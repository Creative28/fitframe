/**
 * Compresses an image file on the client side before upload.
 * - Resizes to max 1400px width/height
 * - Converts to JPEG at 75% quality
 * - Skips compression for HEIC/HEIF (handled server-side)
 * Returns a compressed File object + a local preview URL.
 */
export function getLocalPreview(file) {
  return URL.createObjectURL(file);
}

export function isHeic(file) {
  const mime = file.type || '';
  const name = file.name?.toLowerCase() || '';
  return mime === 'image/heic' || mime === 'image/heif' ||
    name.endsWith('.heic') || name.endsWith('.heif');
}

export async function compressImage(file, { maxDim = 1400, quality = 0.75 } = {}) {
  // HEIC must go through backend — skip compression
  if (isHeic(file)) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down if needed
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height / width) * maxDim);
          width = maxDim;
        } else {
          width = Math.round((width / height) * maxDim);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fallback: use original
    };

    img.src = objectUrl;
  });
}