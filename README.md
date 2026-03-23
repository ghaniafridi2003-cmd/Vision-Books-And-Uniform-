# Visionbooks & Uniform - E-Commerce Website

A modern, professional e-commerce website for books, stationery, gifts, and school uniforms. Built with clean HTML/CSS/JavaScript and optimized for GitHub Pages deployment.

## 🌟 Features

### Core Functionality
- **Product Catalog**: 18+ sample products across 4 categories (Books, Stationery, Gifts, Uniforms)
- **Smart Filtering**: Filter by category, price range, rating, and special offers
- **Product Search**: Full-text search across products
- **Shopping Cart**: Add, update, remove items with real-time calculations
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop

### Checkout & Payment
- **Cash on Delivery (COD)**: Primary payment method
- **WhatsApp Confirmation**: Orders confirmed via WhatsApp for trust and transparency
- **Customer Info Collection**: Name, email, phone, address
- **Order Tracking**: Unique order IDs for every purchase
- **Free Shipping**: On orders above Rs. 2,000

### Design & UX
- **Warm Bookshop Aesthetic**: Professional color palette (navy blue, warm copper, cream backgrounds)
- **Premium Typography**: Playfair Display + Poppins
- **Smooth Animations**: Scroll reveals, hover effects, transitions
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **SEO Optimized**: Meta tags, structured data, clean URLs

## 📁 Project Structure

```
visionbooks-refactored/
├── index.html                 # Homepage
├── products.html              # Product listing page
├── cart.html                  # Shopping cart
├── checkout.html              # Checkout page
├── wishlist.html              # Wishlist page
├── order-confirmation.html    # Order success page
├── robots.txt                 # SEO robots file
│
├── css/
│   ├── style.css             # Main stylesheet (4,200+ lines)
│   ├── products.css          # Products page styles
│   ├── cart.css              # Cart page styles
│   └── checkout.css          # Checkout page styles
│
├── js/
│   ├── config.js             # Site configuration (EDIT THIS!)
│   ├── products.js           # Product data & functions
│   ├── cart.js               # Cart management
│   ├── wishlist.js           # Wishlist management
│   ├── utils.js              # Helper functions
│   ├── checkout.js           # Checkout logic
│   ├── products-page.js      # Products page logic
│   └── cart-page.js          # Cart page logic
│
└── README.md                 # This file
```

## 🚀 Quick Start

### 1. Configure Your Store

Edit `js/config.js` to customize your store:

```javascript
const CONFIG = {
  store: {
    name: 'Your Store Name',
    phone: '03XX-XXXXXXX',
    whatsapp: '92XXXXXXXXXXX',  // No + or spaces
    email: 'your@email.com',
    address: 'Your Store Address',
  },
  shipping: {
    freeShippingThreshold: 2000,  // Free shipping amount
    deliveryFee: 200,             // Delivery charges
  },
  // ... more settings
};
```

### 2. Add Your Products

Edit `js/products.js` to add/modify products:

```javascript
const SAMPLE_PRODUCTS = [
  {
    id: 'UNIQUE_ID',
    name: 'Product Name',
    category: 'books',        // books, stationery, gifts, uniforms
    subcategory: 'school',
    price: 500,
    originalPrice: 700,       // For sale badge
    stock: 20,
    image: 'https://...',
    description: '...',
    rating: 4.5,
    reviews: 42,
    badge: 'sale',            // sale, new, hot, or null
    featured: true,
    isNew: false,
  },
  // ... more products
];
```

### 3. Deploy to GitHub Pages

1. **Create a GitHub repository**
2. **Upload all files** to the repository
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from branch
   - Branch: main
   - Folder: / (root)
4. **Update base URL** in each HTML file:
   ```html
   <base href="/your-repo-name/">
   ```
   Replace `/vision-shop/` with `/your-repo-name/`

5. **Your site will be live at**:
   `https://yourusername.github.io/your-repo-name/`

## 🎨 Customization

### Colors

Edit CSS variables in `css/style.css`:

```css
:root {
  --primary: #1a3c5e;      /* Main brand color */
  --accent: #d4893f;       /* Accent color */
  --cream: #faf7f2;        /* Background */
  /* ... more colors */
}
```

