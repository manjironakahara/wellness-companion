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
    const { userData } = await req.json();
    console.log("Generating plan for user:", JSON.stringify(userData));

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Calculate age from birthday
    let ageInfo = "";
    if (userData.birthday) {
      const birthDate = new Date(userData.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      ageInfo = `Age: ${age} years old (born ${userData.birthday}).`;
    }

    const systemPrompt = `You are an expert fitness and health coach. Based on the user's profile, create a personalized fitness plan.

You MUST respond with valid JSON in this exact format (no markdown, no code blocks, just raw JSON):
{
  "goals": ["goal 1 string", "goal 2 string", "goal 3 string"],
  "insights": "A paragraph explaining your analysis and approach",
  "weeklyPlan": [
    {
      "time": "HH:MM",
      "duration": number_in_minutes,
      "type": "workout" | "meal" | "stretch",
      "name": "Activity Name",
      "description": "Brief description",
      "color": "hsl(H S% L%)"
    }
  ]
}

Guidelines:
- Create 3 specific, measurable goals tailored to their stated objectives
- Generate 4-6 daily activities that fit their schedule
- Consider their barriers and work around them
- Adjust intensity based on their current activity level
- Factor in their physical stats (weight, height, age, gender) for appropriate recommendations
- Use varied hsl colors for activities: workout=blue/indigo, meal=green, stretch=purple
- Keep workout durations realistic for their lifestyle
- The insights should reference specific things they told you`;

    const userMessage = `Here is my profile:
- Goal: ${userData.goal || "General fitness"}
- Current Activity: ${userData.currentActivity || "None specified"}
- Weekday Routine: ${userData.weekdayRoutine || "Not specified"}
- Weekend Routine: ${userData.weekendRoutine || "Not specified"}
- Barriers: ${userData.barriers || "None specified"}
- Weight: ${userData.weight || "Not specified"} ${userData.useMetric ? "kg" : "lbs"}
- Height: ${userData.height || "Not specified"} ${userData.useMetric ? "cm" : "inches"}
- ${ageInfo || "Age: Not specified"}
- Gender: ${userData.gender || "Not specified"}

Please create a personalized fitness plan for me.`;

    console.log("Calling AI gateway...");
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
          { role: "user", content: userMessage },
        ],
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    console.log("AI response content:", content);

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response, stripping markdown code fences if present
    let cleaned = content.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "");
    }
    const plan = JSON.parse(cleaned);

    return new Response(JSON.stringify(plan), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-plan error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
