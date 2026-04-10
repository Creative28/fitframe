import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import { Download, RefreshCw, Share2, ChevronDown, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const DOWNLOAD_FORMATS = [
  { label: 'Original', suffix: 'original', w: null, h: null },
  { label: 'Instagram Square', suffix: 'instagram', w: 1080, h: 1080 },
  { label: 'Portrait (4:5)', suffix: 'portrait', w: 1080, h: 1350 },
  { label: 'Story (9:16)', suffix: 'story', w: 1080, h: 1920 },
];

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [generation, setGeneration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFormats, setShowFormats] = useState(false);
  const [showListing, setShowListing] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [listingContent, setListingContent] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    base44.entities.Generation.filter({ id }).then(async res => {
      if (res?.[0]) {
        const gen = res[0];
        if (gen.garment_id) {
          const garments = await base44.entities.Garment.filter({ id: gen.garment_id });
          if (garments?.[0]) {
            setGeneration({ ...gen, ...garments[0], result_image_url: gen.result_image_url });
          } else {
            setGeneration(gen);
          }
        } else {
          setGeneration(gen);
        }
      }
      setLoading(false);
    });
  }, [id]);

  const handleDownload = async (url, format) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `just-fit-it-${format}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    }
  };

  const handleWriteListing = async () => {
    if (!generation || !selectedPlatform) return;
    setIsWriting(true);
    setListingContent(null);
    try {
      const garmentDesc = [generation.color, generation.display_category || generation.category, generation.garment_type].filter(Boolean).join(' ');
      const platformTone = {
        Depop: 'casual, Gen Z, fun, use some lowercase, include 1-2 relevant emojis naturally, use trendy language like y2k, aesthetic, vintage vibes',
        Poshmark: 'professional, clean, trustworthy, mention shipping speed and condition clearly, no slang',
        Etsy: 'warm and descriptive, mention materials and styling possibilities, artisan feel',
        eBay: 'factual and detailed, mention condition clearly, no fluff',
        Mercari: 'friendly and brief, mention condition and shipping, keep it simple',
        Vinted: 'casual and honest, mention condition clearly, European friendly tone',
      }[selectedPlatform];
      const prompt = `You are an expert reseller copywriter who knows exactly how to write listings that sell on ${selectedPlatform}. The item is: ${garmentDesc || 'a clothing item'}. Platform tone: ${platformTone}. Write a listing with exactly this JSON structure and nothing else: {"title":"max 60 characters","description":"3-4 sentences in the right tone","hashtags":["tag1","tag2","tag3","tag4","tag5"]}. Return only valid JSON. No explanation. No markdown. No code blocks.`;
      const res = await base44.functions.invoke('aiChat', {
        messages: [{ role: 'user', content: prompt }],
      });
      const raw = res.data?.reply || '';
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setListingContent(parsed);
    } catch (e) {
      console.error(e);
      toast({ title: 'Could not generate listing', description: 'Try again in a moment.', variant: 'destructive' });
    } finally {
      setIsWriting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
      </div>
    );
  }

  if (!generation?.result_image_url) {
    return (
      <div className="min-h-screen bg-[#FAFAF8]">
        <AppHeader title="Result" />
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center px-4">
          <p className="font-playfair text-xl text-[#1A1A2E]">Generation failed or not found.</p>
          <button
            onClick={() => navigate('/studio')}
            className="px-6 py-3 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-28">
      <AppHeader title="Your Photo" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Result image */}
        <div className="rounded-3xl overflow-hidden shadow-lg">
          <img
            src={generation.result_image_url}
            alt="Generated model photo"
            className="w-full object-cover"
          />
        </div>

        {/* Download button */}
        <div className="relative">
          <button
            onClick={() => setShowFormats(!showFormats)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1A2E] text-white rounded-2xl font-dm font-semibold text-base min-h-[56px]"
          >
            <Download size={18} />
            Download
            <ChevronDown size={16} className={`transition-transform ${showFormats ? 'rotate-180' : ''}`} />
          </button>
          {showFormats && (
            <div className="mt-2 bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
              {DOWNLOAD_FORMATS.map(fmt => (
                <button
                  key={fmt.suffix}
                  onClick={() => { handleDownload(generation.result_image_url, fmt.suffix); setShowFormats(false); }}
                  className="w-full text-left px-4 py-3 font-dm text-sm text-[#1A1A2E] hover:bg-gray-50 border-b border-gray-50 last:border-0"
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Write My Listing */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
          <p className="font-playfair text-base font-bold text-[#1A1A2E] flex items-center gap-2">
            <Sparkles size={16} className="text-[#E8B86D]" />
            Write My Listing
          </p>
          <p className="text-xs font-dm text-gray-400">Pick your platform — we'll write the title, description and hashtags instantly.</p>
          <div className="grid grid-cols-3 gap-2">
            {['Depop', 'Poshmark', 'Etsy', 'eBay', 'Mercari', 'Vinted'].map(platform => (
              <button
                key={platform}
                onClick={() => { setSelectedPlatform(platform); setListingContent(null); }}
                className={`py-2 rounded-xl text-sm font-dm font-semibold border-2 transition-all ${
                  selectedPlatform === platform
                    ? 'border-[#1A1A2E] bg-[#1A1A2E] text-white'
                    : 'border-gray-100 bg-gray-50 text-gray-600'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
          {selectedPlatform && !listingContent && (
            <button
              onClick={handleWriteListing}
              disabled={isWriting}
              className="w-full py-3 bg-[#E8B86D] text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm disabled:opacity-50"
            >
              {isWriting ? 'Writing your listing…' : `Write ${selectedPlatform} Listing ✨`}
            </button>
          )}
          {listingContent && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              {[
                { label: 'Title', value: listingContent.title, field: 'title' },
                { label: 'Description', value: listingContent.description, field: 'description' },
                { label: 'Hashtags', value: Array.isArray(listingContent.hashtags) ? listingContent.hashtags.map(h => `#${h.replace('#','')}`).join(' ') : listingContent.hashtags, field: 'hashtags' },
              ].map(({ label, value, field }) => (
                <div key={field} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(value);
                        setCopiedField(field);
                        setTimeout(() => setCopiedField(null), 2000);
                      }}
                      className={`text-xs font-dm font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        copiedField === field ? 'bg-green-100 text-green-600' : 'bg-[#1A1A2E] text-white'
                      }`}
                    >
                      {copiedField === field ? '✓ Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="text-sm font-dm text-gray-700 leading-relaxed">{value}</p>
                </div>
              ))}
              <button
                onClick={() => { setListingContent(null); setSelectedPlatform(null); }}
                className="w-full text-center text-xs font-dm text-gray-400 py-1"
              >
                ↺ Write for a different platform
              </button>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/studio')}
            className="flex items-center justify-center gap-2 py-3.5 bg-gray-100 text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm min-h-[48px]"
          >
            <RefreshCw size={16} />
            New Photo
          </button>
          <button
            onClick={() => navigate('/my-photos')}
            className="flex items-center justify-center gap-2 py-3.5 bg-[#E8B86D]/10 text-[#1A1A2E] rounded-2xl font-dm font-semibold text-sm min-h-[48px] border border-[#E8B86D]/30"
          >
            My Photos
          </button>
        </div>
      </div>
    </div>
  );
}