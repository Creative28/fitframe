import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Download, RefreshCw, ChevronLeft, Image, BookmarkPlus, Share2, Link2 } from 'lucide-react';
import AppHeader from '@/components/layout/AppHeader';

const BACKGROUNDS = [
  { id: 'none', label: 'Original' },
  { id: 'white_studio', label: 'White Studio' },
  { id: 'lifestyle_cafe', label: 'Café' },
  { id: 'outdoor_street', label: 'Street' },
  { id: 'marble', label: 'Marble' },
  { id: 'beach', label: 'Beach' },
];

export default function Result() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const [activeTab, setActiveTab] = useState(0);
  const [selectedBg, setSelectedBg] = useState('none');
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const [linkCode, setLinkCode] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);

  const urls = [state.url1, state.url2 || state.url1].filter(Boolean);
  const currentUrl = urls[activeTab] || urls[0];

  const handleDownload = async () => {
    if (!currentUrl) return;
    const a = document.createElement('a');
    a.href = currentUrl;
    a.download = `fitframe-photo-${Date.now()}.jpg`;
    a.target = '_blank';
    a.click();
  };

  const handleSaveToCatalog = async () => {
    if (saved || !state.garmentId) return;
    setSaving(true);
    try {
      await base44.entities.Garment.update(state.garmentId, {
        name: state.displayCategory || 'My Item',
        color: state.color || '',
        category: state.category || 'tops',
      });
      setSaved(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTryOnLink = async () => {
    if (!state.garmentId) return;
    setCreatingLink(true);
    try {
      const code = Math.random().toString(36).substring(2, 10);
      const link = await base44.entities.TryOnLink.create({
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
    <div className="min-h-screen bg-[#FAFAF8]">
      <AppHeader title="Your Photo" />

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Hero photo */}
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg" style={{ minHeight: 400 }}>
          {currentUrl ? (
            <img
              src={currentUrl}
              alt="Generated fashion photo"
              className="w-full object-cover"
              style={{ maxHeight: 520 }}
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-gray-300 text-4xl">📸</div>
          )}
        </div>

        {/* Tab switcher */}
        {urls.length > 1 && (
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-gray-100">
            {urls.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-dm font-medium transition-all ${
                  activeTab === i ? 'bg-[#1A1A2E] text-white' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Photo {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3.5 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold text-sm"
          >
            <Download size={18} />
            Download
          </button>
          <button
            onClick={() => navigate('/studio')}
            className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm"
          >
            <ChevronLeft size={18} />
            Change Model
          </button>
          <button
            onClick={() => setShowBgPanel(!showBgPanel)}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-dm font-semibold text-sm border ${
              showBgPanel ? 'bg-[#E8B86D]/10 border-[#E8B86D] text-[#1A1A2E]' : 'bg-white border-gray-200 text-[#1A1A2E]'
            }`}
          >
            <Image size={18} />
            Background
          </button>
          <button
            onClick={handleSaveToCatalog}
            disabled={saving || saved}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl font-dm font-semibold text-sm border ${
              saved ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-gray-200 text-[#1A1A2E]'
            }`}
          >
            <BookmarkPlus size={18} />
            {saving ? 'Saving…' : saved ? 'Saved!' : 'Save to Catalog'}
          </button>
        </div>

        {/* Background panel */}
        {showBgPanel && (
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="font-playfair text-sm font-semibold text-[#1A1A2E] mb-3">Choose Background</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {BACKGROUNDS.map(bg => (
                <button
                  key={bg.id}
                  onClick={() => setSelectedBg(bg.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-dm transition-all ${
                    selectedBg === bg.id
                      ? 'bg-[#1A1A2E] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Try-on link CTA */}
        <button
          onClick={handleCreateTryOnLink}
          disabled={creatingLink}
          className="w-full py-4 bg-[#E8B86D] text-[#1A1A2E] rounded-2xl font-playfair text-lg font-bold flex items-center justify-center gap-3 hover:bg-[#d4a55e] transition-colors"
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
                onClick={() => { navigator.clipboard.writeText(tryOnUrl); }}
                className="px-3 py-1.5 bg-[#1A1A2E] text-white rounded-lg text-xs font-dm font-medium flex-shrink-0"
              >
                Copy
              </button>
            </div>
            <button
              onClick={() => setShowLinkModal(false)}
              className="w-full py-3 bg-gray-100 text-[#1A1A2E] rounded-xl font-dm font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}