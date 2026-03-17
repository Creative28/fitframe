import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { compressImage, getLocalPreview, isHeic } from '@/lib/compressImage';

const CONCURRENCY = 3;

async function uploadFile(file) {
  const toUpload = await compressImage(file);
  if (isHeic(file)) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await base44.functions.invoke('convertImage', formData);
    return response.data.file_url;
  } else {
    const result = await base44.integrations.Core.UploadFile({ file: toUpload });
    return result.file_url;
  }
}

export default function MultiUploadZone({ onFilesUploaded }) {
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files).slice(0, 30);

    // Instantly add all items to queue with local previews & 'uploading' status
    const items = fileArr.map(file => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: getLocalPreview(file),
      status: 'uploading', // uploading | done | error
      file_url: null,
    }));

    onFilesUploaded(items); // pass immediately so cards appear in grid

    // Upload in parallel batches of CONCURRENCY
    const queue = [...items];
    const inFlight = [];

    const runNext = async () => {
      if (queue.length === 0) return;
      const item = queue.shift();
      try {
        const file_url = await uploadFile(item.file);
        onFilesUploaded([{ ...item, status: 'done', file_url }]);
      } catch {
        onFilesUploaded([{ ...item, status: 'error', file_url: null }]);
      }
      await runNext();
    };

    for (let i = 0; i < Math.min(CONCURRENCY, items.length); i++) {
      inFlight.push(runNext());
    }

    await Promise.all(inFlight);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed border-[#E8B86D]/50 rounded-2xl bg-white cursor-pointer hover:border-[#E8B86D] transition-colors p-10 gap-4 min-h-[180px]"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="w-16 h-16 rounded-full bg-[#1A1A2E]/5 flex items-center justify-center">
        <ImagePlus size={28} className="text-[#1A1A2E]/40" />
      </div>
      <div className="text-center">
        <p className="font-playfair text-xl text-[#1A1A2E] font-semibold">Upload Multiple Items</p>
        <p className="text-sm text-gray-400 font-dm mt-1">Select up to 30 garment photos at once</p>
      </div>
      <div className="flex items-center gap-2 px-6 py-3.5 bg-[#1A1A2E] text-white rounded-full text-sm font-dm font-medium min-h-[48px]">
        <ImagePlus size={16} />
        Choose Photos
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}