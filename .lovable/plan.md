

# Comprehensive Admin Dashboard Redesign

## Current State
The admin dashboard is a simple page with hardcoded stats, static pending approvals, and a basic activity feed. The admin bottom nav has: Dashboard, Users, KYC, Experts, Profile. The sub-pages (Users, AdminKYC, AdminExperts) already have functional CRUD via DataContext.

## What's Missing
The dashboard doesn't pull real data from DataContext. There's no visibility into orders, inquiries, products, revenue, or content moderation. Admin has no way to monitor or control what happens on the farmer/dealer side.

## Plan

### 1. Redesign `src/pages/dashboard/AdminDashboard.tsx` — Data-Driven Dashboard
Replace all hardcoded data with real values from `useData()`:

**Live Stats Cards (grid of 6):**
- Total Farmers (from `platformUsers` filtered by role)
- Total Dealers (same)
- Total Products (from `products`)
- Total Orders + Revenue (from `orders`)
- Pending KYC (from `dealerKYCs`)
- Pending Expert Apps (from `expertApplications`)

**Quick Action Cards (navigable):**
- Manage Users → `/users`
- KYC Approvals → `/admin/kyc`
- Expert Approvals → `/admin/experts`
- All Orders → `/admin/orders` (new)
- All Inquiries → `/admin/inquiries` (new)
- Content Moderation → `/admin/content` (new)

**Dashboard Sections:**
- **Pending Approvals Summary**: Show count of pending KYCs + pending experts with quick-approve buttons
- **Revenue Overview**: Total platform revenue from all orders, with a simple bar chart (recharts)
- **Recent Activity Feed**: Derived from `notifications` array (last 10)
- **Order Status Breakdown**: Pie/bar showing pending/confirmed/shipped/delivered counts
- **Low Stock Alerts**: Products with stock < 50 across all dealers
- **Recent Inquiries**: Latest 5 inquiries across the platform

### 2. Create `src/pages/admin/AdminOrders.tsx` — Platform-Wide Order Management
- View all orders across all dealers
- Filter by status, dealer, date range
- View order details (items, buyer, dealer, amount, status)
- Ability to override/cancel orders
- Add route `/admin/orders`

### 3. Create `src/pages/admin/AdminInquiries.tsx` — Platform-Wide Inquiry View
- View all inquiries across all dealers
- Filter by type (stock/delivery/general) and status
- Read-only view with ability to escalate or flag
- Add route `/admin/inquiries`

### 4. Create `src/pages/admin/AdminContent.tsx` — Content Moderation
- View all community posts and reels
- Ability to delete inappropriate posts via existing `deletePost`
- Flag/remove content
- Add route `/admin/content`

### 5. Update `src/components/layout/BottomNav.tsx` — Expand Admin Nav
Update admin nav to include a "More" menu or reorganize:
- Dashboard, Users, KYC, Experts, Profile (keep current, adequate for mobile)
- Add links to Orders/Inquiries/Content from dashboard quick actions instead

### 6. Update `src/App.tsx` — Add New Routes
- `/admin/orders` → AdminOrders
- `/admin/inquiries` → AdminInquiries  
- `/admin/content` → AdminContent

### 7. Update `src/contexts/DataContext.tsx` — Expose admin helpers
- Add `getOrdersByStatus` helper
- Add `getAllOrders` (unfiltered) for admin use
- Expose `orders` directly if not already

## Files

| File | Action |
|------|--------|
| `src/pages/dashboard/AdminDashboard.tsx` | Rewrite — data-driven with real stats, charts, quick actions |
| `src/pages/admin/AdminOrders.tsx` | Create — platform-wide order management |
| `src/pages/admin/AdminInquiries.tsx` | Create — platform-wide inquiry view |
| `src/pages/admin/AdminContent.tsx` | Create — content moderation (posts/reels) |
| `src/App.tsx` | Edit — add 3 new admin routes |
| `src/contexts/DataContext.tsx` | Edit — expose orders array for admin access |

