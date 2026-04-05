import { Info } from 'lucide-react';
import { useState } from 'react';

export const GARMENT_TYPES = [
  { value: 'hoodie', label: '🧥 Hoodie / Sweatshirt', category: 'tops' },
  { value: 'tshirt', label: '👕 T-Shirt / Top', category: 'tops' },
  { value: 'jacket', label: '🧣 Jacket / Coat', category: 'tops' },
  { value: 'dress', label: '👗 Dress', category: 'one-pieces' },
  { value: 'pants', label: '👖 Pants / Bottoms', category: 'bottoms' },
];

const FIT_OPTIONS = [
  {
    value: 'preserve',
    label: 'Preserve original fit',
    desc: 'Keeps exact length, sleeves & shape',
    default: true,
  },
  {
    value: 'tailored',
    label: 'Slightly tailored',
    desc: 'Minor styling adjustments',
  },
  {
    value: 'fashion',
    label: 'Fashion styled',
    desc: 'AI may apply editorial styling',
  },
];

export default function GarmentSettings({ settings, onChange }) {
  const [showTips, setShowTips] = useState(false);

  const update = (key, value) => onChange({ ...settings, [key]: value });

  const selectedType = GARMENT_TYPES.find(t => t.value === settings.garmentType);

  return (
    <div className="space-y-5">

      {/* Upload tips */}
      <div className="bg-[#E8B86D]/10 border border-[#E8B86D]/30 rounded-2xl p-4">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => setShowTips(!showTips)}
        >
          <span className="font-dm font-semibold text-[#1A1A2E] text-sm flex items-center gap-2">
            <Info size={15} className="text-[#E8B86D]" />
            Best results — photo tips
          </span>
          <span className="text-xs text-gray-400">{showTips ? '▲ hide' : '▼ show'}</span>
        </button>
        {showTips && (
          <ul className="mt-3 space-y-1.5">
            {[
              'Lay garment flat on a clean surface',
              'Use a plain, light background',
              'Spread sleeves fully — show full width',
              'Keep full garment visible (no cropping)',
              'Take photo from directly above',
            ].map(tip => (
              <li key={tip} className="flex items-start gap-2 text-sm text-gray-600 font-dm">
                <span className="text-[#E8B86D] mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Garment type */}
      <div>
        <p className="font-dm font-semibold text-[#1A1A2E] text-sm mb-2">Garment Type</p>
        <div className="grid grid-cols-1 gap-2">
          {GARMENT_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => update('garmentType', t.value)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-dm font-medium border-2 transition-all text-left ${
                settings.garmentType === t.value
                  ? 'border-[#1A1A2E] bg-[#1A1A2E] text-white'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fit preference */}
      <div>
        <p className="font-dm font-semibold text-[#1A1A2E] text-sm mb-2">Garment Fit</p>
        <div className="flex flex-col gap-2">
          {FIT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => update('fitMode', opt.value)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all text-left ${
                settings.fitMode === opt.value
                  ? 'border-[#1A1A2E] bg-[#1A1A2E] text-white'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
              }`}
            >
              <div>
                <p className="font-dm font-semibold text-sm">
                  {opt.label}
                  {opt.default && (
                    <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
                      settings.fitMode === opt.value ? 'bg-white/20 text-white' : 'bg-[#E8B86D]/20 text-[#9a7a30]'
                    }`}>
                      Recommended
                    </span>
                  )}
                </p>
                <p className={`text-xs mt-0.5 ${settings.fitMode === opt.value ? 'text-white/70' : 'text-gray-400'}`}>
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}

// Helper: build extra prompt context based on settings
export function buildFitContext(settings) {
  const type = GARMENT_TYPES.find(t => t.value === settings.garmentType);
  const lines = [];

  if (settings.fitMode === 'preserve' || settings.fitMode === undefined) {
    lines.push('PRIORITY: preserve exact garment shape, size, length, and fit from the product photo.');
    lines.push('Do NOT crop, tighten, or shorten the garment.');
    lines.push('Preserve full sleeve length exactly as shown.');
  }

  if (settings.garmentType === 'hoodie') {
    lines.push('This is a hoodie/sweatshirt: enforce full torso length, long sleeves, loose fit, and visible hood structure.');
    lines.push('The model must wear it un-cropped with the hem at hip level.');
  } else if (settings.garmentType === 'jacket') {
    lines.push('This is a jacket: preserve full length, lapels, and original structure.');
  } else if (settings.garmentType === 'dress') {
    lines.push('This is a dress: preserve exact hem length and silhouette.');
  }

  return lines.join(' ');
}