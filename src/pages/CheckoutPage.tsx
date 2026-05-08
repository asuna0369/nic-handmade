import { useState, type FormEvent } from 'react';
import { ArrowLeft, Truck, Shield, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';
import { formatPrice } from '../lib/products';
import { supabase } from '../lib/supabase';

interface CheckoutForm {
  email: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  delivery_notes: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { navigate } = usePage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<CheckoutForm>({
    email: '',
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Madagascar',
    delivery_notes: '',
  });

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Créer la commande dans Supabase (status awaiting_payment)
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          email: form.email,
          full_name: form.full_name,
          phone: form.phone,
          total_amount: totalPrice,
          status: 'awaiting_payment',
          payment_status: 'unpaid',
        })
        .select('id')
        .single();

      if (orderError) throw orderError;
      if (!orderData) throw new Error('Failed to create order');

      const orderId = orderData.id;

      // Enregistrer les articles de la commande
      const orderItems = items.map(item => ({
        order_id: orderId,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      // Enregistrer l'adresse de livraison
      const { error: deliveryError } = await supabase.from('delivery_info').insert({
        order_id: orderId,
        address_line1: form.address_line1,
        address_line2: form.address_line2 || null,
        city: form.city,
        state: form.state || null,
        postal_code: form.postal_code || null,
        country: form.country,
        delivery_notes: form.delivery_notes || null,
      });
      if (deliveryError) throw deliveryError;

      // 2. Appeler le backend pour créer une session Stripe Checkout
      const response = await fetch('http://localhost:3001/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, orderId }),
      });

      if (!response.ok) throw new Error('Erreur création session paiement');

      const session = await response.json();

      // 3. Vider le panier et rediriger vers Stripe
      clearCart();
      window.location.href = session.url;
    } catch (err) {
      console.error('Order submission error:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-lg font-semibold text-stone-900 mb-2">Votre panier est vide</p>
          <p className="text-sm text-stone-500 mb-6">Ajoutez des articles avant de commander</p>
          <button
            onClick={() => navigate('home')}
            className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-full transition-colors"
          >
            Voir la collection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-20 sm:pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Continuer mes achats
        </button>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-8">
          Passer la commande
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Informations de contact */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <span className="text-xs font-bold text-amber-700">1</span>
                  </div>
                  <h2 className="text-base font-bold text-stone-900">Informations de contact</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => updateField('email', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Nom complet *</label>
                    <input
                      type="text"
                      required
                      value={form.full_name}
                      onChange={e => updateField('full_name', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      placeholder="Rakoto Jean"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Téléphone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => updateField('phone', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      placeholder="+261 34 00 000 00"
                    />
                  </div>
                </div>
              </div>

              {/* Adresse de livraison */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-amber-700" />
                  </div>
                  <h2 className="text-base font-bold text-stone-900">Adresse de livraison</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Adresse ligne 1 *</label>
                    <input
                      type="text"
                      required
                      value={form.address_line1}
                      onChange={e => updateField('address_line1', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      placeholder="Rue, numéro"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Adresse ligne 2</label>
                    <input
                      type="text"
                      value={form.address_line2}
                      onChange={e => updateField('address_line2', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      placeholder="Appartement, suite, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Ville *</label>
                    <input
                      type="text"
                      required
                      value={form.city}
                      onChange={e => updateField('city', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      placeholder="Antananarivo"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Province / État</label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={e => updateField('state', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      placeholder="Analamanga"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Code postal</label>
                    <input
                      type="text"
                      value={form.postal_code}
                      onChange={e => updateField('postal_code', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      placeholder="101"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Pays *</label>
                    <select
                      value={form.country}
                      onChange={e => updateField('country', e.target.value)}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                    >
                      <option value="Madagascar">Madagascar</option>
                      <option value="France">France</option>
                      <option value="Maurice">Maurice</option>
                      <option value="Comores">Comores</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">Instructions de livraison</label>
                    <textarea
                      value={form.delivery_notes}
                      onChange={e => updateField('delivery_notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
                      placeholder="Instructions spéciales pour la livraison..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé de la commande */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 sticky top-28">
                <h2 className="text-base font-bold text-stone-900 mb-5">Récapitulatif</h2>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.product.id} className="flex items-center gap-3">
                      <img
                        src={item.product.image_url}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-stone-900 truncate">{item.product.name}</p>
                        <p className="text-xs text-stone-500">x{item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-stone-900 shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Sous-total</span>
                    <span className="font-medium text-stone-700">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Livraison</span>
                    <span className="font-medium text-stone-700">Calculé après</span>
                  </div>
                </div>

                <div className="border-t border-stone-100 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-stone-900">Total</span>
                    <span className="text-xl font-bold text-stone-900">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {error && (
                  <p className="mt-4 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Payer avec Stripe
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-stone-400">
                  <Shield className="w-3 h-3" />
                  Paiement sécurisé
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}