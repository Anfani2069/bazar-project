import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { OrderService } from '../services/order.service';
import type { Order, OrderStatus } from '@shared/models';

type FilterStatus = 'all' | OrderStatus;

@Component({
  selector: 'admin-orders',
  templateUrl: './admin-orders.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe],
  providers: [DatePipe, CurrencyPipe],
})
export class AdminOrders {
  protected readonly orderService = inject(OrderService);
  private  readonly datePipe     = inject(DatePipe);
  private  readonly currencyPipe = inject(CurrencyPipe);

  protected readonly filter        = signal<FilterStatus>('all');
  protected readonly search         = signal('');
  protected readonly dateFrom       = signal('');
  protected readonly dateTo         = signal('');
  protected readonly selectedOrder  = signal<Order | null>(null);

  protected readonly filteredOrders = computed(() => {
    const f    = this.filter();
    const q    = this.search().toLowerCase().trim();
    const from = this.dateFrom() ? new Date(this.dateFrom()) : null;
    const to   = this.dateTo()   ? new Date(this.dateTo() + 'T23:59:59') : null;

    let list = f === 'all'
      ? this.orderService.orders()
      : this.orderService.orders().filter(o => o.status === f);

    if (from) list = list.filter(o => new Date(o.date) >= from!);
    if (to)   list = list.filter(o => new Date(o.date) <= to!);

    if (q) {
      list = list.filter(o =>
        o.id.toLowerCase().includes(q) ||
        (o.orderedBy?.nom ?? '').toLowerCase().includes(q) ||
        (o.orderedBy?.prenom ?? '').toLowerCase().includes(q) ||
        o.recipient.nom.toLowerCase().includes(q) ||
        o.recipient.prenom.toLowerCase().includes(q) ||
        o.recipient.ville.toLowerCase().includes(q) ||
        o.recipient.telephone.includes(q)
      );
    }
    return list;
  });

  protected readonly filters: { value: FilterStatus; label: string }[] = [
    { value: 'all',        label: 'Toutes'         },
    { value: 'pending',    label: 'En attente'      },
    { value: 'processing', label: 'En préparation'  },
    { value: 'shipped',    label: 'Expédiées'       },
    { value: 'delivered',  label: 'Livrées'         },
    { value: 'cancelled',  label: 'Annulées'        },
  ];

  protected readonly nextStatuses: Record<OrderStatus, { value: OrderStatus; label: string }[]> = {
    pending:    [{ value: 'processing', label: '📦 Prendre en charge' }, { value: 'cancelled', label: '❌ Annuler' }],
    processing: [{ value: 'shipped',   label: '🚚 Marquer expédiée'  }, { value: 'cancelled', label: '❌ Annuler' }],
    shipped:    [{ value: 'delivered', label: '✅ Marquer livrée'    }],
    delivered:  [],
    cancelled:  [],
  };

  protected setFilter(f: FilterStatus): void { this.filter.set(f); }
  protected setSearch(v: string): void        { this.search.set(v); }
  protected setDateFrom(v: string): void      { this.dateFrom.set(v); }
  protected setDateTo(v: string): void        { this.dateTo.set(v); }

  protected setDatePreset(preset: 'today' | 'week' | 'month' | 'all'): void {
    const now   = new Date();
    const pad   = (n: number) => n.toString().padStart(2, '0');
    const ymd   = (d: Date)   => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    const today = ymd(now);

    if (preset === 'today') {
      this.dateFrom.set(today);
      this.dateTo.set(today);
    } else if (preset === 'week') {
      const mon = new Date(now);
      mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      this.dateFrom.set(ymd(mon));
      this.dateTo.set(today);
    } else if (preset === 'month') {
      this.dateFrom.set(`${now.getFullYear()}-${pad(now.getMonth()+1)}-01`);
      this.dateTo.set(today);
    } else {
      this.dateFrom.set('');
      this.dateTo.set('');
    }
  }

  protected readonly hasDateFilter = computed(() => this.dateFrom() !== '' || this.dateTo() !== '');
  protected openOrder(o: Order): void         { this.selectedOrder.set(o); }
  protected closeOrder(): void                { this.selectedOrder.set(null); }

  protected updateStatus(id: string, status: OrderStatus): void {
    this.orderService.updateStatus(id, status);
    const updated = this.orderService.orders().find(o => o.id === id);
    if (updated) this.selectedOrder.set(updated);
  }

  protected quickStatus(event: Event, id: string): void {
    event.stopPropagation();
    const val = (event.target as HTMLSelectElement).value as OrderStatus;
    this.updateStatus(id, val);
  }

