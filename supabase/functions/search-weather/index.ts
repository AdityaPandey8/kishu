import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeoutMs = 7000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

const mapWeatherCodeToText = (code: number): string => {
  if (code === 0) return "Clear";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
};

async function fetchWttrData(query: string) {
  const url = `https://wttr.in/${encodeURIComponent(query)}?format=j1`;
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetchWithTimeout(
        url,
        { headers: { "User-Agent": "curl/7.68.0", Accept: "application/json" } },
        6500
      );

      const text = await res.text();
      let parsed: any = null;

      try {
        parsed = JSON.parse(text);
      } catch {
        // ignore non-JSON body
      }

      // wttr can return non-2xx while still returning valid weather payload
      if (parsed?.current_condition?.[0]) return parsed;

      if (!res.ok) {
        throw new Error(`wttr.in returned ${res.status}: ${text.slice(0, 180)}`);
      }

      throw new Error("wttr.in returned unexpected response format");
    } catch (err) {
      lastError = err;
      if (attempt < 2) await sleep(400 * (attempt + 1));
    }
  }

  throw lastError instanceof Error ? lastError : new Error("wttr.in request failed");
}

async function geocodeFromOpenMeteo(location: string) {
  const compact = location.trim().replace(/\s+/g, " ");
  const words = compact.split(" ").filter(Boolean);

  const candidates = Array.from(
    new Set([
      compact,
      compact.replace(/\s+/g, ", "),
      words.slice(-2).join(" "),
      words.slice(-1).join(" "),
      compact.split(",")[0]?.trim(),
    ].filter(Boolean))
  );

  for (const name of candidates) {
    const res = await fetchWithTimeout(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`,
      {},
      5500
    );

    if (!res.ok) continue;
    const data = await res.json();
    const first = data?.results?.[0];
    if (!first) continue;

    return {
      latitude: first.latitude,
      longitude: first.longitude,
      name: first.name || compact,
      region: first.admin1 || "",
      country: first.country || "",
    };
  }

  throw new Error("Location not found");
}

async function reverseGeocodeFromOpenMeteo(lat: number, lng: number) {
  const res = await fetchWithTimeout(
    `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lng}&count=1&language=en&format=json`,
    {},
    5500
  );

  if (!res.ok) return { latitude: lat, longitude: lng, name: `${lat},${lng}`, region: "", country: "" };

  const data = await res.json();
  const first = data?.results?.[0];

  return {
    latitude: lat,
    longitude: lng,
    name: first?.name || `${lat},${lng}`,
    region: first?.admin1 || "",
    country: first?.country || "",
  };
}

async function fetchOpenMeteoWeather(params: { location?: string; lat?: number; lng?: number }) {
  const coords =
    params.lat !== undefined && params.lng !== undefined
      ? await reverseGeocodeFromOpenMeteo(params.lat, params.lng)
      : await geocodeFromOpenMeteo(params.location || "India");

  const weatherRes = await fetchWithTimeout(
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=5&timezone=auto`,
    {},
    6500
  );

  if (!weatherRes.ok) throw new Error("Open-Meteo weather failed");

  const weatherData = await weatherRes.json();
  const current = weatherData?.current;
  const daily = weatherData?.daily;
  if (!current || !daily) throw new Error("Incomplete weather data");

  return {
    location: coords.name,
    region: coords.region,
    country: coords.country,
    current: {
      temp: Math.round(current.temperature_2m ?? 0),
      feelsLike: Math.round(current.temperature_2m ?? 0),
      condition: mapWeatherCodeToText(Number(current.weather_code ?? -1)),
      humidity: Math.round(current.relative_humidity_2m ?? 0),
      wind: Math.round(current.wind_speed_10m ?? 0),
      windDir: "",
      uv: 0,
      visibility: 0,
    },
    forecast: (daily.time || []).slice(0, 5).map((date: string, i: number) => ({
      date,
      high: Math.round(daily.temperature_2m_max?.[i] ?? 0),
      low: Math.round(daily.temperature_2m_min?.[i] ?? 0),
      avgTemp: Math.round(((daily.temperature_2m_max?.[i] ?? 0) + (daily.temperature_2m_min?.[i] ?? 0)) / 2),
      condition: mapWeatherCodeToText(Number(daily.weather_code?.[i] ?? -1)),
      rain: Number(daily.precipitation_probability_max?.[i] ?? 0),
      humidity: 0,
    })),
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { location, lat, lng } = await req.json();

    if (!(location && typeof location === "string") && !(lat !== undefined && lng !== undefined)) {
      return new Response(JSON.stringify({ error: "location or lat/lng is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const query = lat !== undefined && lng !== undefined ? `${lat},${lng}` : location;

    try {
      const data = await fetchWttrData(query);
      const current = data.current_condition?.[0];
      const forecast = data.weather?.slice(0, 5) || [];

      return new Response(
        JSON.stringify({
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
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (wttrError) {
      console.error("wttr.in failed, switching to Open-Meteo fallback:", wttrError);
    }

    try {
      const fallbackResult = await fetchOpenMeteoWeather({
        location: typeof location === "string" ? location : undefined,
        lat: typeof lat === "number" ? lat : undefined,
        lng: typeof lng === "number" ? lng : undefined,
      });

      return new Response(JSON.stringify(fallbackResult), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (fallbackError) {
      console.error("Open-Meteo fallback failed:", fallbackError);
      return new Response(JSON.stringify({ error: "Weather service temporarily unavailable. Please try again." }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (e) {
    console.error("search-weather error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
