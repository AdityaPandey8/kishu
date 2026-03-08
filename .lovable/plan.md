

# Add Plants from Nurseries to Shop

## Overview
Add a "Plants" category to the Shop with nursery plant products, a new category icon, and a promotional banner.

## Changes

### 1. Edit `src/contexts/DataContext.tsx` — Add nursery plant products
Add 6-8 plant products to `seedProducts` array with category `'Plants'`, sourced from nurseries:
- Tulsi Plant, Money Plant, Aloe Vera, Curry Leaf Plant, Rose Plant, Jasmine Plant, Mango Sapling, Guava Sapling
- Different price ranges (₹99-₹599), high ratings, realistic descriptions mentioning nursery origin

### 2. Edit `src/pages/Shop.tsx` — Add Plants category icon + banner
- Add `Flower2` (or `TreePine`) icon import from lucide-react
- Add `{ name: 'Plants', icon: Flower2, color: 'bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400' }` to `categoryIcons` array
- Add a new banner: `{ id: 5, title: 'Nursery Plants Collection', subtitle: 'Fresh plants delivered to your doorstep', gradient: 'from-pink-600 to-pink-400' }`

## Files

| File | Action |
|------|--------|
| `src/contexts/DataContext.tsx` | Edit — add 6-8 nursery plant products |
| `src/pages/Shop.tsx` | Edit — add Plants category icon + banner |

