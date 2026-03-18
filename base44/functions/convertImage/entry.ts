import { createClientFromRequest } from 'npm:@base44/sdk@0.8.21';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = (file.name || '').toLowerCase();
    const mimeType = (file.type || '').toLowerCase();
    const isHeic =
      mimeType === 'image/heic' ||
      mimeType === 'image/heif' ||
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif');

    if (!isHeic) {
      // Non-HEIC: upload directly via Base44
      const { file_url } = await base44.asServiceRole.integrations.Core.UploadFile({ file });
      return Response.json({ file_url, converted: false });
    }

    // HEIC: stream directly to Cloudinary (no CPU-heavy processing)
    const CLOUDINARY_CLOUD_NAME = Deno.env.get('CLOUDINARY_CLOUD_NAME');
    const CLOUDINARY_UPLOAD_PRESET = Deno.env.get('CLOUDINARY_UPLOAD_PRESET');

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      return Response.json({ error: 'Cloudinary not configured' }, { status: 500 });
    }

    // Read file as ArrayBuffer and re-create as Blob to avoid any processing
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'image/heic' });

    const cloudinaryForm = new FormData();
    cloudinaryForm.append('file', blob, fileName || 'upload.heic');
    cloudinaryForm.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: cloudinaryForm }
    );

    if (!cloudRes.ok) {
      const err = await cloudRes.text();
      console.error('[convertImage] Cloudinary error:', err);
      return Response.json({ error: 'Cloudinary conversion failed', detail: err }, { status: 500 });
    }

    const cloudData = await cloudRes.json();
    // Use the JPG version URL from Cloudinary (auto-converts HEIC → JPG)
    const jpgUrl = cloudData.secure_url.replace(/\.[^.]+$/, '.jpg');

    return Response.json({ file_url: jpgUrl, converted: true });
  } catch (error) {
    console.error('[convertImage] error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});