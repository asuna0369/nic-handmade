import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Client Supabase admin (service_role) pour le webhook
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CORS : autoriser toutes les origines pour le moment (à restreindre plus tard)
app.use(cors({ origin: 'https://nic-handmade.vercel.app' }));

// Route de création de session Stripe
app.post('/api/create-checkout-session', express.json(), async (req, res) => {
  const { items, orderId } = req.body;

  const line_items = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.product.name,
      },
      unit_amount: Math.round(item.product.price * 100), // prix en centimes d'euro
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'https://nic-handmade.vercel.app/order-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://nic-handmade.vercel.app/checkout?canceled=true',
      metadata: {
        order_id: orderId,
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erreur création session:', err);
    res.status(500).json({ error: 'Erreur création session' });
  }
});

// Webhook Stripe
app.post(
  '/api/stripe-webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('❌ Erreur signature webhook:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata.order_id;

      if (orderId) {
        const { error } = await supabaseAdmin
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'processing',
          })
          .eq('id', orderId);

        if (error) {
          console.error('❌ Erreur mise à jour commande:', error);
        } else {
          console.log(`✅ Commande ${orderId} marquée comme payée`);
        }
      }
    }

    res.json({ received: true });
  }
);

// Test de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Serveur prêt sur le port ${PORT}`);
});