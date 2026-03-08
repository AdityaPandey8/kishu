

# Enhanced "Recommended for You" — Dedicated Page with Location/Season Controls

## Overview
Replace the current inline AppSuggests card on the dashboard with a simple navigable card that links to a new full-page `/crop-recommendations` route. On this page, users can set location and season, get AI-powered crop suggestions, expand each crop for detailed planting guide + care instructions, and buy required tools/pesticides/products from the shop. Also remove the CropGuide widget from the dashboard.

## Changes

### 1. Simplify `src/components/home/AppSuggests.tsx` → Navigation Card
- Replace the full inline crop listing with a simple card containing:
  - Title "Recommended for You" with Sprout icon
  - Subtitle about season/location-based suggestions
  - A "View Recommendations" button that navigates to `/crop-recommendations`

### 2. Create `src/pages/CropRecommendations.tsx` — Full Page
- **Header**: Back button + "Crop Recommendations" title
- **Location & Season Controls** (top section):
  - Location input — pre-filled from `localStorage('kishu_user_city')`, editable text input
  - Season selector — dropdown/chips for Kharif, Rabi, Zaid, auto-detected by default
  - "Get Suggestions" button that calls the existing `crop-suggestions` edge function
- **Results Section**: List of suggested crops, each as an expandable card showing:
  - Crop name (English + local), difficulty badge, best months
  - Description
  - **On expand**: Full planting guide (step-by-step), care instructions, and a "What You Need" section with tool/pesticide/product badges linking to `/shop?search=...`
- **Loading/Error states**: Skeleton loaders and error card
- Reuse the existing `crop-suggestions` Supabase edge function (already returns all needed data)
- Cache results in localStorage keyed by location+season+date

### 3. Update `src/pages/dashboard/FarmerDashboard.tsx`
- Remove `CropGuide` import and `<CropGuide />` JSX
- Keep simplified `AppSuggests` (now just a navigation card)

### 4. Delete `src/components/home/CropGuide.tsx`

### 5. Add route in `src/App.tsx`
- `/crop-recommendations` → `CropRecommendations` page

### 6. Update Edge Function Prompt (optional enhancement)
- Extend the `crop-suggestions` edge function prompt to also request "care tips after planting" for each crop, and add a `careTips` field to the tool schema

## Files
- **Create**: `src/pages/CropRecommendations.tsx`
- **Edit**: `src/components/home/AppSuggests.tsx`, `src/pages/dashboard/FarmerDashboard.tsx`, `src/App.tsx`, `supabase/functions/crop-suggestions/index.ts`
- **Delete**: `src/components/home/CropGuide.tsx`

