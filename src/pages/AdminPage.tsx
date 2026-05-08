import { useState, useEffect } from 'react';
import { usePage } from '../context/PageContext';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { categories } from '../lib/products';
import { Trash2, Edit, Plus, LogOut, CheckCircle, X } from 'lucide-react';

export default function AdminPage() {
  const { navigate } = usePage();
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('Crochet');
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
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
            navigate('home'); // pas admin
          }
        });
    });
  }, [navigate]);

  // Charger les produits
  const loadProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (!error && data) setProducts(data);
  };

  useEffect(() => {
    if (session) loadProducts();
  }, [session]);

  const resetForm = () => {
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
    setFeatured(product.featured);
    setImagePreview(product.image_url);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Si c'est une création, on génère un ID unique
    if (!editingProduct) {
      productData.id = crypto.randomUUID();
    }

    try {
      let image_url = editingProduct?.image_url || '';

      // Upload image si nouveau fichier
      if (imageFile) {
        setUploading(true);
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Obtenir l'URL publique
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        image_url = publicUrlData.publicUrl;
        setUploading(false);
      }

      if (editingProduct) {
        // Mise à jour
        const { error: updateError } = await supabase
          .from('products')
          .update({ ...productData, image_url })
          .eq('id', editingProduct.id);

        if (updateError) throw updateError;
        setSuccessMessage('✅ Modifications enregistrées avec succès !');
      } else {
        // Insertion avec l'ID généré
        const { error: insertError } = await supabase
          .from('products')
          .insert([{ ...productData, image_url }]);

        if (insertError) throw insertError;
        setSuccessMessage('🎉 Nouveau sac ajouté avec succès !');
      }

      // Faire disparaître le message après 3 secondes
      setTimeout(() => setSuccessMessage(''), 3000);

      resetForm();
      setShowForm(false);
      loadProducts();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      alert('Erreur suppression');
      return;
    }
    setSuccessMessage('🗑️ Sac supprimé avec succès.');
    setTimeout(() => setSuccessMessage(''), 3000);
    loadProducts();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('home');
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-stone-50 pt-20 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Administration des Produits</h1>
          <div className="flex gap-3">
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-amber-700 text-white rounded-full hover:bg-amber-800 transition"
            >
              <Plus className="w-4 h-4" /> Ajouter un sac
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-200 text-stone-700 rounded-full hover:bg-stone-300 transition"
            >
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

        {/* Formulaire en modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingProduct ? 'Modifier le sac' : 'Nouveau sac'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  <button type="button" onClick={() => { setShowForm(false); resetForm(); }}
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

        {/* Liste des produits */}
        <div className="grid gap-4">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <img src={product.image_url} alt={product.name} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-semibold text-stone-900">{product.name}</h3>
                  <p className="text-sm text-stone-500">{product.price.toLocaleString()} Ar — {product.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(product)} className="p-2 text-amber-700 hover:bg-amber-50 rounded-full">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="text-center text-stone-500 mt-8">Aucun produit.</p>}
        </div>
      </div>
    </div>
  );
}