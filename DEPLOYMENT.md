# Git and Shopify Deployment Instructions

## 1. Initialize Git Repository

```bash
cd my-shopify-theme
git init
git add .
git commit -m "Initial commit: Shopify theme with product gallery"
```

## 2. Push to GitHub

```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 3. Deploy to Shopify

### Method 1: Shopify CLI
```bash
# Install Shopify CLI
npm install -g @shopify/cli @shopify/theme

# Login to Shopify
shopify auth login

# Deploy to development theme
shopify theme dev --store=your-store.myshopify.com

# Push to live theme
shopify theme push --store=your-store.myshopify.com
```

### Method 2: ZIP Upload
1. Remove demo files: `index.html`, `demo-images/`
2. Create ZIP of remaining files
3. Go to Shopify Admin > Online Store > Themes
4. Click "Upload theme" and select ZIP file

### Method 3: GitHub Integration
1. Push code to GitHub
2. In Shopify Admin, connect GitHub repository
3. Select branch and deploy

## 4. Theme Configuration

After deployment:
1. Go to Shopify Admin > Online Store > Themes
2. Click "Customize" on your theme
3. Configure gallery settings in theme editor
4. Publish when ready

## File Structure for Deployment

**Include in deployment:**
- `assets/` - All CSS/JS files
- `config/` - Theme configuration  
- `layout/` - Theme layout files
- `locales/` - Language files
- `sections/` - Theme sections
- `snippets/` - Reusable components
- `templates/` - Page templates

**Exclude from deployment:**
- `index.html` - Demo page only
- `demo-images/` - Demo assets only
- `.vscode/` - Editor settings
- `README.md` - Documentation (optional)