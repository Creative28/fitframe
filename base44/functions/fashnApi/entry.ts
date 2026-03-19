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

    } else if (action === "run") {
      const { model_image, garment_image, category, garment_type, fit_mode, fit_context } = payload;

      // Build cover_feet and other hints based on garment type
      const isHoodie = garment_type === 'hoodie';
      const isPreserveFit = !fit_mode || fit_mode === 'preserve';

      const requestBody = {
        model_name: "tryon-v1.6",
        inputs: {
          model_image,
          garment_image,
          category: category || "tops",
          // For hoodies/oversized: use flat_lay_garment mode if available to better preserve shape
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