import { ArrowLeft, ShoppingBag, Minus, Plus, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/products';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

export default function ProductPage() {
  const { selectedProductId, navigate } = usePage();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!selectedProductId) {
        navigate('home');
        return;
      }
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', selectedProductId)
        .single();

      if (error || !data) {
        navigate('home');
        return;
      }
      setProduct(data);

      // Charger les images supplémentaires
      const { data: imagesData } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', data.id)
        .order('display_order', { ascending: true });

      if (imagesData && imagesData.length > 0) {
        setProductImages([data.image_url, ...imagesData.map(img => img.image_url)]);
      } else {
        setProductImages([data.image_url]);
      }

      // Produits similaires (même catégorie)
      const { data: related } = await supabase
        .from('products')
        .select('*')
        .eq('category', data.category)
        .neq('id', data.id)
        .limit(4);
      if (related) setRelatedProducts(related);

      setLoading(false);
    };
    loadProduct();
  }, [selectedProductId, navigate]);

  // Défilement automatique
  useEffect(() => {
    if (productImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % productImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [productImages.length]);

  const nextImage = () => {
    setCurrentImage(prev => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImage(prev => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-stone-500">Produit non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          
          {/* ========== CARROUSEL IMAGES ========== */}
          <div className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-stone-100 shadow-lg">
              <img
                src={productImages[currentImage] || product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-500"
              />

              {product.featured && (
                <div className="absolute top-4 left-4 px-4 py-1.5 bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                  Vedette
                </div>
              )}

              {/* Compteur d'images */}
              {productImages.length > 1 && (
                <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                  {currentImage + 1} / {productImages.length}
                </div>
              )}

              {/* Flèches de navigation */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <ChevronLeft className="w-5 h-5 text-stone-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <ChevronRight className="w-5 h-5 text-stone-700" />
                  </button>
                </>
              )}
            </div>

            {/* Miniatures */}
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-4 justify-center">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      index === currentImage
                        ? 'border-amber-600 shadow-md scale-105'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-stone-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ========== INFOS PRODUIT ========== */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-3">
              {product.category}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl sm:text-3xl font-bold text-stone-900">
              {formatPrice(product.price)}
            </p>

            <div className="mt-6 border-t border-stone-100 pt-6">
              <p className="text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-stone-700">Quantité</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center hover:border-amber-300 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full border border-stone-200 flex items-center justify-center hover:border-amber-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-stone-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`w-full flex items-center justify-center gap-2 py-4 font-semibold rounded-full transition-all duration-300 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-700 hover:bg-amber-800 text-white hover:shadow-lg hover:shadow-amber-900/20'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Ajouté au panier !
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Ajouter au panier
                  </>
                )}
              </button>
            </div>

            {/* Détails du produit */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { label: 'Matière', value: product.matiere || 'Raphia naturel' },
                { label: 'Origine', value: product.origine || 'Madagascar' },
                { label: 'Fabrication', value: '100% fait main' },
                { label: 'Disponibilité', value: product.disponibilite || (product.in_stock ? 'En stock' : 'Rupture') },
              ].map(detail => (
                <div key={detail.label} className="p-3 rounded-xl bg-stone-50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    {detail.label}
                  </p>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">
                    {detail.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Produits similaires */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-stone-900 mb-8">Vous aimerez aussi</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}