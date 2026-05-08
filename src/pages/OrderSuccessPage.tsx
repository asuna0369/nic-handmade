import { CheckCircle, ArrowRight } from 'lucide-react';
import { usePage } from '../context/PageContext';

export default function OrderSuccessPage() {
  const { navigate } = usePage();
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center pt-20">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">Paiement réussi !</h1>
        <p className="mt-4 text-sm text-stone-500">
          Merci pour votre commande. Vous recevrez un email de confirmation sous peu.
        </p>
        <button
          onClick={() => navigate('home')}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full transition-all duration-300"
        >
          Retour à la boutique
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}