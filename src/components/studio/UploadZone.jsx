import { useRef, useState } from 'react';
import { Camera, ImagePlus, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { compressImage, getLocalPreview, isHeic } from '@/lib/compressImage';

export default function UploadZone({ onFileSelect }) {
  const inputRef = useRef(null);
  // uploadState: null | 'uploading' | 'done'
  const [uploadState, setUploadState] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = async (file) => {
    // 1. Show instant local preview
    const localUrl = getLocalPreview(file);
    setPreviewUrl(localUrl);
    setUploadState('uploading');

    // 2. Compress (skip for HEIC)
    const toUpload = await compressImage(file);

    // 3. Upload in background
    let file_url;
    if (isHeic(file)) {
      const formData = new FormData();
      formData.append('file', file);
      const response = await base44.functions.invoke('convertImage', formData);
      file_url = response.data.file_url;
    } else {
      const result = await base44.integrations.Core.UploadFile({ file: toUpload });
      file_url = result.file_url;
    }

    setUploadState('done');
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

  // Uploading state: show preview with overlay
  if (previewUrl) {
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#E8B86D]/50 bg-white" style={{ aspectRatio: '4/3' }}>
        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        {uploadState === 'uploading' && (
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <p className="text-white text-xs font-dm font-medium">Uploading…</p>
          </div>
        )}
        {uploadState === 'done' && (
          <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1">
            <CheckCircle2 size={16} />
          </div>
        )}
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