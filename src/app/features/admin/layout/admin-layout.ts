import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AdminAuthService } from '../services/admin-auth.service';
import { OrderService } from '../services/order.service';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'admin-layout',
  templateUrl: './admin-layout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
})
export class AdminLayout {
  private  readonly router      = inject(Router);
  private  readonly adminAuth   = inject(AdminAuthService);
  private  readonly destroyRef  = inject(DestroyRef);
  protected readonly orderService = inject(OrderService);
  protected readonly notifService = inject(NotificationService);
  protected readonly sidebarOpen  = signal(true);

  constructor() {
    this.orderService.connect();
    this.destroyRef.onDestroy(() => this.orderService.disconnect());
  }

  protected logout(): void {
    this.adminAuth.logout().then(() => this.router.navigate(['/admin/login']));
  }

  protected toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }
}
