import { useRef, useState } from 'react';
import { Camera, ImagePlus, AlertCircle } from 'lucide-react';

async function convertToJpg(file) {
  // If already a JPEG, skip conversion
  if (file.type === 'image/jpeg') return file;

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (blob) resolve(new File([blob], 'garment.jpg', { type: 'image/jpeg' }));
          else resolve(file); // fallback: use original
        },
        'image/jpeg',
        0.95
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fallback: use original file as-is
    };
    img.src = objectUrl;
  });
}

export default function UploadZone({ onFileSelect }) {
  const inputRef = useRef(null);
  const [preparing, setPreparing] = useState(false);

  const handleFile = async (file) => {
    setPreparing(true);
    const jpgFile = await convertToJpg(file);
    setPreparing(false);
    onFileSelect(jpgFile);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  if (preparing) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#E8B86D]/50 rounded-2xl bg-white p-10 gap-4 min-h-[240px]">
        <div className="w-10 h-10 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
        <p className="font-dm text-sm text-gray-500">Preparing your photo...</p>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed border-[#E8B86D]/50 rounded-2xl bg-white cursor-pointer hover:border-[#E8B86D] transition-colors p-10 gap-4"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="w-20 h-20 rounded-full bg-[#1A1A2E]/5 flex items-center justify-center">
        <Camera size={36} className="text-[#1A1A2E]/40" />
      </div>
      <div className="text-center">
        <p className="font-playfair text-xl text-[#1A1A2E] font-semibold">Upload Your Item</p>
        <p className="text-sm text-gray-400 font-dm mt-1">Flat-lay, hanger, or any product photo</p>
      </div>
      <div className="flex items-center gap-2 px-6 py-3.5 bg-[#1A1A2E] text-white rounded-full text-sm font-dm font-medium min-h-[48px]">
        <ImagePlus size={16} />
        Choose Photo / Take Picture
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}