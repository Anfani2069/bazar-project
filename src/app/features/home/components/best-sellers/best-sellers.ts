import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from '@angular/core';

import { ProductCard } from '@shared/ui/product-card/product-card';
import type { Product } from '@shared/models';

const BEST_SELLERS: Product[] = [
  { id: 'bs1', name: 'Jus de coco naturel',        price: 4.50,  emoji: '🥥', category: 'Boissons',  unit: '500ml', badge: 'best-seller' },
  { id: 'bs2', name: 'Miel naturel des Comores',   price: 12.00, emoji: '🍯', category: 'Naturels',  unit: '500g',  badge: 'best-seller' },
  { id: 'bs3', name: 'Huile de tournesol',         price: 6.90,  emoji: '🌻', category: 'Huiles',    unit: '1L',    badge: 'best-seller' },
  { id: 'bs4', name: 'Riz parfumé Basmati 5KG',    price: 8.50,  emoji: '🌾', category: 'Céréales',  unit: '5kg',   badge: 'best-seller' },
  { id: 'bs5', name: 'Mélange d\'épices comorien', price: 3.20,  emoji: '🌶️', category: 'Épices',    unit: '200g',  badge: 'best-seller' },
  { id: 'bs6', name: 'Filet de poisson séché',     price: 9.00,  emoji: '🐟', category: 'Poissons',  unit: '400g',  badge: 'best-seller' },
];

@Component({
  selector: 'home-best-sellers',
  templateUrl: './best-sellers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard],
})
export class BestSellers {
  protected readonly scrollRef = viewChild<ElementRef<HTMLDivElement>>('scrollRef');
  protected readonly products  = BEST_SELLERS;

  protected scroll(direction: 'left' | 'right'): void {
    const el = this.scrollRef()?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction === 'right' ? 290 : -290, behavior: 'smooth' });
  }

  protected addToCart(product: Product): void {
    console.log('Add to cart:', product.name);
  }
}
