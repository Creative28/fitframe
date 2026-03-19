import { Sparkles, ArrowLeft, User, Image, Shirt, Maximize2 } from 'lucide-react';
import { BACKGROUNDS } from '@/components/studio/BackgroundSelector';

const FIT_LABELS = {
  preserve: 'Preserve original fit',
  tailored: 'Slightly tailored',
  fashion: 'Fashion styled',
};

const GARMENT_LABELS = {
  hoodie: '🧥 Hoodie / Sweatshirt',
  tshirt: '👕 T-Shirt / Top',
  jacket: '🧣 Jacket / Coat',
  dress: '👗 Dress',
  pants: '👖 Pants / Bottoms',
};

export default function ReviewStep({ garmentUrl, selectedModel, selectedBackground, garmentSettings, credits, onConfirm, onChangeModel, onChangeBackground, onBack }) {
  const bg = BACKGROUNDS?.find(b => b.id === selectedBackground);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A1A2E] px-5 py-4">
        <p className="font-playfair text-lg font-bold text-white">Review Your Selections</p>
        <p className="text-xs font-dm text-white/60 mt-0.5">
          Please confirm your choices before generating. Credits are only used when final generation starts.
        </p>
      </div>

      <div className="p-4 space-y-4">

        {/* Garment + Model side by side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Garment */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <Shirt size={10} /> Your Garment
            </p>
            <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100" style={{ aspectRatio: '3/4' }}>
              <img src={garmentUrl} alt="Garment" className="w-full h-full object-cover" />
            </div>
            <p className="text-xs font-dm text-gray-600 font-medium">
              {GARMENT_LABELS[garmentSettings.garmentType] || garmentSettings.garmentType}
            </p>
            <p className="text-[11px] font-dm text-gray-400">{FIT_LABELS[garmentSettings.fitMode]}</p>
          </div>

          {/* Model */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
              <User size={10} /> AI Model
            </p>
            <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100" style={{ aspectRatio: '3/4' }}>
              <img src={selectedModel.thumbnail_url} alt={selectedModel.name} className="w-full h-full object-cover object-top" />
            </div>
            <p className="text-xs font-dm text-gray-600 font-medium">{selectedModel.name}</p>
            <p className="text-[11px] font-dm text-gray-400">{selectedModel.body_type} · {selectedModel.style}</p>
          </div>
        </div>

        {/* Background */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <Image size={14} className="text-gray-400" />
            <div>
              <p className="text-xs font-dm font-semibold text-gray-700">Background</p>
              <p className="text-[11px] font-dm text-gray-400">{bg?.label || 'None'} {bg?.emoji}</p>
            </div>
          </div>
          <button
            onClick={onChangeBackground}
            className="text-xs font-dm font-semibold text-[#1A1A2E] underline underline-offset-2"
          >
            Change
          </button>
        </div>

        {/* Credit cost */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#E8B86D]/10 border border-[#E8B86D]/30 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#E8B86D]" />
            <p className="text-sm font-dm font-semibold text-[#1A1A2E]">Cost</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-dm font-bold text-[#1A1A2E]">1 credit</p>
            <p className="text-[11px] font-dm text-gray-400">{credits} remaining</p>
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1A2E] text-white rounded-2xl font-playfair text-base font-bold hover:bg-[#2a2a4e] transition-colors"
        >
          <Sparkles size={18} className="text-[#E8B86D]" />
          Generate Final Image — 1 Credit
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onChangeModel}
            className="py-3 bg-gray-100 text-gray-700 rounded-xl font-dm font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Change Model
          </button>
          <button
            onClick={onChangeBackground}
            className="py-3 bg-gray-100 text-gray-700 rounded-xl font-dm font-semibold text-sm hover:bg-gray-200 transition-colors"
          >
            Change Background
          </button>
        </div>

        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 text-gray-400 font-dm text-sm hover:text-gray-600"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    </div>
  );
}