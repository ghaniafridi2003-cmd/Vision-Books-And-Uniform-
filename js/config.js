/**
 * SITE CONFIGURATION
 * Central configuration file for Visionbooks & Uniform
 * Edit these values to customize your store
 */

const CONFIG = {
  // Store Information
  store: {
    name: 'Visionbooks & Uniform',
    tagline: 'Books · Stationery · Gifts · Uniforms',
    description: 'Pakistan\'s trusted online store for books, stationery, gifts and uniforms. Quality products at affordable prices with fast delivery across Pakistan.',
    phone: '0334-3427666',
    whatsapp: '923343427666', // No + or spaces
    email: 'info@vision.pk',
    address: 'Shop #12, Board Bazar, Peshawar, Pakistan',
    hours: {
      weekdays: 'Mon–Sat: 9am – 8pm',
      weekend: 'Sunday: 11am – 6pm'
    }
  },

  // Shipping & Delivery
  shipping: {
    freeShippingThreshold: 2000, // Free shipping above this amount (Rs)
    deliveryFee: 200, // Standard delivery fee (Rs)
    estimatedDays: '2-5' // Estimated delivery time
  },

  // Payment Methods (only COD and WhatsApp)
  payment: {
    cod: {
      enabled: true,
      label: 'Cash on Delivery',
      description: 'Pay when you receive your order'
    },
    whatsapp: {
      enabled: true,
      label: 'WhatsApp Order',
      description: 'Confirm order via WhatsApp'
    }
  },

  // Social Media Links
  social: {
    facebook: '#',
    instagram: '#',
    twitter: '#',
    youtube: '#',
    whatsapp: 'https://wa.me/923343427666?text=Hello!%20I%20want%20to%20inquire%20about%20your%20products.'
  },

  // Categories & Subcategories
  categories: {
    books: {
      label: 'Books',
      icon: 'fa-book',
      subcategories: {
        school: 'School Books',
        college: 'College Books',
        university: 'University Books',
        guides: 'Study Guides',
        novels: 'Novels',
        urdu: 'Urdu Literature',
        poetry: 'Poetry',
        children: 'Children\'s Books',
        selfhelp: 'Self Help',
        religion: 'Islamic Books',
        business: 'Business',
        history: 'History'
      }
    },
    stationery: {
      label: 'Stationery',
      icon: 'fa-pen',
      subcategories: {
        pens: 'Pens & Pencils',
        notebooks: 'Notebooks & Diaries',
        art: 'Art Supplies',
        office: 'Office Supplies',
        bags: 'Bags & Backpacks',
        geometry: 'Geometry & Math',
        craft: 'Craft Supplies'
      }
    },
    gifts: {
      label: 'Gifts',
      icon: 'fa-gift',
      subcategories: {
        cards: 'Greeting Cards',
        wrapping: 'Gift Wrapping',
        personalized: 'Personalized Gifts',
        corporate: 'Corporate Gifts',
        toys: 'Educational Toys'
      }
    },
    uniforms: {
      label: 'Uniforms',
      icon: 'fa-graduation-cap',
      subcategories: {
        boys: 'Boys Uniforms',
        girls: 'Girls Uniforms',
        pe: 'PE Kit',
        shoes: 'Shoes',
        accessories: 'Accessories',
        ties: 'Ties & Belts'
      }
    }
  },

  // Schools (for uniform customization)
  schools: [
    'Pak-Turk International School',
    'Beaconhouse School System',
    'The City School',
    'Roots Millennium Schools',
    'Aitchison College',
    'Army Public School',
    'Convent of Jesus & Mary',
    'Other'
  ],

  // Site Settings
  site: {
    baseURL: '/vision-shop/', // GitHub Pages base URL
    productsPerPage: 12,
    enableReviews: true,
    enableWishlist: true,
    enableQuickView: true,
    showBestSellers: true,
    showNewArrivals: true
  },

  // Announcements (top bar marquee)
  announcements: [
    '🎉 BACK TO SCHOOL SALE – Up to 40% OFF on all school supplies!',
    'New arrivals every week',
    'Bulk orders welcome'
  ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
