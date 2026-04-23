import { Routes } from '@angular/router';

export const CATALOGUE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./catalogue').then(m => m.Catalogue),
  },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetail),
  },
];
