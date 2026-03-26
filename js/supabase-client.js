/**
 * SUPABASE CLIENT
 * Database connection for Visionbooks & Uniform
 */

// Your Supabase credentials (now pulled from private js/env.js)
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE';

// Initialize Supabase client
let supabaseClient;
try {
  if (SUPABASE_URL !== 'YOUR_SUPABASE_URL_HERE' && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY_HERE') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else {
    console.warn('Supabase credentials missing. Please set them in js/env.js');
  }
} catch (e) {
  console.error('Failed to initialize Supabase:', e);
}

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
async function updateOrderStatus(orderId, newStatus) {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Supabase update failed:', error);
    throw error;
  }
}

/**
 * ADMIN AUTH - Using Supabase Auth for security
 */
async function adminLogin(email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Login error:', error.message);
      return false;
    }

    return !!data.user;
  } catch (error) {
    console.error('Authentication exception:', error);
    return false;
  }
}

async function isAdminLoggedIn() {
  // Check Supabase session
  if (!supabaseClient) return false;
  const { data: { session } } = await supabaseClient.auth.getSession();
  return !!session;
}

async function adminLogout() {
  try {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    localStorage.removeItem('admin_logged_in'); // Clean up old legacy key
  } catch (error) {
    console.error('Logout error:', error);
  }
}
