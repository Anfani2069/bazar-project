import { Routes } from '@angular/router';

export const CATALOGUE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./catalogue').then(m => m.Catalogue),
  },
];
