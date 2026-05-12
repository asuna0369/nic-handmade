import { Mail, Phone, MapPin, ArrowUp, Instagram, Facebook, ExternalLink } from 'lucide-react';
import { usePage } from '../context/PageContext';

export default function Footer() {
  const { navigate } = usePage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCollection = () => {
    navigate('home');
    setTimeout(() => {
      const el = document.getElementById('collection');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <footer className="bg-stone-900 text-stone-300 relative">
      {/* Bouton retour en haut */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center shadow-lg hover:shadow-amber-900/30 transition-all duration-300 hover:-translate-y-1"
          aria-label="Retour en haut"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        
        {/* Grille principale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Colonne 1 : Marque */}
          <div className="sm:col-span-2 lg:col-span-1">
            <button 
              onClick={() => navigate('home')} 
              className="flex items-center gap-2 mb-5 group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center group-hover:bg-amber-600 transition-colors">
                <span className="text-white font-bold text-sm">NH</span>
              </div>
              <span className="text-xl font-bold text-white">
                Nic<span className="text-amber-500">-Handmade</span>
              </span>
            </button>
            
            <p className="text-sm leading-relaxed text-stone-400 mb-6">
              Chaque sac est une création artisanale unique, née d'un savoir-faire 
              minutieux et d'une passion pour les belles matières de Madagascar.
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-stone-400 hover:text-white transition-colors" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-stone-400 hover:text-white transition-colors" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-700 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                aria-label="Pinterest"
              >
                <ExternalLink className="w-4 h-4 text-stone-400 hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', page: 'home' },
                { label: 'Collection', action: handleCollection },
                { label: 'Artisanat', page: 'artisanat' },
                { label: 'Contact', page: 'contact' },
              ].map(item => (
                <li key={item.label}>
                  <button 
                    onClick={() => {
                      if ('action' in item && item.action) {
                        item.action();
                      } else if ('page' in item && item.page) {
                        navigate(item.page as any);
                        scrollToTop();
                      }
                    }}
                    className="text-sm text-stone-400 hover:text-amber-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-amber-500 group-hover:w-3 transition-all duration-300" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 3 : Catégories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              Catégories
            </h3>
            <ul className="space-y-3">
              {['Coton', 'Crochet', 'Pochette'].map(cat => (
                <li key={cat}>
                  <button 
                    onClick={handleCollection}
                    className="text-sm text-stone-400 hover:text-amber-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-[1px] bg-amber-500 group-hover:w-3 transition-all duration-300" />
                    Sacs en {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:contact@gaombavy.com"
                  className="flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-amber-700 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-amber-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm text-stone-400 group-hover:text-amber-500 transition-colors">
                    contact@gaombavy.com
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+261340000000"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-amber-700 transition-colors">
                    <Phone className="w-3.5 h-3.5 text-amber-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm text-stone-400 group-hover:text-amber-500 transition-colors">
                    +261 34 00 000 00
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center shrink-0 group-hover:bg-amber-700 transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm text-stone-400">
                    Madagascar
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-stone-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500">
            &copy; {new Date().getFullYear()} Nic-Handmade. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('contact')}
              className="text-xs text-stone-500 hover:text-amber-500 transition-colors"
            >
              Mentions légales
            </button>
            <button 
              onClick={() => navigate('contact')}
              className="text-xs text-stone-500 hover:text-amber-500 transition-colors"
            >
              CGV
            </button>
            <button 
              onClick={() => navigate('contact')}
              className="text-xs text-stone-500 hover:text-amber-500 transition-colors"
            >
              Politique de confidentialité
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}