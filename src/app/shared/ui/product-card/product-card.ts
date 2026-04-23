import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Badge } from '../badge/badge';
import { Product } from '../../models';

const CATEGORY_COLORS: Record<string, string> = {
  'Légumes':  '#f0fdf4',
  'Fruits':   '#fff7ed',
  'Épices':   '#fef2f2',
  'Céréales': '#fefce8',
  'Poissons': '#eff6ff',
  'Naturels': '#fffbeb',
  'Huiles':   '#f7fee7',
  'Boissons': '#f0fdfa',
  'Ménager':  '#f1f5f9',
};

@Component({
  selector: 'ui-product-card',
  templateUrl: './product-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Badge, CurrencyPipe, RouterLink],
})
export class ProductCard {
  readonly product   = input.required<Product>();
  readonly addToCart = output<Product>();

  protected readonly imageBg = computed((): Record<string, string> => ({
    'background-color': this.product().imageUrl
      ? '#ffffff'
      : (CATEGORY_COLORS[this.product().category ?? ''] ?? '#f8fafa'),
  }));

  protected readonly badgeVariant = computed(() => {
    const badge = this.product().badge;
    if (badge === 'promo') return 'success' as const;
    if (badge === 'new')   return 'primary' as const;
    return 'accent' as const;
  });

  protected readonly badgeLabel = computed(() => {
    const map: Record<NonNullable<Product['badge']>, string> = {
      'best-seller': '⭐ Best Seller',
      new:           '✨ Nouveau',
      promo:         '🔖 Promo',
    };
    const badge = this.product().badge;
    return badge ? map[badge] : '';
  });

  protected onAddToCart(): void {
    this.addToCart.emit(this.product());
  }
}
