import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductCard } from '@shared/ui/product-card/product-card';
import { CartService } from '@features/cart/cart.service';
import { ALL_PRODUCTS } from '@features/catalogue/products.data';

const FEATURED_IDS = [
  'c1',  'h3',  'p4',  'p5',  'n2',  'n3',
  'n4',  'n5',  'n6',
  'b1',  'b2',  'm1',  'm2',
  'n1',  'e2',
];

@Component({
  selector: 'home-product-grid',
  templateUrl: './product-grid.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ProductCard],
})
export class ProductGrid {
  private  readonly cartService = inject(CartService);
  protected readonly products   = FEATURED_IDS
    .map(id => ALL_PRODUCTS.find(p => p.id === id))
    .filter(p => p !== undefined);

  protected addToCart(product: typeof ALL_PRODUCTS[0]): void {
    this.cartService.addToCart(product);
  }
}
