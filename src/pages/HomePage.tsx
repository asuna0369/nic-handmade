import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { categories, formatPrice } from '../lib/products'; // on garde les catégories et le formateur
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';
import { Leaf, Heart, Globe, Star } from 'lucide-react';
import Hero from '../components/Hero';
import type { Product } from '../types';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { addItem } = useCart();
  const { navigate, setSelectedProductId } = usePage();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les produits depuis Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter(p => p.category === activeCategory);

  const featuredProducts = products.filter(p => p.featured);

  // Si les données chargent encore, afficher un loader simple
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Hero />

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, title: '100% Naturel', desc: 'Fibres de raphia et vannerie issues de la nature' },
              { icon: Heart, title: 'Fait Main', desc: 'Chaque sac est unique, tressé avec soin' },
              { icon: Globe, title: 'Artisanat d\'Exception', desc: 'Des techniques maîtrisées pour des créations uniques' },
              { icon: Star, title: 'Qualité Premium', desc: 'Finitions soignées et matériaux durables' },
            ].map(feature => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-stone-50/80 border border-stone-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="text-sm font-bold text-stone-900 mb-1.5">{feature.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">Nos Best-Sellers</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">Pièces Vedettes</h2>
            <p className="mt-4 text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
              Nos sacs les plus appréciés, sélectionnés pour leur beauté et leur qualité exceptionnelle
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuredProducts.slice(0, 3).map(product => (
              <div
                key={product.id}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-1">{product.category}</p>
                    <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
                    <p className="text-xl font-bold text-amber-400">{formatPrice(product.price)}</p>
                  </div>
                </div>
                <div className="p-4 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedProductId(product.id);
                      navigate('product');
                    }}
                    className="flex-1 py-2.5 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 rounded-xl transition-colors"
                  >
                    Voir détails
                  </button>
                  <button
                    onClick={() => addItem(product)}
                    className="flex-1 py-2.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      <section className="py-20 bg-white" id="collection">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">Notre Collection</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">Tous nos Sacs</h2>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-amber-700 text-white shadow-md shadow-amber-900/20'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-stone-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-amber-600 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-amber-600 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Prêt à adopter une pièce d’exception ?
          </h2>
          <p className="mt-4 text-base text-stone-400 max-w-lg mx-auto leading-relaxed">
            Chaque achat soutient directement les artisans locaux et préserve un savoir-faire ancestral
          </p>
          <button
            onClick={() => navigate('home')}
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/30"
          >
            Commander maintenant
          </button>
        </div>
      </section>
    </div>
  );
}