/**
 * ADMIN PANEL JAVASCRIPT
 * Visionbooks & Uniform Admin Dashboard
 */

let allProducts = [];
let allOrders = [];
let currentEditingProduct = null;

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', async function() {
  // Check if admin is logged in via Supabase Auth
  if (await isAdminLoggedIn()) {
    showDashboard();
    await loadDashboardData();
  } else {
    showLogin();
  }
});

// Show login screen
function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

// Show dashboard
function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';
}

// Handle login
async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const success = await adminLogin(email, password);
  
  if (success) {
    showToast('Login successful!', 'success');
    showDashboard();
    await loadDashboardData();
  } else {
    showToast('Invalid credentials', 'error');
  }
}

// Handle logout
async function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    await adminLogout();
    showLogin();
  }
}

// Load all dashboard data
async function loadDashboardData() {
  try {
    // Load products from Supabase
    allProducts = await fetchProductsFromSupabase();
    
    // If no products in Supabase, use local products
    if (allProducts.length === 0) {
      allProducts = getAllProducts();
      showToast('Using local products. Click "Sync Database" to upload to Supabase.', 'info');
    }

    // Load orders from Supabase
    allOrders = await fetchOrdersFromSupabase();

    // Update dashboard
    updateDashboardStats();
    renderRecentOrders();
    renderLowStock();
    renderProductsTable();
    renderOrdersTable();
    loadSettings();
  } catch (error) {
    console.error('Error loading dashboard data:', error);
    showToast('Error loading data. Check console.', 'error');
  }
}

// Update dashboard statistics
function updateDashboardStats() {
  document.getElementById('totalProducts').textContent = allProducts.length;
  document.getElementById('totalOrders').textContent = allOrders.length;
  
  const pending = allOrders.filter(o => o.status === 'pending').length;
  document.getElementById('pendingOrders').textContent = pending;
  
  const revenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  document.getElementById('totalRevenue').textContent = formatPrice(revenue);
}

// Render recent orders on dashboard
function renderRecentOrders() {
  const container = document.getElementById('recentOrdersList');
  const recent = allOrders.slice(0, 5);

  if (recent.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">No orders yet</p>';
    return;
  }

  container.innerHTML = recent.map(order => `
    <div class="order-item">
      <div>
        <strong>${escapeHTML(order.customer_name || order.local_order_id)}</strong>
        <small>${formatPrice(order.total || 0)}</small>
      </div>
      <span class="badge badge-${order.status}">${order.status}</span>
    </div>
  `).join('');
}

// Render low stock products
function renderLowStock() {
  const container = document.getElementById('lowStockList');
  const lowStock = allProducts.filter(p => p.stock < 10).slice(0, 5);

  if (lowStock.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999;">All products in stock</p>';
    return;
  }

  container.innerHTML = lowStock.map(product => `
    <div class="order-item">
      <div>
        <strong>${product.name}</strong>
        <small>${product.category}</small>
      </div>
      <span class="badge badge-warning">${product.stock} left</span>
    </div>
  `).join('');
}

// Show section
function showSection(section, event) {
  // Prevent default link behavior
  if (event) {
    event.preventDefault();
  }
  
  // Update nav items
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  
  // Find and mark the current nav item as active
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    const itemSection = {
      'dashboard': 'dashboard',
      'products': 'products',
      'orders': 'orders',
      'settings': 'settings'
    };
    
    // Mark as active if onclick contains the current section
    if (item.getAttribute('onclick').includes(`'${section}'`)) {
      item.classList.add('active');
    }
  });

  // Hide all sections
  document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');

  // Show selected section
  const sectionMap = {
    dashboard: 'dashboardSection',
    products: 'productsSection',
    orders: 'ordersSection',
    settings: 'settingsSection'
  };

  const sectionTitles = {
    dashboard: 'Dashboard',
    products: 'Products Management',
    orders: 'Orders Management',
    settings: 'Settings'
  };

  document.getElementById(sectionMap[section]).style.display = 'block';
  document.getElementById('sectionTitle').textContent = sectionTitles[section];
}

