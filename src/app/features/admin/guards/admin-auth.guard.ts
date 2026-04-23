import { inject }       from '@angular/core';
import { Router }       from '@angular/router';
import type { CanActivateFn } from '@angular/router';

export const ADMIN_TOKEN_KEY = 'bazar_admin_token';
export const ADMIN_CREDENTIALS = { email: 'admin@bazarcomores.com', password: 'Admin2025' };

export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (localStorage.getItem(ADMIN_TOKEN_KEY)) return true;
  router.navigate(['/admin/login']);
  return false;
};
