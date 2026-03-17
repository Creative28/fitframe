import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import GeneratingProgress from '@/components/studio/GeneratingProgress';
import CreditsModal from '@/components/studio/CreditsModal';
import MultiUploadZone from '@/components/bulk/MultiUploadZone';
import GarmentQueueCard from '@/components/bulk/GarmentQueueCard';
import GenerateDrawer from '@/components/bulk/GenerateDrawer';
import { ImagePlus, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import { compressImage, isHeic } from '@/lib/compressImage';

export default function BulkStudio() {
  const [garments, setGarments] = useState([]);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [activeGeneratingId, setActiveGeneratingId] = useState(null);
  const [credits, setCredits] = useState(null);
  const [showCreditsModal, setShowCreditsModal] = useState(false);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) setCredits(user.credits_remaining ?? 5);
    }).catch(() => {});
  }, []);

  // Called by MultiUploadZone:
  // - Initially with array of new items (uploadStatus: 'uploading', preview set)
  // - Per-item updates when upload completes (uploadStatus: 'done'/'error', file_url set)
  const handleFilesUploaded = (updates) => {
    setGarments(prev => {
      const map = new Map(prev.map(g => [g.id, g]));
      for (const item of updates) {
        if (map.has(item.id)) {
          // Update existing item
          map.set(item.id, { ...map.get(item.id), ...item });
        } else {
          // New item — add with genStatus
          map.set(item.id, { ...item, genStatus: 'pending', result_url: null });
        }
      }
      return Array.from(map.values());
    });
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
    if (!garment.file_url) return; // still uploading

    setSelectedGarment(null);
    setActiveGeneratingId(garment.id);
    setGarments(prev => prev.map(g => g.id === garment.id ? { ...g, genStatus: 'processing' } : g));

    const garmentRecord = await base44.entities.Garment.create({
      original_image_url: garment.file_url,
      category: 'tops',
    });

    const generation = await base44.entities.Generation.create({
      garment_id: garmentRecord.id,
      model_id: model.id,
      background_type: background,
      status: 'pending',
    });

    const res = await base44.functions.invoke('fashnApi', {
      action: 'run',
      payload: {
        model_image: model.thumbnail_url,
        garment_image: garment.file_url,
        category: 'tops',
      },
    });

    const predictionId = res.data?.prediction_id;
    await base44.entities.Generation.update(generation.id, { prediction_id: predictionId, status: 'processing' });

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

      await base44.entities.Generation.update(generation.id, { result_image_url: resultUrl, status: 'completed' });
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

      if (credits !== null) {
        const newCredits = Math.max(0, credits - 1);
        await base44.auth.updateMe({ credits_remaining: newCredits });
        await base44.entities.CreditTransaction.create({
          amount: -1, type: 'generation', description: 'Bulk model photo generation', generation_id: generation.id,
        });
        setCredits(newCredits);
      }

      setGarments(prev => prev.map(g =>
        g.id === garment.id ? { ...g, genStatus: 'completed', result_url: resultUrl } : g
      ));
    } else {
      await base44.entities.Generation.update(generation.id, { status: 'failed' });
      setGarments(prev => prev.map(g =>
        g.id === garment.id ? { ...g, genStatus: 'failed' } : g
      ));
    }

    setActiveGeneratingId(null);
  };

  const pendingCount = garments.filter(g => g.genStatus === 'pending').length;
  const doneCount = garments.filter(g => g.genStatus === 'completed').length;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">
      <AppHeader title="Bulk Studio" />
      <GeneratingProgress isGenerating={!!activeGeneratingId} />
      {showCreditsModal && <CreditsModal onClose={() => setShowCreditsModal(false)} />}

      {/* Mode switcher */}
      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <Link
            to="/studio"
            className="flex-1 py-2 rounded-lg text-sm font-dm font-semibold text-center text-gray-500 hover:text-gray-700"
          >
            Single Item
          </Link>
          <span className="flex-1 py-2 rounded-lg text-sm font-dm font-semibold text-center bg-[#1A1A2E] text-white shadow-sm flex items-center justify-center gap-1.5">
            <Layers size={14} />
            Bulk Upload
          </span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <MultiUploadZone onFilesUploaded={handleFilesUploaded} />

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

        {garments.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {garments.map(g => (
              <GarmentQueueCard
                key={g.id}
                garment={g}
                isSelected={selectedGarment?.id === g.id}
                onSelect={(item) => {
                  if (item.uploadStatus === 'uploading') return; // still uploading
                  setSelectedGarment(item);
                }}
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
                input.onchange = (e) => {
                  const files = e.target.files;
                  if (files?.length) {
                    // Re-use MultiUploadZone logic via a synthetic event isn't easy,
                    // so we do it inline here (same compression pipeline)
                    const fileArr = Array.from(files).slice(0, 30);
                    const items = fileArr.map(file => ({
                      id: Math.random().toString(36).slice(2),
                      file,
                      preview: URL.createObjectURL(file),
                      uploadStatus: 'uploading',
                      file_url: null,
                    }));
                    handleFilesUploaded(items);
                    // Upload in background
                    const CONCURRENCY = 3;
                    const queue = [...items];
                    const runNext = async () => {
                      if (queue.length === 0) return;
                      const item = queue.shift();
                      try {
                        const compressed = await compressImage(item.file);
                        let file_url;
                        if (isHeic(item.file)) {
                          const formData = new FormData();
                          formData.append('file', item.file);
                          const response = await base44.functions.invoke('convertImage', formData);
                          file_url = response.data.file_url;
                        } else {
                          const result = await base44.integrations.Core.UploadFile({ file: compressed });
                          file_url = result.file_url;
                        }
                        handleFilesUploaded([{ ...item, uploadStatus: 'done', file_url }]);
                      } catch {
                        handleFilesUploaded([{ ...item, uploadStatus: 'error' }]);
                      }
                      await runNext();
                    };
                    for (let i = 0; i < Math.min(CONCURRENCY, items.length); i++) runNext();
                  }
                };
                input.click();
              }}
            >
              <ImagePlus size={24} className="text-gray-300" />
              <span className="text-xs font-dm text-gray-400">Add more</span>
            </div>
          </div>
        )}

        {garments.length === 0 && (
          <p className="text-center text-sm font-dm text-gray-400 py-4">
            Upload garment images to get started. You can process them one by one.
          </p>
        )}
      </div>

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