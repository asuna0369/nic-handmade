import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { categories, formatPrice } from '../lib/products';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';
import { Leaf, Heart, Globe, Star } from 'lucide-react';
import Hero from '../components/Hero';
import type { Product } from '../types';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      <section className="py-24 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* En-tête de section */}
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-700 mb-4">
              Pourquoi nous choisir
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              L'excellence artisanale
            </h2>
            <div className="w-16 h-[2px] bg-amber-700 mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[
              { 
                icon: Leaf, 
                title: 'Matériaux Nobles', 
                desc: 'Matériaux soigneusement sélectionnés pour leur qualité et leur beauté.',
                color: 'from-emerald-500 to-green-600'
              },
              { 
                icon: Heart, 
                title: 'Fait Main', 
                desc: 'Chaque sac est unique, tressé avec soin par des artisans passionnés.',
                color: 'from-rose-500 to-red-600'
              },
              { 
                icon: Globe, 
                title: 'Artisanat d\'Exception', 
                desc: 'Des techniques ancestrales maîtrisées pour des créations authentiques.',
                color: 'from-amber-500 to-orange-600'
              },
              { 
                icon: Star, 
                title: 'Qualité Premium', 
                desc: 'Finitions soignées et matériaux durables pour des sacs qui traversent le temps.',
                color: 'from-violet-500 to-purple-600'
              },
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-stone-100 hover:border-transparent transition-all duration-500 overflow-hidden"
              >
                {/* Fond avec dégradé au survol */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
                
                {/* Numéro de la carte */}
                <div className="absolute -top-6 -right-6 text-8xl font-bold text-stone-50 group-hover:text-stone-100 transition-colors duration-500 select-none">
                  {String(index + 1).padStart(2, '0')}
                </div>

                {/* Icône */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Titre */}
                <h3 className="relative text-lg font-bold text-stone-900 mb-3 group-hover:text-amber-800 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="relative text-sm text-stone-500 leading-relaxed group-hover:text-stone-600 transition-colors duration-300">
                  {feature.desc}
                </p>

                {/* Ligne décorative */}
                <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
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

    {/* Barre de recherche */}
    <div className="relative z-10 max-w-2xl mx-auto mb-10">
      <div className="relative group">
        {/* Fond décoratif au focus */}
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition duration-500" />
        
        <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-stone-200/50 border border-stone-100 group-focus-within:shadow-xl group-focus-within:shadow-amber-100/50 transition-all duration-500 overflow-hidden">
          
          {/* Icône de recherche */}
          <div className="pl-5 pr-3">
            <svg 
              className="w-5 h-5 text-stone-400 group-focus-within:text-amber-600 transition-colors duration-300" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>

          {/* Champ de recherche */}
          <input
            type="text"
            placeholder="Rechercher un sac par nom, catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-4 pr-5 text-sm bg-transparent text-stone-700 placeholder-stone-400 focus:outline-none"
          />

          {/* Bouton effacer */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mr-3 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}

          {/* Bouton rechercher */}
          <button 
            onClick={() => {}}
            className="hidden sm:flex items-center gap-2 mr-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium rounded-xl transition-all duration-300 hover:shadow-md hover:shadow-amber-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <span>Rechercher</span>
          </button>
        </div>

        {/* Suggestions de recherche */}
        {searchTerm && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-400">Suggestions :</span>
            {['Coton', 'Crochet', 'Pochette'].map(tag => (
              <button
                key={tag}
                onClick={() => setSearchTerm(tag)}
                className="px-3 py-1 text-xs bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-700 rounded-full transition-all duration-200 border border-stone-200 hover:border-amber-200"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
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
            Prêt à adopter une pièce d'exception ?
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