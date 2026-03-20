import { Sparkles, ArrowLeft, Shirt, User } from 'lucide-react';
import { BACKGROUNDS } from '@/components/studio/BackgroundSelector';
import { GARMENT_TYPES } from '@/components/studio/GarmentSettings';

const BODY_LABEL = { slim: 'Slim', regular: 'Regular', plus: 'Plus Size', athletic: 'Athletic' };
const POSE_LABEL = { front: 'Classic Front', hands_on_hips: 'Hands on Hips', walking: 'Walking', casual: 'Casual' };

export default function ReviewStep({
  garmentUrl,
  modelConfig,
  selectedBackground,
  garmentSettings,
  credits,
  onConfirm,
  onChangeModel,
  onChangeBackground,
  onBack,
}) {
  const bg = BACKGROUNDS?.find(b => b.id === selectedBackground);
  const typeEntry = GARMENT_TYPES?.find(t => t.value === garmentSettings.garmentType);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A1A2E] px-5 py-4">
        <p className="font-playfair text-lg font-bold text-white">Review Your Selections</p>
        <p className="text-xs font-dm text-white/60 mt-0.5">
          FASHN AI will generate a professional model wearing your garment.
        </p>
      </div>

      <div className="p-4 space-y-4">

        {/* Garment preview */}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-1">
            <Shirt size={10} /> Your Garment
          </p>
          <div className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100 w-40" style={{ aspectRatio: '3/4' }}>
            <img src={garmentUrl} alt="Garment" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs font-dm text-gray-500">{typeEntry?.label || garmentSettings.garmentType}</p>
        </div>

        {/* Model config summary */}
        <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-xl">
          <User size={14} className="text-[#1A1A2E] mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-dm font-semibold text-[#1A1A2E]">AI Model</p>
            <p className="text-[11px] font-dm text-gray-500 capitalize mt-0.5">
              {modelConfig?.gender === 'male' ? 'Male' : 'Female'} · {BODY_LABEL[modelConfig?.bodyType] || modelConfig?.bodyType} · {POSE_LABEL[modelConfig?.pose] || modelConfig?.pose}
            </p>
          </div>
          <button
            onClick={onChangeModel}
            className="text-xs font-dm font-semibold text-[#1A1A2E] underline underline-offset-2"
          >
            Change
          </button>
        </div>

        {/* Background row */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs font-dm font-semibold text-gray-700">Background</p>
            <p className="text-[11px] font-dm text-gray-400">{bg?.label} {bg?.emoji} — {bg?.desc}</p>
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
            <p className="text-sm font-dm font-semibold text-[#1A1A2E]">Generation cost</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-dm font-bold text-[#1A1A2E]">1 credit</p>
            <p className="text-[11px] font-dm text-gray-400">{credits} remaining</p>
          </div>
        </div>

        {/* Generate button */}
        <button
          onClick={onConfirm}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1A2E] text-white rounded-2xl font-playfair text-base font-bold hover:bg-[#2a2a4e] transition-colors"
        >
          <Sparkles size={18} className="text-[#E8B86D]" />
          Generate Model Photo — 1 Credit
        </button>

        {/* Change buttons */}
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