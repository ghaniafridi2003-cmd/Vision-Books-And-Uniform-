/**
 * PRODUCTS DATA
 * Product catalog for Visionbooks & Uniform
 * This file contains sample products. In production, fetch from Supabase.
 */

const SAMPLE_PRODUCTS = [
  // BOOKS
  {
    id: 'BK001',
    name: 'Oxford English Grammar – Class 9',
    category: 'books',
    subcategory: 'school',
    price: 450,
    originalPrice: 550,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&q=80',
    description: 'Complete English grammar guide for 9th grade students with exercises and practice tests.',
    rating: 4.5,
    reviews: 42,
    badge: 'sale',
    featured: true,
    isNew: false,
    tags: ['school', 'english', 'grammar', '9th grade']
  },
  {
    id: 'BK002',
    name: 'Pakistan Studies – Matric',
    category: 'books',
    subcategory: 'school',
    price: 380,
    originalPrice: null,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&q=80',
    description: 'Comprehensive Pakistan Studies textbook for matriculation level with maps and illustrations.',
    rating: 4.3,
    reviews: 28,
    badge: null,
    featured: true,
    isNew: false,
    tags: ['school', 'pakistan studies', 'matric']
  },
  {
    id: 'BK003',
    name: 'The Alchemist by Paulo Coelho',
    category: 'books',
    subcategory: 'novels',
    price: 650,
    originalPrice: 850,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=500&q=80',
    description: 'International bestseller about a young Andalusian shepherd who travels to Egypt in search of his dream.',
    rating: 4.8,
    reviews: 156,
    badge: 'sale',
    featured: true,
    isNew: false,
    tags: ['fiction', 'bestseller', 'paulo coelho']
  },
  {
    id: 'BK004',
    name: 'Atomic Habits by James Clear',
    category: 'books',
    subcategory: 'selfhelp',
    price: 1200,
    originalPrice: 1500,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    description: 'Proven framework for improving every day with tiny changes that transform your habits.',
    rating: 4.9,
    reviews: 203,
    badge: 'hot',
    featured: true,
    isNew: true,
    tags: ['self-help', 'productivity', 'habits']
  },
  {
    id: 'BK005',
    name: 'Quran with Urdu Translation',
    category: 'books',
    subcategory: 'religion',
    price: 800,
    originalPrice: null,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=500&q=80',
    description: 'Holy Quran with authentic Urdu translation and tafseer. Large print for easy reading.',
    rating: 5.0,
    reviews: 89,
    badge: null,
    featured: true,
    isNew: false,
    tags: ['islamic', 'quran', 'urdu', 'religion']
  },

  // STATIONERY
  {
    id: 'ST001',
    name: 'Dollar Classic Ball Pen (Blue) – Pack of 10',
    category: 'stationery',
    subcategory: 'pens',
    price: 150,
    originalPrice: 200,
    stock: 100,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&q=80',
    description: 'Smooth writing ball pens perfect for students and professionals. Pack of 10 blue pens.',
    rating: 4.4,
    reviews: 67,
    badge: 'sale',
    featured: true,
    isNew: false,
    tags: ['pens', 'dollar', 'stationery', 'school']
  },
  {
    id: 'ST002',
    name: 'A4 Spiral Notebook – 200 Pages',
    category: 'stationery',
    subcategory: 'notebooks',
    price: 220,
    originalPrice: null,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=500&q=80',
    description: 'High-quality A4 spiral notebook with 200 ruled pages. Durable cover and strong binding.',
    rating: 4.6,
    reviews: 54,
    badge: null,
    featured: true,
    isNew: false,
    tags: ['notebook', 'stationery', 'school', 'office']
  },
  {
    id: 'ST003',
    name: 'Faber-Castell Art Set – 48 Pieces',
    category: 'stationery',
    subcategory: 'art',
    price: 2500,
    originalPrice: 3200,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&q=80',
    description: 'Professional art set including colored pencils, watercolors, brushes, and sketch pencils.',
    rating: 4.9,
    reviews: 38,
    badge: 'sale',
    featured: true,
    isNew: true,
    tags: ['art', 'faber-castell', 'drawing', 'painting']
  },
  {
    id: 'ST004',
    name: 'School Backpack – Waterproof',
    category: 'stationery',
    subcategory: 'bags',
    price: 1800,
    originalPrice: 2200,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    description: 'Durable waterproof backpack with multiple compartments, laptop sleeve, and padded straps.',
    rating: 4.7,
    reviews: 91,
    badge: 'sale',
    featured: true,
    isNew: false,
    tags: ['backpack', 'bag', 'school', 'waterproof']
  },
  {
    id: 'ST005',
    name: 'Geometry Set – Compass & Rulers',
    category: 'stationery',
    subcategory: 'geometry',
    price: 280,
    originalPrice: null,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=500&q=80',
    description: 'Complete geometry set with compass, protractor, set squares, ruler, and pencil in metal box.',
    rating: 4.5,
    reviews: 45,
    badge: null,
    featured: false,
    isNew: false,
    tags: ['geometry', 'compass', 'math', 'school']
  },

  // GIFTS
  {
    id: 'GF001',
    name: 'Birthday Card Set – Assorted Designs (10 Pack)',
    category: 'gifts',
    subcategory: 'cards',
    price: 400,
    originalPrice: null,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1607344645866-009c7b779f4b?w=500&q=80',
    description: 'Beautiful birthday greeting cards with envelopes. Assorted designs suitable for all ages.',
    rating: 4.3,
    reviews: 22,
    badge: null,
    featured: false,
    isNew: false,
    tags: ['greeting cards', 'birthday', 'gifts']
  },
  {
    id: 'GF002',
    name: 'Gift Wrapping Paper Roll – Premium',
    category: 'gifts',
    subcategory: 'wrapping',
    price: 250,
    originalPrice: 350,
    stock: 42,
    image: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&q=80',
    description: 'Premium quality gift wrapping paper roll with elegant patterns. 5 meters long.',
    rating: 4.4,
    reviews: 18,
    badge: 'sale',
    featured: false,
    isNew: false,
    tags: ['gift wrap', 'wrapping paper', 'gifts']
  },
  {
    id: 'GF003',
    name: 'Personalized Notebook – Custom Name',
    category: 'gifts',
    subcategory: 'personalized',
    price: 550,
    originalPrice: null,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&q=80',
    description: 'Custom notebook with name embossing. Perfect gift for students and professionals.',
    rating: 4.8,
    reviews: 56,
    badge: 'hot',
    featured: true,
    isNew: true,
    tags: ['personalized', 'custom', 'notebook', 'gifts']
  },

  // UNIFORMS
  {
    id: 'UF001',
    name: 'Boys School Shirt – White (Sizes 24-40)',
    category: 'uniforms',
    subcategory: 'boys',
    price: 650,
    originalPrice: 800,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=500&q=80',
    description: 'Premium quality white school shirt for boys. Soft fabric, durable stitching. Sizes 24 to 40.',
    rating: 4.6,
    reviews: 73,
    badge: 'sale',
    featured: true,
    isNew: false,
    tags: ['uniform', 'shirt', 'boys', 'school']
  },
  {
    id: 'UF002',
    name: 'Girls School Tunic – Navy Blue',
    category: 'uniforms',
    subcategory: 'girls',
    price: 1200,
    originalPrice: 1500,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&q=80',
    description: 'Navy blue school tunic for girls. Quality fabric with neat stitching. Multiple sizes available.',
    rating: 4.7,
    reviews: 61,
    badge: 'sale',
    featured: true,
    isNew: false,
    tags: ['uniform', 'tunic', 'girls', 'school']
  },
  {
    id: 'UF003',
    name: 'PE Kit – Complete Set (Shirt + Shorts)',
    category: 'uniforms',
    subcategory: 'pe',
    price: 950,
    originalPrice: null,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80',
    description: 'Complete PE kit with breathable fabric. Includes sports shirt and shorts. Unisex.',
    rating: 4.5,
    reviews: 34,
    badge: null,
    featured: false,
    isNew: false,
    tags: ['pe kit', 'sports', 'uniform', 'school']
  },
  {
    id: 'UF004',
    name: 'School Black Shoes – Patent Leather',
    category: 'uniforms',
    subcategory: 'shoes',
    price: 1600,
    originalPrice: 2000,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80',
    description: 'Black patent leather school shoes. Comfortable fit, durable sole. Sizes 1-10.',
    rating: 4.4,
    reviews: 48,
    badge: 'sale',
    featured: false,
    isNew: false,
    tags: ['shoes', 'uniform', 'school', 'leather']
  },
  {
    id: 'UF005',
    name: 'School Tie – Striped (Various Colors)',
    category: 'uniforms',
    subcategory: 'ties',
    price: 180,
    originalPrice: 250,
    stock: 65,
    image: 'https://images.unsplash.com/photo-1578281407972-ac63e2f25e78?w=500&q=80',
    description: 'Striped school tie available in various school colors. Pre-tied for convenience.',
    rating: 4.3,
    reviews: 29,
    badge: 'sale',
    featured: false,
    isNew: false,
    tags: ['tie', 'uniform', 'school', 'accessories']
  }
];

