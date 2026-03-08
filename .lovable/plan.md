

# Redesign Dealer Dashboard — Flipkart Seller Hub Style

## Overview
Redesign the dealer dashboard to match Flipkart's Seller Hub patterns: a clean white header with store info and verification badge, a prominent **blue action banner** with CTAs, **order-centric stats row** (pending, shipped, delivered, returns), a **revenue summary card** with period selector, **performance scorecard** with health indicators, and a **task/to-do section** for pending actions.

## Key Flipkart Seller Dashboard Patterns to Replicate

```text
┌─────────────────────────────────────────┐
│  Store Name ✓  │  Notification  Settings│  ← Verified badge
├─────────────────────────────────────────┤
│  🔵 Action Banner (Add Listings / Go)   │  ← Blue CTA banner
├─────────────────────────────────────────┤
│  Orders Overview (tabs: Today/Week/Month)│
│  [Pending] [Shipped] [Delivered] [Return]│  ← Order lifecycle cards
├─────────────────────────────────────────┤
│  Revenue Summary        ₹XX,XXX         │
│  ▓▓▓▓▓▓▓░░░  Chart     +18% ↑          │  ← Mini area chart
├─────────────────────────────────────────┤
│  Seller Performance Scorecard           │
│  [Listing Quality] [Delivery] [Returns] │  ← Circular progress rings
├─────────────────────────────────────────┤
│  Pending Tasks (3)                      │
│  • Update bank details                  │
│  • Respond to 2 inquiries               │  ← Actionable checklist
├─────────────────────────────────────────┤
│  Top Products  │  Inventory Alerts       │
│  (horizontal)  │  (low stock cards)      │
├─────────────────────────────────────────┤
│  Growth Tips / Announcements Banner      │
└─────────────────────────────────────────┘
```

## Changes

### 1. Rewrite `src/pages/dashboard/DealerDashboard.tsx`
Complete redesign with Flipkart-style sections:

- **Header**: Store name + verified badge (green check), "Seller Since" date, notification + settings icons (keep existing)
- **Action Banner**: Blue gradient card — "Grow your business! Add more listings to reach more farmers" with CTA button
- **Order/Inquiry Lifecycle Row**: 4 horizontal scrollable cards showing pipeline stages: Pending → In Progress → Resolved → Total — each tappable, with counts
- **Revenue Card**: White card with period toggle (Today/Week/Month/Year), large ₹ figure, mini sparkline area chart, and % change badge
- **Performance Scorecard**: New component — 3 circular progress indicators for "Listing Quality", "Response Rate", "Customer Rating" with scores out of 100
- **Pending Tasks**: Checklist-style card with actionable items (respond to inquiries, update stock, complete KYC) — each with a "Do Now →" button
- **Top Products**: Keep existing horizontal list but add product images
- **Inventory Alerts**: Keep existing component
- **Growth Tips Banner**: Bottom card with Flipkart-blue gradient — rotating tips like "Add 5 more products to increase visibility by 30%"

### 2. Create `src/components/dealer/PerformanceScorecard.tsx`
New component with 3 circular progress rings (using SVG circles):
- Listing Quality (based on products with images/descriptions)
- Response Rate (resolved/total inquiries %)
- Customer Rating (average product rating)
Each ring has a color (green/amber/red based on score) and label beneath.

### 3. Create `src/components/dealer/PendingTasks.tsx`
Checklist-style component:
- Dynamically generates tasks based on data (e.g., "Respond to X pending inquiries", "Restock Y low-stock items")
- Each task has icon, description, priority badge, and action button
- Completed tasks show strikethrough

### 4. Create `src/components/dealer/OrderLifecycleCards.tsx`
Horizontal row of 4 status cards showing inquiry pipeline:
- Pending (amber), In Progress (blue), Resolved (green), Total (gray)
- Each card: count + label + icon, tappable to navigate to filtered inquiries page

### 5. Update `src/components/dealer/StatsCard.tsx`
Refine to be more compact — Flipkart uses smaller, denser stat cards with thin left-colored border accent instead of icon boxes.

### 6. Create `src/components/dealer/GrowthTipsBanner.tsx`
Bottom promotional banner with tips, rotating every 5 seconds using `useState` + `setInterval`.

## Files

| File | Action |
|------|--------|
| `src/pages/dashboard/DealerDashboard.tsx` | Rewrite — Flipkart-style layout |
| `src/components/dealer/PerformanceScorecard.tsx` | Create — circular progress rings |
| `src/components/dealer/PendingTasks.tsx` | Create — actionable task checklist |
| `src/components/dealer/OrderLifecycleCards.tsx` | Create — inquiry pipeline cards |
| `src/components/dealer/GrowthTipsBanner.tsx` | Create — rotating tips banner |
| `src/components/dealer/StatsCard.tsx` | Edit — compact Flipkart-style variant |

