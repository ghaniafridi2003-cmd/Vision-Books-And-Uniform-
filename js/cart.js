/**
 * CART MANAGEMENT
 * Functions for managing shopping cart
 */

// Get cart from localStorage
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem('visionbooks_cart') || '[]');
    return Array.isArray(cart) ? cart : [];
  } catch (e) {
    console.error('Error reading cart:', e);
    return [];
  }
}

// Save cart to localStorage
function saveCart(cart) {
  try {
    localStorage.setItem('visionbooks_cart', JSON.stringify(cart));
    updateCartBadge();
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}

// Add item to cart
function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) {
    showToast('Product not found', 'error');
    return;
  }

  if (product.stock <= 0) {
    showToast('Sorry, this product is out of stock', 'error');
    return;
  }

  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    if (existingItem.qty >= product.stock) {
      showToast('Cannot add more. Stock limit reached', 'error');
      return;
    }
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: 1
    });
  }

  saveCart(cart);
  showToast('Added to cart!', 'success');
  
  // Trigger cart animation
  if (typeof animateCartAdd === 'function') {
    animateCartAdd();
  }
}

// Update item quantity in cart
function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  
  if (!item) return;

  const product = getProductById(productId);
  if (quantity > product.stock) {
    showToast('Stock limit reached', 'error');
    return;
  }

  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  item.qty = quantity;
  saveCart(cart);
  
  // Update cart display if on cart page
  if (typeof renderCartItems === 'function') {
    renderCartItems();
  }
}

// Remove item from cart
function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  
  showToast('Item removed from cart', 'info');
  
  // Update cart display if on cart page
  if (typeof renderCartItems === 'function') {
    renderCartItems();
  }
}

// Clear entire cart
function clearCart() {
  localStorage.removeItem('visionbooks_cart');
  updateCartBadge();
  
  if (typeof renderCartItems === 'function') {
    renderCartItems();
  }
}

// Get cart subtotal
function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

// Get cart total item count
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) {
    const count = getCartItemCount();
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Quick buy function (add to cart and go to checkout)
function buyNow(productId) {
  const product = getProductById(productId);
  if (!product) return;

  if (product.stock <= 0) {
    showToast('Sorry, this product is out of stock', 'error');
    return;
  }

  const cart = getCart();
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    if (existingItem.qty >= product.stock) {
      showToast('Cannot add more. Stock limit reached', 'error');
      return;
    }
    existingItem.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      qty: 1
    });
  }

  saveCart(cart);
  showToast('Redirecting to checkout...', 'success');
  setTimeout(() => {
    window.location.href = 'checkout.html';
  }, 500);
}
