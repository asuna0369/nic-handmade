import { Mail, Phone, MapPin } from 'lucide-react';
import { usePage } from '../context/PageContext';

export default function Footer() {
  const { navigate } = usePage();

  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <button onClick={() => navigate('home')} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-amber-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">NH</span>
              </div>
              <span className="text-xl font-bold text-white">
                Nic<span className="text-amber-500">-Handmade</span>
              </span>
            </button>
            <p className="text-sm leading-relaxed text-stone-400">
              Chaque sac est une création artisanale unique, née d’un savoir-faire minutieux et d’une passion pour les belles matières.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2.5">
              {['Accueil', 'Collection', 'Artisanat', 'Contact'].map(item => (
                <li key={item}>
                  <button onClick={() => navigate('home')} className="text-sm text-stone-400 hover:text-amber-500 transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Catégories</h3>
            <ul className="space-y-2.5">
              {['Raphia', 'Vannerie', 'Pochettes', 'Sacs shopping'].map(item => (
                <li key={item}>
                  <button onClick={() => navigate('home')} className="text-sm text-stone-400 hover:text-amber-500 transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
                <span className="text-sm text-stone-400">Suisse</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm text-stone-400">+261 34 00 000 00</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-sm text-stone-400">contact@gaombavy.mg</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">&copy; {new Date().getFullYear()} Gaombavy. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <button className="text-xs text-stone-500 hover:text-stone-300 transition-colors">Conditions générales</button>
            <button className="text-xs text-stone-500 hover:text-stone-300 transition-colors">Politique de confidentialité</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
