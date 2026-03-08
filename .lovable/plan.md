

# Add Nursery Section + Product Images to Shop

## Overview
Add a dedicated "From the Nursery" horizontal section with featured plants and seasonal tags, and replace all placeholder Package icons with real product images using Unsplash URLs mapped by category.

## Changes

### 1. Edit `src/contexts/DataContext.tsx` — Add image URLs to all products
Add `image` field (already in Product interface) to every product in `seedProducts`:
- **Fertilizer**: bags of fertilizer images
- **Fungicide**: pesticide bottle/spray images  
- **Organic**: organic farming/compost images
- **Insecticide**: spray bottle images
- **Seeds**: seed packet images
- **Equipment**: farm tool images
- **Plants**: individual plant photos (tulsi, money plant, aloe vera, rose, jasmine, mango, guava, curry leaf)

Use high-quality Unsplash URLs with `w=400` parameter for performance.

### 2. Edit `src/pages/Shop.tsx` — Add Nursery section + use product images

**Nursery Section** (between Trending Now and All Products):
- Header: "🌿 From the Nursery" with "View All" link (filters to Plants category)
- Seasonal recommendation banner: "Spring Picks — Best time to plant fruit saplings!"
- Horizontal scroll of Plants-category products with:
  - Product image (not placeholder)
  - Nursery name (dealer), plant name, price
  - "Nursery Fresh" badge on cards
  - Wishlist heart button

**Product Images everywhere**:
- Replace `<Package>` placeholder icon with `<img>` tag using `product.image` in:
  - Deal of the Day cards
  - Trending Now cards
  - Main product grid
  - Nursery section cards
- Fallback to Package icon if no image

### 3. Add seasonal recommendations data
Hardcoded seasonal tips array displayed in the Nursery section:
- "Spring Picks — Plant fruit saplings now"
- "Monsoon Ready — Hardy indoor plants"
- "Summer Essentials — Heat-resistant varieties"

## Files

| File | Action |
|------|--------|
| `src/contexts/DataContext.tsx` | Edit — add image URLs to all seedProducts |
| `src/pages/Shop.tsx` | Edit — add Nursery section, replace Package placeholders with product images |

