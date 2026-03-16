import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import { Download, RefreshCw, Share2, ChevronDown } from 'lucide-react';

const DOWNLOAD_FORMATS = [
  { label: 'Original', suffix: 'original', w: null, h: null },
  { label: 'Instagram Square', suffix: 'instagram', w: 1080, h: 1080 },
  { label: 'Portrait (4:5)', suffix: 'portrait', w: 1080, h: 1350 },
  { label: 'Story (9:16)', suffix: 'story', w: 1080, h: 1920 },
];

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [generation, setGeneration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFormats, setShowFormats] = useState(false);

  useEffect(() => {
    base44.entities.Generation.filter({ id }).then(res => {
      if (res?.[0]) setGeneration(res[0]);
      setLoading(false);
    });
  }, [id]);

  const handleDownload = async (url, format) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `just-fit-it-${format}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
      </div>
    );
  }

  if (!generation?.result_image_url) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <AppHeader title="Result" />
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
          <p className="font-playfair text-xl text-[#1A1A2E]">Generation failed or not found.</p>
          <button
            onClick={() => navigate('/studio')}
            className="px-6 py-3 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">
      <AppHeader title="Your Photo" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Result image */}
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img
            src={generation.result_image_url}
            alt="Generated model photo"
            className="w-full object-cover"
          />
        </div>

        {/* Download button */}
        <div className="relative">
          <button
            onClick={() => setShowFormats(!showFormats)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold text-base min-h-[56px]"
          >
            <Download size={18} />
            Download
            <ChevronDown size={16} className={`transition-transform ${showFormats ? 'rotate-180' : ''}`} />
          </button>
          {showFormats && (
            <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              {DOWNLOAD_FORMATS.map(fmt => (
                <button
                  key={fmt.suffix}
                  onClick={() => { handleDownload(generation.result_image_url, fmt.suffix); setShowFormats(false); }}
                  className="w-full text-left px-4 py-3 font-dm text-sm text-[#1A1A2E] hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/studio')}
            className="flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm min-h-[48px]"
          >
            <RefreshCw size={16} />
            New Photo
          </button>
          <button
            onClick={() => navigate('/my-photos')}
            className="flex items-center justify-center gap-2 py-3.5 bg-[#E8B86D]/10 text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm min-h-[48px] border border-[#E8B86D]/30"
          >
            My Photos
          </button>
        </div>
      </div>
    </div>
  );
}