import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import type { Product } from '@shared/models';

interface CartItem {
  product: Product;
  quantity: number;
}

const INITIAL_ITEMS: CartItem[] = [
  { product: { id: '1', name: 'Tomates fraîches des Comores', price: 2.50, emoji: '🍅', category: 'Légumes',  unit: 'kg'    }, quantity: 2 },
  { product: { id: '4', name: 'Riz parfumé Basmati 5kg',      price: 7.90, emoji: '🌾', category: 'Céréales', unit: '5kg',  badge: 'promo', originalPrice: 10.00 }, quantity: 1 },
  { product: { id: '7', name: 'Miel naturel des Comores',     price: 12.00,emoji: '🍯', category: 'Naturels', unit: '500g', badge: 'new'   }, quantity: 1 },
];

const SHIPPING_THRESHOLD = 50;
const SHIPPING_COST      = 8.90;

@Component({
  selector: 'page-cart',
  templateUrl: './cart.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, RouterLink],
})
export class Cart {
  protected readonly items    = signal<CartItem[]>([...INITIAL_ITEMS]);

  protected readonly subtotal = computed(() =>
    this.items().reduce((s, i) => s + i.product.price * i.quantity, 0)
  );
  protected readonly shipping = computed(() =>
    this.subtotal() >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  );
  protected readonly total    = computed(() => this.subtotal() + this.shipping());
  protected readonly threshold = SHIPPING_THRESHOLD;

  protected increment(id: string): void {
    this.items.update(list =>
      list.map(i => i.product.id === id ? { ...i, quantity: i.quantity + 1 } : i)
    );
  }

  protected decrement(id: string): void {
    this.items.update(list =>
      list
        .map(i => i.product.id === id ? { ...i, quantity: i.quantity - 1 } : i)
        .filter(i => i.quantity > 0)
    );
  }

  protected remove(id: string): void {
    this.items.update(list => list.filter(i => i.product.id !== id));
  }
}
