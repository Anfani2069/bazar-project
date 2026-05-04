import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

import { environment } from '../../../environments/environment';
import type { Order } from '@shared/models';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly cfg = environment.emailjs;

  async sendOrderConfirmation(order: Order, toEmail: string): Promise<void> {
    if (!toEmail) return;

    const itemsText = order.items
      .map(i => `• ${i.emoji ?? ''} ${i.name} × ${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €`)
      .join('\n');

    const discountLine = order.discount
      ? `Réduction (${order.discount.code}) : −${order.discount.amount.toFixed(2)} €\n`
      : '';

    const deliveryCost = order.delivery.cost === 0
      ? 'Gratuite'
      : `${order.delivery.cost.toFixed(2)} €`;

    const address = [
      order.recipient.adresse,
      order.recipient.ville,
      order.recipient.ile,
    ].filter(Boolean).join(', ');

    const params = {
      to_email:        toEmail,
      to_name:         order.orderedBy
        ? `${order.orderedBy.prenom} ${order.orderedBy.nom}`
        : `${order.recipient.prenom} ${order.recipient.nom}`,
      order_ref:       order.id,
      order_date:      new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      items:           itemsText,
      subtotal:        `${order.subtotal.toFixed(2)} €`,
      discount_line:   discountLine,
      delivery_label:  order.delivery.label,
      delivery_cost:   deliveryCost,
      total:           `${order.total.toFixed(2)} €`,
      address,
    };

    try {
      await emailjs.send(this.cfg.serviceId, this.cfg.templateId, params, { publicKey: this.cfg.publicKey });
    } catch (err) {
      console.error('[EmailService] Failed to send confirmation:', err);
    }
  }
}