// Render products table
function renderProductsTable() {
  const tbody = document.getElementById('productsTableBody');
  
  if (allProducts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No products found</td></tr>';
    return;
  }

  tbody.innerHTML = allProducts.map(product => `
    <tr>
      <td>
        <img src="${product.image}" alt="${escapeHTML(product.name)}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
      </td>
      <td><strong>${escapeHTML(product.name)}</strong></td>
      <td><span class="badge badge-secondary">${escapeHTML(product.category)}</span></td>
      <td>${formatPrice(product.price)}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn-icon" onclick="editProduct('${escapeHTML(product.id)}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon" onclick="deleteProduct('${escapeHTML(product.id)}')" style="color: var(--danger);" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Filter products
function filterProducts() {
  const search = document.getElementById('productSearch').value.toLowerCase();
  const filtered = allProducts.filter(p => 
    p.name.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search) ||
    p.id.toLowerCase().includes(search)
  );

  const tbody = document.getElementById('productsTableBody');
  tbody.innerHTML = filtered.map(product => `
    <tr>
      <td>
        <img src="${product.image}" alt="${escapeHTML(product.name)}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
      </td>
      <td><strong>${escapeHTML(product.name)}</strong></td>
      <td><span class="badge badge-secondary">${escapeHTML(product.category)}</span></td>
      <td>${formatPrice(product.price)}</td>
      <td>${product.stock}</td>
      <td>
        <button class="btn-icon" onclick="editProduct('${escapeHTML(product.id)}')" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon" onclick="deleteProduct('${escapeHTML(product.id)}')" style="color: var(--danger);" title="Delete">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Render orders table
function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  
  if (allOrders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;">No orders found</td></tr>';
    return;
  }

  tbody.innerHTML = allOrders.map(order => `
    <tr>
      <td><strong>${escapeHTML(order.local_order_id || order.id)}</strong></td>
      <td>${escapeHTML(order.customer_name || '-')}</td>
      <td>${escapeHTML(order.phone || '-')}</td>
      <td>${Array.isArray(order.items) ? order.items.length : 0} items</td>
      <td>${formatPrice(order.total || 0)}</td>
      <td>
        <select class="status-select" onchange="updateOrderStatusInline(${order.id}, this.value)">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>${new Date(order.created_at).toLocaleDateString()}</td>
      <td>
        <button class="btn-icon" onclick="viewOrderDetails(${order.id})" title="View">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Filter orders
function filterOrders() {
  const status = document.getElementById('orderStatusFilter').value;
  const filtered = status === 'all' ? allOrders : allOrders.filter(o => o.status === status);
  
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = filtered.map(order => `
    <tr>
      <td><strong>${escapeHTML(order.local_order_id || order.id)}</strong></td>
      <td>${escapeHTML(order.customer_name || '-')}</td>
      <td>${escapeHTML(order.phone || '-')}</td>
      <td>${Array.isArray(order.items) ? order.items.length : 0} items</td>
      <td>${formatPrice(order.total || 0)}</td>
      <td>
        <select class="status-select" onchange="updateOrderStatusInline(${order.id}, this.value)">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
          <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
          <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </td>
      <td>${new Date(order.created_at).toLocaleDateString()}</td>
      <td>
        <button class="btn-icon" onclick="viewOrderDetails(${order.id})" title="View">
          <i class="fas fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

// Update order status inline
async function updateOrderStatusInline(orderId, newStatus) {
  try {
    await updateOrderStatus(orderId, newStatus);
    showToast('Order status updated', 'success');
    await loadDashboardData();
  } catch (error) {
    const errorMsg = error.message || 'Unknown database error';
    showToast(`Error: ${errorMsg}`, 'error');
    console.error('Detailed Debug Error:', error);
  }
}

// View order details
function viewOrderDetails(orderId) {
  const order = allOrders.find(o => o.id === orderId);
  if (!order) return;

  alert(`Order Details:\n\nID: ${order.local_order_id || order.id}\nCustomer: ${order.customer_name}\nPhone: ${order.phone}\nTotal: ${formatPrice(order.total)}\nStatus: ${order.status}`);
}

// Open product modal
function openProductModal(productId = null) {
  currentEditingProduct = productId;
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');
  
  if (productId) {
    // Edit mode
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productId').readOnly = true;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productSubcategory').value = product.subcategory;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOriginalPrice').value = product.originalPrice || '';
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productRating').value = product.rating;
    document.getElementById('productReviews').value = product.reviews;
    document.getElementById('productBadge').value = product.badge || '';
    document.getElementById('productFeatured').checked = product.featured;
    document.getElementById('productIsNew').checked = product.isNew;
  } else {
    // Add mode
    document.getElementById('modalTitle').textContent = 'Add New Product';
    form.reset();
    document.getElementById('productId').readOnly = false;
  }

  modal.style.display = 'flex';
}

// Close product modal
function closeProductModal() {
  document.getElementById('productModal').style.display = 'none';
  currentEditingProduct = null;
}

// Save product
async function saveProduct(event) {
  event.preventDefault();

  const product = {
    id: document.getElementById('productId').value,
    name: document.getElementById('productName').value,
    category: document.getElementById('productCategory').value,
    subcategory: document.getElementById('productSubcategory').value,
    price: Number(document.getElementById('productPrice').value),
    originalPrice: document.getElementById('productOriginalPrice').value ? Number(document.getElementById('productOriginalPrice').value) : null,
    stock: Number(document.getElementById('productStock').value),
    image: document.getElementById('productImage').value,
    images: [document.getElementById('productImage').value],
    description: document.getElementById('productDescription').value,
    rating: Number(document.getElementById('productRating').value),
    reviews: Number(document.getElementById('productReviews').value),
    badge: document.getElementById('productBadge').value || null,
    featured: document.getElementById('productFeatured').checked,
    isNew: document.getElementById('productIsNew').checked,
    tags: []
  };

  try {
    await upsertProduct(product);
    showToast(currentEditingProduct ? 'Product updated!' : 'Product added!', 'success');
    closeProductModal();
    await loadDashboardData();
  } catch (error) {
    showToast('Error saving product', 'error');
    console.error(error);
  }
}

// Edit product
function editProduct(productId) {
  openProductModal(productId);
}

// Confirm delete product
function confirmDeleteProduct(productId) {
  if (confirm('Are you sure you want to delete this product?')) {
    deleteProductById(productId);
  }
}

// Delete product
async function deleteProductById(productId) {
  try {
    await deleteProduct(productId);
    showToast('Product deleted', 'success');
    await loadDashboardData();
  } catch (error) {
    showToast('Error deleting product', 'error');
    console.error(error);
  }
}

// Sync with Supabase
async function syncWithSupabase() {
  try {
    showToast('Syncing with database...', 'info');
    await loadDashboardData();
    showToast('Sync complete!', 'success');
  } catch (error) {
    showToast('Sync failed', 'error');
    console.error(error);
  }
}

// Import local products to Supabase
async function importProductsToSupabase() {
  if (!confirm('This will upload all local products to Supabase. Continue?')) {
    return;
  }

  try {
    showToast('Importing products to Supabase...', 'info');
    
    // Get local products
    const productsToImport = getAllProducts();
    
    if (productsToImport.length === 0) {
      showToast('No products to import', 'warning');
      return;
    }

    // Import each product
    let imported = 0;
    for (const product of productsToImport) {
      try {
        await upsertProduct(product);
        imported++;
      } catch (error) {
        console.error(`Error importing product ${product.id}:`, error);
      }
    }

    showToast(`Successfully imported ${imported}/${productsToImport.length} products!`, 'success');
    
    // Reload dashboard
    await loadDashboardData();
  } catch (error) {
    showToast('Import failed. Check console for details.', 'error');
    console.error('Import error:', error);
  }
}

// Load settings
function loadSettings() {
  document.getElementById('settingStoreName').textContent = CONFIG.store.name;
  document.getElementById('settingPhone').textContent = CONFIG.store.phone;
  document.getElementById('settingEmail').textContent = CONFIG.store.email;
  document.getElementById('settingWhatsApp').textContent = CONFIG.store.whatsapp;
  document.getElementById('settingFreeShipping').textContent = formatPrice(CONFIG.shipping.freeShippingThreshold);
  document.getElementById('settingDeliveryFee').textContent = formatPrice(CONFIG.shipping.deliveryFee);
}

// Toast notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-circle',
    warning: 'fa-exclamation-triangle',
    info: 'fa-info-circle'
  };
  
  toast.innerHTML = `
    <i class="fas ${icons[type] || icons.info}"></i>
    <span>${message}</span>
  `;
  
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Helper: Format price
function formatPrice(price) {
  return 'Rs. ' + Number(price).toLocaleString('en-PK');
}
