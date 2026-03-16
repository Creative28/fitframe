import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import UploadZone from '@/components/studio/UploadZone.jsx';
import ModelSelector, { BUILTIN_MODELS } from '@/components/studio/ModelSelector';
import BackgroundSelector from '@/components/studio/BackgroundSelector.jsx';
import GeneratingProgress from '@/components/studio/GeneratingProgress';
import CreditsModal from '@/components/studio/CreditsModal';
import { Sparkles, ChevronLeft } from 'lucide-react';

export default function Studio() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('upload'); // upload | configure | generating
  const [garmentFile, setGarmentFile] = useState(null);
  const [garmentImageUrl, setGarmentImageUrl] = useState(null);
  const [garmentUploadedUrl, setGarmentUploadedUrl] = useState(null);
  const [garmentId, setGarmentId] = useState(null);
  const [category, setCategory] = useState('tops');
  const [displayCategory, setDisplayCategory] = useState('Top');
  const [color, setColor] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [backgroundType, setBackgroundType] = useState('none');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      // Grant signup bonus if first time (no credits set yet)
      if (u && u.credits_remaining === undefined) {
        base44.auth.updateMe({ credits_remaining: 5 });
        u.credits_remaining = 5;
      }
      setUser(u);
    }).catch(() => {});
  }, []);

  const handleFileSelect = async (file, uploadedUrl) => {
    const objectUrl = URL.createObjectURL(file);
    setGarmentFile(file);
    setGarmentImageUrl(objectUrl);
    setGarmentUploadedUrl(uploadedUrl);
    setStep('configure');
    setIsAnalyzing(true);

    try {
      // Analyze garment with AI (best-effort)
      let analysisData = {};
      try {
        const analysis = await base44.functions.invoke('fashnApi', {
          action: 'remove_background',
          payload: { image_url: uploadedUrl }
        });
        analysisData = analysis.data || {};
      } catch (e) {
        console.warn('Analysis failed, using defaults');
      }

      if (analysisData.category) setCategory(analysisData.category);
      if (analysisData.display_category) setDisplayCategory(analysisData.display_category);
      if (analysisData.color) setColor(analysisData.color);

      const garment = await base44.entities.Garment.create({
        original_image_url: uploadedUrl,
        processed_image_url: uploadedUrl,
        category: analysisData.category || 'tops',
        display_category: analysisData.display_category || 'Top',
        color: analysisData.color || '',
        name: analysisData.name || 'My Item',
      });
      setGarmentId(garment.id);
    } catch (err) {
      console.error('Setup error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedModel) return;
    const credits = user?.credits_remaining ?? 5;
    if (credits < 1) {
      setShowCreditsModal(true);
      return;
    }

    setIsGenerating(true);

    try {
      await base44.auth.updateMe({ credits_remaining: credits - 1 });

      const [run1, run2] = await Promise.all([
        base44.functions.invoke('fashnApi', {
          action: 'run',
          payload: { model_image: selectedModel.thumbnail_url, garment_image: garmentUploadedUrl, category }
        }),
        base44.functions.invoke('fashnApi', {
          action: 'run',
          payload: { model_image: selectedModel.thumbnail_url, garment_image: garmentUploadedUrl, category }
        })
      ]);

      const predId1 = run1.data?.prediction_id;
      const predId2 = run2.data?.prediction_id;

      const generation = await base44.entities.Generation.create({
        garment_id: garmentId,
        model_id: selectedModel.id,
        background_type: backgroundType,
        prediction_id: predId1,
        prediction_id_2: predId2,
        status: 'processing',
      });

      await base44.entities.CreditTransaction.create({
        amount: -1,
        type: 'generation',
        description: `Generated photo — ${displayCategory}`,
        generation_id: generation.id
      });

      const pollResult = async (predId, maxMs = 120000) => {
        const start = Date.now();
        while (Date.now() - start < maxMs) {
          await new Promise(r => setTimeout(r, 3000));
          const s = await base44.functions.invoke('fashnApi', { action: 'status', payload: { prediction_id: predId } });
          if (s.data?.status === 'completed' && s.data?.output?.length > 0) return s.data.output[0];
          if (s.data?.status === 'failed') throw new Error('Generation failed');
        }
        throw new Error('Timeout');
      };

      let url1, url2;
      try {
        [url1, url2] = await Promise.all([
          pollResult(predId1),
          pollResult(predId2).catch(() => null)
        ]);
      } catch (pollErr) {
        // Refund credit
        await base44.auth.updateMe({ credits_remaining: credits });
        await base44.entities.CreditTransaction.create({ amount: 1, type: 'refund', description: 'Generation failed — credit refunded', generation_id: generation.id });
        await base44.entities.Generation.update(generation.id, { status: 'failed' });
        setIsGenerating(false);
        alert('Generation failed — your credit was returned. Please try again.');
        return;
      }

      await base44.entities.Generation.update(generation.id, {
        status: 'completed',
        result_image_url: url1,
        result_image_url_2: url2 || url1,
        background_type: backgroundType,
      });

      // Save to Photo library
      const user2 = await base44.auth.me();
      await base44.entities.Photo.create({
        garment_image_url: garmentUploadedUrl,
        generated_image_url: url1,
        generated_image_url_2: url2 || url1,
        model_id: selectedModel.id,
        model_name: selectedModel.name,
        background_type: backgroundType,
        garment_id: garmentId,
        generation_id: generation.id,
        category,
      });

      setIsGenerating(false);
      navigate(`/result/${generation.id}`, {
        state: { url1, url2: url2 || url1, garmentId, garmentImageUrl: garmentUploadedUrl, selectedModel, category, displayCategory, color, backgroundType, generationId: generation.id }
      });

    } catch (err) {
      console.error('Generation error:', err);
      setIsGenerating(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const canGenerate = selectedModel && garmentUploadedUrl && !isAnalyzing;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">
      <AppHeader title="Studio" />

      <div className="px-4 py-6 flex flex-col gap-6 max-w-lg mx-auto">
        {/* STEP 1 — Upload */}
        {step === 'upload' && (
          <div className="flex flex-col gap-4">
            <div className="text-center py-4">
              <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">Create a Model Photo</h2>
              <p className="text-gray-400 font-dm text-sm mt-2">Upload any garment photo — we'll put it on a model</p>
            </div>
            <UploadZone onFileSelect={handleFileSelect} />
            <p className="text-center text-xs text-gray-400 font-dm">
              Works best with flat-lay, hanger, or mannequin photos
            </p>
          </div>
        )}

        {/* STEPS 2–4 — Configure & Generate */}
        {step === 'configure' && (
          <div className="flex flex-col gap-6">
            {/* Garment thumbnail */}
            {isAnalyzing ? (
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3 border border-gray-100">
                <div className="w-10 h-10 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
                <p className="font-dm text-sm text-gray-500">Analyzing your garment…</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <div className="relative bg-gray-50 flex items-center justify-center" style={{ minHeight: 200 }}>
                  <img
                    src={garmentImageUrl}
                    alt="Your garment"
                    className="max-h-52 w-auto object-contain"
                    style={{ maxWidth: '100%' }}
                  />
                  <div className="absolute top-3 right-3 bg-[#1A1A2E]/70 text-white text-xs px-2.5 py-1 rounded-full font-dm">
                    {displayCategory} · {color}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Model */}
            <ModelSelector selectedModelId={selectedModel?.id} onSelect={setSelectedModel} />

            {/* Step 3 — Background */}
            <BackgroundSelector selected={backgroundType} onSelect={setBackgroundType} />

            {/* Step 4 — Generate */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full rounded-2xl font-playfair text-lg font-semibold flex items-center justify-center gap-3 transition-all min-h-[56px] ${
                canGenerate
                  ? 'bg-[#1A1A2E] text-white active:scale-[0.98] hover:bg-[#2a2a4e]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles size={20} className={canGenerate ? 'text-[#E8B86D]' : ''} />
              Generate Photo
              <span className="text-xs font-dm opacity-70 font-normal">(1 credit)</span>
            </button>

            <button
              onClick={() => { setStep('upload'); setGarmentImageUrl(null); setGarmentUploadedUrl(null); setSelectedModel(null); setBackgroundType('none'); }}
              className="text-center text-sm text-gray-400 font-dm hover:text-gray-600 py-2"
            >
              ← Upload a different photo
            </button>
          </div>
        )}
      </div>

      <GeneratingProgress isGenerating={isGenerating} />
      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}
    </div>
  );
}