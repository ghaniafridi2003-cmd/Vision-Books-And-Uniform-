/**
 * SUPABASE CLIENT
 * Database connection for Visionbooks & Uniform
 */

// Your Supabase credentials
const SUPABASE_URL = 'https://vagttrkoefdymqvipzlz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhZ3R0cmtvZWZkeW1xdmlwemx6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxNjY2OTgsImV4cCI6MjA4OTc0MjY5OH0.Al8xgc0PEXHn5bHlEtTAIAeisFpC1YHdGEDd_Km0BlQ';

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * PRODUCTS - Fetch from Supabase
 */
async function fetchProductsFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    if (!Array.isArray(data)) return [];

    // Normalize field names
    return data.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory || 'general',
      price: Number(product.price) || 0,
      originalPrice: product.original_price ? Number(product.original_price) : null,
      stock: product.in_stock ? 10 : 0, // DB uses boolean 'in_stock', mapping to dummy numeric for UI
      image: product.image || '',
      images: Array.isArray(product.images) ? product.images : [product.image || ''],
      description: product.description || '',
      rating: Number(product.rating) || 4.5,
      reviews: Number(product.reviews) || 0,
      badge: product.badge || null,
      featured: Boolean(product.is_featured),
      isNew: Boolean(product.is_new),
      tags: Array.isArray(product.tags) ? product.tags : []
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * PRODUCTS - Create/Update
 */
async function upsertProduct(product) {
  try {
    const row = {
      id: product.id,
      name: product.name,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      original_price: product.originalPrice,
      in_stock: product.stock > 0,
      image: product.image,
      images: product.images,
      description: product.description,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      is_featured: product.featured,
      is_new: product.isNew,
      tags: product.tags
    };

    const { data, error } = await supabaseClient
      .from('products')
      .upsert([row], { onConflict: 'id' })
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error upserting product:', error);
    throw error;
  }
}

/**
 * PRODUCTS - Delete
 */
async function deleteProduct(productId) {
  try {
    const { error } = await supabaseClient
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

/**
 * ORDERS - Fetch all
 */
async function fetchOrdersFromSupabase() {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

/**
 * ORDERS - Create
 */
async function createOrderInSupabase(order) {
  try {
    const orderRow = {
      local_order_id: order.id,
      customer_name: order.customerInfo.fullName,
      email: order.customerInfo.email,
      phone: order.customerInfo.phone,
      address: order.customerInfo.address,
      city: order.customerInfo.city,
      postal_code: order.customerInfo.postalCode || null,
      payment_method: order.paymentMethod,
      notes: order.notes || null,
      items: order.items,
      subtotal: order.summary.subtotal,
      shipping: order.summary.shipping,
      total: order.summary.total,
      status: order.status || 'pending'
    };

    const { data, error } = await supabaseClient
      .from('orders')
      .insert([orderRow])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * ORDERS - Update status
 */
async function updateOrderStatus(orderId, status) {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .update({ status: status })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

/**
 * ADMIN AUTH - Simple check (for demo, use Supabase Auth in production)
 */
async function adminLogin(email, password) {
  // For now, hardcoded admin credentials
  // In production, use Supabase Auth or a proper auth system
  const ADMIN_EMAIL = 'admin@vision.pk';
  const ADMIN_PASSWORD = 'admin123';  // CHANGE THIS!

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem('admin_logged_in', 'true');
    return true;
  }
  return false;
}

function isAdminLoggedIn() {
  return localStorage.getItem('admin_logged_in') === 'true';
}

function adminLogout() {
  localStorage.removeItem('admin_logged_in');
}