### Categories

Add/remove categories in `js/config.js`:

```javascript
categories: {
  your_category: {
    label: 'Your Category',
    icon: 'fa-icon-name',
    subcategories: {
      sub1: 'Subcategory 1',
      sub2: 'Subcategory 2',
    }
  }
}
```

### Schools (for Uniforms)

Edit the schools list in `js/config.js`:

```javascript
schools: [
  'School Name 1',
  'School Name 2',
  'Other'
]
```

## 💳 Payment Setup

Currently supports:
- **Cash on Delivery (COD)**
- **WhatsApp Order Confirmation**

### WhatsApp Integration

Orders are automatically formatted and sent to your WhatsApp number. Make sure to:
1. Set correct WhatsApp number in `config.js` (format: `923XXXXXXXXX`)
2. Keep your WhatsApp Business app active
3. Respond to customer orders promptly

### Future Payment Methods

To add JazzCash, EasyPaisa, or bank transfers:
1. Update `config.js` payment methods
2. Modify `js/checkout.js` to handle payment gateways
3. Add payment gateway API integration

## 🗄️ Optional: Supabase Integration

For persistent data storage (products, orders, customers):

1. **Create Supabase Project**: https://supabase.com
2. **Create Tables**:
   - `products` (id, name, category, price, image, etc.)
   - `orders` (order_id, customer_name, items, total, status, etc.)
   - `customers` (email, name, phone, etc.)

3. **Add Supabase Client**:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
   ```

4. **Initialize in your JS**:
   ```javascript
   const supabaseClient = supabase.createClient(
     'YOUR_PROJECT_URL',
     'YOUR_ANON_KEY'
   );
   ```

5. **Fetch Products from Supabase**:
   Modify `getAllProducts()` in `js/products.js` to fetch from database

## 📱 Social Media

Update social media links in `js/config.js`:

```javascript
social: {
  facebook: 'https://facebook.com/yourpage',
  instagram: 'https://instagram.com/yourpage',
  whatsapp: 'https://wa.me/923XXXXXXXXX',
  // ... etc
}
```

## 🔍 SEO Optimization

1. **Update Meta Tags** in each HTML file:
   ```html
   <meta name="description" content="Your store description">
   <meta name="keywords" content="books, stationery, gifts">
   ```

2. **Add Google Analytics** (optional):
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
   ```

3. **Submit Sitemap** to Google Search Console

## 🐛 Troubleshooting

### Products not showing?
- Check `js/products.js` - ensure products array is valid
- Open browser console (F12) for JavaScript errors

### Cart not working?
- Ensure `localStorage` is enabled in browser
- Check browser console for errors

### Checkout failing?
- Verify all form fields are filled correctly
- Check WhatsApp number format in config (no + or spaces)

### Styling issues?
- Clear browser cache (Ctrl + F5)
- Check CSS files are loading (Network tab in DevTools)

## 📊 Analytics & Metrics

Track these metrics:
- Cart abandonment rate
- Average order value
- Popular products
- Traffic sources
- Conversion rate

Add Google Analytics or similar tracking for insights.

## 🛡️ Security Best Practices

1. **Never commit sensitive data** (API keys, passwords)
2. **Use environment variables** for sensitive config
3. **Validate all user inputs** server-side (if using backend)
4. **Use HTTPS** (GitHub Pages provides this automatically)
5. **Regularly update dependencies**

## 🤝 Support

For issues or questions:
- Email: info@vision.pk
- Phone: 0334-3427666
- WhatsApp: +92-334-3427666

## 📄 License

This project is open source. Feel free to customize for your store.

## 🎯 Roadmap

Future improvements:
- [ ] Admin panel for product management
- [ ] Customer accounts and order history
- [ ] Email notifications
- [ ] SMS order confirmations
- [ ] Advanced search with filters
- [ ] Product reviews system
- [ ] Discount codes and coupons
- [ ] Multiple payment gateways
- [ ] Inventory management
- [ ] Sales analytics dashboard

---

**Built with ❤️ for Pakistani e-commerce**

Version: 1.0.0
Last Updated: March 2026
