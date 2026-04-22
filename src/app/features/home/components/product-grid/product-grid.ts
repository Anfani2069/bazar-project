import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductCard } from '@shared/ui/product-card/product-card';
import type { Product } from '@shared/models';

const PRODUCTS: Product[] = [
  { id: '1', name: 'Tomates fraîches',          price: 2.50, emoji: '🍅', category: 'Légumes',  unit: 'kg'    },
  { id: '2', name: 'Bananes plantains',          price: 3.00, emoji: '🍌', category: 'Fruits',   unit: 'kg',   badge: 'new'  },
  { id: '3', name: 'Piment comorien',            price: 1.80, emoji: '🌶️', category: 'Épices',   unit: '250g'  },
  { id: '4', name: 'Riz parfumé Basmati',        price: 7.90, emoji: '🌾', category: 'Céréales', unit: '5kg',  badge: 'promo', originalPrice: 10.00 },
  { id: '5', name: 'Manioc frais',               price: 2.20, emoji: '🥔', category: 'Légumes',  unit: 'kg'    },
  { id: '6', name: 'Noix de coco',               price: 1.50, emoji: '🥥', category: 'Fruits',   unit: 'pièce' },
  { id: '7', name: 'Miel naturel des Comores',   price: 12.00,emoji: '🍯', category: 'Naturels', unit: '500g', badge: 'new'  },
  { id: '8', name: 'Huile de coco vierge',       price: 9.00, emoji: '🫙', category: 'Huiles',   unit: '500ml' },
];

@Component({
  selector: 'home-product-grid',
  templateUrl: './product-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCard],
})
export class ProductGrid {
  protected readonly products = PRODUCTS;

  protected addToCart(product: Product): void {
    console.log('Add to cart:', product.name);
  }
}
