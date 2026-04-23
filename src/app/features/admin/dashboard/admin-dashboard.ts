import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { OrderService } from '../services/order.service';
import type { Order, OrderStatus } from '@shared/models';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  providers: [DatePipe, CurrencyPipe],
})
export class AdminDashboard {
  protected readonly orderService  = inject(OrderService);
  private  readonly datePipe      = inject(DatePipe);
  private  readonly currencyPipe  = inject(CurrencyPipe);

  protected readonly recentOrders   = computed(() => this.orderService.orders().slice(0, 5));
  protected readonly selectedOrder  = signal<Order | null>(null);

  protected readonly nextStatuses: Record<OrderStatus, { value: OrderStatus; label: string }[]> = {
    pending:    [{ value: 'processing', label: '📦 Prendre en charge' }, { value: 'cancelled', label: '❌ Annuler' }],
    processing: [{ value: 'shipped',   label: '🚚 Marquer expédiée'  }, { value: 'cancelled', label: '❌ Annuler' }],
    shipped:    [{ value: 'delivered', label: '✅ Marquer livrée'    }],
    delivered:  [],
    cancelled:  [],
  };

  protected openOrder(o: Order): void  { this.selectedOrder.set(o); }
  protected closeOrder(): void         { this.selectedOrder.set(null); }

  protected updateStatus(id: string, status: OrderStatus): void {
    this.orderService.updateStatus(id, status);
    const updated = this.orderService.orders().find(o => o.id === id);
    if (updated) this.selectedOrder.set(updated);
  }

  protected statusLabel(s: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending:    'En attente',
      processing: 'En préparation',
      shipped:    'Expédiée',
      delivered:  'Livrée',
      cancelled:  'Annulée',
    };
    return map[s];
  }

  protected statusClass(s: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending:    'bg-amber-100 text-amber-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped:    'bg-purple-100 text-purple-700',
      delivered:  'bg-green-100 text-green-700',
      cancelled:  'bg-red-100 text-red-600',
    };
    return map[s];
  }
}
