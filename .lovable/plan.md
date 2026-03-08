

# Revamp Inquiries: Stock & Order-Focused + Real-Time Dealer Notifications

## Overview
Transform the inquiry system from crop-disease-focused to **stock availability and order delivery** focused. Add real-time toast + notification alerts for dealers when new inquiries arrive.

## Changes

### 1. Update `Inquiry` interface in `src/contexts/DataContext.tsx`
Replace crop/issue fields with stock & order delivery fields:
- Remove: `crop`, `issue`, `urgent`
- Add: `type: 'stock' | 'delivery' | 'general'`, `subject` (free text), `message` (details), `orderId?` (optional link to order), `productName?` (optional product reference)
- Keep: `id`, `farmerId`, `farmerName`, `dealerId`, `location`, `status`, `createdAt`, `response`

Update seed data with stock/delivery-themed inquiries (e.g. "Is NPK 19-19-19 in stock?", "Where is my order #ORD-001?").

### 2. Auto-notify dealers in `addInquiry` — `src/contexts/DataContext.tsx`
When `addInquiry` is called:
- Automatically call `addNotification` for the dealer with type `'inquiry'`, linking to `/inquiries`
- Show a `sonner` toast ("New inquiry from {farmerName}") immediately if the dealer is logged in
- Import `toast` from sonner at the top of the context

### 3. Add order status change notifications in `updateOrderStatus`
When an order status changes (e.g. shipped, delivered):
- Auto-notify the farmer via `addNotification` with type `'order'`
- Auto-notify the dealer as well

### 4. Update `src/pages/Inquiries.tsx` — New UI for stock/delivery inquiries
- Replace crop/issue display with `type` badge (Stock / Delivery / General) and `subject` + `message`
- Show linked order ID or product name when present
- Remove urgency flag references, replace with type-based color coding
- Update filter chips: All / Stock / Delivery / General (instead of pending/responded/resolved status — keep status filters as secondary)

### 5. Update `src/components/dealer/UrgentInquiries.tsx`
- Rename to reflect new model — show latest pending inquiries (any type)
- Display type badge instead of urgency indicator
- Show subject + message snippet instead of crop + issue

### 6. Update references across codebase
- `src/pages/BuyerProfile.tsx` — update inquiry display fields
- `src/components/dealer/InquiryDetailModal.tsx` — update to show new fields
- `src/pages/dashboard/DealerDashboard.tsx` — if it references `inquiry.crop` or `inquiry.urgent`

## Files

| File | Action |
|------|--------|
| `src/contexts/DataContext.tsx` | Edit — update Inquiry interface, seed data, add auto-notifications |
| `src/pages/Inquiries.tsx` | Edit — new UI for stock/delivery inquiries |
| `src/components/dealer/UrgentInquiries.tsx` | Edit — adapt to new inquiry model |
| `src/pages/BuyerProfile.tsx` | Edit — update inquiry fields |
| `src/components/dealer/InquiryDetailModal.tsx` | Edit — update fields |

