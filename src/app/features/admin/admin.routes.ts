import { Routes } from '@angular/router';

import { adminAuthGuard }  from './guards/admin-auth.guard';
import { AdminLogin }      from './login/admin-login';
import { AdminLayout }     from './layout/admin-layout';
import { AdminDashboard }  from './dashboard/admin-dashboard';
import { AdminOrders }    from './orders/admin-orders';
import { AdminReports }   from './reports/admin-reports';
import { AdminProducts }  from './products/admin-products';
import { AdminPromos }    from './promos/admin-promos';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'login',
    component: AdminLogin,
  },
  {
    path: '',
    component: AdminLayout,
    canActivate: [adminAuthGuard],
    children: [
      { path: '',          redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboard },
      { path: 'commandes', component: AdminOrders    },
      { path: 'rapports',  component: AdminReports    },
      { path: 'produits',  component: AdminProducts   },
      { path: 'promos',    component: AdminPromos     },
    ],
  },
];
