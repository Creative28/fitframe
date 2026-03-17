import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Camera, Heart, Share2, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerTryOn() {
  const { code } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState('landing'); // landing | upload | processing | result
  const [customerImage, setCustomerImage] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [sellerName, setSellerName] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    loadLink();
  }, [code]);

  const loadLink = async () => {
    try {
      const res = await base44.functions.invoke('fashnApi', {
        action: 'get_tryon_link',
        payload: { unique_code: code }
      });
      const l = res.data?.link;
      if (!l) {
        setNotFound(true);
        return;
      }
      setLink(l);
    } catch (e) {
      console.error(e);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file) => {
    const objectUrl = URL.createObjectURL(file);
    setCustomerImage(objectUrl);
    setStep('processing');
    setProcessing(true);

    try {
      const { file_url: customerFileUrl } = await base44.integrations.Core.UploadFile({ file });

      const run = await base44.functions.invoke('fashnApi', {
        action: 'run',
        payload: {
          model_image: customerFileUrl,
          garment_image: link.garment_image_url,
          category: 'tops'
        }
      });

      const predId = run.data?.prediction_id;
      if (!predId) throw new Error('No prediction ID');

      // Poll
      let resultImageUrl = null;
      const start = Date.now();
      while (Date.now() - start < 90000) {
        await new Promise(r => setTimeout(r, 2000));
        const statusRes = await base44.functions.invoke('fashnApi', {
          action: 'status',
          payload: { prediction_id: predId }
        });
        const s = statusRes.data;
        if (s?.status === 'completed' && s?.output?.length > 0) {
          resultImageUrl = s.output[0];
          break;
        }
        if (s?.status === 'failed') throw new Error('Generation failed');
      }

      if (!resultImageUrl) throw new Error('Timeout');

      // Save customer try-on & increment completions via service role
      await base44.functions.invoke('fashnApi', {
        action: 'save_tryon',
        payload: {
          tryon_link_id: link.id,
          customer_image_url: customerFileUrl,
          result_image_url: resultImageUrl,
          completions_count: (link.completions_count || 0) + 1
        }
      });

      setResultUrl(resultImageUrl);
      setStep('result');

    } catch (e) {
      console.error(e);
      alert('Could not process your photo. Please try again with a clearer, well-lit photo.');
      setStep('upload');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !link) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-6 text-center">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">Link not found</h2>
          <p className="text-gray-400 font-dm mt-2">This try-on link may have expired or been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-gray-100 bg-white">
        <span className="font-playfair text-xl font-bold text-[#1A1A2E]">FitFrame</span>
        {sellerName && (
          <span className="text-xs font-dm text-gray-500">From: <span className="font-medium text-[#1A1A2E]">{sellerName}</span></span>
        )}
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <AnimatePresence mode="wait">

          {step === 'landing' && (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Garment photo */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-6">
                <img
                  src={link.garment_image_url}
                  alt="Clothing item"
                  className="w-full object-cover"
                  style={{ maxHeight: 380 }}
                />
              </div>

              <div className="text-center mb-8">
                <h1 className="font-playfair text-3xl font-bold text-[#1A1A2E] leading-tight">
                  See how this looks on <em>you</em>
                </h1>
                <p className="text-gray-500 font-dm mt-3 leading-relaxed">
                  Upload a photo and we'll show you exactly how this item looks on your body before you buy.
                </p>
              </div>

              <button
                onClick={() => setStep('upload')}
                className="w-full py-4 bg-[#1A1A2E] text-white rounded-2xl font-playfair text-lg font-bold flex items-center justify-center gap-3"
              >
                <Camera size={22} />
                See how this looks on YOU →
              </button>

              {link.seller_store_url && (
                <a
                  href={link.seller_store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-4 text-[#1A1A2E] font-dm text-sm underline"
                >
                  Shop now without trying on
                </a>
              )}

              <p className="text-center text-xs text-gray-400 font-dm mt-6 flex items-center justify-center gap-1.5">
                <Shield size={12} />
                Your photo is used only for this preview and deleted within 24 hours.
              </p>
            </motion.div>
          )}

          {step === 'upload' && (
            <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-8">
                <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">Upload your photo</h2>
              </div>

              <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-100">
                <p className="font-dm font-semibold text-[#1A1A2E] mb-3 text-sm">For best results:</p>
                <ul className="space-y-2">
                  {['Stand straight, full body visible', 'Good, even lighting', 'Simple background', 'Fitted clothes (not baggy)'].map(tip => (
                    <li key={tip} className="flex items-center gap-2 text-sm text-gray-500 font-dm">
                      <span className="text-[#E8B86D]">✓</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-5 bg-[#1A1A2E] text-white rounded-2xl font-playfair text-lg font-bold flex items-center justify-center gap-3"
              >
                <Camera size={22} />
                Upload My Photo
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
              />

              <button onClick={() => setStep('landing')} className="w-full text-center text-sm text-gray-400 font-dm mt-4 py-2">
                ← Back
              </button>

              <p className="text-center text-xs text-gray-400 font-dm mt-4 flex items-center justify-center gap-1.5">
                <Shield size={12} />
                Your photo is deleted within 24 hours.
              </p>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col items-center justify-center py-20 gap-8">
                <div className="relative">
                  {customerImage && (
                    <img src={customerImage} alt="You" className="w-32 h-40 object-cover rounded-2xl opacity-50" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-playfair text-2xl font-bold text-[#1A1A2E]">Finding your fit…</p>
                  <p className="text-gray-400 font-dm text-sm mt-2">This takes about 10–15 seconds</p>
                </div>
                <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E8B86D] rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'result' && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="text-center mb-4">
                <p className="font-playfair text-2xl font-bold text-[#1A1A2E]">You look amazing! ✨</p>
              </div>

              <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-6">
                <img
                  src={resultUrl}
                  alt="You in this outfit"
                  className="w-full object-cover"
                />
              </div>

              <div className="flex flex-col gap-3">
                {link.seller_store_url ? (
                  <a
                    href={link.seller_store_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#1A1A2E] text-white rounded-2xl font-playfair text-lg font-bold flex items-center justify-center gap-3"
                  >
                    <Heart size={20} className="text-[#E8B86D]" />
                    I love it — Shop Now
                  </a>
                ) : (
                  <button className="w-full py-4 bg-[#1A1A2E] text-white rounded-2xl font-playfair text-lg font-bold flex items-center justify-center gap-3">
                    <Heart size={20} className="text-[#E8B86D]" />
                    I love it — Shop Now
                  </button>
                )}

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: 'Check out this look!', url: window.location.href });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied!');
                    }
                  }}
                  className="w-full py-4 bg-white border-2 border-gray-200 text-[#1A1A2E] rounded-2xl font-dm font-semibold flex items-center justify-center gap-3"
                >
                  <Share2 size={18} />
                  Share this look
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 font-dm mt-6 flex items-center justify-center gap-1.5">
                <Shield size={12} />
                Your photo is used only to generate this preview and is deleted within 24 hours.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}