import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { file_base64, file_name, file_type } = body;

    if (!file_base64) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert base64 to blob
    const binaryStr = atob(file_base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: file_type || 'image/jpeg' });
    const file = new File([blob], file_name || 'upload.jpg', { type: file_type || 'image/jpeg' });

    const result = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    return Response.json({ file_url: result.file_url });

  } catch (error) {
    console.error('uploadPublicFile error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});