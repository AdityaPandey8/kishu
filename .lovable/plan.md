

# Show Login Page Instead of Farmer Dashboard for Guests

## Change
In `src/pages/Index.tsx`, when no user is logged in, redirect to `/auth` instead of showing `FarmerDashboard`.

## Edit
**File: `src/pages/Index.tsx`** (line 22)
- Replace `return <FarmerDashboard />;` with `return <Navigate to="/auth" replace />;`

This ensures unauthenticated users always see the role-selection auth landing page first.

