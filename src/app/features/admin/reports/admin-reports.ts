import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { OrderService } from '../services/order.service';
import type { Order } from '@shared/models';

type Preset = 'today' | 'week' | 'month' | 'year' | 'all';

@Component({
  selector: 'admin-reports',
  templateUrl: './admin-reports.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, DatePipe],
  providers: [DatePipe, CurrencyPipe],
})
export class AdminReports {
  private  readonly orderService = inject(OrderService);
  private  readonly datePipe     = inject(DatePipe);
  private  readonly currencyPipe = inject(CurrencyPipe);

  protected readonly dateFrom     = signal('');
  protected readonly dateTo       = signal('');
  protected readonly activePreset = signal<Preset>('month');

  private pad = (n: number) => n.toString().padStart(2, '0');
  private ymd = (d: Date)   =>
    `${d.getFullYear()}-${this.pad(d.getMonth()+1)}-${this.pad(d.getDate())}`;

  protected readonly periodOrders = computed(() => {
    const from = this.dateFrom() ? new Date(this.dateFrom()) : null;
    const to   = this.dateTo()   ? new Date(this.dateTo() + 'T23:59:59') : null;
    return this.orderService.orders().filter(o => {
      const d = new Date(o.date);
      if (from && d < from) return false;
      if (to   && d > to)   return false;
      return o.status !== 'cancelled';
    });
  });

  protected readonly kpis = computed(() => {
    const orders = this.periodOrders();
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    const count   = orders.length;
    return {
      revenue,
      count,
      avgOrder:  count ? revenue / count : 0,
      delivered: orders.filter(o => o.status === 'delivered').length,
    };
  });

  protected readonly productSales = computed(() => {
    const map = new Map<string, { name: string; qty: number; revenue: number; imageUrl?: string; emoji?: string }>();
    for (const order of this.periodOrders()) {
      for (const item of order.items) {
        const existing = map.get(item.productId);
        if (existing) {
          existing.qty     += item.quantity;
          existing.revenue += item.price * item.quantity;
        } else {
          map.set(item.productId, {
            name:     item.name,
            qty:      item.quantity,
            revenue:  item.price * item.quantity,
            imageUrl: item.imageUrl,
            emoji:    item.emoji,
          });
        }
      }
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue);
  });

