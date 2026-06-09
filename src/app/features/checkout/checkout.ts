import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CartService } from '@features/cart/cart.service';
import { OrderService } from '@features/admin/services/order.service';
import { PromoService } from './promo.service';
import { CustomerAuthService } from '@shared/services/customer-auth.service';
import { StripeService } from '@shared/services/stripe.service';
import { EmailService } from '@shared/services/email.service';
import type { Order } from '@shared/models';
import type { PromoCode } from './promo.service';

export type Step           = 1 | 2 | 3 | 4;
export type PaymentMethod  = 'stripe' | 'paypal';
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
  protected readonly authService     = inject(CustomerAuthService);
  private  readonly stripeService   = inject(StripeService);
  private  readonly emailService    = inject(EmailService);
  private  readonly fb              = inject(FormBuilder);

  protected readonly guestMode      = signal<'guest' | 'account' | null>(null);
  protected readonly authPanel      = signal<'login' | 'register' | null>(null);
  protected readonly authError      = signal('');
  protected readonly authLoading    = signal(false);
  protected readonly guestPanel     = signal(false);
  protected readonly orderedBy      = signal<Order['orderedBy'] | null>(null);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user && this.guestMode() === null) {
        this.orderedBy.set({ prenom: user.prenom, nom: user.nom,
                             telephone: user.telephone, email: user.email, type: 'account' });
        this.guestMode.set('account');
      }
    });
    this.authService.loadProfileForCurrentUser();
  }
  protected readonly step           = signal<Step>(1);
  protected readonly paymentMethod  = signal<PaymentMethod>('stripe');
  protected readonly stripeLoading  = signal(false);
  protected readonly deliveryOption = signal<DeliveryOption>('domicile');
  protected readonly orderNumber    = signal('');
  protected readonly confirmedName  = signal('');
  protected readonly confirmedIle   = signal('');
  protected readonly confirmedVille = signal('');

  protected readonly couponInput    = signal('');
  protected readonly appliedPromo   = signal<PromoCode | null>(null);
  protected readonly couponError      = signal('');
  protected readonly couponSuccess    = signal(false);
  protected readonly placeOrderError  = signal('');

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

  protected openGuestPanel(): void {
    this.guestPanel.set(true);
    this.authPanel.set(null);
    this.guestInfoForm.reset();
  }

  protected readonly guestInfoForm = this.fb.group({
    prenom:    ['', [Validators.required, Validators.minLength(2)]],
    nom:       ['', [Validators.required, Validators.minLength(2)]],
    telephone: ['', Validators.required],
    email:     [''],
  });

  protected submitGuestInfo(): void {
    if (this.guestInfoForm.invalid) { this.guestInfoForm.markAllAsTouched(); return; }
    const v = this.guestInfoForm.getRawValue();
    this.orderedBy.set({
      prenom:    v.prenom    ?? '',
      nom:       v.nom       ?? '',
      telephone: v.telephone ?? '',
      email:     v.email     || undefined,
      type:      'guest',
    });
    this.guestMode.set('guest');
    this.guestPanel.set(false);
  }

  protected openAuthPanel(tab: 'login' | 'register'): void {
    this.authPanel.set(tab);
    this.guestPanel.set(false);
    this.authError.set('');
    this.loginForm.reset();
    this.registerForm.reset();
  }

  protected readonly loginForm = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  protected readonly registerForm = this.fb.group({
    prenom:    ['', [Validators.required, Validators.minLength(2)]],
    nom:       ['', [Validators.required, Validators.minLength(2)]],
    email:     ['', [Validators.required, Validators.email]],
    telephone: ['', Validators.required],
    password:  ['', [Validators.required, Validators.minLength(6)]],
  });

  protected async submitGoogle(): Promise<void> {
    this.authLoading.set(true);
    this.authError.set('');
    const res = await this.authService.loginWithGoogle();
    this.authLoading.set(false);
    if (!res.ok) { this.authError.set(res.error ?? 'Erreur Google.'); return; }
    const u = this.authService.currentUser()!;
    this.orderedBy.set({ prenom: u.prenom, nom: u.nom,
                         telephone: u.telephone, email: u.email, type: 'account' });
    this.guestMode.set('account');
    this.authPanel.set(null);
  }

  protected async submitLogin(): Promise<void> {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.authLoading.set(true);
    this.authError.set('');
    const { email, password } = this.loginForm.getRawValue();
    const res = await this.authService.login(email ?? '', password ?? '');
    this.authLoading.set(false);
    if (!res.ok) { this.authError.set(res.error ?? 'Erreur.'); return; }
    const u = this.authService.currentUser()!;
    this.orderedBy.set({ prenom: u.prenom, nom: u.nom,
                         telephone: u.telephone, email: u.email, type: 'account' });
    this.guestMode.set('account');
    this.authPanel.set(null);
  }

  protected async submitRegister(): Promise<void> {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.authLoading.set(true);
    this.authError.set('');
    const v = this.registerForm.getRawValue();
    const res = await this.authService.register({
      prenom:    v.prenom    ?? '',
      nom:       v.nom       ?? '',
      email:     v.email     ?? '',
      telephone: v.telephone ?? '',
      password:  v.password  ?? '',
    });
    this.authLoading.set(false);
    if (!res.ok) { this.authError.set(res.error ?? 'Erreur.'); return; }
    this.orderedBy.set({ prenom: v.prenom ?? '', nom: v.nom ?? '',
                         telephone: v.telephone ?? '', email: v.email || undefined, type: 'account' });
    this.guestMode.set('account');
    this.authPanel.set(null);
  }

  protected fillSameAsMe(): void {
    const me = this.orderedBy();
    if (!me) return;
    this.deliveryForm.patchValue({ prenom: me.prenom, nom: me.nom, telephone: me.telephone, email: me.email ?? '' });
  }

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

  protected async placeOrder(): Promise<void> {
    this.placeOrderError.set('');
    const ref = 'BC-' + Date.now().toString(36).toUpperCase()
              + Math.random().toString(36).slice(2, 5).toUpperCase();
    const f   = this.deliveryForm.value;
    const del = this.selectedDelivery();

    const order: Order = {
      id:     ref,
      date:   new Date().toISOString(),
      userId: this.authService.currentUser()?.id,
      status: 'pending',
      orderedBy: this.orderedBy() ?? undefined,
      recipient: {
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

    try {
      await this.orderService.addOrder(order);
    } catch (err) {
      console.error('[Checkout] Failed to save order:', err);
      this.placeOrderError.set('Une erreur est survenue. Votre commande n\'a pas été enregistrée. Veuillez réessayer.');
      return;
    }

    if (this.paymentMethod() === 'stripe') {
      await this.redirectToStripe(order);
    } else {
      this.orderNumber.set(ref);
      this.confirmedName.set(`${f['prenom']} ${f['nom']}`);
      this.confirmedIle.set(f['ile'] ?? '');
      this.confirmedVille.set(f['ville'] ?? '');
      this.cartService.clear();
      this.step.set(4);
      const customerEmail = order.orderedBy?.email ?? order.recipient.email ?? '';
      if (customerEmail) {
        this.emailService.sendOrderConfirmation(order, customerEmail);
      }
      this.emailService.sendAdminNotification(order);
    }
  }

  private async redirectToStripe(order: Order): Promise<void> {
    this.stripeLoading.set(true);
    this.placeOrderError.set('');
    try {
      const origin     = window.location.origin;
      const result     = await this.stripeService.createCheckoutSession({
        orderId:    order.id,
        currency:   'eur',
        successUrl: `${origin}/commande/success`,
        cancelUrl:  `${origin}/panier`,
        items: order.items.map(i => ({
          name:     i.name,
          price:    i.price,
          quantity: i.quantity,
          imageUrl: i.imageUrl?.startsWith('http') ? i.imageUrl : undefined,
        })),
      });
      this.stripeService.redirectToCheckout(result.url);
    } catch (err) {
      console.error('[Checkout] Stripe error:', err);
      this.stripeLoading.set(false);
      this.placeOrderError.set('Erreur lors de la redirection vers Stripe. Veuillez réessayer.');
    }
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
      'stripe': '💳 Stripe (carte bancaire)',
      'paypal': '🅿️ PayPal',
    };
    return labels[this.paymentMethod()];
  }
}
