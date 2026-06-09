import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '@shared/services/search.service';

import { ProductCard } from '@shared/ui/product-card/product-card';
import type { Product } from '@shared/models';
import { CartService } from '@features/cart/cart.service';
import { ProductService } from '@features/admin/services/product.service';

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
  private  readonly cartService    = inject(CartService);
  private  readonly productService = inject(ProductService);
  private  readonly searchService  = inject(SearchService);
  protected readonly categories     = this.productService.categories;
  protected readonly activeCategory = signal('Tous');
  protected readonly sortBy         = signal<SortKey>('name');

  constructor() {
    inject(ActivatedRoute).queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe(params => {
        const param = params.get('categorie');
        this.activeCategory.set(param && PARAM_TO_CATEGORY[param] ? PARAM_TO_CATEGORY[param] : 'Tous');
        const q = params.get('q');
        if (q) this.searchService.query.set(q);
      });
  }

  protected readonly filteredProducts = computed(() => {
    const cat      = this.activeCategory();
    const sort     = this.sortBy();
    const products = this.productService.products();
    const q        = this.searchService.query().trim().toLowerCase();

    let list = cat === 'Tous'
      ? products
      : products.filter(p => p.category === cat);

    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
      );
    }

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
