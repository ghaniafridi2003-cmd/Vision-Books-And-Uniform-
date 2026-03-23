# Supabase Setup Guide
## Visionbooks & Uniform Admin Panel

This guide will help you set up Supabase tables for your admin panel.

---

## 📋 Prerequisites

- Supabase account (https://supabase.com)
- Your Supabase project already exists (credentials in `js/supabase-client.js`)

---

## 🗄️ Step 1: Create Tables

Go to your Supabase Dashboard → **SQL Editor** and run these queries:

### **1. Products Table**

```sql
-- Create products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  stock INTEGER DEFAULT 0,
  image TEXT,
  images TEXT[],
  description TEXT,
  rating NUMERIC DEFAULT 4.5,
  reviews INTEGER DEFAULT 0,
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT TO anon USING (true);

-- Create policy to allow authenticated insert/update/delete
CREATE POLICY "Allow authenticated insert" ON products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Allow authenticated delete" ON products
  FOR DELETE TO authenticated USING (true);
```

### **2. Orders Table**

```sql
-- Create orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  local_order_id TEXT UNIQUE,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT,
  payment_method TEXT DEFAULT 'cod',
  notes TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  shipping NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated read access
CREATE POLICY "Allow authenticated read access" ON orders
  FOR SELECT TO authenticated USING (true);

-- Create policy to allow insert for anyone (for customer orders)
CREATE POLICY "Allow insert for anyone" ON orders
  FOR INSERT TO anon WITH CHECK (true);

-- Create policy to allow authenticated update
CREATE POLICY "Allow authenticated update" ON orders
  FOR UPDATE TO authenticated USING (true);
```

### **3. Create Indexes for Better Performance**

```sql
-- Products indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_is_new ON products(is_new);

-- Orders indexes
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_email ON orders(email);
```

---

## 🔐 Step 2: Authentication Setup (Optional)

For better security, you can set up Supabase Auth:

### **Enable Email/Password Authentication:**

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Configure email templates if needed

### **Update admin login in `js/supabase-client.js`:**

```javascript
// Replace the simple adminLogin function with:
async function adminLogin(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.error('Login error:', error);
    return false;
  }

  localStorage.setItem('admin_logged_in', 'true');
  return true;
}
```

### **Create Admin User:**

Go to **Authentication → Users → Add User**
- Email: `admin@vision.pk`
- Password: `your-secure-password`
- Auto Confirm User: **Yes**

---

## 📤 Step 3: Upload Sample Products

You can use the admin panel to add products, or bulk insert using SQL:

```sql
-- Example: Insert sample products
INSERT INTO products (id, name, category, subcategory, price, original_price, stock, image, description, rating, reviews, badge, featured, is_new)
VALUES
  ('BK001', 'Oxford English Grammar – Class 9', 'books', 'school', 450, 550, 25, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80', 'Complete English grammar guide for 9th grade students', 4.5, 42, 'sale', true, false),
  ('ST001', 'Dollar Classic Ball Pen (Blue) – Pack of 10', 'stationery', 'pens', 150, 200, 100, 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80', 'Smooth writing ball pens perfect for students', 4.4, 67, 'sale', true, false),
  ('UF001', 'Boys School Shirt – White', 'uniforms', 'boys', 650, 800, 50, 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&q=80', 'Premium quality white school shirt for boys', 4.6, 73, 'sale', true, false);

-- Add more products as needed
```

---

## 🔄 Step 4: Test the Connection

1. **Open your admin panel:** `your-site-url/admin.html`
2. **Login** with credentials (default: `admin@vision.pk` / `admin123`)
3. **Click "Sync Database"** to fetch products from Supabase
4. **Add a test product** to verify insert works
5. **Check the "Orders" section** after placing a test order on your site

---

## 🛠️ Step 5: Configure RLS (Row Level Security)

For production, you should configure proper RLS policies:

```sql
-- Example: Only allow admin role to manage products
CREATE POLICY "Admin can manage products" ON products
  FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Example: Customers can only view their own orders
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT TO authenticated
  USING (
    email = auth.jwt() ->> 'email'
  );
```

---

## 📊 Step 6: Enable Realtime (Optional)

To get live updates in your admin panel:

1. Go to **Database → Replication**
2. Enable replication for `products` and `orders` tables
3. Update `admin.js` to subscribe to changes:

```javascript
// Subscribe to product changes
supabaseClient
  .channel('products-changes')
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'products' 
  }, (payload) => {
    console.log('Product changed:', payload);
    loadDashboardData(); // Refresh data
  })
  .subscribe();
```

---

## ⚠️ Important Security Notes

### **1. Change Default Admin Password**

In `js/supabase-client.js`, change:
```javascript
const ADMIN_EMAIL = 'admin@vision.pk';
const ADMIN_PASSWORD = 'admin123';  // CHANGE THIS!
```

### **2. Use Environment Variables (For Production)**

Don't commit your Supabase keys to GitHub. Use environment variables:

```javascript
// Instead of hardcoding:
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
```

### **3. Restrict Admin Access**

Add IP whitelisting or additional authentication layers for the admin panel.

---

## 🎯 Verification Checklist

- [ ] Products table created with correct columns
- [ ] Orders table created with correct columns
- [ ] RLS policies enabled
- [ ] Indexes created for performance
- [ ] Admin user created (if using Supabase Auth)
- [ ] Sample products uploaded
- [ ] Admin panel loads without errors
- [ ] Can add/edit/delete products
- [ ] Orders appear in admin panel after checkout
- [ ] Changed default admin password

---

## 🆘 Troubleshooting

### **Products not showing in admin panel?**
- Check browser console for errors
- Verify Supabase URL and key in `supabase-client.js`
- Check RLS policies allow read access
- Click "Sync Database" button

### **Cannot add products?**
- Check RLS policies allow insert for authenticated users
- Verify you're logged in
- Check browser console for errors

### **Orders not saving?**
- Check orders table exists
- Verify RLS policies allow insert
- Check browser console for errors
- Test with a simple order first

### **Admin login not working?**
- If using Supabase Auth, verify user exists
- If using hardcoded credentials, check spelling
- Clear browser cache and try again

---

## 📚 Additional Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Row Level Security:** https://supabase.com/docs/guides/auth/row-level-security
- **Realtime:** https://supabase.com/docs/guides/realtime
- **API Reference:** https://supabase.com/docs/reference/javascript/introduction

---

**Need Help?** Check the browser console (F12) for error messages, they usually point to the exact problem!
