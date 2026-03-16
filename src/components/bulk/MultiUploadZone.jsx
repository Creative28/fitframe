import { useRef, useState } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function MultiUploadZone({ onFilesUploaded }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const handleFiles = async (files) => {
    if (!files || files.length === 0) return;
    const fileArr = Array.from(files).slice(0, 30);
    setUploading(true);
    setProgress({ done: 0, total: fileArr.length });

    const uploaded = [];
    for (let i = 0; i < fileArr.length; i++) {
      const file = fileArr[i];
      const fileName = file.name || '';
      const mimeType = file.type || '';
      const isHeic =
        mimeType === 'image/heic' || mimeType === 'image/heif' ||
        fileName.toLowerCase().endsWith('.heic') || fileName.toLowerCase().endsWith('.heif');

      let file_url;
      if (isHeic) {
        const formData = new FormData();
        formData.append('file', file);
        const response = await base44.functions.invoke('convertImage', formData);
        file_url = response.data.file_url;
      } else {
        const result = await base44.integrations.Core.UploadFile({ file });
        file_url = result.file_url;
      }

      uploaded.push({ file, file_url });
      setProgress({ done: i + 1, total: fileArr.length });
    }

    setUploading(false);
    onFilesUploaded(uploaded);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  if (uploading) {
    return (
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#E8B86D]/50 rounded-2xl bg-white p-10 gap-4 min-h-[200px]">
        <Loader2 size={36} className="text-[#E8B86D] animate-spin" />
        <p className="font-dm text-sm text-gray-500">
          Uploading {progress.done} / {progress.total}…
        </p>
        <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#E8B86D] rounded-full transition-all"
            style={{ width: `${(progress.done / progress.total) * 100}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col items-center justify-center border-2 border-dashed border-[#E8B86D]/50 rounded-2xl bg-white cursor-pointer hover:border-[#E8B86D] transition-colors p-10 gap-4 min-h-[200px]"
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