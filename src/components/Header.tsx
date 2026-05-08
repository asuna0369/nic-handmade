import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { navigate } = usePage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleScrollToCollection = () => {
    const el = document.getElementById('collection');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Accueil', action: () => navigate('home') },
    { label: 'Collection', action: handleScrollToCollection },
    { label: 'Artisanat', action: () => navigate('artisanat') }

    // { label: 'Contact', action: () => navigate('contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* LOGO */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-800 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-bold text-sm sm:text-base">NH</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Nic<span className="text-amber-800">-Handmade</span>
            </span>
          </button>

          {/* MENU DESKTOP */}
          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="relative text-sm font-medium text-stone-600 transition-all duration-300 group"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-amber-800 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </nav>

          {/* ACTIONS */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                navigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-stone-400 hover:text-amber-700 transition-colors"
            >
              Admin
            </button>

            {/* CTA */}
            <button
              onClick={() => navigate('contact')}
              className="hidden md:block bg-amber-800 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-amber-900 transition-all"
            >
              Nous contacter
            </button>

            {/* PANIER */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5 text-stone-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* MENU MOBILE BTN */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-stone-100 transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-stone-700" />
              ) : (
                <Menu className="w-5 h-5 text-stone-700" />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200/60 bg-white/95 backdrop-blur-xl">
          <nav className="flex flex-col px-4 py-4 gap-2">

            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  item.action();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-4 py-3 text-sm font-medium text-stone-700 hover:text-amber-800 hover:bg-stone-50 rounded-lg transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('admin');
                setMobileMenuOpen(false);
              }}
              className="text-xs text-stone-400 hover:text-amber-700 transition-colors"
            >
              Admin
            </button>

            {/* CTA MOBILE */}
            <button
              onClick={() => {
                navigate('contact');
                setMobileMenuOpen(false);
              }}
              className="mt-2 bg-amber-800 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-amber-900 transition-all"
            >
              Nous contacter
            </button>

          </nav>
        </div>
      )}
    </header>
  );
}