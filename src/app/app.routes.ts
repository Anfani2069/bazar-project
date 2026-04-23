import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES),
  },
  {
    path: 'catalogue',
    loadChildren: () => import('./features/catalogue/catalogue.routes').then(m => m.CATALOGUE_ROUTES),
  },
  {
    path: 'comment-ca-marche',
    loadChildren: () => import('./features/comment-ca-marche/comment-ca-marche.routes').then(m => m.COMMENT_CA_MARCHE_ROUTES),
  },
  {
    path: 'connexion',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'panier',
    loadChildren: () => import('./features/cart/cart.routes').then(m => m.CART_ROUTES),
  },
  {
    path: 'a-propos',
    loadChildren: () => import('./features/about/about.routes').then(m => m.ABOUT_ROUTES),
  },
  {
    path: 'commande',
    loadChildren: () => import('./features/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  {
    path: 'suivi',
    loadComponent: () => import('./features/order-tracking/order-tracking').then(m => m.OrderTracking),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
