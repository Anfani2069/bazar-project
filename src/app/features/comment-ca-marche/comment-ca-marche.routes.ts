import { Routes } from '@angular/router';

export const COMMENT_CA_MARCHE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./comment-ca-marche').then(m => m.CommentCaMarche),
  },
];
