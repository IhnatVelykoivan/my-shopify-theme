# Shopify Theme: Product Gallery with Color Filtering

Professional Shopify theme featuring Swiper.js gallery with instant color variant switching.

## Features

- 🎨 **Color Filtering**: Instant product variant switching without page reload
- 🖼️ **Responsive Gallery**: Swiper-based image carousel with navigation
- 📱 **Mobile Optimized**: Touch-friendly controls and responsive design
- ⚡ **Performance**: Lazy loading and optimized image delivery
- 🛍️ **Shopify Ready**: Complete theme structure with schema configuration

## Demo

View `index.html` for live demo with sample products.

```bash
python3 -m http.server 8000
# Open http://localhost:8000
```

## Shopify Deployment

### Option 1: Shopify CLI (Recommended)
```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Deploy to development theme
shopify theme dev

# Deploy to live theme
shopify theme push
```

### Option 2: ZIP Upload
1. Create ZIP of all theme files (exclude demo files)
2. Upload via Shopify Admin > Themes > Upload theme

### Option 3: Git Integration
1. Push to GitHub repository
2. Connect to Shopify via Git integration

## Theme Structure

```
├── assets/           # CSS, JS, images
├── config/           # Theme settings
├── layout/           # Theme layout files  
├── locales/          # Translation files
├── sections/         # Theme sections
├── snippets/         # Reusable components
├── templates/        # Page templates
├── index.html        # Demo page (remove for production)
└── demo-images/      # Demo assets (remove for production)
```

## Customization

Configure gallery via `config/settings_schema.json`:
- Gallery behavior settings
- Color variant options  
- Responsive breakpoints
- Navigation controls

## Browser Support

- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Mobile Safari, Chrome Mobile
- IE11+ (with polyfills)