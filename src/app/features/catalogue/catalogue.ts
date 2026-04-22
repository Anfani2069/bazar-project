import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ProductCard } from '@shared/ui/product-card/product-card';
import type { Product } from '@shared/models';

type SortKey = 'name' | 'price-asc' | 'price-desc';

const ALL_PRODUCTS: Product[] = [
  { id: 'l1', name: 'Tomates fraîches des Comores', price: 2.50, emoji: '🍅', category: 'Légumes',  unit: 'kg'    },
  { id: 'l2', name: 'Manioc frais',                 price: 2.20, emoji: '🥔', category: 'Légumes',  unit: 'kg'    },
  { id: 'l3', name: 'Brèdes mafane',                price: 1.80, emoji: '🥬', category: 'Légumes',  unit: '500g'  },
  { id: 'l4', name: 'Concombre comorien',           price: 1.20, emoji: '🥒', category: 'Légumes',  unit: 'pièce' },
  { id: 'f1', name: 'Bananes plantains',            price: 3.00, emoji: '🍌', category: 'Fruits',   unit: 'kg',   badge: 'new'   },
  { id: 'f2', name: 'Noix de coco',                 price: 1.50, emoji: '🥥', category: 'Fruits',   unit: 'pièce' },
  { id: 'f3', name: 'Mangues des Comores',          price: 4.50, emoji: '🥭', category: 'Fruits',   unit: 'kg'    },
  { id: 'f4', name: 'Papaye fraîche',               price: 3.50, emoji: '🍈', category: 'Fruits',   unit: 'kg'    },
  { id: 'e1', name: 'Piment comorien',              price: 1.80, emoji: '🌶️', category: 'Épices',   unit: '250g'  },
  { id: 'e2', name: 'Vanille des Comores',          price: 18.00,emoji: '🌿', category: 'Épices',   unit: '10g',  badge: 'new'   },
  { id: 'e3', name: 'Curcuma moulu',                price: 3.50, emoji: '🫚', category: 'Épices',   unit: '200g'  },
  { id: 'e4', name: 'Gingembre séché',              price: 4.00, emoji: '🫛', category: 'Épices',   unit: '150g'  },
  { id: 'c1', name: 'Riz parfumé Basmati 5kg',      price: 7.90, emoji: '🌾', category: 'Céréales', unit: '5kg',  badge: 'promo', originalPrice: 10.00 },
  { id: 'c2', name: 'Farine de manioc',             price: 4.50, emoji: '🫙', category: 'Céréales', unit: '1kg'   },
  { id: 'n1', name: 'Miel naturel des Comores',     price: 12.00,emoji: '🍯', category: 'Naturels', unit: '500g', badge: 'new'   },
  { id: 'h1', name: 'Huile de coco vierge',         price: 9.00, emoji: '🫙', category: 'Huiles',   unit: '500ml' },
  { id: 'h2', name: 'Huile de tournesol',           price: 6.90, emoji: '🌻', category: 'Huiles',   unit: '1L'    },
  { id: 'p1', name: 'Filet de poisson séché',       price: 9.00, emoji: '🐟', category: 'Poissons', unit: '400g', badge: 'best-seller' },
  { id: 'p2', name: 'Crevettes séchées',            price: 11.00,emoji: '🦐', category: 'Poissons', unit: '300g'  },
  { id: 'p3', name: 'Thon séché des Comores',       price: 5.50, emoji: '🐠', category: 'Poissons', unit: '200g'  },
];

const CATEGORIES = ['Tous', 'Légumes', 'Fruits', 'Épices', 'Céréales', 'Naturels', 'Huiles', 'Poissons'];

@Component({
  selector: 'page-catalogue',
  templateUrl: './catalogue.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProductCard],
})
export class Catalogue {
  protected readonly categories     = CATEGORIES;
  protected readonly activeCategory = signal('Tous');
  protected readonly sortBy         = signal<SortKey>('name');

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
    console.log('Add to cart:', product.name);
  }
}
