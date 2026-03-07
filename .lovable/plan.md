

# Add 3D Animations and Smooth Scrolling to KISHU

## Overview
Enhance the entire KISHU app with scroll-triggered animations (using framer-motion's `whileInView`), 3D perspective/tilt effects on cards, smooth page transitions, and parallax-style scrolling. Currently, most components use `animate` which fires immediately on mount -- switching to viewport-based triggers will create a much more dynamic scrolling experience.

## Changes

### 1. Create a reusable `AnimatedCard` wrapper component
**File: `src/components/common/AnimatedCard.tsx`**

A reusable wrapper using framer-motion that provides:
- Scroll-triggered fade-in + slide-up animations via `whileInView`
- 3D tilt/perspective effect on hover (CSS `perspective` + `rotateX`/`rotateY` via mouse tracking)
- Configurable delay, direction, and intensity
- `viewport={{ once: true, margin: "-50px" }}` so elements animate as they scroll into view

### 2. Create a `Parallax` utility component
**File: `src/components/common/ParallaxSection.tsx`**

Uses framer-motion's `useScroll` + `useTransform` to create parallax movement on background decorative elements (blobs, gradients) across all pages.

### 3. Add smooth scroll CSS
**File: `src/index.css`**

Add `scroll-behavior: smooth` to `html` and custom 3D utility classes:
- `.perspective-1000` for 3D card containers
- `.preserve-3d` for transform-style
- Floating/bobbing keyframe animation for decorative elements

### 4. Update `AuthLanding.tsx`
- Wrap role cards with 3D tilt-on-hover effect (track mouse position, apply `rotateX`/`rotateY`)
- Add parallax to background decorative blobs using `useScroll`/`useTransform`
- Stagger animations using `whileInView` instead of fixed delays
- Add floating animation to the logo icon

### 5. Update `FarmerDashboard.tsx`
- Replace all child component mount animations with scroll-triggered `whileInView` variants
- Add staggered container animation using framer-motion's `staggerChildren`
- Wrap the whole content area in a stagger parent for cascade effect

### 6. Update Home Components (all 9 files)
For each of `QuickScanCard`, `TipsCarousel`, `WeatherWidget`, `WeatherAlertsWidget`, `MarketPrices`, `SeasonalCalendar`, `ExpertHelp`, `CropGuide`, `RecentDiagnoses`:
- Change `initial`/`animate` to `initial`/`whileInView` with `viewport={{ once: true }}`
- Add 3D hover tilt effect on interactive cards (using `onMouseMove` to calculate rotation)
- Add `whileHover={{ scale: 1.02, y: -4 }}` with spring physics for card lift
- Add subtle `rotateX`/`rotateY` perspective transforms on hover

### 7. Update `DealerDashboard.tsx` and `AdminDashboard.tsx`
- Same scroll-triggered animation pattern
- Stats cards get 3D flip or tilt on hover
- Stagger children for cascade reveal

### 8. Update `Header.tsx`
- Add a subtle slide-down entrance animation on page load
- Logo gets a continuous subtle floating animation

### 9. Update `BottomNav.tsx`
- Add slide-up entrance animation
- Active tab indicator gets spring physics

### 10. Add page transition wrapper
**File: `src/components/common/PageTransition.tsx`**

Wraps page content with `AnimatePresence` for fade+slide transitions between routes.

## Technical Details

Key framer-motion patterns used:
```text
// Scroll-triggered animation
whileInView={{ opacity: 1, y: 0 }}
initial={{ opacity: 0, y: 40 }}
viewport={{ once: true, margin: "-50px" }}
transition={{ type: "spring", stiffness: 100 }}

// 3D tilt on hover (mouse tracking)
onMouseMove -> calculate rotateX/rotateY from mouse position
style={{ perspective: 1000, rotateX, rotateY }}

// Stagger children
variants={{ container: { transition: { staggerChildren: 0.08 } } }}

// Parallax via useScroll
const { scrollYProgress } = useScroll()
const y = useTransform(scrollYProgress, [0, 1], [0, -50])
```

No new dependencies required -- framer-motion (already installed) handles everything.

## Files to Create
- `src/components/common/AnimatedCard.tsx`
- `src/components/common/ParallaxSection.tsx`
- `src/components/common/PageTransition.tsx`

## Files to Edit
- `src/index.css` (add smooth scroll + 3D utility classes)
- `src/pages/auth/AuthLanding.tsx`
- `src/pages/dashboard/FarmerDashboard.tsx`
- `src/pages/dashboard/DealerDashboard.tsx`
- `src/pages/dashboard/AdminDashboard.tsx`
- `src/components/home/QuickScanCard.tsx`
- `src/components/home/TipsCarousel.tsx`
- `src/components/home/WeatherWidget.tsx`
- `src/components/home/WeatherAlertsWidget.tsx`
- `src/components/home/MarketPrices.tsx`
- `src/components/home/SeasonalCalendar.tsx`
- `src/components/home/ExpertHelp.tsx`
- `src/components/home/CropGuide.tsx`
- `src/components/home/RecentDiagnoses.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/BottomNav.tsx`

