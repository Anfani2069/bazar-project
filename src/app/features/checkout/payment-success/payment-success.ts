import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

import type { Order } from '@shared/models';
import { EmailService } from '@shared/services/email.service';
import { CartService } from '@features/cart/cart.service';

@Component({
  selector: 'page-payment-success',
  templateUrl: './payment-success.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CurrencyPipe],
})
export class PaymentSuccess implements OnInit {
  private readonly route        = inject(ActivatedRoute);
  private readonly emailService = inject(EmailService);
  private readonly cartService  = inject(CartService);
  private readonly db           = getFirestore(getApp());

  protected readonly order      = signal<Order | null>(null);
  protected readonly loading    = signal(true);
  protected readonly error      = signal('');

  async ngOnInit(): Promise<void> {
    const orderId = this.route.snapshot.queryParamMap.get('order_id');

    if (!orderId) {
      this.error.set('Identifiant de commande manquant.');
      this.loading.set(false);
      return;
    }

    try {
      const snap = await getDoc(doc(this.db, 'orders', orderId));
      if (!snap.exists()) {
        this.error.set('Commande introuvable.');
        this.loading.set(false);
        return;
      }
      const o = snap.data() as Order;
      this.order.set(o);
      this.cartService.clear();

      const email = o.orderedBy?.email ?? o.recipient.email ?? '';
      if (email) {
        this.emailService.sendOrderConfirmation(o, email);
      }
      this.emailService.sendAdminNotification(o);
    } catch (err) {
      console.error('[PaymentSuccess] Error loading order:', err);
      this.error.set('Impossible de charger votre commande.');
    } finally {
      this.loading.set(false);
    }
  }
}
