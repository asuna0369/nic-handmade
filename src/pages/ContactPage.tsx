import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-24 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-stone-600 max-w-xl mx-auto">
            Une question, une demande ou une collaboration ? 
            Notre équipe est à votre écoute.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">

          {/* FORMULAIRE */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-stone-200">

            <h2 className="text-xl font-semibold mb-6 text-stone-800">
              Envoyer un message
            </h2>

            <form className="space-y-5">

              <div>
                <label className="block text-sm mb-1 text-stone-600">
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-stone-600">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-stone-600">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Votre message..."
                  className="w-full border border-stone-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-700"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-amber-800 text-white py-3 rounded-lg hover:bg-amber-900 transition-colors font-medium"
              >
                Envoyer le message
              </button>

            </form>
          </div>

          {/* INFOS CONTACT */}
          <div className="flex flex-col justify-center gap-8">

            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Mail className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-800">Email</h3>
                <p className="text-stone-600 text-sm">
                  contact@gaombavy.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Phone className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-800">Téléphone</h3>
                <p className="text-stone-600 text-sm">
                  +33 6 00 00 00 00
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <MapPin className="w-5 h-5 text-amber-800" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-800">Localisation</h3>
                <p className="text-stone-600 text-sm">
                  Disponible en ligne
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 mt-4">
              <p className="text-stone-600 text-sm leading-relaxed">
                Nous répondons généralement sous 24h.  
                N’hésitez pas à nous contacter pour toute demande ou information.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}