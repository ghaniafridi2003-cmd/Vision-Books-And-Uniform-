/**
 * PRODUCTS PAGE
 * Handles product filtering, sorting, and display
 */

let currentProducts = [];
let filteredProducts = [];

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
  // Update page with config data
  document.getElementById('storeName').textContent = CONFIG.store.name;
  document.getElementById('storeTagline').textContent = CONFIG.store.tagline;
  document.getElementById('topBarPhone').textContent = CONFIG.store.phone;
  document.getElementById('footerStoreName').textContent = CONFIG.store.name;
  document.getElementById('footerStoreTagline').textContent = CONFIG.store.tagline;
  document.getElementById('footerDescription').textContent = CONFIG.store.description;
  document.getElementById('footerPhone').textContent = CONFIG.store.phone;
  document.getElementById('footerEmail').textContent = CONFIG.store.email;
  document.getElementById('footerCopyright').textContent = CONFIG.store.name;
  document.getElementById('announcementMarquee').textContent = CONFIG.announcements.join(' | ');
  document.getElementById('whatsappFloatBtn').href = CONFIG.social.whatsapp;

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('cat');
  const subcategory = urlParams.get('sub');
  const search = urlParams.get('search');
  const sale = urlParams.get('sale');
  const isNew = urlParams.get('new');

  // Set page title and description
  updatePageTitle(category, subcategory, search, sale, isNew);

  // Load initial products
  loadProducts(category, subcategory, search, sale, isNew);

  // Build category filters
  buildCategoryFilters();

  // Set up sort listener
  document.getElementById('sortSelect').addEventListener('change', function() {
    sortProducts(this.value);
  });

  // Mobile filter toggle
  document.getElementById('filterToggle').addEventListener('click', function() {
    document.getElementById('filtersSidebar').classList.toggle('active');
  });

  // Close filters when clicking outside on mobile
  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('filtersSidebar');
    const toggle = document.getElementById('filterToggle');
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('active');
    }
  });
});

// Update page title based on filters
function updatePageTitle(category, subcategory, search, sale, isNew) {
  const titleEl = document.getElementById('pageTitle');
  const descEl = document.getElementById('pageDescription');

  if (search) {
    titleEl.textContent = `Search Results for "${search}"`;
    descEl.textContent = 'Products matching your search';
  } else if (sale) {
    titleEl.textContent = 'Sale Products';
    descEl.textContent = 'Amazing deals and discounts';
  } else if (isNew) {
    titleEl.textContent = 'New Arrivals';
    descEl.textContent = 'Latest products just added';
  } else if (category && subcategory) {
    const catConfig = CONFIG.categories[category];
    titleEl.textContent = catConfig?.subcategories[subcategory] || 'Products';
    descEl.textContent = `Browse our ${catConfig?.label.toLowerCase() || 'products'} collection`;
  } else if (category) {
    const catConfig = CONFIG.categories[category];
    titleEl.textContent = catConfig?.label || 'Products';
    descEl.textContent = `Browse our ${catConfig?.label.toLowerCase() || 'products'} collection`;
  } else {
    titleEl.textContent = 'All Products';
    descEl.textContent = 'Browse our complete collection';
  }
}

// Load products based on filters
async function loadProducts(category, subcategory, search, sale, isNew) {
  try {
    // Load from Supabase first
    let products = await loadAllProducts();

    // Apply initial filters from URL
    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
      document.getElementById('searchInput').value = search;
    } else if (sale) {
      products = products.filter(p => p.originalPrice && p.originalPrice > p.price);
    } else if (isNew) {
      products = products.filter(p => p.isNew);
    } else if (category && subcategory) {
      products = products.filter(p => p.category === category && p.subcategory === subcategory);
    } else if (category) {
      products = products.filter(p => p.category === category);
    }

    currentProducts = products;
    filteredProducts = products;
    renderProducts(filteredProducts);
  } catch (error) {
    console.error('Error loading products:', error);
    showToast('Error loading products', 'error');
  }
}

// Build category filter checkboxes
function buildCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  const categories = Object.keys(CONFIG.categories);

  let html = '';
  categories.forEach(cat => {
    const config = CONFIG.categories[cat];
    html += `
      <label class="filter-checkbox">
        <input type="checkbox" name="category" value="${cat}" onchange="applyFilters()">
        <span>${config.label}</span>
      </label>
    `;
  });

  container.innerHTML = html;
}

// Apply all selected filters
function applyFilters() {
  let products = [...currentProducts];

  // Category filter
  const categoryChecks = Array.from(document.querySelectorAll('input[name="category"]:checked'));
  if (categoryChecks.length > 0) {
    const selectedCats = categoryChecks.map(cb => cb.value);
    products = products.filter(p => selectedCats.includes(p.category));
  }

  // Price filter
  const priceChecks = Array.from(document.querySelectorAll('input[name="price"]:checked'));
  if (priceChecks.length > 0) {
    products = products.filter(p => {
      return priceChecks.some(cb => {
        const [min, max] = cb.value.split('-').map(Number);
        return p.price >= min && p.price <= max;
      });
    });
  }

  // Badge filter
  const badgeChecks = Array.from(document.querySelectorAll('input[name="badge"]:checked'));
  if (badgeChecks.length > 0) {
    products = products.filter(p => {
      return badgeChecks.some(cb => {
        const badge = cb.value;
        if (badge === 'sale') return p.originalPrice && p.originalPrice > p.price;
        if (badge === 'new') return p.isNew;
        if (badge === 'hot') return p.badge === 'hot';
        return false;
      });
    });
  }

  // Rating filter
  const ratingChecks = Array.from(document.querySelectorAll('input[name="rating"]:checked'));
  if (ratingChecks.length > 0) {
    const minRating = Math.min(...ratingChecks.map(cb => Number(cb.value)));
    products = products.filter(p => p.rating >= minRating);
  }

  filteredProducts = products;
  renderProducts(filteredProducts);
}

// Clear all filters
function clearFilters() {
  // Uncheck all checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
  
  // Reset to current products
  filteredProducts = [...currentProducts];
  renderProducts(filteredProducts);
  
  // Reset sort
  document.getElementById('sortSelect').value = 'featured';
  
  showToast('Filters cleared', 'info');
}

// Sort products
function sortProducts(sortBy) {
  let sorted = [...filteredProducts];

  switch(sortBy) {
    case 'price-low':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      sorted.sort((a, b) => b.rating - a.rating);
      break;
    default: // featured
      sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  filteredProducts = sorted;
  renderProducts(filteredProducts);
}

// Render products to grid
function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');

  if (products.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    resultsCount.textContent = '0';
  } else {
    grid.style.display = 'grid';
    noResults.style.display = 'none';
    resultsCount.textContent = products.length;
    
    grid.innerHTML = products.map(p => generateProductCard(p)).join('');
  }
}
