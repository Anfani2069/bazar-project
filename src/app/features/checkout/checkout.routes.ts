import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./checkout').then(m => m.Checkout),
  },
  {
    path: 'success',
    loadComponent: () => import('./payment-success/payment-success').then(m => m.PaymentSuccess),
  },
];
