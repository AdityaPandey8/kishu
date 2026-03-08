

# Multi-Language, Voice Search & Location-Based Weather Alerts

## 1. Add Prominent Indian Languages

**New locale files** for Tamil (ta), Telugu (te), Kannada (kn), Malayalam (ml), Bengali (bn), Marathi (mr), Gujarati (gu), Punjabi (pa), Odia (or) — each a translated copy of `en.json`.

**Edit `src/i18n/index.ts`** — import and register all 9 new locales.

**Edit `src/components/layout/Header.tsx`** — expand the language dropdown from 2 items to 11 (with flags/labels): English, हिंदी, தமிழ், తెలుగు, ಕನ್ನಡ, മലയാളം, বাংলা, मराठी, ગુજરાતી, ਪੰਜਾਬੀ, ଓଡ଼ିଆ.

## 2. Voice Search Support

Create **`src/hooks/useVoiceSearch.ts`** — a reusable hook using the Web Speech API (`webkitSpeechRecognition`/`SpeechRecognition`):
- Accepts `lang` param (maps app language to BCP-47: hi→hi-IN, ta→ta-IN, etc.)
- Returns `{ isListening, transcript, startListening, stopListening, supported }`
- On result, calls an `onResult` callback with the transcript

**Add mic button** to these components:
- `src/pages/MarketPricesPage.tsx` — mic icon next to crop name input and location input
- `src/components/home/WeatherWidget.tsx` — mic icon next to city search input
- `src/pages/WeatherAlerts.tsx` — mic icon next to city search input

Each mic button: toggles listening, shows active state (pulsing red), fills the input with transcript, and auto-submits.

## 3. Device Location + Search for Weather Alerts Widget

**Edit `src/components/home/WeatherAlertsWidget.tsx`**:
- On mount, use `navigator.geolocation.getCurrentPosition` to get lat/lng
- Reverse geocode via the weather edge function (wttr.in supports lat,lng queries)
- Display detected city name next to "Weather Alert" text (e.g., "Weather Alert · Delhi")
- Store detected location in localStorage

**Edit `src/pages/WeatherAlerts.tsx`**:
- Add a "Use my location" button next to the search bar that triggers geolocation
- On page load, auto-detect location if no saved location exists
- Pass lat,lng to the `search-weather` edge function

**Edit `supabase/functions/search-weather/index.ts`**:
- Accept optional `lat`/`lng` params as alternative to `location` string
- Query wttr.in with `${lat},${lng}` format when coordinates are provided

## Files

**Create:**
- `src/i18n/locales/ta.json`, `te.json`, `kn.json`, `ml.json`, `bn.json`, `mr.json`, `gu.json`, `pa.json`, `or.json` (9 files)
- `src/hooks/useVoiceSearch.ts`

**Edit:**
- `src/i18n/index.ts` — register all languages
- `src/components/layout/Header.tsx` — expanded language dropdown
- `src/pages/MarketPricesPage.tsx` — add voice mic buttons
- `src/components/home/WeatherWidget.tsx` — add voice mic button
- `src/pages/WeatherAlerts.tsx` — add voice mic + geolocation button
- `src/components/home/WeatherAlertsWidget.tsx` — auto-detect location, show city name
- `supabase/functions/search-weather/index.ts` — accept lat/lng

