import { useRef, useState } from 'react';
import { Camera, ImagePlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function UploadZone({ onFileSelect }) {
  const inputRef = useRef(null);
  const [preparing, setPreparing] = useState(false);

  const handleFile = async (file) => {
    setPreparing(true);

    const fileName = file.name || '';
    const mimeType = file.type || '';
    const isHeic =
      mimeType === 'image/heic' ||
      mimeType === 'image/heif' ||
      fileName.toLowerCase().endsWith('.heic') ||
      fileName.toLowerCase().endsWith('.heif');

    let file_url;

    if (isHeic) {
      // HEIC: must go through backend for Cloudinary conversion
      const formData = new FormData();
      formData.append('file', file);
      const response = await base44.functions.invoke('convertImage', formData);
      file_url = response.data.file_url;
    } else {
      // JPG/PNG/etc: upload directly from browser — much faster
      const result = await base44.integrations.Core.UploadFile({ file });
      file_url = result.file_url;
    }

    setPreparing(false);
    onFileSelect(file, file_url);
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