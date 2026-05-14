import { useState, useEffect } from 'react';
import { ShoppingBag, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice } from '../lib/products';
import { useCart } from '../context/CartContext';
import { usePage } from '../context/PageContext';
import { supabase } from '../lib/supabase';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { navigate, setSelectedProductId } = usePage();
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      const { data } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', product.id)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setImages([product.image_url, ...data.map(img => img.image_url)]);
      } else {
        setImages([product.image_url]);
      }
    };
    loadImages();
  }, [product.id, product.image_url]);

  // Défilement automatique au survol
  useEffect(() => {
    if (!isHovered || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage(prev => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage(prev => (prev - 1 + images.length) % images.length);
  };

  const handleView = () => {
    setSelectedProductId(product.id);
    navigate('product');
  };

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 hover:border-stone-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImage(0);
      }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        <img
          src={images[currentImage] || product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {product.featured && (
          <div className="absolute top-3 left-3 px-3 py-1 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            Vedette
          </div>
        )}

        {/* Indicateurs de points (style Instagram) */}
        {images.length > 1 && isHovered && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(index);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImage
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Flèches de navigation */}
        {images.length > 1 && isHovered && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg z-10"
            >
              <ChevronLeft className="w-4 h-4 text-stone-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white shadow-lg z-10"
            >
              <ChevronRight className="w-4 h-4 text-stone-700" />
            </button>
          </>
        )}

        {/* Compteur d'images */}
        {images.length > 1 && isHovered && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-[10px] font-medium">
            {currentImage + 1}/{images.length}
          </div>
        )}

        {/* Actions au survol */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-10">
          <button
            onClick={handleView}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/95 backdrop-blur-sm text-stone-800 text-xs font-semibold rounded-xl hover:bg-white transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            Voir
          </button>
          <button
            onClick={() => addItem(product)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-amber-700 text-white text-xs font-semibold rounded-xl hover:bg-amber-800 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Ajouter
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-700 mb-1.5">
          {product.category}
        </p>
        <h3
          onClick={handleView}
          className="text-sm sm:text-base font-semibold text-stone-900 cursor-pointer hover:text-amber-800 transition-colors line-clamp-1"
        >
          {product.name}
        </h3>
        <p className="mt-1.5 text-xs text-stone-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-base sm:text-lg font-bold text-stone-900">
            {formatPrice(product.price)}
          </p>
          <button
            onClick={() => addItem(product)}
            className="p-2 rounded-full bg-stone-50 hover:bg-amber-50 text-stone-400 hover:text-amber-700 transition-all duration-200"
            aria-label="Ajouter au panier"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}