import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '@features/cart/cart.service';
import { OrderService } from '@features/admin/services/order.service';
import { PromoService } from './promo.service';
import type { Order } from '@shared/models';
import type { PromoCode } from './promo.service';

export type Step           = 1 | 2 | 3 | 4;
export type PaymentMethod  = 'carte' | 'paypal';
export type DeliveryOption = 'domicile' | 'relais' | 'express';

export interface DeliveryChoice {
  id: DeliveryOption;
  label: string;
  detail: string;
  price: number;
  icon: string;
}

export const DELIVERY_OPTIONS: DeliveryChoice[] = [
  { id: 'domicile', label: 'Livraison à domicile', detail: '3 – 5 jours ouvrés',  price: 8.90,  icon: '🏠' },
  { id: 'relais',   label: 'Point de retrait',      detail: 'Disponible sous 48 h', price: 0,     icon: '📦' },
  { id: 'express',  label: 'Livraison express',     detail: 'Sous 24 h garantie',   price: 15.00, icon: '⚡' },
];

export const CHECKOUT_STEPS = [
  { num: 1 as Step, label: 'Récapitulatif' },
  { num: 2 as Step, label: 'Livraison'     },
  { num: 3 as Step, label: 'Paiement'      },
];

@Component({
  selector: 'page-checkout',
  templateUrl: './checkout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CurrencyPipe, RouterLink],
})
export class Checkout {
  protected readonly cartService    = inject(CartService);
  private  readonly orderService    = inject(OrderService);
  private  readonly promoService    = inject(PromoService);
  private  readonly fb              = inject(FormBuilder);

  protected readonly step           = signal<Step>(1);
  protected readonly paymentMethod  = signal<PaymentMethod>('carte');
  protected readonly deliveryOption = signal<DeliveryOption>('domicile');
  protected readonly orderNumber    = signal('');
  protected readonly confirmedName  = signal('');
  protected readonly confirmedIle   = signal('');
  protected readonly confirmedVille = signal('');

  protected readonly couponInput    = signal('');
  protected readonly appliedPromo   = signal<PromoCode | null>(null);
  protected readonly couponError    = signal('');
  protected readonly couponSuccess  = signal(false);

  protected readonly checkoutSteps   = CHECKOUT_STEPS;
  protected readonly deliveryOptions = DELIVERY_OPTIONS;
  protected readonly items           = this.cartService.items;
  protected readonly subtotal        = this.cartService.subtotal;

  protected readonly selectedDelivery = computed(() =>
    DELIVERY_OPTIONS.find(d => d.id === this.deliveryOption())!
  );
  protected readonly deliveryCost    = computed(() => this.selectedDelivery().price);
  protected readonly discountAmount  = computed(() => {
    const p = this.appliedPromo();
    return p ? this.promoService.computeDiscount(p, this.subtotal()) : 0;
  });
  protected readonly orderTotal      = computed(() =>
    this.subtotal() + this.deliveryCost() - this.discountAmount()
  );

  protected readonly deliveryForm = this.fb.group({
    prenom:       ['', [Validators.required, Validators.minLength(2)]],
    nom:          ['', [Validators.required, Validators.minLength(2)]],
    telephone:    ['', Validators.required],
    email:        ['', Validators.email],
    ile:          ['Grande Comore (Ngazidja)', Validators.required],
    ville:        ['', Validators.required],
    adresse:      ['', Validators.required],
    instructions: [''],
  });

  protected readonly cardForm = this.fb.group({
    numero:     ['', [Validators.required, Validators.pattern(/^[\d\s]{19}$/)]],
    titulaire:  ['', Validators.required],
    expiration: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvv:        ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
  });

  protected stepCircleClass(num: number): string {
    const s = this.step();
    if (s > num)  return 'bg-primary border-primary text-white';
    if (s === num) return 'bg-white border-primary text-primary shadow-sm';
    return 'bg-surface-alt border-border text-muted';
  }

