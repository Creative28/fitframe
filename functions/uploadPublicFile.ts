import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const result = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    return Response.json({ file_url: result.file_url });

  } catch (error) {
    console.error('uploadPublicFile error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});