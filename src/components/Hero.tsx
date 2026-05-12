import { ArrowRight, Leaf, Star, Users, Shield } from 'lucide-react';
import { usePage } from '../context/PageContext';

export default function Hero() {
  const { navigate } = usePage();

  return (
    <section className="relative min-h-[100vh] flex items-center overflow-hidden bg-stone-950">
      {/* Fond avec image en overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/collections/WhatsApp_Image_2026-04-07_at_09.42.21_(2).jpeg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-900/70 to-stone-900/40" />
      </div>

      {/* Contenu principal */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne de gauche : Texte */}
          <div className="max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800/20 border border-amber-700/30 mb-8 backdrop-blur-sm">
              <Leaf className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-medium text-amber-300 tracking-wider uppercase">
                Artisanat d'Exception 
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              L'Art du
              <br />
              <span className="text-amber-500">Fait Main</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-stone-300 leading-relaxed max-w-lg">
              Découvrez notre collection de sacs artisanaux en raphia et en vannerie, 
              tressés à la main avec soin et passion. Chaque pièce raconte une histoire 
              unique, empreinte de savoir-faire et d'authenticité.
            </p>

            {/* Boutons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById('collection');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('home');
                  }
                }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/30 hover:-translate-y-0.5"
              >
                Découvrir la collection
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('artisanat')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 backdrop-blur-sm transition-all duration-300"
              >
                Notre savoir-faire
              </button>
            </div>

            {/* Statistiques */}
            <div className="mt-16 flex items-center gap-8">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">100%</p>
                <p className="text-xs text-stone-400 mt-1">Fait main</p>
              </div>
              <div className="w-px h-12 bg-stone-700" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">+500</p>
                <p className="text-xs text-stone-400 mt-1">Artisans partenaires</p>
              </div>
              <div className="w-px h-12 bg-stone-700" />
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white">Unique</p>
                <p className="text-xs text-stone-400 mt-1">Pièces originales</p>
              </div>
            </div>
          </div>

          {/* Colonne de droite : Carte de mise en avant */}
          <div className="hidden lg:flex justify-center">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-sm shadow-2xl">
              {/* Étoiles */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                Artisan passionné ?
              </h3>
              <p className="text-stone-300 text-sm leading-relaxed mb-6">
                Rejoignez notre communauté d'artisans et exposez vos créations 
                en ligne. Bénéficiez d'un accompagnement personnalisé et 
                développez votre activité.
              </p>

              <button
                onClick={() => navigate('artisanat')}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/30"
              >
                Rejoindre l'aventure
              </button>

              {/* Avantages */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-stone-300">Paiement 100% sécurisé</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-stone-300">Communauté de +500 artisans</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span className="text-sm text-stone-300">Produits notés 4.9/5</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}