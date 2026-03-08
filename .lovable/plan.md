

# Expert/Mentor Listing Page + Slot Booking + Admin Approval

## Overview
Create a full "Experts" page where farmers can browse verified mentors, view their experience/specializations, and book consultation slots (Call, Video, Message). Add a "Become an Expert" CTA on this page. Wire the ExpertHelp widget's arrow button to navigate here. Add an "Expert Approvals" quick-action card on the Admin Dashboard linking to the existing `/admin/experts` page.

## Changes

### 1. Create `src/pages/Experts.tsx` — Mentor Listing Page
- Header with back button + "Our Experts" title
- "Become an Expert" banner at top linking to `/become-expert`
- List of mock verified experts with: avatar, name, specializations (chips), experience years, rating, consultations count, online/offline status
- Each expert card expands or opens a modal with:
  - Bio, specializations, experience detail
  - **Book Slot** section: date picker (simple day selector), time slot chips (9AM, 10AM, etc.)
  - Three booking buttons: Call, Video Call, Message
  - On booking: toast confirmation with slot details
- Search bar to filter experts by name/specialization
- Filter tabs: All, Crop Disease, Organic Farming, Dairy, etc.

### 2. Update `src/components/home/ExpertHelp.tsx`
- Make the arrow button navigate to `/experts`
- Make Call/Video buttons also navigate to `/experts`

### 3. Add route in `src/App.tsx`
- `/experts` → `Experts` page

### 4. Update `src/pages/dashboard/AdminDashboard.tsx`
- Add an "Expert Approvals" card in the dashboard (between Pending Approvals and Recent Activity) showing pending expert application count from `useData().expertApplications`
- Card links to `/admin/experts`

### 5. Mock expert data
- 6-8 mock verified experts with Indian names, specializations, ratings, experience years, avatar placeholders, online status — all hardcoded in the Experts page (consistent with the localStorage-based demo pattern)

## Files

**Create:** `src/pages/Experts.tsx`
**Edit:** `src/components/home/ExpertHelp.tsx`, `src/App.tsx`, `src/pages/dashboard/AdminDashboard.tsx`

