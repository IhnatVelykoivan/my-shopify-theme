#!/bin/bash

# Create deployment package for Shopify theme
# This script creates a clean ZIP file ready for Shopify upload

echo "🚀 Creating Shopify theme deployment package..."

# Create temporary directory
mkdir -p shopify-theme-deploy
cd shopify-theme-deploy

# Copy essential theme files
echo "📂 Copying theme files..."
cp -r ../assets .
cp -r ../config .
cp -r ../layout .
cp -r ../locales .
cp -r ../sections .
cp -r ../snippets .
cp -r ../templates .

# Copy documentation
cp ../README.md .

echo "🗑️  Excluding demo files..."
# Note: index.html and demo-images are excluded automatically

echo "📦 Creating ZIP package..."
zip -r ../shopify-theme-deploy.zip . -x "*.DS_Store" "*/.DS_Store"

cd ..
rm -rf shopify-theme-deploy

echo "✅ Deployment package created: shopify-theme-deploy.zip"
echo ""
echo "📋 Next steps:"
echo "1. Go to Shopify Admin > Online Store > Themes"
echo "2. Click 'Upload theme'"
echo "3. Select shopify-theme-deploy.zip"
echo "4. Wait for upload to complete"
echo "5. Preview and publish when ready"