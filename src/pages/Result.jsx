import { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Download, ChevronLeft, Link2, ChevronDown, ChevronUp } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';

const EXPORT_OPTIONS = [
  { id: 'original', label: 'Download Original', desc: 'Full resolution' },
  { id: 'instagram', label: 'Instagram Square', desc: '1080 × 1080' },
  { id: 'portrait', label: 'Portrait (4:5)', desc: '1080 × 1350' },
  { id: 'story', label: 'Story (9:16)', desc: '1080 × 1920' },
];

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [activeTab, setActiveTab] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const [linkCode, setLinkCode] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const urls = [state.url1, state.url2 || state.url1].filter(Boolean);
  const currentUrl = urls[activeTab] || urls[0];

  const handleDownload = async (format = 'original') => {
    if (!currentUrl) return;
    const link = document.createElement('a');
    link.href = currentUrl;
    link.download = `just-fit-it-${format}-${Date.now()}.jpg`;
    link.target = '_blank';
    link.click();
    setShowExportMenu(false);
  };

  const handleCreateTryOnLink = async () => {
    if (!state.garmentId) return;
    setCreatingLink(true);
    try {
      const code = Math.random().toString(36).substring(2, 10);
      await base44.entities.TryOnLink.create({
        garment_id: state.garmentId,
        unique_code: code,
        garment_image_url: currentUrl,
        views_count: 0,
        completions_count: 0,
        is_active: true,
      });
      setLinkCode(code);
      setShowLinkModal(true);
    } catch (e) {
      console.error(e);
    } finally {
      setCreatingLink(false);
    }
  };

  const tryOnUrl = linkCode ? `${window.location.origin}/try/${linkCode}` : '';

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">
      <AppHeader title="Your Photo" />

      <div className="px-4 py-4 flex flex-col gap-4 max-w-lg mx-auto">

        {/* Hero photo — full width */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg">
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Generated fashion photo"
              className="w-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-300 text-5xl">📸</div>
          )}
        </div>

        {/* Tab switcher */}
        {urls.length > 1 && (
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100">
            {urls.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-dm font-medium transition-all min-h-[44px] ${
                  activeTab === i ? 'bg-[#1A1A2E] text-white' : 'text-gray-400'
                }`}
              >
                Photo {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Download with export options */}
        <div className="relative">
          <div className="flex gap-2">
            <button
              onClick={() => handleDownload('original')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold text-sm min-h-[52px]"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-4 py-3.5 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold text-sm min-h-[52px] flex items-center gap-1"
            >
              {showExportMenu ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>

          {showExportMenu && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg z-10 overflow-hidden">
              {EXPORT_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleDownload(opt.id)}
                  className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                >
                  <div className="text-left">
                    <p className="font-dm font-semibold text-sm text-[#1A1A2E]">{opt.label}</p>
                    <p className="font-dm text-xs text-gray-400">{opt.desc}</p>
                  </div>
                  <Download size={14} className="text-gray-400" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Secondary actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/studio')}
            className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm min-h-[52px]"
          >
            <ChevronLeft size={18} />
            New Photo
          </button>
          <button
            onClick={() => navigate('/my-photos')}
            className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm min-h-[52px]"
          >
            View Library
          </button>
        </div>

        {/* Try-on link CTA */}
        <button
          onClick={handleCreateTryOnLink}
          disabled={creatingLink}
          className="w-full py-4 bg-[#E8B86D] text-[#1A1A2E] rounded-2xl font-playfair text-lg font-bold flex items-center justify-center gap-3 hover:bg-[#d4a55e] transition-colors min-h-[56px]"
        >
          <Link2 size={20} />
          {creatingLink ? 'Creating link…' : 'Create Customer Try-On Link →'}
        </button>
      </div>

      {/* Try-on link modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center px-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 pb-10">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔗</div>
              <h3 className="font-playfair text-xl font-bold text-[#1A1A2E]">Your Try-On Link is Ready!</h3>
              <p className="text-gray-500 font-dm text-sm mt-1">Share this with your customers</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2 mb-4">
              <p className="flex-1 text-sm font-dm text-gray-600 truncate">{tryOnUrl}</p>
              <button
                onClick={() => navigator.clipboard.writeText(tryOnUrl)}
                className="px-3 py-1.5 bg-[#1A1A2E] text-white rounded-lg text-xs font-dm font-medium flex-shrink-0 min-h-[32px]"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowLinkModal(false)}
              className="w-full py-3.5 bg-gray-100 text-[#1A1A2E] rounded-xl font-dm font-medium min-h-[48px]"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}