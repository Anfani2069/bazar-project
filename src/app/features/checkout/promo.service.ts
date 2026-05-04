import { Injectable, NgZone, inject, signal } from '@angular/core';
import { getApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';

export type PromoType = 'percent' | 'fixed';

export interface PromoCode {
  code:       string;
  type:       PromoType;
  value:      number;
  minOrder?:  number;
  active:     boolean;
}

@Injectable({ providedIn: 'root' })
export class PromoService {
  private readonly db   = getFirestore(getApp());
  private readonly zone = inject(NgZone);

  private readonly _promos = signal<PromoCode[]>([]);
  readonly promos = this._promos.asReadonly();

  constructor() {
    onSnapshot(collection(this.db, 'promos'), snap => {
      this.zone.run(() => this._promos.set(snap.docs.map(d => d.data() as PromoCode)));
    });
  }

  validate(code: string, subtotal: number): { valid: true; promo: PromoCode } | { valid: false; error: string } {
    const promo = this.promos().find(p => p.code === code.trim().toUpperCase());
    if (!promo)         return { valid: false, error: 'Code promo introuvable.' };
    if (!promo.active)  return { valid: false, error: 'Ce code promo est désactivé.' };
    if (promo.minOrder && subtotal < promo.minOrder)
      return { valid: false, error: `Commande minimale de ${promo.minOrder} € requise.` };
    return { valid: true, promo };
  }

  computeDiscount(promo: PromoCode, subtotal: number): number {
    if (promo.type === 'percent') return Math.round(subtotal * promo.value) / 100;
    return Math.min(promo.value, subtotal);
  }

  async add(p: PromoCode): Promise<void> {
    const code = p.code.trim().toUpperCase();
    await setDoc(doc(this.db, 'promos', code), { ...p, code });
  }

  async update(original: string, p: PromoCode): Promise<void> {
    const newCode = p.code.trim().toUpperCase();
    if (original !== newCode) await deleteDoc(doc(this.db, 'promos', original));
    await setDoc(doc(this.db, 'promos', newCode), { ...p, code: newCode });
  }

  async remove(code: string): Promise<void> {
    await deleteDoc(doc(this.db, 'promos', code));
  }

  async toggle(code: string): Promise<void> {
    const promo = this.promos().find(p => p.code === code);
    if (promo) await updateDoc(doc(this.db, 'promos', code), { active: !promo.active });
  }
}
