import * as admin from 'firebase-admin';
import { onCall, onRequest, HttpsError } from 'firebase-functions/v2/https';
import Stripe from 'stripe';

admin.initializeApp();

const getStripe = (): Stripe => {
  const key = process.env['STRIPE_SECRET_KEY'];
  if (!key) throw new HttpsError('failed-precondition', 'Stripe secret key not configured.');
  return new Stripe(key, { apiVersion: '2024-06-20' });
};

interface CheckoutItem {
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface CreateSessionRequest {
  orderId:    string;
  items:      CheckoutItem[];
  currency:   string;
  successUrl: string;
  cancelUrl:  string;
}

/**
 * Crée une Stripe Checkout Session et retourne { sessionId, url }.
 * Appelée depuis le client via httpsCallable.
 */
export const createCheckoutSession = onCall(
  { region: 'europe-west1', cors: true },
  async (request) => {
    const data = request.data as CreateSessionRequest;
    const { orderId, items, currency, successUrl, cancelUrl } = data;

    if (!orderId || !items?.length) {
      throw new HttpsError('invalid-argument', 'orderId et items sont requis.');
    }

    const stripe = getStripe();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(item => ({
      price_data: {
        currency: currency ?? 'eur',
        product_data: {
          name: item.name,
          ...(item.imageUrl?.startsWith('http') ? { images: [item.imageUrl] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
      cancel_url:  `${cancelUrl}?cancelled=1`,
      metadata: { orderId },
    });

    return { sessionId: session.id, url: session.url };
  }
);

/**
 * Webhook Stripe — met à jour le statut de la commande après paiement.
 * Configurez l'URL dans le Dashboard Stripe : /stripe-webhook
 */
export const stripeWebhook = onRequest(
  { region: 'europe-west1' },
  async (req, res) => {
    const sig           = req.headers['stripe-signature'] as string | undefined;
    const webhookSecret = process.env['STRIPE_WEBHOOK_SECRET'] ?? '';

    if (!sig) {
      res.status(400).send('Missing stripe-signature header.');
      return;
    }

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
      console.error('Webhook signature error:', err);
      res.status(400).send('Webhook signature verification failed.');
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session  = event.data.object as Stripe.Checkout.Session;
      const orderId  = session.metadata?.['orderId'];

      if (orderId) {
        await admin.firestore().collection('orders').doc(orderId).update({
          status:          'processing',
          stripeSessionId: session.id,
          paidAt:          new Date().toISOString(),
        });
        console.log(`[Webhook] Order ${orderId} → processing`);
      }
    }

    res.status(200).send('OK');
  }
);