// Global cache for products
let globalProducts = [];

// Functions to get products
async function loadAllProducts() {
  try {
    // Try to fetch from Supabase first
    const supabaseProducts = await fetchProductsFromSupabase();
    if (supabaseProducts && supabaseProducts.length > 0) {
      globalProducts = supabaseProducts;
      return globalProducts;
    }
  } catch (error) {
    console.warn('Supabase fetch failed, using local products:', error);
  }
  
  // Fallback to sample products if Supabase fails or is empty
  globalProducts = SAMPLE_PRODUCTS;
  return globalProducts;
}

function getAllProducts() {
  // Return cached products if available, otherwise fallback to sample
  return globalProducts.length > 0 ? globalProducts : SAMPLE_PRODUCTS;
}

function getProductById(id) {
  return getAllProducts().find(p => String(p.id) === String(id));
}

function getProductsByCategory(category) {
  return getAllProducts().filter(p => p.category === category);
}

function getProductsBySubcategory(category, subcategory) {
  return getAllProducts().filter(p => p.category === category && p.subcategory === subcategory);
}

function getFeaturedProducts() {
  return getAllProducts().filter(p => p.featured);
}

function getNewArrivals() {
  return getAllProducts().filter(p => p.isNew);
}

function getSaleProducts() {
  return getAllProducts().filter(p => p.originalPrice && p.originalPrice > p.price);
}

function searchProducts(query) {
  const q = query.toLowerCase();
  return getAllProducts().filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
  );
}

// Helper Functions
function getDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

function formatPrice(price) {
  return 'Rs. ' + Number(price).toLocaleString('en-PK');
}

function generateStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<i class="fas fa-star"></i>';
    } else if (i - 0.5 <= rating) {
      html += '<i class="fas fa-star-half-alt"></i>';
    } else {
      html += '<i class="far fa-star"></i>';
    }
  }
  return html;
}
