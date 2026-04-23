import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { ADMIN_TOKEN_KEY } from '../guards/admin-auth.guard';
import { OrderService } from '../services/order.service';

@Component({
  selector: 'admin-layout',
  templateUrl: './admin-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class AdminLayout {
  private  readonly router       = inject(Router);
  protected readonly orderService = inject(OrderService);
  protected readonly sidebarOpen  = signal(true);

  protected logout(): void {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    this.router.navigate(['/admin/login']);
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
