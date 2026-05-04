import { ChangeDetectionStrategy, Component, DestroyRef, NgZone, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { getApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';

import { CustomerAuthService } from '@shared/services/customer-auth.service';
import type { Order, OrderStatus } from '@shared/models';

@Component({
  selector: 'page-mes-commandes',
  templateUrl: './mes-commandes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe, DatePipe],
})
export class MesCommandes {
  private readonly authService = inject(CustomerAuthService);
  private readonly router      = inject(Router);
  private readonly zone        = inject(NgZone);
  private readonly destroyRef  = inject(DestroyRef);
  private readonly db          = getFirestore(getApp());

  protected readonly orders     = signal<Order[]>([]);
  protected readonly loading    = signal(true);
  protected readonly loadError  = signal('');
  protected readonly expandedId = signal<string | null>(null);

  protected readonly currentUser = this.authService.currentUser;

  constructor() {
    let unsubOrders: (() => void) | null = null;

    const unsubAuth = onAuthStateChanged(getAuth(getApp()), firebaseUser => {
      if (unsubOrders) { unsubOrders(); unsubOrders = null; }

      if (!firebaseUser) {
        this.zone.run(() => {
          this.loading.set(false);
          this.router.navigate(['/connexion']);
        });
        return;
      }

      const q = query(collection(this.db, 'orders'), where('userId', '==', firebaseUser.uid));
      unsubOrders = onSnapshot(
        q,
        snap => {
          this.zone.run(() => {
            this.orders.set(
              snap.docs
                .map(d => d.data() as Order)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            );
            this.loading.set(false);
          });
        },
        err => {
          console.error('[MesCommandes] Firestore error:', err);
          this.zone.run(() => {
            this.loading.set(false);
            this.loadError.set('Impossible de charger vos commandes. Veuillez réessayer.');
          });
        },
      );
    });

    this.destroyRef.onDestroy(() => {
      unsubAuth();
      if (unsubOrders) unsubOrders();
    });
  }

  protected toggle(id: string): void {
    this.expandedId.update(cur => cur === id ? null : id);
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
      pending:    'bg-amber-100 text-amber-700 border-amber-200',
      processing: 'bg-blue-100 text-blue-700 border-blue-200',
      shipped:    'bg-purple-100 text-purple-700 border-purple-200',
      delivered:  'bg-green-100 text-green-700 border-green-200',
      cancelled:  'bg-red-100 text-red-600 border-red-200',
    };
    return map[s];
  }

  protected statusIcon(s: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      pending: '📋', processing: '📦', shipped: '🚚', delivered: '✅', cancelled: '❌',
    };
    return map[s];
  }
}
