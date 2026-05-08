import { ArrowRight, Leaf } from 'lucide-react';
import { usePage } from '../context/PageContext';


export default function Hero() {
  const { navigate } = usePage();

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
    backgroundImage: "url('/images/collections/WhatsApp_Image_2026-04-07_at_09.42.21_(2).jpeg')",
  }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/60 to-stone-900/40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800/20 border border-amber-700/30 mb-8 backdrop-blur-sm">
            <Leaf className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-amber-300 tracking-wider uppercase">
              Artisanat  Authentique
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            L'Art du
            <br />
            <span className="text-amber-500">Fait Main</span>
            <br />
            
          </h1>

          <p className="mt-6 text-base sm:text-lg text-stone-300 leading-relaxed max-w-lg">
            Découvrez notre collection de sacs artisanaux en raphia et en vannerie, tressés à la main avec soin et passion. Chaque pièce raconte une histoire unique, empreinte de savoir-faire et d’authenticité.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/30 hover:-translate-y-0.5"
            >
              Découvrir la collection
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300"
            >
              Notre artisanat
            </button>
          </div>

          <div className="mt-16 flex items-center gap-8">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">500+</p>
              <p className="text-xs text-stone-400 mt-1">Artisans partenaires</p>
            </div>
            <div className="w-px h-12 bg-stone-700" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">100%</p>
              <p className="text-xs text-stone-400 mt-1">Fait main</p>
            </div>
            <div className="w-px h-12 bg-stone-700" />
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-white">Artisanat</p>
              <p className="text-xs text-stone-400 mt-1"> authentique</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
