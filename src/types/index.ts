export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  featured: boolean;
  in_stock: boolean;
  created_at: string;
  matiere?: string;
  origine?: string;
  disponibilite?: string;

}

export interface CartItem {
  product: Product;
  quantity: number;
}
