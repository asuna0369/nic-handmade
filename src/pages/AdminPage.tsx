import { useState, useEffect } from 'react';
import { usePage } from '../context/PageContext';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { categories } from '../lib/products';
import { Trash2, Edit, Plus, LogOut, CheckCircle, X, Image, Video, Package, Mail } from 'lucide-react';

interface ArtisanatMedia {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  section: string;
  display_order: number;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function AdminPage() {
  const { navigate } = usePage();
  const [products, setProducts] = useState<Product[]>([]);
  const [mediaList, setMediaList] = useState<ArtisanatMedia[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingMedia, setEditingMedia] = useState<ArtisanatMedia | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showMediaForm, setShowMediaForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('Crochet');
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaSection, setMediaSection] = useState('gallery');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [session, setSession] = useState<any>(null);

  // Vérifier si l'utilisateur est connecté et admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        navigate('admin-login');
        return;
      }
      supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
        .then(({ data, error }) => {
          if (error || !data?.is_admin) {
            navigate('home');
          }
        });
    });
  }, [navigate]);

  // Charger les produits
  const loadProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
  };

  // Charger les médias
  const loadMedia = async () => {
    const { data, error } = await supabase.from('artisanat_media').select('*').order('display_order', { ascending: true });
    if (!error && data) setMediaList(data);
  };

  // Charger les messages
  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setMessages(data);
  };

  useEffect(() => {
    if (session) {
      loadProducts();
      loadMedia();
      loadMessages();
    }
  }, [session]);

  // === PRODUITS ===
  const resetProductForm = () => {
    setEditingProduct(null);
    setName('');
    setDescription('');
    setPrice(0);
    setCategory('Crochet');
    setFeatured(false);
    setImageFile(null);
    setImagePreview('');
    setError('');
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setFeatured(product.featured);
    setImagePreview(product.image_url);
    setShowProductForm(true);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    const productData: any = {
      name,
      description,
      price,
      category,
      featured,
      in_stock: true,
    };

    if (!editingProduct) {
      productData.id = crypto.randomUUID();
    }

    try {
      let image_url = editingProduct?.image_url || '';

      if (imageFile) {
        setUploading(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        image_url = publicUrlData.publicUrl;
        setUploading(false);
      }

      if (editingProduct) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ ...productData, image_url })
          .eq('id', editingProduct.id);
        if (updateError) throw updateError;
        setSuccessMessage('✅ Sac modifié avec succès !');
      } else {
        const { error: insertError } = await supabase
          .from('products')
          .insert([{ ...productData, image_url }]);
        if (insertError) throw insertError;
        setSuccessMessage('🎉 Nouveau sac ajouté avec succès !');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      resetProductForm();
      setShowProductForm(false);
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Confirmer la suppression du sac ?')) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      alert('Erreur suppression');
      return;
    }
    setSuccessMessage('🗑️ Sac supprimé avec succès.');
    setTimeout(() => setSuccessMessage(''), 3000);
    loadProducts();
  };

  // === MÉDIAS ARTISANAT ===
  const resetMediaForm = () => {
    setEditingMedia(null);
    setMediaTitle('');
    setMediaType('image');
    setMediaSection('gallery');
    setMediaFile(null);
    setMediaPreview('');
    setError('');
  };

  const handleEditMedia = (media: ArtisanatMedia) => {
    setEditingMedia(media);
    setMediaTitle(media.title);
    setMediaType(media.type);
    setMediaSection(media.section);
    setMediaPreview(media.url);
    setShowMediaForm(true);
  };

  const handleSubmitMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    const mediaData: any = {
      title: mediaTitle,
      type: mediaType,
      section: mediaSection,
    };

    try {
      let url = editingMedia?.url || '';

      if (mediaFile) {
        setUploading(true);
        const fileExt = mediaFile.name.split('.').pop();
        const fileName = `artisanat-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, mediaFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        url = publicUrlData.publicUrl;
        setUploading(false);
      }

      if (editingMedia) {
        const { error: updateError } = await supabase
          .from('artisanat_media')
          .update({ ...mediaData, url })
          .eq('id', editingMedia.id);
        if (updateError) throw updateError;
        setSuccessMessage('✅ Média modifié avec succès !');
      } else {
        const { data: maxOrder } = await supabase
          .from('artisanat_media')
          .select('display_order')
          .eq('section', mediaSection)
          .order('display_order', { ascending: false })
          .limit(1)
          .single();

        const newOrder = maxOrder ? maxOrder.display_order + 1 : 1;

        const { error: insertError } = await supabase
          .from('artisanat_media')
          .insert([{ ...mediaData, url, display_order: newOrder }]);
        if (insertError) throw insertError;
        setSuccessMessage('🎉 Nouveau média ajouté avec succès !');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      resetMediaForm();
      setShowMediaForm(false);
      loadMedia();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!window.confirm('Confirmer la suppression du média ?')) return;
    const { error } = await supabase.from('artisanat_media').delete().eq('id', mediaId);
    if (error) {
      alert('Erreur suppression');
      return;
    }
    setSuccessMessage('🗑️ Média supprimé avec succès.');
    setTimeout(() => setSuccessMessage(''), 3000);
    loadMedia();
  };

  // === MESSAGES ===
  const markAsRead = async (messageId: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', messageId);
    if (!error) {
      setSuccessMessage('✅ Message marqué comme lu');
      setTimeout(() => setSuccessMessage(''), 3000);
      loadMessages();
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', messageId);
    if (error) {
      alert('Erreur suppression');
      return;
    }
    setSuccessMessage('🗑️ Message supprimé.');
    setTimeout(() => setSuccessMessage(''), 3000);
    loadMessages();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('home');
  };

  if (!session) return null;

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Administration</h1>
          <div className="flex gap-3">
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-200 text-stone-700 rounded-full hover:bg-stone-300 transition">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="fixed top-28 right-6 z-[60] flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3 rounded-xl shadow-lg animate-bounce">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium">{successMessage}</span>
            <button onClick={() => setSuccessMessage('')} className="ml-4 p-1 rounded-full hover:bg-emerald-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* === SECTION PRODUITS === */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
              <Package className="w-6 h-6 text-amber-700" />
              Produits
            </h2>
            <button
              onClick={() => { resetProductForm(); setShowProductForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition"
            >
              <Plus className="w-4 h-4" /> Ajouter un sac
            </button>
          </div>

          <div className="grid gap-4">
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div>
                    <h3 className="font-semibold text-stone-900">{product.name}</h3>
                    <p className="text-sm text-stone-500">{product.price.toLocaleString()} Ar — {product.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditProduct(product)} className="p-2 text-amber-700 hover:bg-amber-50 rounded-full transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-center text-stone-500 py-8">Aucun produit.</p>}
          </div>
        </div>

        {/* === SECTION MÉDIAS ARTISANAT === */}
        <div className="border-t border-stone-200 pt-12 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
              <Image className="w-6 h-6 text-amber-700" />
              Médias Page Artisanat
            </h2>
            <button
              onClick={() => { resetMediaForm(); setShowMediaForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition"
            >
              <Plus className="w-4 h-4" /> Ajouter un média
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMediaSection('gallery')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                mediaSection === 'gallery' 
                  ? 'bg-amber-700 text-white shadow-md shadow-amber-900/20' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🖼️ Galerie
            </button>
            <button
              onClick={() => setMediaSection('videos')}
              className={`px-4 py-2 text-xs font-semibold rounded-full transition-all ${
                mediaSection === 'videos' 
                  ? 'bg-amber-700 text-white shadow-md shadow-amber-900/20' 
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              🎬 Vidéos
            </button>
          </div>

          <div className="grid gap-4">
            {mediaList
              .filter(m => m.section === mediaSection)
              .map(media => (
                <div key={media.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    {media.type === 'image' ? (
                      <img src={media.url} alt={media.title} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-stone-900">{media.title}</h3>
                      <p className="text-sm text-stone-500">
                        {media.type === 'image' ? '🖼️ Image' : '🎬 Vidéo'} — Ordre: {media.display_order}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditMedia(media)} className="p-2 text-amber-700 hover:bg-amber-50 rounded-full transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteMedia(media.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            {mediaList.filter(m => m.section === mediaSection).length === 0 && (
              <p className="text-center text-stone-500 py-8">Aucun média dans cette section.</p>
            )}
          </div>
        </div>

        {/* === SECTION MESSAGES === */}
        <div className="border-t border-stone-200 pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 flex items-center gap-3">
              <Mail className="w-6 h-6 text-amber-700" />
              Messages de contact
              {unreadCount > 0 && (
                <span className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-full font-bold animate-pulse">
                  {unreadCount} non lu{unreadCount > 1 ? 's' : ''}
                </span>
              )}
            </h2>
          </div>

          <div className="space-y-4">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`bg-white p-5 rounded-xl shadow-sm border transition-all ${
                  msg.read 
                    ? 'border-stone-100' 
                    : 'border-amber-200 bg-amber-50/30 shadow-amber-100/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-stone-900">{msg.name}</h3>
                    <p className="text-sm text-stone-500">{msg.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-400">
                      {new Date(msg.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    
                    {/* Bouton Répondre */}
                    <a
                      href={`mailto:${msg.email}?subject=Réponse à votre message - Nic Handmade&body=Bonjour ${msg.name},%0D%0A%0D%0A`}
                      className="text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full transition-colors font-medium flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Répondre
                    </a>
                    
                    {!msg.read && (
                      <button
                        onClick={() => markAsRead(msg.id)}
                        className="text-xs px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-full transition-colors font-medium"
                      >
                        Marquer comme lu
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-12">
                <Mail className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                <p className="text-stone-500">Aucun message pour le moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* === MODAL FORMULAIRE PRODUIT === */}
        {showProductForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingProduct ? 'Modifier le sac' : 'Nouveau sac'}
              </h2>
              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <input type="text" required value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea required value={description} onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Prix (Ar)</label>
                    <input type="number" required min={0} value={price} onChange={e => setPrice(Number(e.target.value))}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie</label>
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500">
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} id="featured" />
                  <label htmlFor="featured" className="text-sm">Produit vedette ?</label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image</label>
                  <input type="file" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }} className="w-full text-sm" />
                  {imagePreview && (
                    <img src={imagePreview} alt="Aperçu" className="mt-2 h-32 object-cover rounded-lg" />
                  )}
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowProductForm(false); resetProductForm(); }}
                    className="px-4 py-2 border rounded-full text-stone-600 hover:bg-stone-100">Annuler</button>
                  <button type="submit" disabled={saving || uploading}
                    className="px-6 py-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 disabled:opacity-50">
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* === MODAL FORMULAIRE MÉDIA === */}
        {showMediaForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                {editingMedia ? 'Modifier le média' : 'Nouveau média'}
              </h2>
              <form onSubmit={handleSubmitMedia} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre</label>
                  <input type="text" required value={mediaTitle} onChange={e => setMediaTitle(e.target.value)}
                    placeholder="Ex: Travail du raphia"
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select value={mediaType} onChange={e => setMediaType(e.target.value as 'image' | 'video')}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500">
                    <option value="image">Image</option>
                    <option value="video">Vidéo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Section</label>
                  <select value={mediaSection} onChange={e => setMediaSection(e.target.value)}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-amber-500">
                    <option value="gallery">Galerie d'images</option>
                    <option value="videos">Vidéos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Fichier</label>
                  <input type="file" accept={mediaType === 'image' ? 'image/*' : 'video/*'} onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMediaFile(file);
                      setMediaPreview(URL.createObjectURL(file));
                    }
                  }} className="w-full text-sm" />
                  {mediaPreview && mediaType === 'image' && (
                    <img src={mediaPreview} alt="Aperçu" className="mt-2 h-32 object-cover rounded-lg" />
                  )}
                  {mediaPreview && mediaType === 'video' && (
                    <video src={mediaPreview} controls className="mt-2 h-32 rounded-lg" />
                  )}
                  {!mediaFile && editingMedia && (
                    <p className="text-xs text-stone-500 mt-1">Laissez vide pour conserver le fichier actuel</p>
                  )}
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowMediaForm(false); resetMediaForm(); }}
                    className="px-4 py-2 border rounded-full text-stone-600 hover:bg-stone-100">Annuler</button>
                  <button type="submit" disabled={saving || uploading}
                    className="px-6 py-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 disabled:opacity-50">
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}