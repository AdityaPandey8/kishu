

# Real Search-Based Market Prices & Weather for Farmers

## Overview
Replace mock data with real search functionality. Farmers can search for crop market prices by name/location and weather for any desired location, powered by edge functions using the Gemini API (already configured) and a free weather API.

## Architecture

```text
Farmer Dashboard / Market Prices Page
  ├── Search crop name → Edge Function (Gemini) → Real mandi prices
  └── Search location → Edge Function (wttr.in) → Real weather data
```

## Changes

### 1. Create edge function: `search-weather`
**File: `supabase/functions/search-weather/index.ts`**
- Accepts `location` string (e.g. "Jaipur", "Delhi")
- Calls `wttr.in/{location}?format=j1` (free, no API key needed)
- Returns structured weather: temp, condition, humidity, wind, forecast
- No API key required

### 2. Create edge function: `search-market-prices`
**File: `supabase/functions/search-market-prices/index.ts`**
- Accepts `query` (crop name) and optional `location` (state/mandi)
- Uses Gemini API with a structured prompt to return current Indian mandi prices as JSON
- Prompt instructs Gemini to return crop name, price, unit, mandi, state, and trend
- Returns array of price objects

### 3. Update `WeatherWidget.tsx`
- Add a small search input for location (city name)
- On search, call `search-weather` edge function
- Display real weather data instead of mock
- Store last searched location in localStorage
- Show loading state while fetching

### 4. Update `MarketPricesPage.tsx`
- Connect the existing search bar to the `search-market-prices` edge function
- When user types a crop name and searches, fetch real prices from Gemini
- Show loading skeleton while fetching
- Keep category filters for local filtering of results
- Fall back to empty state with helpful message if no results

### 5. Update `MarketPrices` home widget
- Make the widget tappable → navigates to `/market-prices`
- Optionally fetch a few trending prices on load via the edge function

### 6. Update `WeatherAlerts.tsx`
- Add location search input at the top
- Fetch real 5-day forecast from wttr.in for the searched location
- Replace mock forecast data with real data

## Files to Create
- `supabase/functions/search-weather/index.ts`
- `supabase/functions/search-market-prices/index.ts`

## Files to Edit
- `src/components/home/WeatherWidget.tsx` — add location search + real data
- `src/components/home/MarketPrices.tsx` — make tappable, link to full page
- `src/pages/MarketPricesPage.tsx` — integrate real search via edge function
- `src/pages/WeatherAlerts.tsx` — add location search + real forecast

## Technical Notes
- Weather uses wttr.in (free, no key) — returns JSON with current conditions and 3-day forecast
- Market prices use Gemini API (key already stored as `GEMINI_API_KEY`) with structured JSON output prompting
- Both edge functions include CORS headers for preview compatibility
- Results cached in component state; localStorage remembers last searched location

