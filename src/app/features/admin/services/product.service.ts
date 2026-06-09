import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { getApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot,
         doc, setDoc, updateDoc, deleteDoc, writeBatch, deleteField } from 'firebase/firestore';

import type { Product } from '@shared/models';
import { ALL_PRODUCTS, CATEGORIES as BASE_CATEGORIES } from '@features/catalogue/products.data';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly db       = getFirestore(getApp());
  private readonly zone     = inject(NgZone);
  private readonly _products = signal<Product[]>([]);

  readonly products = this._products.asReadonly();

  constructor() {
    onSnapshot(collection(this.db, 'products'), snap => {
      this.zone.run(() => this._products.set(snap.docs.map(d => d.data() as Product)));
    });
  }

  readonly categories = computed(() => {
    const set     = new Set(this.products().map(p => p.category).filter(Boolean) as string[]);
    const ordered = BASE_CATEGORIES.filter(c => c !== 'Tous' && set.has(c));
    const extra   = [...set].filter(c => !BASE_CATEGORIES.includes(c));
    return ['Tous', ...ordered, ...extra];
  });

  async add(p: Omit<Product, 'id'>): Promise<void> {
    const id = 'adm-' + Date.now();
    await setDoc(doc(this.db, 'products', id), { id, ...p });
  }

  async update(id: string, changes: Partial<Omit<Product, 'id'>>): Promise<void> {
    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(changes)) {
      payload[key] = value === undefined ? deleteField() : value;
    }
    await updateDoc(doc(this.db, 'products', id), payload);
  }

  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.db, 'products', id));
  }

  async reset(): Promise<void> {
    const batch = writeBatch(this.db);
    ALL_PRODUCTS.forEach(p => batch.set(doc(this.db, 'products', p.id), p));
    await batch.commit();
  }
}
