import { Injectable, computed, signal } from '@angular/core';

import type { Product } from '@shared/models';

export interface CartItem {
  product: Product;
  quantity: number;
}

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST      = 8.90;

@Injectable({ providedIn: 'root' })
export class CartService {
  readonly items = signal<CartItem[]>([]);

  readonly totalCount = computed(() =>
    this.items().reduce((sum, i) => sum + i.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((s, i) => s + i.product.price * i.quantity, 0)
  );

  readonly shipping = computed(() =>
    this.subtotal() >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  );

  readonly total = computed(() => this.subtotal() + this.shipping());

  readonly threshold  = SHIPPING_THRESHOLD;
  readonly lastAdded  = signal<Product | null>(null);

  private _toastTimer: ReturnType<typeof setTimeout> | null = null;

  addToCart(product: Product): void {
    this.items.update(list => {
      const existing = list.find(i => i.product.id === product.id);
      if (existing) {
        return list.map(i =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...list, { product, quantity: 1 }];
    });

    if (this._toastTimer) clearTimeout(this._toastTimer);
    this.lastAdded.set(product);
    this._toastTimer = setTimeout(() => this.lastAdded.set(null), 2500);
  }

  increment(id: string): void {
    this.items.update(list =>
      list.map(i => i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
  }

  decrement(id: string): void {
    this.items.update(list =>
      list
        .map(i => i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    );
  }

  remove(id: string): void {
    this.items.update(list => list.filter(i => i.product.id !== id));
  }

  clear(): void {
    this.items.set([]);
    this.lastAdded.set(null);
  }
}
