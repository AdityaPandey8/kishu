

# AI Farming Chatbot + Seasonal Crop Suggestions (AppSuggests)

## Overview
Add two features: (1) a floating AI chatbot accessible from the farmer dashboard for asking any agriculture/farming question, powered by Gemini via Lovable AI Gateway with streaming responses; (2) an "AppSuggests" widget on the dashboard that uses AI to recommend crops/plants based on current season and user location, with plantation methods, required tools/products, and direct "Buy" links to the shop.

## Architecture

```text
Farmer Dashboard
  ├── Floating Chat Button → Chat Drawer/Page
  │     └── Edge Function (chat-farming) → Gemini (streaming)
  │           System prompt: agriculture expert, Indian farming context
  │
  └── AppSuggests Widget (on dashboard)
        └── Edge Function (crop-suggestions) → Gemini (structured output)
              Input: season + location (from device/localStorage)
              Output: crops, methods, required products → link to /shop
```

## Changes

### 1. Create edge function: `chat-farming`
**File: `supabase/functions/chat-farming/index.ts`**
- Accepts `messages` array (full conversation history)
- System prompt: "You are an expert Indian agriculture advisor. Answer questions about farming, crops, soil, irrigation, pests, fertilizers, government schemes, etc. Respond in the same language the user asks in."
- Streams response via SSE using Lovable AI Gateway
- Handles 429/402 errors

### 2. Create edge function: `crop-suggestions`
**File: `supabase/functions/crop-suggestions/index.ts`**
- Accepts `season`, `location`, `language`
- Uses Gemini with tool calling to return structured JSON: array of crops with `name`, `nameLocal`, `description`, `plantingMethod`, `requiredTools` (array with name + shopSearchQuery), `bestMonths`, `difficulty`
- Non-streaming, returns JSON

### 3. Create `FarmingChatbot` component
**File: `src/components/chat/FarmingChatbot.tsx`**
- Floating green chat button (bottom-right, above bottom nav)
- Opens a full-screen drawer/sheet with chat UI
- Message list with user/assistant bubbles, markdown rendering
- Input with send button + voice mic (reuses `useVoiceSearch`)
- Streams responses token-by-token using SSE parsing
- Persists conversation in state (resets on close or optional localStorage)

### 4. Create `AppSuggests` widget
**File: `src/components/home/AppSuggests.tsx`**
- Card on farmer dashboard showing "Recommended for You"
- On mount: determines current season from month + gets location from localStorage
- Calls `crop-suggestions` edge function
- Displays 3-5 crop cards with: crop name, brief method, required items as chips
- Each required item chip links to `/shop?search={toolName}`
- "View All" expands or navigates to a dedicated page
- Loading skeleton while fetching
- Caches results in localStorage for the day

### 5. Update `FarmerDashboard.tsx`
- Import and add `<FarmingChatbot />` (floating, renders above everything)
- Import and add `<AppSuggests />` widget between SeasonalCalendar and ExpertHelp

### 6. Update `supabase/config.toml`
- Add `[functions.chat-farming]` with `verify_jwt = false`
- Add `[functions.crop-suggestions]` with `verify_jwt = false`

### 7. Update `App.tsx`
- No new routes needed (chatbot is a floating component, suggestions are a widget)

## Files to Create
- `supabase/functions/chat-farming/index.ts`
- `supabase/functions/crop-suggestions/index.ts`
- `src/components/chat/FarmingChatbot.tsx`
- `src/components/home/AppSuggests.tsx`

## Files to Edit
- `src/pages/dashboard/FarmerDashboard.tsx` — add chatbot + AppSuggests widget
- `supabase/config.toml` — register new functions

## Technical Notes
- Chatbot uses SSE streaming pattern from Lovable AI docs (token-by-token rendering)
- Crop suggestions use Gemini tool calling for structured output (no JSON parsing guesswork)
- Voice search hook already exists at `src/hooks/useVoiceSearch.ts` — reused in chat input
- Shop links use query params: `/shop?search=fertilizer` to pre-fill the shop search
- `LOVABLE_API_KEY` is already configured as a Supabase secret

