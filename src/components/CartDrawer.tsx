import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';
import { formatPrice } from '../lib/products';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const { navigate } = usePage();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col" style={{ animation: 'slideIn 0.3s ease-out' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
            <h2 className="text-lg font-bold text-stone-900">Panier</h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 rounded-full">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center mb-5">
              <ShoppingBag className="w-8 h-8 text-stone-300" />
            </div>
            <p className="text-base font-semibold text-stone-900 mb-2">Votre panier est vide</p>
            <p className="text-sm text-stone-500 text-center mb-6">
              Découvrez nos sacs artisanaux et ajoutez vos favoris
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('home');
              }}
              className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white text-sm font-semibold rounded-full transition-colors"
            >
              Voir la collection
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {items.map(item => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 rounded-xl bg-stone-50/80 border border-stone-100"
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-stone-900 truncate">
                        {item.product.name}
                      </h3>
                      <p className="text-sm font-bold text-amber-700 mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-amber-300 transition-colors"
                        >
                          <Minus className="w-3 h-3 text-stone-600" />
                        </button>
                        <span className="text-sm font-semibold text-stone-900 w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white border border-stone-200 flex items-center justify-center hover:border-amber-300 transition-colors"
                        >
                          <Plus className="w-3 h-3 text-stone-600" />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto text-xs text-stone-400 hover:text-red-500 transition-colors"
                        >
                          Retirer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-stone-100 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-500">Sous-total</span>
                <span className="text-lg font-bold text-stone-900">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-xs text-stone-400">Livraison calculée à l'étape suivante</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('checkout');
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20"
              >
                Commander
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