  protected readonly deliverySales = computed(() => {
    const map = new Map<string, { label: string; count: number; revenue: number }>();
    for (const o of this.periodOrders()) {
      const k = o.delivery.method;
      const e = map.get(k);
      if (e) { e.count++; e.revenue += o.delivery.cost; }
      else   map.set(k, { label: o.delivery.label, count: 1, revenue: o.delivery.cost });
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  });

  protected readonly paymentSales = computed(() => {
    const map = new Map<string, { label: string; count: number; revenue: number }>();
    for (const o of this.periodOrders()) {
      const k = o.payment.method;
      const e = map.get(k);
      if (e) { e.count++; e.revenue += o.total; }
      else   map.set(k, { label: o.payment.label, count: 1, revenue: o.total });
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue);
  });

  protected readonly presets: { key: Preset; label: string }[] = [
    { key: 'today', label: "Aujourd'hui" },
    { key: 'week',  label: 'Cette semaine' },
    { key: 'month', label: 'Ce mois' },
    { key: 'year',  label: 'Cette année' },
    { key: 'all',   label: 'Tout' },
  ];

  protected setPreset(p: Preset): void {
    this.activePreset.set(p);
    const now   = new Date();
    const today = this.ymd(now);

    if (p === 'today') {
      this.dateFrom.set(today); this.dateTo.set(today);
    } else if (p === 'week') {
      const mon = new Date(now);
      mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
      this.dateFrom.set(this.ymd(mon)); this.dateTo.set(today);
    } else if (p === 'month') {
      this.dateFrom.set(`${now.getFullYear()}-${this.pad(now.getMonth()+1)}-01`);
      this.dateTo.set(today);
    } else if (p === 'year') {
      this.dateFrom.set(`${now.getFullYear()}-01-01`); this.dateTo.set(today);
    } else {
      this.dateFrom.set(''); this.dateTo.set('');
    }
  }

  protected setDateFrom(v: string): void { this.activePreset.set('all'); this.dateFrom.set(v); }
  protected setDateTo(v: string):   void { this.activePreset.set('all'); this.dateTo.set(v); }

  protected printReport(): void {
    const fmt     = (n: number) => this.currencyPipe.transform(n, 'EUR', 'symbol', '1.2-2') ?? '';
    const k       = this.kpis();
    const orders  = this.periodOrders();
    const preset  = this.presets.find(p => p.key === this.activePreset())?.label ?? 'Personnalisée';
    const period  = this.dateFrom() && this.dateTo()
      ? `${this.datePipe.transform(this.dateFrom(),'dd/MM/yyyy')} → ${this.datePipe.transform(this.dateTo(),'dd/MM/yyyy')}`
      : preset;

    const prodRows = this.productSales().map((p, i) => `
      <tr>
        <td style="text-align:center;color:#888">${i + 1}</td>
        <td>${p.name}</td>
        <td style="text-align:center;font-weight:700">${p.qty}</td>
        <td style="text-align:right;font-weight:700;color:#0B3D34">${fmt(p.revenue)}</td>
      </tr>`).join('');

    const orderRows = orders.map(o => `
      <tr>
        <td style="font-family:monospace;color:#0B3D34;font-weight:700">${o.id}</td>
        <td>${o.recipient.prenom} ${o.recipient.nom} — ${o.recipient.ville}</td>
        <td>${this.datePipe.transform(o.date,'dd/MM/yy HH:mm') ?? ''}</td>
        <td>${o.delivery.label}</td>
        <td style="text-align:right;font-weight:700;color:#0B3D34">${fmt(o.total)}</td>
      </tr>`).join('');

    const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/><title>Rapport de ventes — ${period}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#1a2e1a;padding:28px}
  h2{font-size:14px;font-weight:800;color:#0B3D34;margin:20px 0 10px}
  .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #0B3D34}
  .brand{font-size:20px;font-weight:900;color:#0B3D34}.brand span{color:#C8A84B}
  .meta{text-align:right;font-size:11px;color:#666}
  .period{font-size:13px;font-weight:700;color:#0B3D34;margin-bottom:20px;padding:8px 14px;background:#f0fdf4;border-radius:8px;display:inline-block}
  .kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
  .kpi{background:#f0fdf4;border-radius:10px;padding:12px 16px;text-align:center}
  .kpi .val{font-size:22px;font-weight:900;color:#0B3D34}
  .kpi .lbl{font-size:10px;color:#666;margin-top:2px}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  thead tr{background:#0B3D34;color:#fff}
  thead th{padding:7px 10px;text-align:left;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px}
  tbody tr{border-bottom:1px solid #e5e7eb}
  tbody tr:last-child{border-bottom:none}
  tbody td{padding:7px 10px}
  .footer{margin-top:16px;padding-top:12px;border-top:1px dashed #ccc;text-align:center;font-size:10px;color:#999}
  @media print{body{padding:14px}}
</style></head><body>
<div class="header">
  <div class="brand">🛒 BAZAR <span>Comores</span><br><small style="font-size:11px;font-weight:400;color:#666">Rapport de ventes</small></div>
  <div class="meta">Généré le ${this.datePipe.transform(new Date(),'dd/MM/yyyy HH:mm') ?? ''}<br>www.bazarcomores.com</div>
</div>
<div class="period">📅 Période : ${period}</div>
<div class="kpis">
  <div class="kpi"><div class="val">${fmt(k.revenue)}</div><div class="lbl">Chiffre d'affaires</div></div>
  <div class="kpi"><div class="val">${k.count}</div><div class="lbl">Commandes</div></div>
  <div class="kpi"><div class="val">${fmt(k.avgOrder)}</div><div class="lbl">Panier moyen</div></div>
  <div class="kpi"><div class="val">${k.delivered}</div><div class="lbl">Livrées</div></div>
</div>
<h2>Produits vendus</h2>
<table>
  <thead><tr><th>#</th><th>Produit</th><th style="text-align:center">Qté</th><th style="text-align:right">CA</th></tr></thead>
  <tbody>${prodRows}</tbody>
</table>
<h2>Détail des commandes (${orders.length})</h2>
<table>
  <thead><tr><th>N° Commande</th><th>Client</th><th>Date</th><th>Livraison</th><th style="text-align:right">Total</th></tr></thead>
  <tbody>${orderRows}</tbody>
  <tfoot><tr style="background:#f0fdf4">
    <td colspan="4" style="padding:8px 10px;font-weight:800">TOTAL</td>
    <td style="padding:8px 10px;text-align:right;font-weight:900;color:#0B3D34;font-size:14px">${fmt(k.revenue)}</td>
  </tr></tfoot>
</table>
<div class="footer">Bazar Comores — Rapport généré automatiquement — www.bazarcomores.com</div>
<script>window.onload=()=>window.print();<\/script>
</body></html>`;

    const w = window.open('', '_blank', 'width=1000,height=800');
    w?.document.write(html);
    w?.document.close();
  }

  constructor() {
    this.setPreset('month');
  }
}
