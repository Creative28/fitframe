import { useState } from 'react';
import { Sparkles, ArrowLeft, User, Shirt, RefreshCw, Eye, Check } from 'lucide-react';
import { BACKGROUNDS } from '@/components/studio/BackgroundSelector';
import { base44 } from '@/api/base44Client';
import { GARMENT_TYPES } from '@/components/studio/GarmentSettings';

const FIT_LABELS = {
  preserve: 'Preserve original fit',
  tailored: 'Slightly tailored',
  fashion: 'Fashion styled',
};

const BG_PROMPTS = {
  studio: 'clean white photography studio background, professional lighting',
  outdoor: 'outdoor lifestyle street background, natural light',
  neutral: 'neutral warm grey wall background, soft light',
};

export default function ReviewStep({
  garmentUrl,
  selectedModel,
  selectedBackground,
  garmentSettings,
  credits,
  onConfirm,
  onChangeModel,
  onChangeBackground,
  onBack,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  const bg = BACKGROUNDS?.find(b => b.id === selectedBackground);
  const typeEntry = GARMENT_TYPES?.find(t => t.value === garmentSettings.garmentType);
  const resolvedCategory = typeEntry?.category || 'tops';

  const handlePreview = async () => {
    setIsPreviewing(true);
    setPreviewUrl(null);
    setPreviewError(null);

    // Step 1: run try-on
    const res = await base44.functions.invoke('fashnApi', {
      action: 'run',
      payload: {
        model_image: selectedModel.thumbnail_url,
        garment_image: garmentUrl,
        category: resolvedCategory,
        garment_type: garmentSettings.garmentType,
        fit_mode: garmentSettings.fitMode,
      },
    });

    const predictionId = res.data?.prediction_id;
    if (!predictionId) {
      setPreviewError('Preview failed. Please try again.');
      setIsPreviewing(false);
      return;
    }

    // Poll for try-on result
    let tryonUrl = null;
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const poll = await base44.functions.invoke('fashnApi', {
        action: 'status',
        payload: { prediction_id: predictionId },
      });
      if (poll.data?.status === 'completed' && poll.data?.output?.[0]) {
        tryonUrl = poll.data.output[0];
        break;
      }
      if (poll.data?.status === 'failed') break;
    }

    if (!tryonUrl) {
      setPreviewError('Preview failed. Please try again.');
      setIsPreviewing(false);
      return;
    }

    // Step 2: Apply background if not 'none'
    if (selectedBackground !== 'none' && BG_PROMPTS[selectedBackground]) {
      const bgRes = await base44.functions.invoke('fashnApi', {
        action: 'change_background',
        payload: {
          image: tryonUrl,
          prompt: BG_PROMPTS[selectedBackground],
        },
      });

      const bgPredId = bgRes.data?.prediction_id;
      if (bgPredId) {
        for (let i = 0; i < 30; i++) {
          await new Promise(r => setTimeout(r, 1000));
          const poll = await base44.functions.invoke('fashnApi', {
            action: 'status',
            payload: { prediction_id: bgPredId },
          });
          if (poll.data?.status === 'completed' && poll.data?.output?.[0]) {
            tryonUrl = poll.data.output[0];
            break;
          }
          if (poll.data?.status === 'failed') break;
        }
      }
    }

    setPreviewUrl(tryonUrl);
    setIsPreviewing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-[#1A1A2E] px-5 py-4">
        <p className="font-playfair text-lg font-bold text-white">Review Your Selections</p>
        <p className="text-xs font-dm text-white/60 mt-0.5">
          Preview the result first — credits are only used when you click "Generate Final Image".
        </p>
      </div>

      <div className="p-4 space-y-4">

        {/* Preview result OR side-by-side thumbnails */}
        {previewUrl ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-dm font-semibold text-green-600 uppercase tracking-wide flex items-center gap-1">
                <Check size={10} /> Preview Result
              </p>
              <button
                onClick={() => setPreviewUrl(null)}
                className="text-[10px] font-dm text-gray-400 underline"
              >
                Back to selections
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-gray-100 w-full" style={{ aspectRatio: '2/3' }}>
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover object-top" />
            </div>
            <p className="text-xs font-dm text-gray-500 text-center">
              {bg?.id !== 'none' ? `Background: ${bg?.label} ${bg?.emoji}` : 'Original background'}
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}

        {/* Preview error */}
        {previewError && (
          <p className="text-xs font-dm text-red-500 text-center">{previewError}</p>
        )}

        {/* Preview button — free, no credit cost */}
        {!previewUrl && (
          <button
            onClick={handlePreview}
            disabled={isPreviewing}
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-[#1A1A2E] text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm hover:bg-[#1A1A2E]/5 transition-colors disabled:opacity-50"
          >
            {isPreviewing ? (
              <>
                <RefreshCw size={15} className="animate-spin" />
                Generating preview… (~15s)
              </>
            ) : (
              <>
                <Eye size={15} />
                Preview Result (Free — no credit used)
              </>
            )}
          </button>
        )}

        {/* Credit cost */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#E8B86D]/10 border border-[#E8B86D]/30 rounded-xl">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#E8B86D]" />
            <p className="text-sm font-dm font-semibold text-[#1A1A2E]">Final generation cost</p>
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
          Generate Final Image — 1 Credit
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