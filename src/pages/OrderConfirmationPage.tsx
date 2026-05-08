import { CheckCircle, ArrowRight, Package } from 'lucide-react';
import { usePage } from '../context/PageContext';

export default function OrderConfirmationPage() {
  const { navigate } = usePage();

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Commande confirmée !
        </h1>
        <p className="mt-4 text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
          Merci pour votre commande ! Vous recevrez un email de confirmation avec les détails de votre commande et les informations de suivi.
        </p>

        <div className="mt-8 bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-5 h-5 text-amber-700" />
            <h2 className="text-sm font-bold text-stone-900">Prochaines étapes</h2>
          </div>
          <ul className="space-y-3 text-left">
            {[
              'Vous recevrez un email de confirmation',
              'Nous préparerons votre commande avec soin',
              'Vous serez notifié lors de l\'expédition',
              'Livraison estimée : 3-7 jours ouvrés',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-amber-700">{i + 1}</span>
                </div>
                <span className="text-xs text-stone-600">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => navigate('home')}
          className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20"
        >
          Continuer mes achats
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
