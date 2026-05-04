import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged,
         createUserWithEmailAndPassword, signInWithEmailAndPassword,
         signOut, signInWithPopup, GoogleAuthProvider,
         type User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export interface Customer {
  id:        string;
  prenom:    string;
  nom:       string;
  email:     string;
  telephone: string;
}

export interface CustomerProfile {
  prenom:    string;
  nom:       string;
  telephone: string;
}

@Injectable({ providedIn: 'root' })
export class CustomerAuthService {
  private readonly auth = getAuth(getApp());
  private readonly db   = getFirestore(getApp());
  private readonly zone = inject(NgZone);

  private readonly _firebaseUser = signal<User | null | undefined>(undefined);
  private readonly _profile      = signal<CustomerProfile | null>(null);

  readonly currentUser = computed<Customer | null>(() => {
    const fb      = this._firebaseUser();
    const profile = this._profile();
    if (!fb || !profile) return null;
    return { id: fb.uid, email: fb.email ?? '', ...profile };
  });

  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly authReady  = computed(() => this._firebaseUser() !== undefined);

  readonly profileReady = computed(() => {
    const fb = this._firebaseUser();
    if (fb === undefined) return false;
    if (fb === null)      return true;
    return this._profile() !== null;
  });

  constructor() {
    onAuthStateChanged(this.auth, async user => {
      const snap     = user ? await getDoc(doc(this.db, `customers/${user.uid}`)) : null;
      const isGoogle = user?.providerData[0]?.providerId === 'google.com';

      let profile: CustomerProfile | null = null;
      if (snap?.exists()) {
        profile = snap.data() as CustomerProfile;
      } else if (user && isGoogle) {
        const parts = (user.displayName ?? '').split(' ');
        profile = { prenom: parts[0] ?? '', nom: parts.slice(1).join(' ') || '', telephone: user.phoneNumber ?? '' };
        await setDoc(doc(this.db, `customers/${user.uid}`), { ...profile, email: user.email ?? '' });
      }

      this.zone.run(() => {
        this._firebaseUser.set(user);
        this._profile.set(profile);
      });
    });
  }

  async register(data: { prenom: string; nom: string; email: string; telephone: string; password: string }): Promise<{ ok: boolean; error?: string }> {
    try {
      const cred    = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      const profile: CustomerProfile = { prenom: data.prenom, nom: data.nom, telephone: data.telephone };
      await setDoc(doc(this.db, `customers/${cred.user.uid}`), { ...profile, email: data.email });
      this._profile.set(profile);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: this._mapError(e.code) };
    }
  }

  async login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: this._mapError(e.code) };
    }
  }

  async loginWithGoogle(): Promise<{ ok: boolean; error?: string }> {
    try {
      await signInWithPopup(this.auth, new GoogleAuthProvider());
      return { ok: true };
    } catch (e: any) {
      return { ok: false, error: this._mapError(e.code) };
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }

  async loadProfileForCurrentUser(): Promise<void> {
    const fb = this._firebaseUser();
    if (fb && !this._profile()) await this._loadProfile(fb.uid);
  }

  private async _loadProfile(uid: string): Promise<void> {
    const snap = await getDoc(doc(this.db, `customers/${uid}`));
    if (snap.exists()) this._profile.set(snap.data() as CustomerProfile);
  }

  private _mapError(code: string): string {
    const map: Record<string, string> = {
      'auth/email-already-in-use':  'Un compte avec cet e-mail existe déjà.',
      'auth/invalid-email':         'Adresse e-mail invalide.',
      'auth/weak-password':         'Mot de passe trop faible (min. 6 caractères).',
      'auth/user-not-found':        'Aucun compte trouvé avec cet e-mail.',
      'auth/wrong-password':        'Mot de passe incorrect.',
      'auth/invalid-credential':    'E-mail ou mot de passe incorrect.',
      'auth/too-many-requests':     'Trop de tentatives. Réessayez plus tard.',
    };
    return map[code] ?? 'Une erreur est survenue. Veuillez réessayer.';
  }
}
