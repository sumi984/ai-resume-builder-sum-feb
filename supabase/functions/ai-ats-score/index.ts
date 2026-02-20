import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { resume, jobDescription } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are an ATS (Applicant Tracking System) expert. Analyze the resume against the job description (if provided) or general best practices. Return ONLY valid JSON in this exact format: {\"score\": <number 0-100>, \"suggestions\": [\"suggestion1\", \"suggestion2\"], \"matchedKeywords\": [\"keyword1\"], \"missingKeywords\": [\"keyword1\"]}. Be specific and actionable in suggestions." },
          { role: "user", content: `Resume:\n${JSON.stringify(resume)}${jobDescription ? `\n\nJob Description:\n${jobDescription}` : ""}` },
        ],
      }),
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) return new Response(JSON.stringify({ error: "Rate limit exceeded." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI service error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content || "{}";
    
    // Try to parse the JSON from the AI response
    let atsResult;
    try {
      // Handle potential markdown code blocks in response
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      atsResult = JSON.parse(jsonStr);
    } catch {
      atsResult = { score: 50, suggestions: ["Unable to fully analyze. Please try again."], matchedKeywords: [], missingKeywords: [] };
    }

    return new Response(JSON.stringify(atsResult), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
