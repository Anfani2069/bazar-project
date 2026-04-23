import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { CartService } from '@features/cart/cart.service';
import { Badge } from '@shared/ui/badge/badge';
import { ProductCard } from '@shared/ui/product-card/product-card';
import type { Product } from '@shared/models';
import { ALL_PRODUCTS } from '../products.data';

const CATEGORY_COLORS: Record<string, string> = {
  'Légumes':  '#f0fdf4',
  'Fruits':   '#fff7ed',
  'Épices':   '#fef2f2',
  'Céréales': '#fefce8',
  'Poissons': '#eff6ff',
  'Naturels': '#fffbeb',
  'Huiles':   '#f7fee7',
};

@Component({
  selector: 'page-product-detail',
  templateUrl: './product-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, Badge, ProductCard, RouterLink],
})
export class ProductDetail {
  private  readonly route       = inject(ActivatedRoute);
  private  readonly router      = inject(Router);
  protected readonly cartService = inject(CartService);
  protected readonly quantity   = signal(1);

  private readonly productId = toSignal(
    this.route.paramMap.pipe(map(p => p.get('id')))
  );

  protected readonly product = computed<Product | undefined>(() => {
    const id = this.productId();
    return ALL_PRODUCTS.find(p => p.id === id);
  });

  protected readonly relatedProducts = computed(() => {
    const p = this.product();
    if (!p) return [];
    return ALL_PRODUCTS.filter(pr => pr.category === p.category && pr.id !== p.id).slice(0, 4);
  });

  protected readonly imageBg = computed((): Record<string, string> => ({
    'background-color': this.product()?.imageUrl
      ? '#ffffff'
      : (CATEGORY_COLORS[this.product()?.category ?? ''] ?? '#f8fafa'),
  }));

  protected readonly badgeVariant = computed(() => {
    const badge = this.product()?.badge;
    if (badge === 'promo') return 'success' as const;
    if (badge === 'new')   return 'primary' as const;
    return 'accent' as const;
  });

  protected readonly badgeLabel = computed(() => {
    const labels: Record<NonNullable<Product['badge']>, string> = {
      'best-seller': '⭐ Best Seller',
      new:           '✨ Nouveau',
      promo:         '🔖 Promo',
    };
    const badge = this.product()?.badge;
    return badge ? labels[badge] : '';
  });

  protected readonly discount = computed(() => {
    const p = this.product();
    if (!p?.originalPrice) return 0;
    return Math.round((1 - p.price / p.originalPrice) * 100);
  });

  protected increment(): void {
    this.quantity.update(q => q + 1);
  }

  protected decrement(): void {
    this.quantity.update(q => Math.max(1, q - 1));
  }

  protected addToCart(): void {
    const p = this.product();
    if (!p) return;
    for (let i = 0; i < this.quantity(); i++) {
      this.cartService.addToCart(p);
    }
    this.quantity.set(1);
  }

  protected goBack(): void {
    this.router.navigate(['/catalogue']);
  }
}
