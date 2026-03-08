import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { season, location, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `Suggest 5 crops/plants ideal for planting in ${season} season in ${location || "India"}. For each crop provide: name, local name in ${language || "Hindi"}, short description, step-by-step planting method, care tips after planting (watering, fertilization, pest management), required tools/products/pesticides for planting and care, best months to plant, and difficulty level.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are an Indian agriculture expert. Return crop suggestions using the provided tool.",
          },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_crops",
              description: "Return an array of crop suggestions with planting details",
              parameters: {
                type: "object",
                properties: {
                  crops: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Crop name in English" },
                        nameLocal: { type: "string", description: "Crop name in local language" },
                        description: { type: "string", description: "Brief description (1-2 sentences)" },
                        plantingMethod: { type: "string", description: "Step-by-step planting method (3-5 steps)" },
                        careTips: { type: "string", description: "Care tips after planting: watering schedule, fertilization, pest management (3-5 tips)" },
                        requiredTools: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              name: { type: "string", description: "Tool or product name" },
                              shopSearchQuery: { type: "string", description: "Search query for shop" },
                            },
                            required: ["name", "shopSearchQuery"],
                            additionalProperties: false,
                          },
                        },
                        bestMonths: { type: "string", description: "Best months to plant" },
                        difficulty: { type: "string", enum: ["Easy", "Medium", "Hard"] },
                      },
                      required: ["name", "nameLocal", "description", "plantingMethod", "careTips", "requiredTools", "bestMonths", "difficulty"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["crops"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_crops" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const t = await response.text();
      console.error("crop-suggestions error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (toolCall?.function?.arguments) {
      const crops = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(crops), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ crops: [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("crop-suggestions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
