import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import UploadZone from '@/components/studio/UploadZone';
import GarmentPreview from '@/components/studio/GarmentPreview';
import ModelSelector, { BUILTIN_MODELS } from '@/components/studio/ModelSelector';
import GeneratingProgress from '@/components/studio/GeneratingProgress';
import CreditsModal from '@/components/studio/CreditsModal';
import { Sparkles } from 'lucide-react';

export default function Studio() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState('upload'); // upload | configure | generating
  const [garmentFile, setGarmentFile] = useState(null);
  const [garmentImageUrl, setGarmentImageUrl] = useState(null);
  const [garmentId, setGarmentId] = useState(null);
  const [category, setCategory] = useState('tops');
  const [displayCategory, setDisplayCategory] = useState('Top');
  const [color, setColor] = useState('');
  const [selectedModel, setSelectedModel] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const handleFileSelect = async (file) => {
    const objectUrl = URL.createObjectURL(file);
    setGarmentFile(file);
    setGarmentImageUrl(objectUrl);
    setStep('configure');
    setIsAnalyzing(true);

    try {
      // Upload the file first
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Analyze the garment
      const analysis = await base44.functions.invoke('fashnApi', {
        action: 'remove_background',
        payload: { image_url: file_url }
      });
      const data = analysis.data;

      if (data?.category) setCategory(data.category);
      if (data?.display_category) setDisplayCategory(data.display_category);
      if (data?.color) setColor(data.color);

      // Create garment record
      const garment = await base44.entities.Garment.create({
        original_image_url: file_url,
        processed_image_url: file_url, // In production, you'd run bg removal
        category: data?.category || 'tops',
        display_category: data?.display_category || 'Top',
        color: data?.color || '',
        name: data?.name || 'My Item',
      });
      setGarmentId(garment.id);
    } catch (err) {
      console.error('Analysis failed:', err);
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
      // Deduct credit
      await base44.auth.updateMe({ credits_remaining: (user.credits_remaining ?? 5) - 1 });

      // Start generation 1
      const run1 = await base44.functions.invoke('fashnApi', {
        action: 'run',
        payload: {
          model_image: selectedModel.thumbnail_url,
          garment_image: garmentImageUrl,
          category
        }
      });

      // Start generation 2 (slight variation)
      const run2 = await base44.functions.invoke('fashnApi', {
        action: 'run',
        payload: {
          model_image: selectedModel.thumbnail_url,
          garment_image: garmentImageUrl,
          category
        }
      });

      const predId1 = run1.data?.prediction_id;
      const predId2 = run2.data?.prediction_id;

      // Create generation record
      const generation = await base44.entities.Generation.create({
        garment_id: garmentId,
        model_id: selectedModel.id,
        prediction_id: predId1,
        prediction_id_2: predId2,
        status: 'processing',
      });

      // Log credit transaction
      await base44.entities.CreditTransaction.create({
        amount: -1,
        type: 'generation',
        description: `Generated photo for ${displayCategory}`,
        generation_id: generation.id
      });

      // Poll for results
      const pollResult = async (predId, maxMs = 30000) => {
        const start = Date.now();
        while (Date.now() - start < maxMs) {
          await new Promise(r => setTimeout(r, 2000));
          const statusRes = await base44.functions.invoke('fashnApi', {
            action: 'status',
            payload: { prediction_id: predId }
          });
          const s = statusRes.data;
          if (s?.status === 'completed' && s?.output?.length > 0) return s.output[0];
          if (s?.status === 'failed') throw new Error('Generation failed');
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
        // Refund credit on failure
        await base44.auth.updateMe({ credits_remaining: (user.credits_remaining ?? 5) });
        await base44.entities.CreditTransaction.create({
          amount: 1,
          type: 'refund',
          description: 'Generation failed — credit refunded',
          generation_id: generation.id
        });
        await base44.entities.Generation.update(generation.id, { status: 'failed' });
        setIsGenerating(false);
        alert('Generation failed — your credit was returned. Please try again.');
        return;
      }

      await base44.entities.Generation.update(generation.id, {
        status: 'completed',
        result_image_url: url1,
        result_image_url_2: url2 || url1
      });

      setIsGenerating(false);
      navigate(`/result/${generation.id}`, {
        state: { url1, url2: url2 || url1, garmentId, selectedModel, category, displayCategory, color }
      });

    } catch (err) {
      console.error('Generation error:', err);
      setIsGenerating(false);
      alert('Something went wrong. Please try again.');
    }
  };

  const canGenerate = selectedModel && garmentImageUrl && !isAnalyzing;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AppHeader title="FitFrame" />
      <div className="px-4 py-6 flex flex-col gap-6">
        {step === 'upload' && (
          <div className="flex flex-col gap-4">
            <div className="text-center py-4">
              <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">Create a Model Photo</h2>
              <p className="text-gray-400 font-dm text-sm mt-2">Upload any garment photo — we'll put it on a model</p>
            </div>
            <UploadZone onFileSelect={handleFileSelect} />
            <div className="text-center text-xs text-gray-400 font-dm">
              Works best with flat-lay, hanger, or mannequin photos
            </div>
          </div>
        )}

        {step === 'configure' && (
          <div className="flex flex-col gap-6">
            {isAnalyzing ? (
              <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-3 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
                <p className="font-dm text-sm text-gray-500">Analyzing your garment…</p>
              </div>
            ) : (
              <GarmentPreview
                imageUrl={garmentImageUrl}
                category={category}
                color={color}
                displayCategory={displayCategory}
                onCategoryChange={setCategory}
                onColorChange={setColor}
              />
            )}

            <ModelSelector selectedModelId={selectedModel?.id} onSelect={setSelectedModel} />

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className={`w-full py-4 rounded-2xl font-playfair text-lg font-semibold flex items-center justify-center gap-3 transition-all ${
                canGenerate
                  ? 'bg-[#1A1A2E] text-white active:scale-98 hover:bg-[#2a2a4e]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Sparkles size={20} className={canGenerate ? 'text-[#E8B86D]' : ''} />
              Generate Photo
              <span className="text-xs font-dm opacity-70 font-normal">(1 credit)</span>
            </button>

            <button
              onClick={() => { setStep('upload'); setGarmentImageUrl(null); setSelectedModel(null); }}
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