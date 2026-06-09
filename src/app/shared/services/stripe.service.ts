import { Injectable } from '@angular/core';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getApp } from 'firebase/app';

import { environment } from '../../../environments/environment';

export interface StripeCheckoutItem {
  name:      string;
  price:     number;
  quantity:  number;
  imageUrl?: string;
}

export interface CreateSessionPayload {
  orderId:    string;
  items:      StripeCheckoutItem[];
  currency:   string;
  successUrl: string;
  cancelUrl:  string;
}

export interface CreateSessionResult {
  sessionId: string;
  url:       string;
}

const DEV_SERVER = 'http://localhost:5001';

@Injectable({ providedIn: 'root' })
export class StripeService {
  private readonly functions = getFunctions(getApp(), 'europe-west1');

  get publicKey(): string {
    return environment.stripe.publicKey;
  }

  async createCheckoutSession(payload: CreateSessionPayload): Promise<CreateSessionResult> {
    if (!environment.production) {
      const res = await fetch(`${DEV_SERVER}/createCheckoutSession`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ data: payload }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error?.message ?? 'Erreur serveur local Stripe');
      }
      const json = await res.json();
      return json.result as CreateSessionResult;
    }

    const fn = httpsCallable<CreateSessionPayload, CreateSessionResult>(
      this.functions,
      'createCheckoutSession'
    );
    const result = await fn(payload);
    return result.data;
  }

  redirectToCheckout(url: string): void {
    window.location.href = url;
  }
}