  readonly allStatuses: { value: OrderStatus; label: string }[] = [
    { value: 'pending',    label: 'En attente'     },
    { value: 'processing', label: 'En préparation' },
    { value: 'shipped',    label: 'Expédiée'       },
    { value: 'delivered',  label: 'Livrée'         },
    { value: 'cancelled',  label: 'Annulée'        },
  ];

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

  protected printList(): void {
    const fmt  = (n: number) => this.currencyPipe.transform(n, 'EUR', 'symbol', '1.2-2') ?? '';
    const rows = this.filteredOrders().map(o => `
      <tr>
        <td style="font-family:monospace;font-weight:700;color:#0B3D34">${o.id}</td>
        <td>${o.orderedBy ? `${o.orderedBy.prenom} ${o.orderedBy.nom}<br><small style="color:#888">${o.orderedBy.telephone}</small>` : '—'}</td>
        <td>${o.recipient.prenom} ${o.recipient.nom}<br><small style="color:#888">${o.recipient.ile}, ${o.recipient.ville}</small></td>
        <td>${this.datePipe.transform(o.date, 'dd/MM/yy HH:mm') ?? ''}</td>
        <td>${o.delivery.label}</td>
        <td style="text-align:right;font-weight:700;color:#0B3D34">${fmt(o.total)}</td>
        <td><span style="padding:3px 10px;border-radius:20px;font-size:11px;font-weight:700;
          background:${this._statusBg(o.status)};color:${this._statusColor(o.status)}">${this.statusLabel(o.status)}</span></td>
      </tr>`).join('');

    const filterLabel = this.filter() === 'all' ? 'Toutes les commandes' : this.statusLabel(this.filter() as OrderStatus);
    const searchLabel = this.search() ? ` — Recherche : "${this.search()}"` : '';
    const printDate   = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm') ?? '';

    const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8" /><title>Liste commandes — ${filterLabel}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#1a2e1a;padding:24px}
  .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #0B3D34}
  .brand{font-size:18px;font-weight:900;color:#0B3D34}.brand span{color:#C8A84B}
  .meta{text-align:right;font-size:11px;color:#666}
  .filter-info{margin-bottom:14px;font-size:12px;color:#555;font-weight:600}
  table{width:100%;border-collapse:collapse}
  thead tr{background:#0B3D34;color:#fff}
  thead th{padding:8px 10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
  tbody tr{border-bottom:1px solid #e5e7eb}
  tbody tr:last-child{border-bottom:none}
  tbody td{padding:8px 10px;vertical-align:middle}
  .footer{margin-top:20px;padding-top:12px;border-top:1px dashed #ccc;text-align:center;font-size:10px;color:#999}
  @media print{body{padding:12px}}
</style></head><body>
<div class="header">
  <div class="brand">🛒 BAZAR <span>Comores</span></div>
  <div class="meta">Imprimé le ${printDate}<br>www.bazarcomores.com</div>
</div>
<div class="filter-info">${filterLabel}${searchLabel} — ${this.filteredOrders().length} commande(s)</div>
<table>
  <thead><tr><th>N° Commande</th><th>Commandé par</th><th>Destinataire / Ville</th><th>Date</th><th>Livraison</th><th style="text-align:right">Total</th><th>Statut</th></tr></thead>
  <tbody>${rows}</tbody>
</table>
<div class="footer">Bazar Comores — Liste des commandes générée automatiquement</div>
<script>window.onload=()=>window.print();<\/script>
</body></html>`;

    const w = window.open('', '_blank', 'width=1000,height=700');
    w?.document.write(html);
    w?.document.close();
  }

  private _statusBg(s: OrderStatus): string {
    const m: Record<OrderStatus, string> = { pending:'#fef3c7', processing:'#dbeafe', shipped:'#f3e8ff', delivered:'#dcfce7', cancelled:'#fee2e2' };
    return m[s];
  }

  private _statusColor(s: OrderStatus): string {
    const m: Record<OrderStatus, string> = { pending:'#92400e', processing:'#1d4ed8', shipped:'#7c3aed', delivered:'#166534', cancelled:'#dc2626' };
    return m[s];
  }

  protected filterCount(f: FilterStatus): number {
    const orders = this.orderService.orders();
    return f === 'all' ? orders.length : orders.filter(o => o.status === f).length;
  }

  protected printOrder(order: Order): void {
    const fmt  = (n: number) => this.currencyPipe.transform(n, 'EUR', 'symbol', '1.2-2') ?? '';
    const date = this.datePipe.transform(order.date, 'dd/MM/yyyy HH:mm') ?? '';

    const rows = order.items.map(i => `
      <tr>
        <td>${i.name}</td>
        <td style="text-align:center">${i.quantity}</td>
        <td style="text-align:right">${fmt(i.price)}</td>
        <td style="text-align:right"><strong>${fmt(i.price * i.quantity)}</strong></td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Fiche commande ${order.id}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a2e1a; padding: 32px; max-width: 720px; margin: auto; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 2px solid #0B3D34; }
    .brand { font-size: 22px; font-weight: 900; color: #0B3D34; }
    .brand span { color: #C8A84B; }
    .brand small { display: block; font-size: 11px; font-weight: 400; color: #666; margin-top: 2px; }
    .order-ref { text-align: right; }
    .order-ref .id { font-size: 18px; font-weight: 900; color: #0B3D34; font-family: monospace; }
    .order-ref .date { font-size: 11px; color: #666; margin-top: 4px; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-top: 6px; background: #fef3c7; color: #92400e; }
    .section { margin-bottom: 22px; }
    .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 10px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 24px; }
    .info-grid .row { display: flex; gap: 8px; font-size: 12px; }
    .info-grid .label { color: #888; min-width: 90px; }
    .info-grid .value { font-weight: 600; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #0B3D34; color: white; }
    thead th { padding: 8px 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    tbody tr { border-bottom: 1px solid #e5e7eb; }
    tbody tr:last-child { border-bottom: none; }
    tbody td { padding: 9px 12px; font-size: 12px; }
    tfoot tr { background: #f0fdf4; }
    tfoot td { padding: 8px 12px; font-size: 12px; font-weight: 600; }
    .total-row td { font-size: 14px; font-weight: 900; color: #0B3D34; border-top: 2px solid #0B3D34; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px dashed #ccc; text-align: center; font-size: 11px; color: #999; }
    @media print { body { padding: 16px; } button { display: none !important; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">🛒 BAZAR <span>Comores</span></div>
      <small>www.bazarcomores.com</small>
    </div>
    <div class="order-ref">
      <div class="id">${order.id}</div>
      <div class="date">${date}</div>
      <div class="badge">${this.statusLabel(order.status)}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Destinataire</div>
    <div class="info-grid">
      ${order.orderedBy ? `
      <div class="row"><span class="label">Commandé par</span><span class="value">${order.orderedBy.prenom} ${order.orderedBy.nom} (${order.orderedBy.type === 'account' ? 'Compte' : 'Invité'})</span></div>
      <div class="row"><span class="label">Tél. expéditeur</span><span class="value">${order.orderedBy.telephone}</span></div>` : ''}
      <div class="row"><span class="label">Destinataire</span><span class="value">${order.recipient.prenom} ${order.recipient.nom}</span></div>
      <div class="row"><span class="label">Téléphone</span><span class="value">${order.recipient.telephone}</span></div>
      ${order.recipient.email ? `<div class="row"><span class="label">Email</span><span class="value">${order.recipient.email}</span></div>` : ''}
      <div class="row"><span class="label">Île</span><span class="value">${order.recipient.ile}</span></div>
      <div class="row"><span class="label">Ville</span><span class="value">${order.recipient.ville}</span></div>
      <div class="row"><span class="label">Adresse</span><span class="value">${order.recipient.adresse}</span></div>
      ${order.recipient.instructions ? `<div class="row"><span class="label">Instructions</span><span class="value">${order.recipient.instructions}</span></div>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Articles commandés</div>
    <table>
      <thead><tr><th>Produit</th><th style="text-align:center">Qté</th><th style="text-align:right">P.U.</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="3">Sous-total</td><td style="text-align:right">${fmt(order.subtotal)}</td></tr>
        <tr><td colspan="3">${order.delivery.label}</td><td style="text-align:right">${order.delivery.cost === 0 ? 'Gratuit' : fmt(order.delivery.cost)}</td></tr>
        <tr class="total-row"><td colspan="3">Total TTC</td><td style="text-align:right">${fmt(order.total)}</td></tr>
      </tfoot>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Paiement</div>
    <p>${order.payment.label}</p>
  </div>

  <div class="footer">Bazar Comores — Produits 100% locaux livrés directement aux Comores<br>www.bazarcomores.com</div>

  <script>window.onload = () => window.print();<\/script>
</body></html>`;

    const w = window.open('', '_blank', 'width=800,height=900');
    w?.document.write(html);
    w?.document.close();
  }
}
