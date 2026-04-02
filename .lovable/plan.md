

# KISHU Premium Branding & UI Upgrade

## Current State
- Branding is already "KISHU"/"Kishu" throughout the app (i18n, header, home page, auth landing)
- No "Built with Lovable" or "Lovable App" text exists
- OG/Twitter image URLs still point to `lovable.dev` placeholder images
- Meta description is agriculture-focused, user wants startup-style meta
- Home page is clean but basic — needs premium SaaS treatment with gradients, glow effects, better typography
- No favicon customization (still default)

## Changes

### 1. Update `index.html` — Meta tags & title
- Title: `KISHU`
- Meta description: "Connect with mentors, pitch to investors, join hackathons, and turn ideas into successful startups." *(as user requested, though this conflicts with the agriculture theme — will use as-is)*
- Remove `lovable.dev` OG/Twitter image URLs, replace with placeholder or remove
- Add `<meta name="generator">` removal (none exists currently)
- Update `<meta name="author">` to KISHU

### 2. Rewrite `src/pages/Home.tsx` — Premium SaaS Landing
- **Hero**: Large gradient text "KISHU" with glow effect, animated floating elements, glassmorphism CTA cards
- **Features grid**: Card hover with subtle lift + border glow, gradient icon backgrounds
- **Stats section**: Animated counters with gradient backgrounds
- **About section**: Split layout with gradient accent bars
- **How It Works**: Timeline with connecting lines and animated step indicators
- **CTA**: Full-width gradient banner with glassmorphism overlay
- **Footer**: Refined with gradient separator line
- **Typography**: Use tracking-tight, font-extrabold for headings, gradient text for brand name
- Micro-interactions: hover scale, border glow on cards, smooth scroll-triggered animations

### 3. Update `src/pages/auth/AuthLanding.tsx` — Polish
- Add subtle glow behind role cards
- Refine card hover states with border-glow effect

### 4. Update `src/components/layout/Header.tsx` — Brand consistency
- Ensure logo text renders "KISHU" (currently uses `t('common.appName')` which is already KISHU)
- No changes needed here, already correct

### 5. Update `public/manifest.json` — App metadata
- Already set to KISHU — no changes needed

### 6. Favicon
- User wants a modern startup-style icon (orange/purple theme). Since no image was provided, will add a simple SVG favicon inline in index.html using a stylized "K" with orange/purple gradient

### 7. `src/index.css` — Premium design tokens
- Add glow utility classes (`.glow-primary`, `.glow-accent`)
- Add glass-morphism utility (`.glass`)
- Add gradient text utilities
- Add premium shadow variants

## Files

| File | Action |
|------|--------|
| `index.html` | Edit — meta tags, title, inline SVG favicon |
| `src/index.css` | Edit — add premium utility classes |
| `src/pages/Home.tsx` | Rewrite — premium SaaS landing page |
| `src/pages/auth/AuthLanding.tsx` | Edit — polish card hover effects |

