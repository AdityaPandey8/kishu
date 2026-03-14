

# Agri Services + Kishu Home Page

## Overview
Two major additions: (1) A public-facing Kishu home/landing page with features showcase and login/signup CTAs, and (2) a full "Agri Services" module (Urban Company-style) for booking agricultural services.

## Part 1: Kishu Home Page (Public Landing)

### Route Change
- `/` → New public home page (unauthenticated users see it, authenticated users see their role dashboard)
- Remove redirect to `/auth` from Index.tsx; instead render the new home page for guests

### Create `src/pages/Home.tsx` — Public Landing Page
Sections:
- **Hero**: App name, tagline ("AI - Driven Smart Agriculture Ecosystem"), animated background, two CTAs: "Get Started" → `/auth`, "Learn More" → scroll down
- **Features Grid** (6 cards with icons): Crop Disease Detection, Weather Alerts, Expert Consultation, Agri Services (NEW), Smart Shop, Community & Reels
- **About Kishu**: Mission statement, key stats (languages supported, farmer-first approach), brief description
- **How It Works**: 3-step flow (Register → Select Role → Access Tools)
- **Footer**: Links to Terms, Privacy, Contact; "Login / Sign Up" button

### Update `src/pages/Index.tsx`
- If no user: render `<Home />` instead of `<Navigate to="/auth" />`

## Part 2: Agri Services Module

### Data Model — Add to `src/contexts/DataContext.tsx`

```typescript
interface AgriService {
  id: string;
  name: string;
  category: 'equipment-rental' | 'soil-testing' | 'spraying' | 'harvesting' | 'other';
  description: string;
  price: number;
  priceUnit: 'per_hour' | 'per_acre' | 'per_visit' | 'fixed';
  rating: number;
  totalBookings: number;
  image: string;
  providerId: string;
  providerName: string;
  availability: boolean;
}

interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: string;
  farmerId: string;
  farmerName: string;
  providerId: string;
  providerName: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  acres?: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: 'cod' | 'online' | 'upi';
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}
```

Add seed data for ~8 services across 4 categories and ~3 sample bookings. Expose `agriServices`, `serviceBookings`, `addServiceBooking`, `updateBookingStatus`, `rateService` in context.

### New Pages

| Page | Route | Purpose |
|------|-------|---------|
| `src/pages/agri-services/AgriServices.tsx` | `/agri-services` | Service marketplace — category filters, search, service cards grid |
| `src/pages/agri-services/ServiceDetail.tsx` | `/agri-services/:id` | Service detail — provider info, pricing, reviews, "Book Now" button |
| `src/pages/agri-services/BookService.tsx` | `/agri-services/:id/book` | Booking form — date, time, location, acres, payment method |
| `src/pages/agri-services/MyBookings.tsx` | `/my-bookings` | Farmer's booking history — status tracking, cancel, rate & review |
| `src/pages/agri-services/BookingDetail.tsx` | `/my-bookings/:id` | Booking detail — status timeline, payment info, dispute option |

### Service Flow (Urban Company style)
1. **Browse** → `/agri-services` — Filter by category, search by name
2. **Select** → `/agri-services/:id` — View details, provider profile, reviews
3. **Book** → `/agri-services/:id/book` — Pick date/time, enter location/acres, choose payment
4. **Track** → `/my-bookings/:id` — Status timeline (Pending → Confirmed → In Progress → Completed)
5. **Rate** → Post-completion rating & review dialog
6. **Dispute** → Flag button for support escalation

### Navigation Updates
- Add "Services" tab to farmer bottom nav (replace or add alongside existing items)
- Add quick-access card on FarmerDashboard linking to `/agri-services`

### Admin Visibility
- Add "Services" section to AdminDashboard with booking stats
- Add `/admin/services` quick action link

## Files

| File | Action |
|------|--------|
| `src/pages/Home.tsx` | Create — public landing page |
| `src/pages/Index.tsx` | Edit — render Home for guests |
| `src/contexts/DataContext.tsx` | Edit — add AgriService & ServiceBooking types, seed data, CRUD |
| `src/pages/agri-services/AgriServices.tsx` | Create — service marketplace |
| `src/pages/agri-services/ServiceDetail.tsx` | Create — service detail page |
| `src/pages/agri-services/BookService.tsx` | Create — booking form |
| `src/pages/agri-services/MyBookings.tsx` | Create — booking history |
| `src/pages/agri-services/BookingDetail.tsx` | Create — booking detail + status timeline |
| `src/App.tsx` | Edit — add 6 new routes |
| `src/components/layout/BottomNav.tsx` | Edit — add Services to farmer nav |
| `src/pages/dashboard/FarmerDashboard.tsx` | Edit — add Agri Services quick card |
| `src/pages/dashboard/AdminDashboard.tsx` | Edit — add services stats |

