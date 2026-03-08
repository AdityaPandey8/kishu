import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { query, location } = await req.json();
    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const locationPart = location ? ` in ${location}` : " across major Indian mandis";
    const prompt = `You are a helpful Indian agriculture market data assistant. Return the current approximate mandi (market) prices for "${query}"${locationPart}.

Return a JSON array of objects with these exact fields:
- cropName (string): name in English
- cropNameHi (string): name in Hindi
- price (number): price in INR
- unit (string): "kg" or "quintal" 
- mandi (string): mandi/market name
- state (string): Indian state name
- trend (number): percentage change from last week (positive or negative, e.g. 2.5 or -1.3)

Return 4-8 results. Use realistic current Indian mandi prices. Only return the JSON array, no other text.`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3 },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error("Gemini API error:", geminiRes.status, errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    
    // Extract JSON from the response (may be wrapped in ```json ... ```)
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    let prices = [];
    if (jsonMatch) {
      try {
        prices = JSON.parse(jsonMatch[0]);
      } catch {
        console.error("Failed to parse Gemini JSON:", rawText);
        prices = [];
      }
    }

    return new Response(JSON.stringify({ prices, query, location: location || "All India" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-market-prices error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
