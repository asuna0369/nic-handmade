import { useState, useEffect } from 'react';
import { usePage } from '../context/PageContext';
import { supabase } from '../lib/supabase';
import FadeInSection from '../components/FadeInSection';
import { Sparkles, Play, Camera, ArrowRight, ChevronDown } from 'lucide-react';

interface Media {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  section: string;
  display_order: number;
}

export default function ArtisanatPage() {
  const { navigate } = usePage();
  const [images, setImages] = useState<Media[]>([]);
  const [videos, setVideos] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<Media | null>(null);

  useEffect(() => {
    const fetchMedia = async () => {
      const { data, error } = await supabase
        .from('artisanat_media')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && data) {
        setImages(data.filter(m => m.type === 'image' && m.section === 'gallery'));
        setVideos(data.filter(m => m.type === 'video' && m.section === 'videos'));
      }
      setLoading(false);
    };
    fetchMedia();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-10 h-10 border-4 border-amber-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white text-stone-900">
      
      {/* ========== HERO PREMIUM ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-stone-50">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_70%)]" />
        </div>

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative max-w-7xl mx-auto px-6 py-32 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 backdrop-blur-sm border border-amber-200 shadow-lg shadow-amber-100/20 mb-10">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs uppercase tracking-[0.4em] text-amber-800 font-bold">
                Artisanat
              </span>
            </div>
          </FadeInSection>

          <FadeInSection>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-none mb-8">
              L'art du{' '}
              <span className="text-amber-700">fait main</span>
            </h1>
          </FadeInSection>

          <FadeInSection>
            <p className="text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed mb-12">
              Des créations façonnées avec exigence, où chaque détail traduit un équilibre 
              entre matière, précision et élégance intemporelle.
            </p>
          </FadeInSection>

          <FadeInSection>
            <div className="flex items-center justify-center gap-3">
              <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-amber-300" />
              <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-200" />
              <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-amber-300" />
            </div>
          </FadeInSection>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </section>

      {/* ========== SECTION NOTRE HISTOIRE ========== */}
      <FadeInSection>
        <section className="relative py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-white to-white" />
          
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              <div className="relative">
                <div className="relative group">
                  <div className="absolute -inset-4 border-2 border-amber-200/50 rounded-3xl -rotate-3 group-hover:rotate-0 transition-transform duration-700" />
                  <div className="absolute -inset-4 border-2 border-amber-200/50 rounded-3xl rotate-6 group-hover:rotate-0 transition-transform duration-700" />
                  
                  <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/5]">
                    <img
                      src={images.length > 0 ? images[0].url : '/images/placeholder.jpg'}
                      alt="Artisanat"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent" />
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">500+</p>
                    <p className="text-xs text-stone-500">Artisans</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="inline-block px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-xs uppercase tracking-[0.3em] text-amber-800 mb-8 font-bold">
                  Notre Savoir-faire
                </span>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-8">
                  Une création{' '}
                  <span className="text-amber-700">minutieuse</span>
                </h2>

                <div className="space-y-4 text-stone-600 leading-relaxed text-lg">
                  <p>
                    Chaque pièce prend vie à travers un processus lent et maîtrisé, 
                    où le geste se répète avec précision jusqu'à atteindre l'équilibre parfait.
                  </p>
                  <p>
                    La matière est travaillée avec attention, transformée progressivement 
                    pour révéler toute sa richesse et donner naissance à une création unique.
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-4">
                  <div className="w-12 h-[1px] bg-amber-400" />
                  <span className="text-sm text-amber-800 uppercase tracking-widest font-bold">
                    Nic Handmade
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ========== GALERIE CRÉATIONS ========== */}
      <FadeInSection>
        <section className="py-24 lg:py-32 bg-stone-50">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-xs uppercase tracking-[0.3em] text-amber-800 mb-6 font-bold">
                <Camera className="w-3 h-3" />
                Collection
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Nos créations</h2>
              <p className="text-stone-500 max-w-xl mx-auto">
                Découvrez nos plus belles pièces, fruit d'un travail artisanal exceptionnel
              </p>
              <div className="w-20 h-[1px] bg-amber-300 mx-auto mt-6" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`group relative cursor-pointer ${
                    index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-stone-200 shadow-sm group-hover:shadow-xl transition-all duration-500 h-full">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ minHeight: index === 0 ? '400px' : '200px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-white font-bold text-lg">{img.title}</p>
                        <p className="text-amber-300 text-sm">Voir l'image</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <Camera className="w-5 h-5 text-stone-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div className="text-center py-20">
                <Camera className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-400 text-lg">Aucune image pour le moment</p>
              </div>
            )}
          </div>
        </section>
      </FadeInSection>

      {/* ========== MODAL IMAGE ========== */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <img 
            src={selectedImage.url} 
            alt={selectedImage.title} 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 text-lg font-medium bg-black/50 px-6 py-3 rounded-full backdrop-blur-sm">
            {selectedImage.title}
          </p>
        </div>
      )}

      {/* ========== SECTION VIDÉOS ========== */}
      {videos.length > 0 && (
        <FadeInSection>
          <section className="py-24 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="text-center mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-xs uppercase tracking-[0.3em] text-amber-800 mb-6 font-bold">
                  <Play className="w-3 h-3" />
                  Immersion
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Le processus en vidéo</h2>
                <p className="text-stone-500 max-w-xl mx-auto">
                  Plongez au cœur de la création et découvrez le geste artisanal
                </p>
                <div className="w-20 h-[1px] bg-amber-300 mx-auto mt-6" />
              </div>

              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {videos.map((video) => (
                  <div key={video.id} className="group">
                    <div className="relative overflow-hidden rounded-3xl bg-black shadow-xl">
                      <div className="relative aspect-video">
                        <video 
                          controls 
                          className="w-full h-full object-cover"
                          poster={images.length > 0 ? images[0].url : undefined}
                        >
                          <source src={video.url} type="video/mp4" />
                        </video>
                      </div>
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-amber-400/30 rounded-3xl transition-all duration-500 pointer-events-none" />
                    </div>
                    <div className="mt-6">
                      <h3 className="text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="w-8 h-[1px] bg-amber-400" />
                        <span className="text-xs text-amber-700 uppercase tracking-widest font-bold">
                          Vidéo artisanale
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>
      )}

      {/* ========== PROCESSUS ========== */}
      <FadeInSection>
        <section className="py-24 lg:py-32 bg-gradient-to-b from-stone-50 to-white">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="text-center mb-20">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-xs uppercase tracking-[0.3em] text-amber-800 mb-6 font-bold">
                <Sparkles className="w-3 h-3" />
                Savoir-faire
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Un processus maîtrisé</h2>
              <p className="text-stone-500 max-w-2xl mx-auto text-lg">
                Chaque création suit un processus précis, où chaque étape contribue 
                à révéler la qualité et l'authenticité du produit final.
              </p>
              <div className="w-20 h-[1px] bg-amber-300 mx-auto mt-6" />
            </div>

            <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
              {[
                { step: '01', title: 'Sélection', desc: 'Choix rigoureux des matières premières pour garantir qualité et durabilité exceptionnelles.' },
                { step: '02', title: 'Préparation', desc: 'Traitement minutieux et mise en forme des fibres avec précision artisanale.' },
                { step: '03', title: 'Tressage', desc: 'Travail manuel d\'exception, réalisé avec patience, passion et expertise.' },
                { step: '04', title: 'Finition', desc: 'Contrôle qualité détaillé et ajustements pour un rendu absolument parfait.' },
              ].map((item, idx) => (
                <div key={item.step} className="group relative text-center">
                  {idx < 3 && (
                    <div className="hidden md:block absolute top-16 left-[60%] w-full h-[1px]">
                      <div className="w-full h-full bg-gradient-to-r from-amber-200 to-transparent" />
                    </div>
                  )}
                  
                  <div className="relative mx-auto w-32 h-32 rounded-full bg-white shadow-lg shadow-amber-100/50 border border-amber-100 flex items-center justify-center mb-8 group-hover:shadow-xl group-hover:border-amber-300 transition-all duration-500 group-hover:scale-105">
                    <span className="text-4xl font-light text-amber-300 group-hover:text-amber-500 transition-colors duration-500">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 group-hover:text-amber-800 transition-colors">{item.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ========== CTA FINAL ========== */}
      <FadeInSection>
        <section className="relative py-24 lg:py-32 overflow-hidden bg-stone-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-600 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-800 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Découvrez nos créations
            </h2>
            <p className="text-stone-300 text-lg max-w-xl mx-auto mb-10">
              Des pièces uniques façonnées avec passion par nos artisans
            </p>
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-amber-900/30 hover:-translate-y-1 group"
            >
              Voir la collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}