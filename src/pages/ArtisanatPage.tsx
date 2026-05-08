import { usePage } from "../context/PageContext";
import FadeInSection from "../components/FadeInSection";

export default function ArtisanatPage() {
  const { navigate } = usePage();

  const videos = [
    {
      title: "Travail du raphia",
      src: "/images/collections/WhatsApp%20Video%202026-04-07%20at%2009.42.19.mp4",
    },
    {
      title: "Tressage manuel",
      src: "/images/collections/WhatsApp%20Video%202026-04-23%20at%2015.53.14.mp4",
    },
  ];

  const images = [
    "/images/collections/WhatsApp Image 2026-04-07 at 09.42.27.jpeg",
    "/images/collections/WhatsApp%20Image%202026-04-07%20at%2009.42.22%20(1).jpeg",
    "/images/collections/WhatsApp%20Image%202026-04-07%20at%2009.42.27%20(1).jpeg",
    "/images/collections/WhatsApp Image 2026-04-07 at 09.42.27 (2).jpeg",
    "/images/collections/WhatsApp Image 2026-04-07 at 09.42.24 (1).jpeg",
    "/images/collections/WhatsApp%20Image%202026-04-07%20at%2009.42.29%20(1).jpeg",
  ];

  return (
    <div className="bg-stone-50 text-stone-900 pt-24">

      {/* HERO PREMIUM */}
      <section className="text-center px-6 py-28 max-w-4xl mx-auto">

        <p className="text-xs uppercase tracking-[0.4em] text-amber-800 mb-6">
          Artisanat
        </p>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight mb-6">
          L’art du fait main
        </h1>

        <p className="text-stone-600 max-w-xl mx-auto leading-relaxed">
          Des créations façonnées avec exigence, où chaque détail
          traduit un équilibre entre matière, précision et élégance.
        </p>

        <div className="w-16 h-[2px] bg-amber-800 mx-auto mt-8"></div>

      </section>

      {/* STORY PREMIUM */}
      <FadeInSection>
        <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16 items-center">

          <div className="relative group overflow-hidden rounded-2xl shadow-md h-[350px]">
            <img
              src={images[0]}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition"></div>
          </div>

          <div className="max-w-md">

            <p className="text-xs uppercase tracking-[0.3em] text-amber-800 mb-4">
              Savoir-faire
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold leading-tight mb-6">
              Une création minutieuse
            </h2>

            <p className="text-stone-600 leading-relaxed mb-4">
              Chaque pièce prend vie à travers un processus lent et maîtrisé,
              où le geste se répète avec précision jusqu’à atteindre l’équilibre parfait.
            </p>

            <p className="text-stone-600 leading-relaxed mb-6">
              La matière est travaillée avec attention, transformée progressivement
              pour révéler toute sa richesse et donner naissance à une création unique.
            </p>

            <div className="w-12 h-[2px] bg-amber-800"></div>

          </div>

        </section>
      </FadeInSection>

      {/* GALERIE */}
      <FadeInSection>
        <section className="max-w-6xl mx-auto px-6 py-16">

          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-800 mb-3">
              Collection
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold">
              Nos créations
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
              >
                <div className="overflow-hidden">
                  <img
                    src={img}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>
            ))}
          </div>

        </section>
      </FadeInSection>

      {/* VIDEO CARDS */}
      <FadeInSection>
        <section className="max-w-6xl mx-auto px-6 py-16">

          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-800 mb-3">
              Immersion
            </p>

            <h2 className="text-3xl md:text-4xl font-semibold">
              Processus en vidéo
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {videos.map((video, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group"
              >
                <div className="bg-black flex items-center justify-center h-[300px]">
  <video
    controls
    className="max-h-full max-w-full object-contain  "
  >
    <source src={video.src} type="video/mp4" />
  </video>
</div>

                <div className="p-4">
                  <h3 className="font-medium text-stone-800 group-hover:text-amber-800 transition">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </section>
      </FadeInSection>

      {/* PROCESS PREMIUM */}
      <FadeInSection>
        <section className="bg-white py-28 px-6">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-20">
              <p className="text-xs uppercase tracking-[0.3em] text-amber-800 mb-4">
                Savoir-faire
              </p>

              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                Un processus maîtrisé
              </h2>

              <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
                Chaque création suit un processus précis, où chaque étape contribue
                à révéler la qualité et l’authenticité du produit final.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-12">
              {[
                {
                  title: "Sélection",
                  desc: "Choix rigoureux des matières premières pour garantir qualité et durabilité.",
                },
                {
                  title: "Préparation",
                  desc: "Traitement et mise en forme des fibres avec précision.",
                },
                {
                  title: "Tressage",
                  desc: "Travail manuel minutieux, réalisé avec patience et expertise.",
                },
                {
                  title: "Finition",
                  desc: "Contrôle des détails et ajustements pour un rendu parfait.",
                },
              ].map((step, i) => (
                <div key={i} className="group">

                  <div className="mb-6">
                    <span className="text-5xl font-light text-stone-200 group-hover:text-amber-800 transition">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-medium text-lg mb-3">
                    {step.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {step.desc}
                  </p>

                  <div className="w-10 h-[2px] bg-amber-800 mt-4 opacity-0 group-hover:opacity-100 transition"></div>

                </div>
              ))}
            </div>

          </div>
        </section>
      </FadeInSection>

      {/* CTA */}
      <FadeInSection>
        <section className="text-center py-20">
          <h2 className="text-2xl mb-6">
            Découvrez nos créations
          </h2>

          <button
            onClick={() => navigate("home")}
            className="bg-amber-800 text-white px-6 py-3 rounded-full hover:bg-amber-900 transition"
          >
            Voir la collection
          </button>
        </section>
      </FadeInSection>

    </div>
  );
}