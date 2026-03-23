/**
 * CHECKOUT
 * Handles checkout process with COD and WhatsApp confirmation
 */

// Initialize checkout page
function initializeCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    showEmptyCheckout();
    return;
  }

  renderOrderSummary(cart);
  updateCartBadge();
  
  // Pre-fill form if user data exists
  prefillCustomerInfo();
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

// Build WhatsApp message
function buildWhatsAppMessage(order) {
  const itemsList = order.items.map((item, i) => 
    `${i + 1}. ${item.name} × ${item.qty} — ${formatPrice(item.price * item.qty)}`
  ).join('\n  ');

  const shippingText = order.summary.shipping === 0 ? 'FREE' : formatPrice(order.summary.shipping);

  return `🛒 *NEW ORDER — ${CONFIG.store.name}*
━━━━━━━━━━━━━━━━━━━━
📋 *Order ID:* ${order.id}
📅 *Date:* ${formatDate(order.timestamp)} ${formatTime(order.timestamp)}

👤 *Customer Details*
  Name: ${order.customerInfo.fullName}
  Phone: ${order.customerInfo.phone}
  Email: ${order.customerInfo.email}
  Address: ${order.customerInfo.address}
  City: ${order.customerInfo.city}
${order.customerInfo.postalCode ? `  Postal: ${order.customerInfo.postalCode}` : ''}

🛍️ *Items Ordered*
  ${itemsList}

💰 *Order Summary*
  Subtotal: ${formatPrice(order.summary.subtotal)}
  Shipping: ${shippingText}
  *TOTAL: ${formatPrice(order.summary.total)}*

💳 *Payment:* Cash on Delivery (COD)
${order.notes ? `\n📝 *Notes:* ${order.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━`;
}

// Show WhatsApp confirmation overlay
function showWhatsAppConfirmation(order) {
  const message = buildWhatsAppMessage(order);
  const waURL = `https://wa.me/${CONFIG.store.whatsapp}?text=${encodeURIComponent(message)}`;

  // Remove existing overlay
  const existing = document.getElementById('waConfirmOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'waConfirmOverlay';
  overlay.innerHTML = `
    <div class="wa-confirm-modal">
      <div class="wa-confirm-icon">
        <i class="fab fa-whatsapp"></i>
      </div>
      <h2>One Last Step!</h2>
      <p>Your order details are ready. Send them to us on WhatsApp to confirm your order.</p>
      <div class="wa-order-info">
        <div><strong>Order ID:</strong> ${order.id}</div>
        <div><strong>Total:</strong> ${formatPrice(order.summary.total)}</div>
      </div>
      <a href="${waURL}" target="_blank" class="btn btn-whatsapp" id="waOpenBtn">
        <i class="fab fa-whatsapp"></i> Open WhatsApp & Send Order
      </a>
      <p class="wa-instruction">After sending the message, click below to complete your order.</p>
      <button onclick="confirmWhatsAppSent('${order.id}')" class="btn btn-primary btn-block">
        ✅ I Sent the Message — Confirm Order
      </button>
      <button onclick="retryWhatsApp('${encodeURIComponent(waURL)}')" class="btn btn-link">
        WhatsApp didn't open? Try again
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  // Auto-open WhatsApp
  setTimeout(() => {
    window.open(waURL, '_blank');
  }, 500);
}

// Retry WhatsApp
function retryWhatsApp(encodedURL) {
  window.open(decodeURIComponent(encodedURL), '_blank');
}

// Confirm WhatsApp sent
function confirmWhatsAppSent(orderId) {
  const overlay = document.getElementById('waConfirmOverlay');
  if (overlay) overlay.remove();
  
  clearCart();
  showToast('Order confirmed! 🎉', 'success', 4000);
  
  setTimeout(() => {
    window.location.href = `order-confirmation.html?orderId=${encodeURIComponent(orderId)}`;
  }, 500);
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
      if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient) {
        saveOrderToSupabase(order).catch(err => {
          console.warn('Supabase save failed, order saved locally', err);
        });
      }

      setFormLoading(form, false);
      showToast('Order placed! Please confirm via WhatsApp.', 'success');
      showWhatsAppConfirmation(order);
      
    } catch (error) {
      console.error('Checkout error:', error);
      setFormLoading(form, false);
      showToast('Something went wrong. Please try again.', 'error');
    }
  }, 800);
}

// Save order to Supabase (if available)
async function saveOrderToSupabase(order) {
  if (!window.supabaseClient) return null;

  try {
    const { data, error } = await window.supabaseClient
      .from('orders')
      .insert([{
        order_id: order.id,
        customer_name: order.customerInfo.fullName,
        customer_email: order.customerInfo.email,
        customer_phone: order.customerInfo.phone,
        customer_address: order.customerInfo.address,
        customer_city: order.customerInfo.city,
        items: order.items,
        subtotal: order.summary.subtotal,
        shipping: order.summary.shipping,
        total: order.summary.total,
        payment_method: order.paymentMethod,
        notes: order.notes,
        status: order.status,
        created_at: order.timestamp
      }])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Supabase error:', error);
    throw error;
  }
}

// Get order by ID
function getOrderById(orderId) {
  const orders = JSON.parse(localStorage.getItem('visionbooks_orders') || '[]');
  return orders.find(order => order.id === orderId);
}

// Initialize on page load
if (document.getElementById('checkoutForm')) {
  document.addEventListener('DOMContentLoaded', initializeCheckout);
}
