import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ProductCard } from '@shared/ui/product-card/product-card';
import { CartService } from '@features/cart/cart.service';
import { ProductService } from '@features/admin/services/product.service';
import type { Product } from '@shared/models';

const FEATURED_IDS = [
  'c1',  'r1',  'r5',  'r8',  'r2',  'r6',
  'c3',  'c4',  'h4',  'h5',  'n7',
  'n8',  'n9',  'ca1',
  'h3',  'p4',  'p5',  'n2',  'n3',
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
  private  readonly cartService    = inject(CartService);
  private  readonly productService = inject(ProductService);

  protected readonly products = computed(() =>
    FEATURED_IDS
      .map(id => this.productService.products().find(p => p.id === id))
      .filter((p): p is Product => p !== undefined)
  );

  protected addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
