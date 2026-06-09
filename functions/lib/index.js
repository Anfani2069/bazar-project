"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.createCheckoutSession = void 0;
const admin = require("firebase-admin");
const https_1 = require("firebase-functions/v2/https");
const stripe_1 = require("stripe");
admin.initializeApp();
const getStripe = () => {
    const key = process.env['STRIPE_SECRET_KEY'];
    if (!key)
        throw new https_1.HttpsError('failed-precondition', 'Stripe secret key not configured.');
    return new stripe_1.default(key, { apiVersion: '2024-06-20' });
};
/**
 * Crée une Stripe Checkout Session et retourne { sessionId, url }.
 * Appelée depuis le client via httpsCallable.
 */
exports.createCheckoutSession = (0, https_1.onCall)({ region: 'europe-west1', cors: true }, async (request) => {
    const data = request.data;
    const { orderId, items, currency, successUrl, cancelUrl } = data;
    if (!orderId || !(items === null || items === void 0 ? void 0 : items.length)) {
        throw new https_1.HttpsError('invalid-argument', 'orderId et items sont requis.');
    }
    const stripe = getStripe();
    const lineItems = items.map(item => ({
        price_data: {
            currency: currency !== null && currency !== void 0 ? currency : 'eur',
            product_data: Object.assign({ name: item.name }, (item.imageUrl ? { images: [item.imageUrl] } : {})),
            unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
        cancel_url: `${cancelUrl}?cancelled=1`,
        metadata: { orderId },
    });
    return { sessionId: session.id, url: session.url };
});
/**
 * Webhook Stripe — met à jour le statut de la commande après paiement.
 * Configurez l'URL dans le Dashboard Stripe : /stripe-webhook
 */
exports.stripeWebhook = (0, https_1.onRequest)({ region: 'europe-west1' }, async (req, res) => {
    var _a, _b;
    const sig = req.headers['stripe-signature'];
    const webhookSecret = (_a = process.env['STRIPE_WEBHOOK_SECRET']) !== null && _a !== void 0 ? _a : '';
    if (!sig) {
        res.status(400).send('Missing stripe-signature header.');
        return;
    }
    const stripe = getStripe();
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    }
    catch (err) {
        console.error('Webhook signature error:', err);
        res.status(400).send('Webhook signature verification failed.');
        return;
    }
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = (_b = session.metadata) === null || _b === void 0 ? void 0 : _b['orderId'];
        if (orderId) {
            await admin.firestore().collection('orders').doc(orderId).update({
                status: 'processing',
                stripeSessionId: session.id,
                paidAt: new Date().toISOString(),
            });
            console.log(`[Webhook] Order ${orderId} → processing`);
        }
    }
    res.status(200).send('OK');
});
//# sourceMappingURL=index.js.map