/*
  # Create products, orders, order_items, and delivery_info tables for Gaombavy

  1. New Tables
    - products - Artisan bags catalog
    - orders - Customer orders
    - order_items - Items within each order
    - delivery_info - Delivery address and instructions

  2. Security
    - Enable RLS on all tables
    - Products: public read access
    - Orders, order_items, delivery_info: anyone can insert and read

  3. Notes
    - Products seeded with 8 artisan bag entries
    - Prices in Ariary (MGA)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL,
  image_url text,
  category text DEFAULT 'sac',
  featured boolean DEFAULT false,
  in_stock boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text NOT NULL,
  phone text,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'unpaid',
  payment_method text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id),
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS delivery_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid UNIQUE NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  address_line1 text NOT NULL,
  address_line2 text,
  city text NOT NULL,
  state text,
  postal_code text,
  country text NOT NULL DEFAULT 'Madagascar',
  delivery_notes text
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view orders" ON orders FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create order items" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view order items" ON order_items FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can create delivery info" ON delivery_info FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can view delivery info" ON delivery_info FOR SELECT TO anon, authenticated USING (true);

INSERT INTO products (name, description, price, image_url, category, featured, in_stock) VALUES
  ('Sac Raphia Naturel', 'Sac artisanal en raphia tresse a la main par les artisans de Madagascar.', 45000, 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800', 'raphia', true, true),
  ('Sac Cabas en Vannerie', 'Grand cabas en vannerie naturelle, ideal pour le quotidien.', 55000, 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800', 'vannerie', true, true),
  ('Sac Pochette Artisanale', 'Elegante pochette artisanale avec motifs traditionnels malgaches.', 35000, 'https://images.pexels.com/photos/1157631/pexels-photo-1157631.jpeg?auto=compress&cs=tinysrgb&w=800', 'pochette', true, true),
  ('Sac Bandouliere Raphia', 'Sac bandouliere en raphia avec bandouliere ajustable.', 42000, 'https://images.pexels.com/photos/2048548/pexels-photo-2048548.jpeg?auto=compress&cs=tinysrgb&w=800', 'raphia', false, true),
  ('Sac Shopping Vannerie', 'Sac shopping spacieux en vannerie naturelle.', 60000, 'https://images.pexels.com/photos/1661471/pexels-photo-1661471.jpeg?auto=compress&cs=tinysrgb&w=800', 'vannerie', true, true),
  ('Sac Mini Raphia Colore', 'Mini sac en raphia avec touches de couleurs vives.', 30000, 'https://images.pexels.com/photos/1749426/pexels-photo-1749426.jpeg?auto=compress&cs=tinysrgb&w=800', 'raphia', false, true),
  ('Sac Seau Artisanal', 'Sac seau en fibres naturelles tressees.', 50000, 'https://images.pexels.com/photos/2929995/pexels-photo-2929995.jpeg?auto=compress&cs=tinysrgb&w=800', 'vannerie', true, true),
  ('Sac de Soiree Brode', 'Petit sac de soiree avec broderies artisanales delicates.', 40000, 'https://images.pexels.com/photos/2726808/pexels-photo-2726808.jpeg?auto=compress&cs=tinysrgb&w=800', 'pochette', false, true);