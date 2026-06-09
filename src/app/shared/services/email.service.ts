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

  async sendAdminNotification(order: Order): Promise<void> {
    const adminEmail = this.cfg.adminEmail;
    if (!adminEmail || adminEmail.includes('example.com')) return;

    const itemsText = order.items
      .map(i => `• ${i.emoji ?? ''} ${i.name} × ${i.quantity} — ${(i.price * i.quantity).toFixed(2)} €`)
      .join('\n');

    const discountLine = order.discount
      ? `Réduction (${order.discount.code}) : −${order.discount.amount.toFixed(2)} €\n`
      : '';

    const deliveryCost = order.delivery.cost === 0
      ? 'Gratuite'
      : `${order.delivery.cost.toFixed(2)} €`;

    const customerName  = `${order.recipient.prenom} ${order.recipient.nom}`;
    const customerPhone = order.recipient.telephone;
    const customerEmail = order.recipient.email ?? order.orderedBy?.email ?? '—';
    const ordererName   = order.orderedBy
      ? `${order.orderedBy.prenom} ${order.orderedBy.nom}`
      : customerName;

    const address = [
      order.recipient.adresse,
      order.recipient.ville,
      order.recipient.ile,
    ].filter(Boolean).join(', ');

    const params = {
      to_email:        adminEmail,
      to_name:         'Admin',
      order_ref:       order.id,
      order_date:      new Date(order.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      orderer_name:    ordererName,
      customer_name:   customerName,
      customer_phone:  customerPhone,
      customer_email:  customerEmail,
      items:           itemsText,
      subtotal:        `${order.subtotal.toFixed(2)} €`,
      discount_line:   discountLine,
      delivery_label:  order.delivery.label,
      delivery_cost:   deliveryCost,
      total:           `${order.total.toFixed(2)} €`,
      address,
    };

    try {
      await emailjs.send(this.cfg.serviceId, this.cfg.adminTemplateId, params, { publicKey: this.cfg.publicKey });
    } catch (err) {
      console.error('[EmailService] Failed to send admin notification:', err);
    }
  }
}
