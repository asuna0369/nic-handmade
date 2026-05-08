import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/api/create-checkout-session', express.json(), async (req, res) => {
  const { items, orderId } = req.body;

  const line_items = items.map(item => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.product.name,
        images: [item.product.image_url ? `${req.protocol}://${req.get('host')}${item.product.image_url}` : ''],
      },
      unit_amount: Math.round(item.product.price * 100), // prix déjà en EUR
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: 'http://localhost:5173/order-success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:5173/checkout?canceled=true',
    metadata: {
      order_id: orderId,
    },
  });

  res.json({ url: session.url });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur prêt sur http://localhost:${PORT}`);
});