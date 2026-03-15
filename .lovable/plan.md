

# Multi-Feature Implementation Plan

## Overview
Six distinct features: (1) Enhanced Reels with back button and Instagram-like UX, (2) Service Provider auth + dashboard, (3) Admin controls for service providers, (4) User detail view from admin, (5) Content preview in AdminContent, (6) Dark mode + language on Home page.

---

## 1. Enhanced Reels Page (`src/pages/Reels.tsx`)

Rewrite to be a standalone full-screen shorts experience:
- Add **back button** (ArrowLeft) top-left to navigate back
- Vertical swipe navigation between reels (already exists but improve)
- Autoplay current reel, pause others
- Add **progress bar** at top showing video progress
- Add **comments bottom sheet** (Sheet component) with comment list + input
- Improve double-tap heart animation
- Keep existing like, save, share, mute functionality

## 2. Service Provider Role + Auth

### Update `src/contexts/AuthContext.tsx`
- Add `'service_provider'` to `UserRole` type
- Add demo account: `provider@kishu.com` with role `service_provider` and `providerStatus: 'pending' | 'approved' | 'rejected'`
- Add `providerStatus` field to `User` interface

### Create auth pages
- `src/pages/auth/ProviderLogin.tsx` — Login page with provider branding (teal theme)
- `src/pages/auth/ProviderSignup.tsx` — Signup form with fields: name, email, phone, business name, service category, experience, description, location
- Add provider option to `src/pages/auth/AuthLanding.tsx`

### Create `src/pages/dashboard/ProviderDashboard.tsx`
- Stats: Total bookings, Active bookings, Revenue, Rating
- Incoming booking requests (from `serviceBookings` filtered by providerId)
- Accept/reject/update booking status
- My Services list with add/edit/delete
- Profile section with provider details

### Create `src/pages/provider/ProviderPending.tsx`
- Status page shown when `providerStatus === 'pending'` (similar to KYCPending)

### Create `src/pages/provider/ProviderRejected.tsx`
- Rejection status page

### Update `src/pages/Index.tsx`
- Add `case 'service_provider'` to route to ProviderDashboard (with pending/rejected gates)

### Update `src/components/layout/BottomNav.tsx`
- Add provider nav items: Dashboard, My Services, Bookings, Profile

## 3. Service Provider Admin Management

### Update `src/contexts/DataContext.tsx`
- Add `ServiceProvider` interface with: id, userId, name, email, phone, businessName, category, experience, description, location, status ('pending'|'approved'|'rejected'), appliedAt, reviewedAt
- Add `serviceProviders` array with seed data
- Add `approveProvider`, `rejectProvider`, `getProviderById` functions
- Add `'service_provider'` to `PlatformUser` role type

### Create `src/pages/admin/AdminServiceProviders.tsx`
- List all service providers with status filters
- Approve/reject pending applications
- View provider details + their services + bookings
- Add route `/admin/service-providers`

### Create `src/pages/admin/AdminServices.tsx`
- View all agri services across platform
- Monitor all service bookings
- Override booking status
- Add route `/admin/services`

### Update `src/pages/dashboard/AdminDashboard.tsx`
- Add service providers count to stats
- Add "Service Providers" and "Services" to quick actions

## 4. User Detail View from Admin

### Create `src/pages/admin/UserDetail.tsx`
- Route: `/admin/users/:id`
- Show full user profile: name, email, phone, role, status, location, join date
- Role-specific details:
  - **Farmer**: crops, farm size, orders placed, bookings
  - **Dealer**: KYC status, products, orders received, revenue
  - **Service Provider**: services offered, bookings, rating, approval status
  - **Expert**: specialization, application status, consultations
- Action buttons: suspend/activate, change role

### Update `src/pages/Users.tsx`
- Make each user card clickable → navigate to `/admin/users/:id`
- Add `'service_provider'` to role filters

## 5. Content Preview in AdminContent

### Update `src/pages/admin/AdminContent.tsx`
- Add "View" button alongside "Delete" for each post/reel
- For posts: expand to show full content, image (if imageUrl exists), video player (if videoUrl), all comments
- For reels: show embedded video player with play/pause, full caption, all comments
- Use a Dialog/Sheet component to show content preview

## 6. Dark Mode + Language on Home Page

### Update `src/pages/Home.tsx`
- Add a top bar/navbar with:
  - Dark mode toggle (Moon/Sun icon) using `useSettings().toggleDarkMode`
  - Language dropdown (Globe icon) using `i18n.changeLanguage` — same language list as Header component
- Position in hero section or as a sticky top bar

---

## Routes to Add (`src/App.tsx`)

| Route | Component |
|-------|-----------|
| `/auth/provider/login` | ProviderLogin |
| `/auth/provider/signup` | ProviderSignup |
| `/provider/pending` | ProviderPending |
| `/provider/rejected` | ProviderRejected |
| `/admin/service-providers` | AdminServiceProviders |
| `/admin/services` | AdminServices |
| `/admin/users/:id` | UserDetail |

## Files Summary

| File | Action |
|------|--------|
| `src/pages/Reels.tsx` | Rewrite — back button, comments sheet, progress bar |
| `src/contexts/AuthContext.tsx` | Edit — add service_provider role |
| `src/contexts/DataContext.tsx` | Edit — add ServiceProvider type, provider CRUD, seed data |
| `src/pages/auth/AuthLanding.tsx` | Edit — add provider login option |
| `src/pages/auth/ProviderLogin.tsx` | Create |
| `src/pages/auth/ProviderSignup.tsx` | Create |
| `src/pages/dashboard/ProviderDashboard.tsx` | Create |
| `src/pages/provider/ProviderPending.tsx` | Create |
| `src/pages/provider/ProviderRejected.tsx` | Create |
| `src/pages/admin/AdminServiceProviders.tsx` | Create |
| `src/pages/admin/AdminServices.tsx` | Create |
| `src/pages/admin/UserDetail.tsx` | Create |
| `src/pages/Index.tsx` | Edit — add provider routing |
| `src/pages/Users.tsx` | Edit — clickable users, add provider role |
| `src/pages/admin/AdminContent.tsx` | Edit — add content preview |
| `src/pages/dashboard/AdminDashboard.tsx` | Edit — add provider stats |
| `src/components/layout/BottomNav.tsx` | Edit — add provider nav |
| `src/pages/Home.tsx` | Edit — add dark mode + language controls |
| `src/App.tsx` | Edit — add new routes |

