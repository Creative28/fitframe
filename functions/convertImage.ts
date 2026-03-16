import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import sharp from 'npm:sharp@0.33.5';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = file.name || '';
    const mimeType = file.type || '';
    const isHeic =
      mimeType === 'image/heic' ||
      mimeType === 'image/heif' ||
      fileName.toLowerCase().endsWith('.heic') ||
      fileName.toLowerCase().endsWith('.heif');

    const inputBuffer = new Uint8Array(await file.arrayBuffer());

    let outputBuffer;
    let outputMime;
    let outputName;

    if (isHeic) {
      // Convert HEIC → JPG using Sharp (libvips handles HEIC natively)
      outputBuffer = await sharp(inputBuffer)
        .jpeg({ quality: 95 })
        .toBuffer();
      outputMime = 'image/jpeg';
      outputName = fileName.replace(/\.(heic|heif)$/i, '.jpg') || 'photo.jpg';
    } else {
      // Pass through as-is
      outputBuffer = inputBuffer;
      outputMime = mimeType || 'image/jpeg';
      outputName = fileName || 'photo.jpg';
    }

    // Upload converted file to Base44 storage
    const blob = new Blob([outputBuffer], { type: outputMime });
    const uploadFile = new File([blob], outputName, { type: outputMime });

    const { file_url } = await base44.asServiceRole.integrations.Core.UploadFile({ file: uploadFile });

    return Response.json({ file_url, converted: isHeic });
  } catch (error) {
    console.error('[convertImage] error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});