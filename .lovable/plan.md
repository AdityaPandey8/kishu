

# Dealer Profile Page + Buyer Detail Page

## Overview
Two things: (1) A dedicated dealer profile page that differs from the farmer profile — showing store info, KYC status, business stats, products, and reviews instead of farm-centric data. (2) A buyer profile page accessible from the Kanban board / customer list showing purchase history, inquiry history, and a communication timeline.

## Changes

### 1. Rewrite `src/pages/Profile.tsx` — Role-aware profile
Make the Profile page render different content based on `user.role`:
- **Farmer**: Keep existing layout (stats, achievements, crops, creator section, activity tabs)
- **Dealer**: New Flipkart-seller-style layout:
  - **Store header**: Business name + verified badge (if KYC approved), "Seller Since" date, KYC status badge
  - **Business Stats row**: Total Products, Total Revenue (₹), Inquiries Resolved, Customer Rating — 4 compact stat cards
  - **Store Details card**: Phone, Email, Location, GST Number (from KYC data), Business Type
  - **My Products** horizontal scroll (top 5 by sales) with images, "Manage All →" button
  - **Performance snapshot**: Mini version of PerformanceScorecard (listing quality, response rate)
  - **Quick Actions**: Order Management, Add Product, Analytics, Settings, Logout
  - No achievements/creator/farm sections for dealers

### 2. Create `src/pages/BuyerProfile.tsx` — Farmer detail page for dealers
A page at `/buyer/:id` showing full buyer info for a specific farmer:
- **Header**: Farmer name, location, phone, crops, farm size — pulled from a farmers lookup in DataContext
- **Stats row**: Total Orders, Total Spent (₹), Inquiries count
- **Tabs**: 
  - **Purchase History**: List of orders from this farmer (filtered from `orders`), showing items, date, amount, status badge
  - **Inquiry History**: List of inquiries from this farmer (filtered from `inquiries`), showing crop, issue, status, date
  - **Timeline**: Combined chronological list of orders + inquiries with icons and timestamps, showing the communication flow
- Back button, "Call" and "Message" action buttons in header

### 3. Update `src/App.tsx` — Add route
- `/buyer/:id` → `BuyerProfile`

### 4. Update `src/pages/dealer/OrderManagement.tsx` — Link buyer names
- Make farmer name in Kanban cards tappable, navigating to `/buyer/{farmerId}`

## Files

| File | Action |
|------|--------|
| `src/pages/Profile.tsx` | Edit — add dealer-specific profile layout |
| `src/pages/BuyerProfile.tsx` | Create — buyer detail page with history tabs |
| `src/App.tsx` | Edit — add `/buyer/:id` route |
| `src/pages/dealer/OrderManagement.tsx` | Edit — link farmer names to buyer profile |

