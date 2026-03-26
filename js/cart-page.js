/**
 * CART PAGE
 * Handles cart display and management
 */

document.addEventListener('DOMContentLoaded', async function() {
  // Update config data
  document.getElementById('storeName').textContent = CONFIG.store.name;
  document.getElementById('storeTagline').textContent = CONFIG.store.tagline;
  document.getElementById('footerCopyright').textContent = CONFIG.store.name;
  document.getElementById('whatsappFloatBtn').href = CONFIG.social.whatsapp;

  // Load products from Supabase
  await loadAllProducts();

  // Render cart
  renderCartItems();
});

// Render cart items
function renderCartItems() {
  const cart = getCart();
  const emptyCart = document.getElementById('emptyCart');
  const cartWithItems = document.getElementById('cartWithItems');
  const cartItemsList = document.getElementById('cartItemsList');

  if (cart.length === 0) {
    emptyCart.style.display = 'block';
    cartWithItems.style.display = 'none';
    return;
  }

  emptyCart.style.display = 'none';
  cartWithItems.style.display = 'block';

  // Render each cart item
  let html = '';
  cart.forEach(item => {
    const product = getProductById(item.id);
    const stock = product ? product.stock : 10;

    html += `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="cart-item-category">${item.category}</p>
          <p class="cart-item-price">${formatPrice(item.price)}</p>
        </div>

        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.qty - 1})" ${item.qty <= 1 ? 'disabled' : ''}>
            <i class="fas fa-minus"></i>
          </button>
          <input type="number" value="${item.qty}" min="1" max="${stock}" 
                 onchange="updateCartQuantity('${item.id}', parseInt(this.value))" 
                 class="qty-input">
          <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.qty + 1})" ${item.qty >= stock ? 'disabled' : ''}>
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <div class="cart-item-total">
          <p class="item-total-price">${formatPrice(item.price * item.qty)}</p>
          <button class="btn-remove" onclick="removeFromCart('${item.id}')">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      </div>
    `;
  });

  cartItemsList.innerHTML = html;

  // Update summary
  updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
  const subtotal = getCartSubtotal();
  const freeShippingThreshold = CONFIG.shipping.freeShippingThreshold;
  const deliveryFee = CONFIG.shipping.deliveryFee;
  const shipping = subtotal >= freeShippingThreshold ? 0 : deliveryFee;
  const total = subtotal + shipping;

  document.getElementById('summarySubtotal').textContent = formatPrice(subtotal);
  document.getElementById('summaryShipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  document.getElementById('summaryTotal').textContent = formatPrice(total);

  // Update shipping message
  const shippingMessage = document.getElementById('shippingMessage');
  const shippingThresholdEl = document.getElementById('shippingThreshold');
  
  if (subtotal >= freeShippingThreshold) {
    shippingMessage.innerHTML = '<i class="fas fa-check-circle"></i> You qualify for FREE delivery!';
    shippingMessage.style.color = 'var(--success)';
  } else {
    const remaining = freeShippingThreshold - subtotal;
    shippingThresholdEl.textContent = formatPrice(remaining).replace('Rs. ', '');
    shippingMessage.innerHTML = `Add Rs. <strong>${remaining.toLocaleString()}</strong> more for FREE delivery!`;
    shippingMessage.style.color = 'var(--warning)';
  }
}