  protected stepLabelClass(num: number): string {
    return this.step() >= num ? 'text-foreground font-semibold' : 'text-muted';
  }

  protected connectorClass(num: number): string {
    return 'h-0.5 flex-1 mx-2 transition-colors ' + (this.step() > num ? 'bg-primary' : 'bg-border');
  }

  protected deliveryCardClass(id: DeliveryOption): string {
    return 'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left w-full ' +
      (this.deliveryOption() === id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40');
  }

  protected paymentCardClass(method: PaymentMethod): string {
    return 'flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left w-full ' +
      (this.paymentMethod() === method ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40');
  }

  protected setDelivery(opt: DeliveryOption): void { this.deliveryOption.set(opt); }
  protected setPayment(method: PaymentMethod): void { this.paymentMethod.set(method); }

  protected goToStep(s: Step): void {
    if (s < this.step()) this.step.set(s);
  }

  protected nextStep(): void {
    if (this.step() < 4) this.step.update(s => (s + 1) as Step);
  }

  protected prevStep(): void {
    if (this.step() > 1) this.step.update(s => (s - 1) as Step);
  }

  protected canProceedStep2(): boolean {
    return this.deliveryForm.valid;
  }

  protected placeOrder(): void {
    const ref = 'BC-' + Date.now().toString(36).toUpperCase().slice(-6);
    const f   = this.deliveryForm.value;
    const del = this.selectedDelivery();

    const order: Order = {
      id:   ref,
      date: new Date().toISOString(),
      status: 'pending',
      customer: {
        prenom:        f['prenom'] ?? '',
        nom:           f['nom'] ?? '',
        telephone:     f['telephone'] ?? '',
        email:         f['email'] ?? undefined,
        ile:           f['ile'] ?? '',
        ville:         f['ville'] ?? '',
        adresse:       f['adresse'] ?? '',
        instructions:  f['instructions'] ?? undefined,
      },
      delivery: { method: del.id, label: del.label, cost: del.price },
      payment:  { method: this.paymentMethod(), label: this.paymentLabel() },
      items: this.items().map(i => ({
        productId: i.product.id,
        name:      i.product.name,
        price:     i.product.price,
        quantity:  i.quantity,
        emoji:     i.product.emoji,
        imageUrl:  i.product.imageUrl,
      })),
      subtotal:  this.subtotal(),
      discount:  this.appliedPromo()
        ? { code: this.appliedPromo()!.code, amount: this.discountAmount() }
        : undefined,
      total:     this.orderTotal(),
    };

    this.orderService.addOrder(order);
    this.orderNumber.set(ref);
    this.confirmedName.set(`${f['prenom']} ${f['nom']}`);
    this.confirmedIle.set(f['ile'] ?? '');
    this.confirmedVille.set(f['ville'] ?? '');
    this.cartService.clear();
    this.step.set(4);
  }

  protected formatCardNumber(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw   = input.value.replace(/\D/g, '').slice(0, 16);
    input.value = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.cardForm.get('numero')?.setValue(input.value, { emitEvent: false });
  }

  protected setCouponInput(e: Event): void {
    this.couponInput.set((e.target as HTMLInputElement).value);
  }

  protected applyCoupon(): void {
    this.couponError.set('');
    this.couponSuccess.set(false);
    const result = this.promoService.validate(this.couponInput(), this.subtotal());
    if (result.valid) {
      this.appliedPromo.set(result.promo);
      this.couponSuccess.set(true);
    } else {
      this.appliedPromo.set(null);
      this.couponError.set(result.error);
    }
  }

  protected removeCoupon(): void {
    this.appliedPromo.set(null);
    this.couponInput.set('');
    this.couponError.set('');
    this.couponSuccess.set(false);
  }

  protected paymentLabel(): string {
    const labels: Record<PaymentMethod, string> = {
      'carte':   '💳 Carte bancaire',
      'paypal':  '🅿️ PayPal',
    };
    return labels[this.paymentMethod()];
  }
}
