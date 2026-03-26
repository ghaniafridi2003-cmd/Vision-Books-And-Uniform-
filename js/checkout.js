/**
 * CHECKOUT
 * Handles checkout process with COD and WhatsApp confirmation
 */

// Initialize checkout page
async function initializeCheckout() {
  // Load products from Supabase into cache
  await loadAllProducts();

  const cart = getCart();
  const checkoutLayout = document.getElementById('checkoutLayout');
  const emptyCheckout = document.getElementById('emptyCheckout');

  if (cart.length === 0) {
    if (checkoutLayout) checkoutLayout.style.display = 'none';
    if (emptyCheckout) emptyCheckout.style.display = 'block';
    return;
  }

  // Show checkout layout and hide empty message
  if (checkoutLayout) checkoutLayout.style.display = 'grid'; // Grid because it uses a grid layout
  if (emptyCheckout) emptyCheckout.style.display = 'none';

  renderOrderSummary(cart);
  updateCartBadge();
  
  // Pre-fill form if user data exists
  prefillCustomerInfo();

  // Set estimated delivery date
  const deliveryEstimate = document.getElementById('deliveryEstimate');
  if (deliveryEstimate) {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 4); // ~4 days
    deliveryEstimate.textContent = formatDate(futureDate);
  }
}

// Show empty checkout message
function showEmptyCheckout() {
  const checkoutLayout = document.getElementById('checkoutLayout');
  const emptyCheckout = document.getElementById('emptyCheckout');
  
  if (checkoutLayout) checkoutLayout.style.display = 'none';
  if (emptyCheckout) emptyCheckout.style.display = 'block';
}

// Prefill customer info from previous orders or localStorage
function prefillCustomerInfo() {
  const savedInfo = JSON.parse(localStorage.getItem('customer_info') || '{}');
  
  if (Object.keys(savedInfo).length > 0) {
    const fields = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode'];
    fields.forEach(field => {
      const input = document.getElementById(field);
      if (input && savedInfo[field]) {
        input.value = savedInfo[field];
      }
    });
  }
}

// Render order summary
function renderOrderSummary(cart) {
  const summaryItems = document.getElementById('summaryItems');
  const subtotal = getCartSubtotal();
  const shipping = subtotal >= CONFIG.shipping.freeShippingThreshold ? 0 : CONFIG.shipping.deliveryFee;
  const total = subtotal + shipping;

  if (!summaryItems) return;

  // Render cart items
  let itemsHTML = cart.map(item => `
    <div class="summary-item">
      <img src="${item.image}" alt="${item.name}" />
      <div class="summary-item-details">
        <h4>${item.name}</h4>
        <span>Qty: ${item.qty}</span>
      </div>
      <div class="summary-item-price">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  summaryItems.innerHTML = itemsHTML;

  // Update summary totals
  const elements = {
    summarySubtotal: subtotal,
    summaryShipping: shipping === 0 ? 'FREE' : shipping,
    summaryTotal: total
  };

  Object.keys(elements).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = typeof elements[id] === 'number' ? formatPrice(elements[id]) : elements[id];
    }
  });
}

// Validate checkout form
function validateCheckoutForm() {
  const fullName = document.getElementById('fullName')?.value.trim();
  const email = document.getElementById('email')?.value.trim();
  const phone = document.getElementById('phone')?.value.trim();
  const address = document.getElementById('address')?.value.trim();
  const city = document.getElementById('city')?.value;

  if (!fullName || fullName.length < 3) {
    showToast('Please enter your full name', 'error');
    return false;
  }

  if (!email || !isValidEmail(email)) {
    showToast('Please enter a valid email address', 'error');
    return false;
  }

  if (!phone || !isValidPhone(phone)) {
    showToast('Please enter a valid Pakistani phone number', 'error');
    return false;
  }

  if (!address || address.length < 10) {
    showToast('Please enter a complete delivery address', 'error');
    return false;
  }

  if (!city) {
    showToast('Please select your city', 'error');
    return false;
  }

  return true;
}

// Generate unique order ID
function generateOrderId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `VB-${timestamp}-${random}`;
}

// Get order details from form
function getOrderDetails() {
  const cart = getCart();
  const subtotal = getCartSubtotal();
  const shipping = subtotal >= CONFIG.shipping.freeShippingThreshold ? 0 : CONFIG.shipping.deliveryFee;
  const total = subtotal + shipping;

  const customerInfo = {
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    address: document.getElementById('address').value.trim(),
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode')?.value.trim() || ''
  };

  // Save customer info for future use
  localStorage.setItem('customer_info', JSON.stringify(customerInfo));

  return {
    id: generateOrderId(),
    timestamp: new Date().toISOString(),
    customerInfo: customerInfo,
    items: cart,
    summary: {
      subtotal: subtotal,
      shipping: shipping,
      discount: 0,
      total: total
    },
    paymentMethod: 'cod',
    notes: document.getElementById('notes')?.value.trim() || '',
    status: 'pending'
  };
}

// Save order to localStorage
function saveOrder(order) {
  let orders = JSON.parse(localStorage.getItem('visionbooks_orders') || '[]');
  orders.unshift(order);
  // Keep only last 50 orders
  if (orders.length > 50) {
    orders = orders.slice(0, 50);
  }
  localStorage.setItem('visionbooks_orders', JSON.stringify(orders));
}


// Submit checkout
async function submitCheckout(event) {
  event.preventDefault();

  if (!validateCheckoutForm()) return;

  const form = document.getElementById('checkoutForm');
  if (!form) return;

  setFormLoading(form, true);

  // Simulate processing time
  setTimeout(() => {
    try {
      const order = getOrderDetails();
      
      // Save order locally
      saveOrder(order);

      // If Supabase is available, save there too
      if (typeof createOrderInSupabase === 'function') {
        createOrderInSupabase(order).catch(err => {
          console.warn('Supabase save failed, order saved locally', err);
        });
      }

      // Clear cart
      clearCart();

      setFormLoading(form, false);
      showToast('Order placed successfully!', 'success');
      
      // Redirect directly to confirmation page
      setTimeout(() => {
        window.location.href = `order-confirmation.html?orderId=${order.id}`;
      }, 500);
      
    } catch (error) {
      console.error('Checkout error:', error);
      if (form) setFormLoading(form, false);
      showToast('Something went wrong. Please try again.', 'error');
    }
  }, 1000);
}

// Internal helper (kept for safety, but primary is in supabase-client.js)
async function saveOrderToSupabase(order) {
  if (typeof createOrderInSupabase === 'function') {
    return createOrderInSupabase(order);
  }
  return null;
}

// Get order by ID
function getOrderById(orderId) {
  const orders = JSON.parse(localStorage.getItem('visionbooks_orders') || '[]');
  return orders.find(order => order.id === orderId);
}

// Initialize on page load
if (document.getElementById('checkoutForm')) {
  document.addEventListener('DOMContentLoaded', async () => {
    await initializeCheckout();
  });
}
