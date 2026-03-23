/**
 * WISHLIST MANAGEMENT
 * Functions for managing wishlist
 */

// Get wishlist from localStorage
function getWishlist() {
  try {
    const wishlist = JSON.parse(localStorage.getItem('visionbooks_wishlist') || '[]');
    return Array.isArray(wishlist) ? wishlist : [];
  } catch (e) {
    console.error('Error reading wishlist:', e);
    return [];
  }
}

// Save wishlist to localStorage
function saveWishlist(wishlist) {
  try {
    localStorage.setItem('visionbooks_wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
  } catch (e) {
    console.error('Error saving wishlist:', e);
  }
}

// Toggle product in wishlist
function toggleWishlist(productId, buttonElement) {
  const wishlist = getWishlist();
  const index = wishlist.indexOf(productId);

  if (index > -1) {
    // Remove from wishlist
    wishlist.splice(index, 1);
    showToast('Removed from wishlist', 'info');
    if (buttonElement) {
      buttonElement.classList.remove('active');
      buttonElement.innerHTML = '<i class="far fa-heart"></i>';
    }
  } else {
    // Add to wishlist
    wishlist.push(productId);
    showToast('Added to wishlist!', 'success');
    if (buttonElement) {
      buttonElement.classList.add('active');
      buttonElement.innerHTML = '<i class="fas fa-heart"></i>';
    }
  }

  saveWishlist(wishlist);
}

// Check if product is in wishlist
function isInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}

// Get wishlist products
function getWishlistProducts() {
  const wishlist = getWishlist();
  return wishlist.map(id => getProductById(id)).filter(p => p !== undefined);
}

// Clear wishlist
function clearWishlist() {
  localStorage.removeItem('visionbooks_wishlist');
  updateWishlistBadge();
}

// Update wishlist badge
function updateWishlistBadge() {
  const badge = document.getElementById('wishlistBadge');
  if (badge) {
    const count = getWishlist().length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// Move all wishlist items to cart
function moveWishlistToCart() {
  const wishlistProducts = getWishlistProducts();
  
  if (wishlistProducts.length === 0) {
    showToast('Your wishlist is empty', 'info');
    return;
  }

  let addedCount = 0;
  wishlistProducts.forEach(product => {
    if (product.stock > 0) {
      addToCart(product.id);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    clearWishlist();
    showToast(`${addedCount} items moved to cart!`, 'success');
    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 1000);
  }
}
