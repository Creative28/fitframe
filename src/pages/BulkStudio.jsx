import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import GeneratingProgress from '@/components/studio/GeneratingProgress';
import CreditsModal from '@/components/studio/CreditsModal';
import MultiUploadZone from '@/components/bulk/MultiUploadZone';
import GarmentQueueCard from '@/components/bulk/GarmentQueueCard';
import GenerateDrawer from '@/components/bulk/GenerateDrawer';
import { ImagePlus, Sparkles } from 'lucide-react';

export default function BulkStudio() {
  const navigate = useNavigate();
  const [garments, setGarments] = useState([]); // { id, file_url, status, result_url }
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [activeGeneratingId, setActiveGeneratingId] = useState(null);
  const [credits, setCredits] = useState(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) setCredits(user.credits_remaining ?? 5);
    }).catch(() => {});
  }, []);

  const handleFilesUploaded = (uploaded) => {
    const newGarments = uploaded.map(({ file_url }) => ({
      id: Math.random().toString(36).slice(2),
      file_url,
      status: 'pending',
      result_url: null,
    }));
    setGarments(prev => [...prev, ...newGarments]);
  };

  const handleDelete = (id) => {
    setGarments(prev => prev.filter(g => g.id !== id));
    if (selectedGarment?.id === id) setSelectedGarment(null);
  };

  const handleGenerate = async (garment, model, background) => {
    if (credits !== null && credits <= 0) {
      setShowCreditsModal(true);
      return;
    }

    setSelectedGarment(null);
    setActiveGeneratingId(garment.id);
    setGarments(prev => prev.map(g => g.id === garment.id ? { ...g, status: 'processing' } : g));

    // Create garment record
    const garmentRecord = await base44.entities.Garment.create({
      original_image_url: garment.file_url,
      category: 'tops',
    });

    // Create generation record
    const generation = await base44.entities.Generation.create({
      garment_id: garmentRecord.id,
      model_id: model.id,
      background_type: background,
      status: 'pending',
    });

    // Call FASHN API
    const res = await base44.functions.invoke('fashnApi', {
      action: 'run',
      payload: {
        model_image: model.thumbnail_url,
        garment_image: garment.file_url,
        category: 'tops',
      },
    });

    const predictionId = res.data?.prediction_id;

    await base44.entities.Generation.update(generation.id, {
      prediction_id: predictionId,
      status: 'processing',
    });

    // Poll for result
    let result = null;
    for (let i = 0; i < 60; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const poll = await base44.functions.invoke('fashnApi', {
        action: 'status',
        payload: { prediction_id: predictionId },
      });
      if (poll.data?.status === 'completed') { result = poll.data; break; }
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
        garment_image_url: garment.file_url,
        generated_image_url: resultUrl,
        model_id: model.id,
        model_name: model.name,
        background_type: background,
        garment_id: garmentRecord.id,
        generation_id: generation.id,
        category: 'tops',
      });

      // Deduct credit
      if (credits !== null) {
        const newCredits = Math.max(0, credits - 1);
        await base44.auth.updateMe({ credits_remaining: newCredits });
        await base44.entities.CreditTransaction.create({
          amount: -1,
          type: 'generation',
          description: 'Bulk model photo generation',
          generation_id: generation.id,
        });
        setCredits(newCredits);
      }

      setGarments(prev => prev.map(g =>
        g.id === garment.id ? { ...g, status: 'completed', result_url: resultUrl } : g
      ));
    } else {
      await base44.entities.Generation.update(generation.id, { status: 'failed' });
      setGarments(prev => prev.map(g =>
        g.id === garment.id ? { ...g, status: 'failed' } : g
      ));
    }

    setActiveGeneratingId(null);
  };

  const pendingCount = garments.filter(g => g.status === 'pending').length;
  const doneCount = garments.filter(g => g.status === 'completed').length;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">
      <AppHeader title="Bulk Studio" />
      <GeneratingProgress isGenerating={!!activeGeneratingId} />
      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

        {/* Upload zone */}
        <MultiUploadZone onFilesUploaded={handleFilesUploaded} />

        {/* Queue stats */}
        {garments.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="font-playfair text-lg font-bold text-[#1A1A2E]">
              Queue <span className="text-gray-400 font-dm text-sm font-normal">({garments.length} items)</span>
            </p>
            <div className="flex items-center gap-3 text-xs font-dm text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" />{doneCount} done</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" />{pendingCount} pending</span>
            </div>
          </div>
        )}

        {/* Garment grid */}
        {garments.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {garments.map(g => (
              <GarmentQueueCard
                key={g.id}
                garment={g}
                isSelected={selectedGarment?.id === g.id}
                onSelect={setSelectedGarment}
                onDelete={handleDelete}
              />
            ))}

            {/* Add more */}
            <div
              className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#E8B86D]/50 transition-colors min-h-[160px]"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = async (e) => {
                  const files = Array.from(e.target.files || []).slice(0, 30);
                  if (!files.length) return;
                  const uploaded = [];
                  for (const file of files) {
                    const result = await base44.integrations.Core.UploadFile({ file });
                    uploaded.push({ file_url: result.file_url });
                  }
                  handleFilesUploaded(uploaded);
                };
                input.click();
              }}
            >
              <ImagePlus size={24} className="text-gray-300" />
              <span className="text-xs font-dm text-gray-400">Add more</span>
            </div>
          </div>
        )}

        {/* Empty state prompt */}
        {garments.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm font-dm text-gray-400">Upload garment images to get started. You can process them one by one.</p>
          </div>
        )}
      </div>

      {/* Generate drawer */}
      {selectedGarment && (
        <GenerateDrawer
          garment={selectedGarment}
          credits={credits ?? 0}
          onGenerate={handleGenerate}
          onClose={() => setSelectedGarment(null)}
        />
      )}
    </div>
  );
}