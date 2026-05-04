import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { getApp } from 'firebase/app';
import {
  getAuth, signInWithEmailAndPassword, signOut,
  onAuthStateChanged, type User,
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly auth = getAuth(getApp());
  private readonly db   = getFirestore(getApp());
  private readonly zone = inject(NgZone);

  private readonly _user    = signal<User | null | undefined>(undefined);
  private readonly _isAdmin = signal(false);

  readonly authReady = computed(() => this._user() !== undefined);
  readonly isAdmin   = computed(() => this._isAdmin());

  constructor() {
    onAuthStateChanged(this.auth, async user => {
      if (!user) {
        this.zone.run(() => { this._user.set(null); this._isAdmin.set(false); });
        return;
      }
      const snap = await getDoc(doc(this.db, 'admins', user.uid));
      this.zone.run(() => {
        this._user.set(user);
        this._isAdmin.set(snap.exists());
      });
    });
  }

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const cred = await signInWithEmailAndPassword(this.auth, email, password);
      const snap = await getDoc(doc(this.db, 'admins', cred.user.uid));
      if (!snap.exists()) {
        await signOut(this.auth);
        return { ok: false, error: 'Accès non autorisé.' };
      }
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: this._mapError(e.code) };
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.zone.run(() => { this._user.set(null); this._isAdmin.set(false); });
  }

  private _mapError(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found':     'Identifiants incorrects.',
      'auth/wrong-password':     'Identifiants incorrects.',
      'auth/invalid-credential': 'Identifiants incorrects.',
      'auth/too-many-requests':  'Trop de tentatives. Réessayez plus tard.',
      'auth/invalid-email':      'Adresse e-mail invalide.',
    };
    return map[code] ?? 'Une erreur est survenue. Veuillez réessayer.';
  }
}
