import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { action, payload } = body;

    const FASHN_API_KEY = Deno.env.get("FASHN_API_KEY");
    if (!FASHN_API_KEY) {
      return Response.json({ error: "FASHN_API_KEY not set" }, { status: 500 });
    }

    if (action === "run") {
      const { model_image, garment_image, category } = payload;
      const requestBody = {
        model_name: "tryon-v1.6",
        inputs: {
          model_image,
          garment_image,
          category: category || "tops"
        }
      };
      console.log("[fashnApi] run payload:", JSON.stringify(requestBody));
      const res = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${FASHN_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json();
      console.log("[fashnApi] run response:", res.status, JSON.stringify(data));
      if (!res.ok) {
        return Response.json({ error: data.message || data.detail || data.error || "FASHN API error" }, { status: res.status });
      }
      return Response.json({ prediction_id: data.id });

    } else if (action === "status") {
      // Poll for status
      const { prediction_id } = payload;
      const res = await fetch(`https://api.fashn.ai/v1/status/${prediction_id}`, {
        headers: { "Authorization": `Bearer ${FASHN_API_KEY}` }
      });
      const data = await res.json();
      if (!res.ok) {
        return Response.json({ error: data.detail || data.error || "Status check failed" }, { status: res.status });
      }
      return Response.json({ status: data.status, output: data.output || [] });

    } else if (action === "remove_background") {
      // Use InvokeLLM to detect category/color from image
      const { image_url } = payload;
      // We'll use the base44 integration to analyze the image
      const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `Analyze this clothing item image. Return JSON with:
- category: one of "tops", "bottoms", "one-pieces" (tops = shirts/blouses/jackets, bottoms = pants/skirts, one-pieces = dresses/jumpsuits/rompers)
- display_category: human readable name like "Dress", "T-Shirt", "Jeans", "Blouse", "Skirt", etc.
- color: main color of the garment (simple color name like "Black", "White", "Red", "Floral", "Striped", etc.)
- name: a short product name suggestion (max 4 words)`,
        file_urls: [image_url],
        response_json_schema: {
          type: "object",
          properties: {
            category: { type: "string" },
            display_category: { type: "string" },
            color: { type: "string" },
            name: { type: "string" }
          }
        }
      });
      return Response.json(result);

    } else {
      return Response.json({ error: "Unknown action" }, { status: 400 });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});