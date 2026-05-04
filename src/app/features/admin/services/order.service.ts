import { Injectable, NgZone, computed, inject, signal } from '@angular/core';
import { getApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';

import type { Order, OrderStatus } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly db   = getFirestore(getApp());
  private readonly zone = inject(NgZone);
  private readonly _orders = signal<Order[]>([]);
  private _unsubscribe: (() => void) | null = null;

  readonly orders = this._orders.asReadonly();

  connect(): void {
    if (this._unsubscribe) return;
    this._unsubscribe = onSnapshot(
      collection(this.db, 'orders'),
      snap => {
        this.zone.run(() =>
          this._orders.set(
            snap.docs.map(d => d.data() as Order).sort((a, b) =>
              new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          )
        );
      },
      err => console.error('[OrderService] Snapshot error:', err),
    );
  }

  disconnect(): void {
    this._unsubscribe?.();
    this._unsubscribe = null;
  }

  readonly stats = computed(() => {
    const o   = this.orders();
    const now = new Date();
    const tod = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return {
      total:      o.length,
      pending:    o.filter(x => x.status === 'pending').length,
      processing: o.filter(x => x.status === 'processing').length,
      shipped:    o.filter(x => x.status === 'shipped').length,
      delivered:  o.filter(x => x.status === 'delivered').length,
      revenue:    o.filter(x => x.status !== 'cancelled').reduce((s, x) => s + x.total, 0),
      today:      o.filter(x => new Date(x.date) >= tod).length,
    };
  });

  async addOrder(order: Order): Promise<void> {
    const clean = JSON.parse(JSON.stringify(order));
    await setDoc(doc(this.db, 'orders', order.id), clean);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<void> {
    await updateDoc(doc(this.db, 'orders', id), { status });
  }
}
