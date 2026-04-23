import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { OrderService } from '@features/admin/services/order.service';
import type { Order, OrderStatus } from '@shared/models';

const STATUS_STEPS: { status: OrderStatus; label: string; icon: string; desc: string }[] = [
  { status: 'pending',    label: 'Commande reçue',    icon: '📋', desc: 'Votre commande a bien été enregistrée.' },
  { status: 'processing', label: 'En préparation',    icon: '📦', desc: 'Nous préparons vos articles avec soin.' },
  { status: 'shipped',    label: 'Expédiée',          icon: '🚚', desc: 'Votre colis est en route.' },
  { status: 'delivered',  label: 'Livrée',            icon: '✅', desc: 'Commande livrée. Bonne dégustation !' },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0, processing: 1, shipped: 2, delivered: 3, cancelled: -1,
};

@Component({
  selector: 'page-order-tracking',
  templateUrl: './order-tracking.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CurrencyPipe, DatePipe, RouterLink],
})
export class OrderTracking {
  private readonly orderService = inject(OrderService);
  private readonly route        = inject(ActivatedRoute);

  protected readonly query       = signal('');
  protected readonly searched    = signal(false);
  protected readonly order       = signal<Order | null>(null);
  protected readonly statusSteps = STATUS_STEPS;

  constructor() {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) { this.query.set(id); this.search(); }
  }

  protected readonly currentStepIndex = computed(() => {
    const o = this.order();
    if (!o) return -1;
    return STATUS_ORDER[o.status] ?? -1;
  });

  protected search(): void {
    const q = this.query().trim().toUpperCase();
    if (!q) return;
    const found = this.orderService.orders().find(o => o.id.toUpperCase() === q) ?? null;
    this.order.set(found);
    this.searched.set(true);
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

  protected reset(): void {
    this.query.set('');
    this.order.set(null);
    this.searched.set(false);
  }
}
