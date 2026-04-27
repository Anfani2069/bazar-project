import { Injectable, signal, computed } from '@angular/core';

import type { Product } from '@shared/models';
import { ALL_PRODUCTS, CATEGORIES as BASE_CATEGORIES } from '@features/catalogue/products.data';

const STORAGE_KEY = 'bazar_products';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>(this.load());

  readonly products   = this._products.asReadonly();

  readonly categories = computed(() => {
    const set     = new Set(this._products().map(p => p.category).filter(Boolean) as string[]);
    const ordered = BASE_CATEGORIES.filter(c => c !== 'Tous' && set.has(c));
    const extra   = [...set].filter(c => !BASE_CATEGORIES.includes(c));
    return ['Tous', ...ordered, ...extra];
  });

  private load(): Product[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as Product[];
    } catch { /**/ }
    return [...ALL_PRODUCTS];
  }

  private save(list: Product[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    this._products.set([...list]);
  }

  add(p: Omit<Product, 'id'>): void {
    this.save([...this._products(), { id: 'adm-' + Date.now(), ...p }]);
  }

  update(id: string, changes: Partial<Omit<Product, 'id'>>): void {
    this.save(this._products().map(p => p.id === id ? { ...p, ...changes } : p));
  }

  remove(id: string): void {
    this.save(this._products().filter(p => p.id !== id));
  }

  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._products.set([...ALL_PRODUCTS]);
  }
}
