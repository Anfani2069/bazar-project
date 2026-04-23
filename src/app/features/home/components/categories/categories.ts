import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  route: string;
  param: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Légumes',           icon: '🥬', color: 'bg-green-50  border-green-100 hover:bg-green-100',  route: '/catalogue', param: 'legumes'  },
  { id: '2', name: 'Fruits tropicaux',  icon: '🍌', color: 'bg-orange-50 border-orange-100 hover:bg-orange-100', route: '/catalogue', param: 'fruits'   },
  { id: '3', name: 'Épices',            icon: '🌶️', color: 'bg-red-50    border-red-100 hover:bg-red-100',      route: '/catalogue', param: 'epices'   },
  { id: '4', name: 'Céréales',          icon: '🌾', color: 'bg-yellow-50 border-yellow-100 hover:bg-yellow-100', route: '/catalogue', param: 'cereales' },
  { id: '5', name: 'Poissons',          icon: '🐟', color: 'bg-blue-50   border-blue-100 hover:bg-blue-100',    route: '/catalogue', param: 'poissons' },
  { id: '6', name: 'Produits naturels', icon: '🍯', color: 'bg-amber-50  border-amber-100 hover:bg-amber-100',  route: '/catalogue', param: 'naturels' },
  { id: '7', name: 'Huiles & Conserves',icon: '🫙', color: 'bg-lime-50   border-lime-100 hover:bg-lime-100',    route: '/catalogue', param: 'huiles'   },
];

@Component({
  selector: 'home-categories',
  templateUrl: './categories.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
})
export class Categories {
  protected readonly categories = CATEGORIES;
  protected readonly activeId   = signal<string | null>(null);

  protected select(id: string): void {
    this.activeId.set(id);
  }
}
