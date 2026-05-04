import { inject }          from '@angular/core';
import { Router }          from '@angular/router';
import { toObservable }    from '@angular/core/rxjs-interop';
import { filter, take, map } from 'rxjs';
import { firstValueFrom }  from 'rxjs';
import type { CanActivateFn } from '@angular/router';

import { AdminAuthService } from '../services/admin-auth.service';

export const adminAuthGuard: CanActivateFn = () => {
  const adminAuth = inject(AdminAuthService);
  const router    = inject(Router);

  return firstValueFrom(
    toObservable(adminAuth.authReady).pipe(
      filter(Boolean),
      take(1),
      map(() => {
        if (adminAuth.isAdmin()) return true;
        router.navigate(['/admin/login']);
        return false;
      }),
    ),
  );
};
