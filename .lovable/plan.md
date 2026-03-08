

# Dealer Store Profile Edit + Testing Verification

## Overview
Add an "Edit Store Profile" dialog/page for dealers to update their business name, description, logo, and operating hours. The User interface already has `updateUser()` for persisting changes to localStorage.

## Changes

### 1. Create `src/components/dealer/EditStoreProfileDialog.tsx`
A Dialog component with form fields:
- **Business Name** — text input, pre-filled from `user.name` or KYC data
- **Store Description** — textarea, new field on User interface
- **Logo Upload** — file input with image preview (store as base64 data URL in localStorage for now)
- **Operating Hours** — two time inputs (open/close) for each day, with a "Same for all days" toggle for simplicity
- **Phone** and **Location** — pre-filled editable fields
- Uses `updateUser()` from AuthContext to persist all changes
- Save button with success toast

### 2. Update `src/contexts/AuthContext.tsx` — Extend User interface
Add optional fields:
- `storeDescription?: string`
- `storeLogo?: string` (base64 data URL)
- `operatingHours?: { open: string; close: string; days: string[] }`

### 3. Update `src/pages/Profile.tsx` — Add edit button
- Add an "Edit Profile" button in the dealer store header section
- Wire it to open the `EditStoreProfileDialog`
- Display store description and operating hours in the Store Details card if set
- Show uploaded logo instead of the default Store icon if available

### 4. Update `src/pages/dealer/OrderManagement.tsx` — Ensure buyer link works
- Verify the farmer name `onClick` navigates to `/buyer/{farmerId}` (already implemented from prior changes)

## Files

| File | Action |
|------|--------|
| `src/components/dealer/EditStoreProfileDialog.tsx` | Create — edit form dialog |
| `src/contexts/AuthContext.tsx` | Edit — add new User fields |
| `src/pages/Profile.tsx` | Edit — add edit button, show new fields |

