import { Injectable, signal } from '@angular/core';

export type PromoType = 'percent' | 'fixed';

export interface PromoCode {
  code:       string;
  type:       PromoType;
  value:      number;
  minOrder?:  number;
  active:     boolean;
}

const STORAGE_KEY = 'bazar_promos';

const DEFAULT_PROMOS: PromoCode[] = [];

@Injectable({ providedIn: 'root' })
export class PromoService {
  private readonly _promos = signal<PromoCode[]>(this.load());
  readonly promos = this._promos.asReadonly();

  private load(): PromoCode[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as PromoCode[];
    } catch { /**/ }
    return [...DEFAULT_PROMOS];
  }

  private save(list: PromoCode[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this._promos.set([...list]);
  }

  validate(code: string, subtotal: number): { valid: true; promo: PromoCode } | { valid: false; error: string } {
    const promo = this._promos().find(p => p.code === code.trim().toUpperCase());
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

  add(p: PromoCode): void {
    this.save([...this._promos(), { ...p, code: p.code.trim().toUpperCase() }]);
  }

  update(original: string, p: PromoCode): void {
    this.save(this._promos().map(x => x.code === original ? { ...p, code: p.code.trim().toUpperCase() } : x));
  }

  remove(code: string): void { this.save(this._promos().filter(p => p.code !== code)); }

  toggle(code: string): void {
    this.save(this._promos().map(p => p.code === code ? { ...p, active: !p.active } : p));
  }
}
