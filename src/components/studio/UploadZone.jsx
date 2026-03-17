import { useRef, useState } from 'react';
import { Camera, ImagePlus, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { compressImage, getLocalPreview, isHeic } from '@/lib/compressImage';

// uploadState: null | 'preparing' | 'uploading' | 'done'
const STATE_LABELS = {
  preparing: 'Preparing image…',
  uploading: 'Uploading…',
  done: 'Ready to generate ✓',
};

export default function UploadZone({ onFileSelect }) {
  const inputRef = useRef(null);
  const [uploadState, setUploadState] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  // 0–100 fake progress for uploading phase
  const [progress, setProgress] = useState(0);

  const handleFile = async (file) => {
    // 1. Instant local preview
    const localUrl = getLocalPreview(file);
    setPreviewUrl(localUrl);
    setUploadState('preparing');
    setProgress(0);

    // 2. Compress on client (skip for HEIC — goes through Cloudinary)
    const toUpload = isHeic(file) ? file : await compressImage(file);

    // 3. Start animated progress bar
    setUploadState('uploading');
    let fakeProgress = 0;
    const ticker = setInterval(() => {
      fakeProgress = Math.min(fakeProgress + 6, 88);
      setProgress(fakeProgress);
    }, 200);

    // 4. Upload
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

    clearInterval(ticker);
    setProgress(100);
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

  if (previewUrl) {
    const isDone = uploadState === 'done';
    return (
      <div className="relative rounded-2xl overflow-hidden border-2 border-[#E8B86D]/50 bg-white" style={{ aspectRatio: '4/3' }}>
        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />

        {/* Status overlay — subtle, non-blocking */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-6">
          <div className="flex items-center justify-between mb-1.5">
            <p className={`text-xs font-dm font-semibold ${isDone ? 'text-green-400' : 'text-white'}`}>
              {STATE_LABELS[uploadState]}
            </p>
            {isDone && <CheckCircle2 size={15} className="text-green-400" />}
          </div>
          {!isDone && (
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#E8B86D] rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
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