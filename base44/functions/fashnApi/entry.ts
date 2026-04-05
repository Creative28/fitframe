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

    if (action === "get_tryon_link") {
      const { unique_code } = payload;
      const links = await base44.asServiceRole.entities.TryOnLink.filter({ unique_code });
      if (!links || links.length === 0) {
        return Response.json({ error: "not_found" }, { status: 404 });
      }
      const link = links[0];
      await base44.asServiceRole.entities.TryOnLink.update(link.id, { views_count: (link.views_count || 0) + 1 });
      return Response.json({ link });

    } else if (action === "save_tryon") {
      const { tryon_link_id, customer_image_url, result_image_url, completions_count } = payload;
      await base44.asServiceRole.entities.CustomerTryOn.create({
        tryon_link_id,
        customer_image_url,
        result_image_url,
        status: 'completed'
      });
      await base44.asServiceRole.entities.TryOnLink.update(tryon_link_id, { completions_count });
      return Response.json({ ok: true });

    } else if (action === "product_to_model") {
      // Use FASHN's product-to-model endpoint — generates an AI model from a prompt + garment
      const { garment_image, prompt } = payload;
      const requestBody = {
        model_name: "product-to-model",
        inputs: {
          product_image: garment_image,
          prompt: prompt || "Full body shot, woman, average build, standing upright, facing forward, clean white background, fashion photography",
          aspect_ratio: "2:3",
        }
      };
      console.log("[fashnApi] product_to_model payload:", JSON.stringify(requestBody));
      const res = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${FASHN_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json();
      console.log("[fashnApi] product_to_model response:", res.status, JSON.stringify(data));
      if (!res.ok) {
        return Response.json({ error: data.message || data.detail || data.error || "FASHN API error" }, { status: res.status });
      }
      return Response.json({ prediction_id: data.id });

    } else if (action === "run") {
      // Legacy tryon-v1.6 (kept for customer try-on flow)
      const { model_image, garment_image, category, garment_type } = payload;
      const isHoodie = garment_type === 'hoodie';
      const requestBody = {
        model_name: "tryon-v1.6",
        inputs: {
          model_image,
          garment_image,
          category: category || "auto",
          mode: "quality",
          ...(isHoodie && { garment_photo_type: "flat-lay" }),
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
      const { prediction_id } = payload;
      const res = await fetch(`https://api.fashn.ai/v1/status/${prediction_id}`, {
        headers: { "Authorization": `Bearer ${FASHN_API_KEY}` }
      });
      const data = await res.json();
      if (!res.ok) {
        return Response.json({ error: data.detail || data.error || "Status check failed" }, { status: res.status });
      }
      return Response.json({ status: data.status, output: data.output || [] });

    } else if (action === "change_background") {
      const { image, prompt } = payload;
      const requestBody = {
        model_name: "background-change",
        inputs: { image, prompt }
      };
      console.log("[fashnApi] change_background payload:", JSON.stringify(requestBody));
      const res = await fetch("https://api.fashn.ai/v1/run", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${FASHN_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json();
      console.log("[fashnApi] change_background response:", res.status, JSON.stringify(data));
      if (!res.ok) {
        return Response.json({ error: data.message || data.detail || data.error || "FASHN API error" }, { status: res.status });
      }
      return Response.json({ prediction_id: data.id });

    } else if (action === "remove_background") {
      const { image_url } = payload;
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
    console.error("fashnApi error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});