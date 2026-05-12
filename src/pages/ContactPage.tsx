import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('contact_messages')
        .insert([{ name, email, message }]);

      if (insertError) throw insertError;

      setIsSent(true);
      setName('');
      setEmail('');
      setMessage('');
      
      setTimeout(() => setIsSent(false), 5000);
    } catch (err: any) {
      setError('Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-24">
      
      {/* ========== HERO ========== */}
      <section className="relative py-20 overflow-hidden bg-stone-50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-xs uppercase tracking-[0.3em] text-amber-800 mb-8 font-bold">
            <Mail className="w-3 h-3" />
            Contact
          </span>
          
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 tracking-tight mb-6">
            Contactez-<span className="text-amber-700">nous</span>
          </h1>
          
          <p className="text-stone-500 max-w-xl mx-auto text-lg leading-relaxed">
            Une question, une demande ou une collaboration ? 
            Notre équipe est à votre écoute.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="w-12 h-[1px] bg-amber-300" />
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <div className="w-12 h-[1px] bg-amber-300" />
          </div>
        </div>
      </section>

      {/* ========== CONTENU PRINCIPAL ========== */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12">
            
            {/* ===== FORMULAIRE (3 colonnes) ===== */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100">
                
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Send className="w-5 h-5 text-amber-700" />
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">Envoyer un message</h2>
                </div>

                {isSent ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-stone-900 mb-2">Message envoyé !</h3>
                    <p className="text-stone-500">Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        Nom <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Votre nom"
                        className="w-full px-5 py-3.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        Email <span className="text-amber-600">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Votre email"
                        className="w-full px-5 py-3.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">
                        Message <span className="text-amber-600">*</span>
                      </label>
                      <textarea
                        required
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={6}
                        placeholder="Votre message..."
                        className="w-full px-5 py-3.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all resize-none"
                      />
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-amber-700 hover:bg-amber-800 disabled:bg-stone-300 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-900/20 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Envoyer le message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* ===== INFOS (2 colonnes) ===== */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Carte principale */}
              <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 text-white shadow-xl">
                <h3 className="text-lg font-bold mb-6">Nos coordonnées</h3>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-700/30 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Email</p>
                      <p className="text-sm text-stone-300">contact@gaombavy.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-700/30 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Téléphone</p>
                      <p className="text-sm text-stone-300">+261 34 00 000 00</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-700/30 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Localisation</p>
                      <p className="text-sm text-stone-300">Madagascar</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte secondaire */}
              <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-amber-700" />
                  <h3 className="font-bold text-stone-900">Délai de réponse</h3>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Nous répondons généralement sous <strong className="text-amber-800">24h</strong>. 
                  N'hésitez pas à nous contacter pour toute demande ou information complémentaire.
                </p>
              </div>

              {/* Carte réseaux sociaux */}
              <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center">
                <h3 className="font-bold text-stone-900 mb-2">Suivez-nous</h3>
                <p className="text-sm text-stone-500">Sur les réseaux sociaux</p>
                <div className="flex items-center justify-center gap-4 mt-4">
                  {['Instagram', 'Facebook', 'Tik Tok'].map(social => (
                    <button
                      key={social}
                      className="px-4 py-2 text-xs font-medium bg-stone-50 hover:bg-amber-50 border border-stone-200 hover:border-amber-200 text-stone-600 hover:text-amber-700 rounded-full transition-all duration-200"
                    >
                      {social}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}