import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userData, weeklyPlan } = await req.json();
    console.log("Chat request with", messages?.length, "messages");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build context about the user
    let userContext = "";
    if (userData) {
      userContext = `\n\nUser Profile:
- Goal: ${userData.goal || "Not specified"}
- Current Activity: ${userData.currentActivity || "Not specified"}
- Weekday Routine: ${userData.weekdayRoutine || "Not specified"}
- Weekend Routine: ${userData.weekendRoutine || "Not specified"}
- Barriers: ${userData.barriers || "Not specified"}
- Weight: ${userData.weight || "?"}, Height: ${userData.height || "?"}
- Gender: ${userData.gender || "Not specified"}`;
    }

    let planContext = "";
    if (weeklyPlan && weeklyPlan.length > 0) {
      planContext = `\n\nCurrent Plan:\n${weeklyPlan.map((a: any) => `- ${a.time}: ${a.name} (${a.duration}min, ${a.type}) - ${a.description}`).join("\n")}`;
    }

    const systemPrompt = `You are a friendly, knowledgeable AI fitness coach. You help users adjust their workout plans, answer health questions, and provide motivation.

Keep responses concise (2-4 sentences usually). Be encouraging but realistic. When users ask to modify their plan, describe the specific changes you'd recommend.${userContext}${planContext}

If the user asks to change their plan, provide specific, actionable modifications referencing their actual activities and schedule.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
