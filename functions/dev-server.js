/**
 * Serveur local de test Stripe (remplace la Cloud Function en développement)
 * Usage : node functions/dev-server.js
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const Stripe = require('stripe');

const app  = express();
const PORT = 5001;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  console.error('❌  STRIPE_SECRET_KEY manquant dans functions/.env');
  process.exit(1);
}
const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });

app.post('/createCheckoutSession', async (req, res) => {
  try {
    const { orderId, items, currency, successUrl, cancelUrl } = req.body.data ?? req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: currency ?? 'eur',
          product_data: {
            name: item.name,
            ...(item.imageUrl?.startsWith('http') ? { images: [item.imageUrl] } : {}),
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode:        'payment',
      success_url: `${successUrl}?order_id=${orderId}`,
      cancel_url:  cancelUrl,
      metadata:    { orderId },
    });

    console.log(`✅  Session créée : ${session.id} — ${orderId}`);
    res.json({ result: { sessionId: session.id, url: session.url } });
  } catch (err) {
    console.error('❌  Stripe error :', err.message);
    res.status(500).json({ error: { message: err.message } });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀  Stripe dev server prêt → http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/createCheckoutSession\n`);
});
