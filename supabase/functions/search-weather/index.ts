import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { location, lat, lng } = await req.json();
    
    let query: string;
    if (lat !== undefined && lng !== undefined) {
      query = `${lat},${lng}`;
    } else if (location && typeof location === "string") {
      query = location;
    } else {
      return new Response(JSON.stringify({ error: "location or lat/lng is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = `https://wttr.in/${encodeURIComponent(query)}?format=j1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "curl/7.68.0" },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("wttr.in error:", res.status, text);
      return new Response(JSON.stringify({ error: "Failed to fetch weather" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const current = data.current_condition?.[0];
    const forecast = data.weather?.slice(0, 5) || [];

    const result = {
      location: data.nearest_area?.[0]?.areaName?.[0]?.value || location || query,
      region: data.nearest_area?.[0]?.region?.[0]?.value || "",
      country: data.nearest_area?.[0]?.country?.[0]?.value || "",
      current: {
        temp: parseInt(current?.temp_C || "0"),
        feelsLike: parseInt(current?.FeelsLikeC || "0"),
        condition: current?.weatherDesc?.[0]?.value || "Unknown",
        humidity: parseInt(current?.humidity || "0"),
        wind: parseInt(current?.windspeedKmph || "0"),
        windDir: current?.winddir16Point || "",
        uv: parseInt(current?.uvIndex || "0"),
        visibility: parseInt(current?.visibility || "0"),
      },
      forecast: forecast.map((day: any) => ({
        date: day.date,
        high: parseInt(day.maxtempC || "0"),
        low: parseInt(day.mintempC || "0"),
        avgTemp: parseInt(day.avgtempC || "0"),
        condition: day.hourly?.[4]?.weatherDesc?.[0]?.value || "Unknown",
        rain: parseFloat(day.hourly?.[4]?.chanceofrain || "0"),
        humidity: parseInt(day.hourly?.[4]?.humidity || "0"),
      })),
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("search-weather error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
