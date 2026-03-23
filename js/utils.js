/**
 * MAIN UTILITIES
 * Core helper functions used throughout the site
 */

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
  const container = document.getElementById('toastContainer') || document.body;
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
  
  // Animate in
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remove after duration
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
  // Hide page loader
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
      setTimeout(() => loader.style.display = 'none', 500);
    }, 500);
  }

  // Update badges
  updateCartBadge();
  updateWishlistBadge();

  // Mobile hamburger menu
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
  }

  // Sticky header on scroll
  const header = document.getElementById('mainHeader');
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }

      lastScroll = currentScroll;
    });
  }

  // Scroll reveal animations
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealOnScroll = () => {
      reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
  }

  // Initialize announcement marquee
  initMarquee();
});

// Marquee initialization
function initMarquee() {
  const marquee = document.querySelector('.top-bar-marquee span');
  if (marquee && CONFIG.announcements && CONFIG.announcements.length > 0) {
    marquee.textContent = CONFIG.announcements.join(' | ');
  }
}

// Search functionality
function handleSearch(event) {
  event.preventDefault();
  const searchInput = document.getElementById('searchInput');
  const searchCategory = document.getElementById('searchCategory');
  
  if (!searchInput) return;
  
  const query = searchInput.value.trim();
  const category = searchCategory ? searchCategory.value : 'all';
  
  if (!query) {
    showToast('Please enter a search query', 'warning');
    return;
  }
  
  // Redirect to products page with search params
  const url = new URL('products.html', window.location.origin + CONFIG.site.baseURL);
  url.searchParams.set('search', query);
  if (category !== 'all') {
    url.searchParams.set('cat', category);
  }
  
  window.location.href = url.pathname + url.search;
}

// Newsletter subscription
function handleNewsletter(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector('input[type="email"]');
  const email = emailInput.value.trim();
  
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email address', 'error');
    return;
  }
  
  // Save to localStorage (in production, send to Supabase)
  const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
    showToast('Thank you for subscribing! 🎉', 'success');
    emailInput.value = '';
  } else {
    showToast('You are already subscribed!', 'info');
  }
}

// Share product
function shareProduct(productId) {
  const product = getProductById(productId);
  if (!product) return;
  
  const url = `${window.location.origin}${CONFIG.site.baseURL}product-detail.html?id=${productId}`;
  const text = `Check out ${product.name} - ${formatPrice(product.price)}`;
  
  if (navigator.share) {
    navigator.share({
      title: product.name,
      text: text,
      url: url
    }).catch(() => {
      copyToClipboard(url);
    });
  } else {
    copyToClipboard(url);
  }
}

// Copy to clipboard
function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  showToast('Link copied to clipboard!', 'success');
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-PK', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Format time
function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-PK', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Validate email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate phone (Pakistan format)
function isValidPhone(phone) {
  // Accepts: 03xxxxxxxxx, 3xxxxxxxxx, +923xxxxxxxxx
  const cleaned = phone.replace(/[\s-]/g, '');
  const re = /^(\+92|92|0)?3[0-9]{9}$/;
  return re.test(cleaned);
}

// Animate cart add (visual feedback)
function animateCartAdd() {
  const cartIcon = document.querySelector('.header-action-btn i.fa-shopping-cart');
  if (cartIcon) {
    cartIcon.classList.add('bounce');
    setTimeout(() => cartIcon.classList.remove('bounce'), 500);
  }
}

// Loading state for forms
function setFormLoading(form, loading) {
  const submitBtn = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input, select, textarea, button');
  
  if (loading) {
    form.classList.add('loading');
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.textContent;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      submitBtn.disabled = true;
    }
    inputs.forEach(input => input.disabled = true);
  } else {
    form.classList.remove('loading');
    if (submitBtn && submitBtn.dataset.originalText) {
      submitBtn.textContent = submitBtn.dataset.originalText;
      delete submitBtn.dataset.originalText;
      submitBtn.disabled = false;
    }
    inputs.forEach(input => input.disabled = false);
  }
}

// Get URL parameters
function getUrlParameter(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Generate product card HTML
function generateProductCard(product) {
  const discount = getDiscountPercent(product.price, product.originalPrice);
  const badgeHTML = product.badge ? 
    `<span class="badge badge-${product.badge}">${product.badge === 'sale' ? `-${discount}%` : product.badge.toUpperCase()}</span>` 
    : '';
  
  const isWishlisted = isInWishlist(product.id);
  
  return `
    <div class="product-card" data-category="${product.category}" data-id="${product.id}">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy" 
             onclick="window.location.href='product-detail.html?id=${product.id}'" />
        ${badgeHTML ? `<div class="product-badges">${badgeHTML}</div>` : ''}
        <div class="product-actions">
          <button class="product-action-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="toggleWishlist('${product.id}', this)" 
                  title="Wishlist">
            <i class="fa${isWishlisted ? 's' : 'r'} fa-heart"></i>
          </button>
          <button class="product-action-btn" 
                  onclick="shareProduct('${product.id}')" 
                  title="Share">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${CONFIG.categories[product.category]?.label || product.category}</div>
        <h3 class="product-name" onclick="window.location.href='product-detail.html?id=${product.id}'">
          ${product.name}
        </h3>
        <div class="product-rating">
          <div class="stars">${generateStars(product.rating)}</div>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.originalPrice && product.originalPrice > product.price ? 
            `<span class="price-original">${formatPrice(product.originalPrice)}</span>` : ''}
          ${discount > 0 ? `<span class="price-discount">-${discount}%</span>` : ''}
        </div>
        <div class="product-actions-bottom">
          <button class="btn btn-primary" onclick="addToCart('${product.id}')">
            <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button class="btn btn-secondary" onclick="buyNow('${product.id}')">
            <i class="fas fa-bolt"></i> Buy Now
          </button>
        </div>
      </div>
    </div>
  `;
}
