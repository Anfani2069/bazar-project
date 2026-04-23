import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProductCard } from '@shared/ui/product-card/product-card';
import type { Product } from '@shared/models';
import { CartService } from '@features/cart/cart.service';
import { ALL_PRODUCTS, CATEGORIES } from './products.data';

const PARAM_TO_CATEGORY: Record<string, string> = {
  legumes:  'Légumes',
  fruits:   'Fruits',
  epices:   'Épices',
  cereales: 'Céréales',
  poissons: 'Poissons',
  naturels: 'Naturels',
  huiles:   'Huiles',
};

type SortKey = 'name' | 'price-asc' | 'price-desc';

@Component({
  selector: 'page-catalogue',
  templateUrl: './catalogue.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard],
})
export class Catalogue {
  private  readonly cartService     = inject(CartService);
  protected readonly categories     = CATEGORIES;
  protected readonly activeCategory = signal('Tous');
  protected readonly sortBy         = signal<SortKey>('name');

  constructor() {
    const param = inject(ActivatedRoute).snapshot.queryParamMap.get('categorie');
    if (param && PARAM_TO_CATEGORY[param]) {
      this.activeCategory.set(PARAM_TO_CATEGORY[param]);
    }
  }

  protected readonly filteredProducts = computed(() => {
    const cat  = this.activeCategory();
    const sort = this.sortBy();

    let list = cat === 'Tous'
      ? ALL_PRODUCTS
      : ALL_PRODUCTS.filter(p => p.category === cat);

    return [...list].sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return a.name.localeCompare(b.name, 'fr');
    });
  });

  protected setCategory(cat: string): void {
    this.activeCategory.set(cat);
  }

  protected setSort(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value as SortKey);
  }

  protected addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
