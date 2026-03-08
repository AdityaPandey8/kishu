

# Redesign Shop Feature — Flipkart-Style UI

## Overview
Redesign the Shop page, Product Detail page, and Cart page to match Flipkart's mobile app experience: promotional banners carousel, category icons grid, deal sections, product cards with discount badges, image carousel on detail page, pincode delivery check, similar products section, and a streamlined cart with coupon input.

## Changes

### 1. Rewrite `src/pages/Shop.tsx` — Flipkart Home-Style Layout
- **Top bar**: Search input (full width, Flipkart blue style) + Cart icon with badge + notification bell
- **Promotional banner carousel** (auto-sliding): 3-4 hardcoded deal banners (e.g., "Kharif Season Sale", "Organic Week", "Fertilizer Deals") using `embla-carousel-react` (already installed)
- **Category icons grid**: Circular icons in a 2-row scrollable grid — Fertilizer, Seeds, Pesticide, Organic, Equipment, Fungicide, Insecticide, Tools — each navigates to filtered view
- **Deal of the Day section**: Horizontal scroll of top-rated products with countdown timer, discount percentage badges
- **"Trending Now" section**: Products sorted by sales, shown as horizontal cards
- **Full product grid below**: 2-column grid with Flipkart-style cards:
  - Product image area with discount % badge (top-left) and wishlist heart (top-right)
  - Product name (2-line clamp), rating stars with count, price with MRP strikethrough, "Free Delivery" tag, dealer name
- **Sticky bottom**: Currently active filters summary bar (if any filter applied)

### 2. Rewrite `src/pages/ProductDetail.tsx` — Flipkart Product Page
- **Image section**: Large product image with dot indicators (simulated multi-image with single placeholder)
- **Share & Wishlist icons** top-right overlay
- **Price section**: Discount %, sale price (large green), MRP strikethrough, "inclusive of all taxes"
- **Offers section**: Green tags showing "Bank Offer", "Partner Offer" (hardcoded mock offers)
- **Delivery check**: Pincode input → "Enter pincode for delivery date" with check button, shows estimated delivery "Delivery by Mon, Mar 15"
- **Highlights section**: Bullet points from product description
- **Seller info card**: Dealer name, rating, location
- **Rating & Reviews section**: Star distribution bar chart, existing rating/review count
- **Similar Products**: Horizontal scroll of products in same category
- **Sticky bottom bar**: "Add to Cart" + "Buy Now" buttons (Flipkart yellow + orange style)

### 3. Rewrite `src/pages/Cart.tsx` — Flipkart Cart Experience
- **Top**: Step indicator (Cart → Address → Payment)
- **Coupon/offer banner**: "Apply Coupon" expandable section with input
- **Cart items**: Each with product image, name, seller, quantity dropdown (instead of +/- buttons), price, remove + "Save for Later" links
- **Price details card** at bottom: Price breakdown (MRP total, discount, delivery charge, total), savings highlight in green
- **Sticky bottom**: Total amount + "Place Order" button

### 4. Add Wishlist Support to `src/contexts/DataContext.tsx`
- Add `wishlist: string[]` (product IDs) to localStorage
- Add methods: `toggleWishlist(productId)`, `isWishlisted(productId)`, `getWishlistProducts()`

### 5. Add `src/pages/Wishlist.tsx` — Wishlist Page
- Simple grid of wishlisted products with "Move to Cart" and "Remove" options
- Route: `/wishlist`

### 6. Update `src/App.tsx`
- Add `/wishlist` route

## Files Summary

| File | Action |
|------|--------|
| `src/pages/Shop.tsx` | Rewrite — Flipkart home layout with banners, categories, deals |
| `src/pages/ProductDetail.tsx` | Rewrite — Flipkart product detail with offers, delivery check, similar products |
| `src/pages/Cart.tsx` | Rewrite — Flipkart cart with coupon, price breakdown, step indicator |
| `src/contexts/DataContext.tsx` | Edit — add wishlist state + methods |
| `src/pages/Wishlist.tsx` | Create — wishlist page |
| `src/App.tsx` | Edit — add wishlist route |

