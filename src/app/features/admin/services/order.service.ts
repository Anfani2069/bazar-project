import { Injectable, computed, signal } from '@angular/core';

import type { Order, OrderStatus } from '@shared/models';

const STORAGE_KEY = 'bazar_orders';

const DEMO_ORDERS: Order[] = [
  {
    id: 'BC-K3N7P2',
    date: new Date(Date.now() - 3_600_000).toISOString(),
    status: 'pending',
    recipient: { prenom: 'Fatima', nom: 'Ali', telephone: '3210101', email: 'fatima@mail.com', ile: 'Grande Comore (Ngazidja)', ville: 'Moroni', adresse: 'Quartier Badjanani' },
    delivery: { method: 'domicile', label: 'Livraison à domicile', cost: 8.90 },
    payment:  { method: 'carte',   label: '💳 Carte bancaire' },
    items: [
      { productId: 'c1', name: 'Riz Onicor IR64 — 5 kg',       price: 8.50, quantity: 2, imageUrl: 'img/riz-onicor.png' },
      { productId: 'p4', name: 'Sardines Delmonaco à l\'huile', price: 1.20, quantity: 3, emoji: '🐟' },
    ],
    subtotal: 20.60, total: 29.50,
  },
  {
    id: 'BC-M8L4X1',
    date: new Date(Date.now() - 86_400_000).toISOString(),
    status: 'processing',
    recipient: { prenom: 'Mohamed', nom: 'Hamidi', telephone: '3330202', ile: 'Anjouan (Ndzuani)', ville: 'Mutsamudu', adresse: 'Centre ville', instructions: 'Appeler avant livraison' },
    delivery: { method: 'express', label: 'Livraison express',   cost: 15.00 },
    payment:  { method: 'carte',   label: '💳 Carte bancaire' },
    items: [
      { productId: 'h3', name: 'Samli — Beurre clarifié',           price: 12.90, quantity: 1, imageUrl: 'img/samli-beurre-clarifie.png' },
      { productId: 'n2', name: 'Concentré de tomate Al Mudhish',    price: 4.50,  quantity: 2, imageUrl: 'img/tomate-concentre.png' },
    ],
    subtotal: 21.90, total: 36.90,
  },
  {
    id: 'BC-Z2Q9R5',
    date: new Date(Date.now() - 172_800_000).toISOString(),
    status: 'shipped',
    recipient: { prenom: 'Aisha', nom: 'Said', telephone: '3215050', email: 'aisha@mail.com', ile: 'Mohéli (Mwali)', ville: 'Fomboni', adresse: 'Quartier Hamahamet' },
    delivery: { method: 'domicile', label: 'Livraison à domicile', cost: 8.90 },
    payment:  { method: 'paypal',   label: '🅿️ PayPal' },
    items: [
      { productId: 'n3', name: 'Lait concentré sucré OKI', price: 2.90, quantity: 4, imageUrl: 'img/Lait concentre.png' },
      { productId: 'c1', name: 'Riz Onicor IR64 — 5 kg',  price: 8.50, quantity: 1, imageUrl: 'img/riz-onicor.png' },
    ],
    subtotal: 20.10, total: 29.00,
  },
  {
    id: 'BC-P5T1W8',
    date: new Date(Date.now() - 432_000_000).toISOString(),
    status: 'delivered',
    recipient: { prenom: 'Ibrahim', nom: 'Mze', telephone: '3219999', ile: 'Grande Comore (Ngazidja)', ville: 'Mitsamiouli', adresse: 'Face à la mosquée' },
    delivery: { method: 'relais', label: 'Point de retrait', cost: 0 },
    payment:  { method: 'carte',  label: '💳 Carte bancaire' },
    items: [
      { productId: 'p5', name: 'Sardines Fruits de mer à l\'huile', price: 2.50, quantity: 2, imageUrl: 'img/Sardine-vegetal-oil.png' },
      { productId: 'e2', name: 'Vanille des Comores',               price: 18.00, quantity: 1, emoji: '🌿' },
    ],
    subtotal: 23.00, total: 23.00,
  },
];

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly _orders = signal<Order[]>(this._load());

  readonly orders = this._orders.asReadonly();

  readonly stats = computed(() => {
    const o   = this._orders();
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

  addOrder(order: Order): void {
    this._orders.update(list => [order, ...list]);
    this._save();
  }

  updateStatus(id: string, status: OrderStatus): void {
    this._orders.update(list => list.map(o => o.id === id ? { ...o, status } : o));
    this._save();
  }

  private _load(): Order[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEMO_ORDERS;
      const list = JSON.parse(raw) as (Order & { customer?: Order['recipient'] })[];
      return list.map(o => {
        if (!o.recipient && o.customer) {
          const { customer, ...rest } = o;
          return { ...rest, recipient: customer } as Order;
        }
        return o as Order;
      });
    } catch {
      return DEMO_ORDERS;
    }
  }

  private _save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._orders()));
  }
}
