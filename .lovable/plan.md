

# Product Image Upload + Per-Product Revenue & Order Tracking

## Overview
Three enhancements: (1) Add image upload to the Add/Edit Product form, (2) Calculate and display per-product revenue from actual orders, (3) Show complete order and buyer details per product.

## Changes

### 1. Update `src/pages/Products.tsx` — Add Image Upload to Form
- Add `image` field to `formData` state (base64 string)
- Add file input with image preview in the dialog form (before description)
- Read file as base64 data URL (limit ~500KB), show thumbnail preview
- Pass `image` to `addProduct()` and `updateProduct()`
- Pre-fill image when editing
- Show product image in the product list cards instead of the generic Package icon
- Update `resetForm` to clear image

### 2. Update `src/pages/Products.tsx` — Per-Product Revenue Stats
- Pull `orders` from `useData()` (already available via `getOrdersByDealer`)
- For each dealer product, compute:
  - `unitsSold`: sum of quantity from all delivered/shipped order items matching productId
  - `revenue`: sum of (quantity × price) from matching order items
- Display revenue (₹) and units sold on each product card
- Replace the existing `product.sales` display with real order-based data
- Update the stats section: show "Total Revenue" calculated from orders, not just stock × price

### 3. Update `src/pages/Products.tsx` — Product Detail with Order & Buyer Tracking
- Add a product detail dialog/expandable view when tapping a product card
- Show: product image, name, category, price, stock, description
- **Orders tab**: List all orders containing this product — show order ID, buyer name (from customers/orders), date, quantity, amount, status badge
- **Buyer list**: Unique buyers who purchased this product — name, location, total quantity bought, total spent
- Pull buyer info from `orders` (farmerId) cross-referenced with `customers` array

### 4. Minor update to `src/contexts/DataContext.tsx`
- Add `farmerName` to `Order` interface (for display without cross-referencing)
- Add `farmerName` to seed orders

## Files

| File | Action |
|------|--------|
| `src/pages/Products.tsx` | Edit — image upload, per-product revenue, product detail view |
| `src/contexts/DataContext.tsx` | Edit — add `farmerName` to Order interface + seed data |

