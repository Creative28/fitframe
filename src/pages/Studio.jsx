import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import UploadZone from '@/components/studio/UploadZone';
import ModelSelector from '@/components/studio/ModelSelector';
import BackgroundSelector from '@/components/studio/BackgroundSelector';
import GeneratingProgress from '@/components/studio/GeneratingProgress';
import CreditsModal from '@/components/studio/CreditsModal';
import GarmentPreview from '@/components/studio/GarmentPreview';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function Studio() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=upload, 2=model, 3=background, 4=generate
  const [garmentFile, setGarmentFile] = useState(null);
  const [garmentUrl, setGarmentUrl] = useState(null);
  const [garmentData, setGarmentData] = useState({ category: 'tops', color: '' });
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState('none');
  const [isGenerating, setIsGenerating] = useState(false);
  const [credits, setCredits] = useState(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) {
        const c = user.credits_remaining ?? 5;
        setCredits(c);
        // Grant signup bonus if first time
        if (user.credits_remaining === undefined || user.credits_remaining === null) {
          base44.auth.updateMe({ credits_remaining: 5 });
          base44.entities.CreditTransaction.create({
            amount: 5,
            type: 'signup_bonus',
            description: '5 free credits on signup',
          });
        }
      }
    }).catch(() => {});
  }, []);

  const handleFileSelect = (file, url) => {
    setGarmentFile(file);
    setGarmentUrl(url);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (!garmentUrl || !selectedModel) return;
    if (credits !== null && credits <= 0) {
      setShowCreditsModal(true);
      return;
    }

    setIsGenerating(true);

    // Create garment record
    const garment = await base44.entities.Garment.create({
      original_image_url: garmentUrl,
      category: garmentData.category,
      color: garmentData.color,
    });

    // Create generation record
    const generation = await base44.entities.Generation.create({
      garment_id: garment.id,
      model_id: selectedModel.id,
      background_type: selectedBackground,
      status: 'pending',
    });

    // Call FASHN API
    const bgPrompt = selectedBackground === 'studio'
      ? 'clean white studio background'
      : selectedBackground === 'outdoor'
      ? 'outdoor street lifestyle background'
      : selectedBackground === 'neutral'
      ? 'neutral warm wall background'
      : '';

    const res = await base44.functions.invoke('fashnApi', {
      action: 'run',
      garment_url: garmentUrl,
      model_url: selectedModel.thumbnail_url,
      category: garmentData.category,
      background: bgPrompt || undefined,
    });

    const predictionId = res.data?.prediction_id;

    await base44.entities.Generation.update(generation.id, {
      prediction_id: predictionId,
      status: 'processing',
    });

    // Poll for result
    let result = null;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const poll = await base44.functions.invoke('fashnApi', {
        action: 'status',
        prediction_id: predictionId,
      });
      if (poll.data?.status === 'completed') {
        result = poll.data;
        break;
      }
      if (poll.data?.status === 'failed') break;
    }

    if (result?.output?.[0]) {
      const resultUrl = result.output[0];
      await base44.entities.Generation.update(generation.id, {
        result_image_url: resultUrl,
        status: 'completed',
      });

      // Save to Photo library
      await base44.entities.Photo.create({
        garment_image_url: garmentUrl,
        generated_image_url: resultUrl,
        model_id: selectedModel.id,
        model_name: selectedModel.name,
        background_type: selectedBackground,
        garment_id: garment.id,
        generation_id: generation.id,
        category: garmentData.category,
      });

      // Deduct credit
      if (credits !== null) {
        const newCredits = Math.max(0, credits - 1);
        await base44.auth.updateMe({ credits_remaining: newCredits });
        await base44.entities.CreditTransaction.create({
          amount: -1,
          type: 'generation',
          description: 'Model photo generation',
          generation_id: generation.id,
        });
        setCredits(newCredits);
      }

      setIsGenerating(false);
      navigate(`/result/${generation.id}`);
    } else {
      await base44.entities.Generation.update(generation.id, { status: 'failed' });
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">
      <AppHeader title="Studio" />
      <GeneratingProgress isGenerating={isGenerating} />
      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}

      <div className="max-w-lg mx-auto px-4 py-6 space-y-8">

        {/* Step 1: Upload */}
        <div>
          <StepLabel number={1} label="Upload Your Item" done={!!garmentUrl} />
          {garmentUrl ? (
            <GarmentPreview
              imageUrl={garmentUrl}
              garmentData={garmentData}
              onChange={setGarmentData}
              onReplace={() => { setGarmentUrl(null); setGarmentFile(null); setStep(1); }}
            />
          ) : (
            <UploadZone onFileSelect={handleFileSelect} />
          )}
        </div>

        {/* Step 2: Model */}
        {step >= 2 && (
          <div>
            <StepLabel number={2} label="Choose a Model" done={!!selectedModel} />
            <ModelSelector
              selectedModelId={selectedModel?.id}
              onSelect={(m) => { setSelectedModel(m); setStep(3); }}
            />
          </div>
        )}

        {/* Step 3: Background */}
        {step >= 3 && (
          <div>
            <StepLabel number={3} label="Select Background" done={step >= 4} />
            <BackgroundSelector
              selected={selectedBackground}
              onSelect={(bg) => { setSelectedBackground(bg); setStep(4); }}
            />
          </div>
        )}

        {/* Step 4: Generate */}
        {step >= 4 && (
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !garmentUrl || !selectedModel}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#1A1A2E] text-white rounded-2xl font-playfair text-lg font-bold hover:bg-[#2a2a4e] transition-colors disabled:opacity-50 min-h-[56px]"
          >
            <Sparkles size={20} className="text-[#E8B86D]" />
            Generate Photo
            {credits !== null && (
              <span className="text-xs font-dm text-white/60 ml-1">({credits} left)</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function StepLabel({ number, label, done }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-dm ${
        done ? 'bg-[#E8B86D] text-[#1A1A2E]' : 'bg-[#1A1A2E] text-white'
      }`}>
        {done ? '✓' : number}
      </div>
      <span className="font-playfair text-lg font-semibold text-[#1A1A2E]">{label}</span>
    </div>
  );
}