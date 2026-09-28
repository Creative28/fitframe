import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { file_base64, file_name, file_type } = body;

    if (!file_base64) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file_type || !ALLOWED_TYPES.includes(file_type)) {
      return Response.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    let binaryStr;
    try {
      binaryStr = atob(file_base64);
    } catch {
      return Response.json({ error: 'Invalid file data' }, { status: 400 });
    }

    if (binaryStr.length > MAX_FILE_BYTES) {
      return Response.json({ error: 'File too large (10MB max)' }, { status: 400 });
    }

    // Convert base64 to blob
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: file_type });
    const safeName = (file_name || 'upload.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    const file = new File([blob], safeName, { type: file_type });

    const result = await base44.asServiceRole.integrations.Core.UploadFile({ file });
    return Response.json({ file_url: result.file_url });

  } catch (error) {
    console.error('uploadPublicFile error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});