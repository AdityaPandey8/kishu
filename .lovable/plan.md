

# Kanban Order Management + Seller Onboarding Checklist + Buyer Details

## Overview
Three features: (1) A Flipkart-style Kanban board page for dealers to drag/move inquiries across status columns, (2) A seller onboarding checklist with progress bar on the dashboard, and (3) Buyer detail cards visible within inquiry cards and the Kanban board.

## Changes

### 1. Create `src/pages/dealer/OrderManagement.tsx` — Kanban Board Page
- 3-column Kanban layout: **Pending** (amber), **In Progress** (blue), **Resolved** (green)
- Each column shows inquiry cards with: farmer name, crop, issue summary, location, time ago, urgency badge
- **Buyer Details section** on each card: farmer name, phone, location, crops, total inquiries count
- Action buttons on cards: "Respond" (moves pending → in progress), "Resolve" (moves in progress → resolved), "Call"
- Tap-to-move between columns (no drag-drop needed — simpler, works on mobile)
- Header with back button, title "Order Management", and count badges per column
- Uses existing `useData()` inquiries and `updateInquiryStatus()`

### 2. Create `src/components/dealer/SellerOnboardingChecklist.tsx`
- Circular progress ring showing overall completion %
- Checklist items with check/uncheck states:
  - Complete KYC (check `user.kycStatus === 'approved'`)
  - Add business logo/avatar (check `user.avatar`)
  - Add first product (check `dealerProducts.length > 0`)
  - Respond to first inquiry (check resolved/responded count > 0)
  - Add bank details (check KYC bank details)
  - Add 5+ products (check `dealerProducts.length >= 5`)
- Each item: icon, label, status badge (done/pending), action button navigating to relevant page
- Progress bar at top showing X/6 completed

### 3. Update `src/pages/dashboard/DealerDashboard.tsx`
- Add `SellerOnboardingChecklist` component between the Action Banner and Order Lifecycle sections
- Only show if completion < 100%

### 4. Add route in `src/App.tsx`
- `/dealer/orders` → `OrderManagement` page

### 5. Update `src/pages/dashboard/DealerDashboard.tsx` — Link to Kanban
- Make OrderLifecycleCards navigate to `/dealer/orders` instead of `/inquiries`

## Files

| File | Action |
|------|--------|
| `src/pages/dealer/OrderManagement.tsx` | Create — Kanban board with buyer details |
| `src/components/dealer/SellerOnboardingChecklist.tsx` | Create — progress checklist |
| `src/pages/dashboard/DealerDashboard.tsx` | Edit — add checklist, update nav links |
| `src/App.tsx` | Edit — add `/dealer/orders` route |

