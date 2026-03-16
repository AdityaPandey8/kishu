

# Remove Recent Diagnoses + Test Full Flow

## Code Change

**File: `src/pages/dashboard/FarmerDashboard.tsx`**
- Remove line 6: `import { RecentDiagnoses } from '@/components/home/RecentDiagnoses';`
- Remove lines 85-86: the `{/* Recent Diagnoses */}` comment and `<RecentDiagnoses />` component

This is a 3-line deletion. The `RecentDiagnoses` component file stays in the codebase in case it's needed later.

## Testing Plan

After the code change, I will test the following flows in the browser:

1. **Reels/Shorts** — Navigate to `/reels`, verify back button, autoplay, swipe, like/comment/share interactions
2. **Home Page** — Visit `/` as guest, toggle dark mode, change language, verify UI updates
3. **Service Provider** — Sign up at `/auth/provider/signup`, verify pending page, then login as admin to approve
4. **Admin Dashboard** — Check provider management, user detail views (click any user), content moderation previews
5. **Farmer Dashboard** — Confirm Recent Diagnoses section is gone

