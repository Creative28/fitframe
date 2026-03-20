import { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';

export { getSuggestedConfig };

// Build a FASHN product-to-model prompt from config
export function buildModelPrompt(config) {
  const { gender, bodyType, pose, background } = config;

  const genderStr = gender === 'male' ? 'man' : 'woman';
  const bodyStr = {
    slim: 'slim build',
    regular: 'average build',
    plus: 'plus-size build',
    athletic: 'athletic build',
  }[bodyType] || 'average build';

  const poseStr = {
    front: 'standing upright, facing forward, arms relaxed at sides',
    hands_on_hips: 'standing, hands on hips, confident pose',
    walking: 'walking pose, natural movement',
    casual: 'casual relaxed stance',
  }[pose] || 'standing upright, facing forward';

  const bgStr = {
    studio: 'clean white studio background, professional lighting',
    outdoor: 'outdoor lifestyle setting, natural light',
    neutral: 'neutral grey wall background, soft studio light',
    none: 'clean white background',
  }[background] || 'clean white background';

  return `Full body shot, ${genderStr}, ${bodyStr}, ${poseStr}, ${bgStr}, fashion photography, professional clothing model`;
}

function getSuggestedConfig(garmentType) {
  return {
    gender: 'female',
    bodyType: 'regular',
    pose: 'front',
    background: 'none',
  };
}

const GENDER_OPTIONS = [
  { value: 'female', label: 'Women' },
  { value: 'male', label: 'Men' },
];

const BODY_TYPES = [
  { value: 'slim',     label: 'Slim',     emoji: '🧍' },
  { value: 'regular',  label: 'Regular',  emoji: '🧍' },
  { value: 'plus',     label: 'Plus Size',emoji: '🧍' },
  { value: 'athletic', label: 'Athletic', emoji: '🧍' },
];

const POSES = [
  { value: 'front',         label: 'Classic Front',    desc: 'Arms at sides, forward facing' },
  { value: 'hands_on_hips', label: 'Hands on Hips',   desc: 'Confident catalog pose' },
  { value: 'walking',       label: 'Walking',          desc: 'Natural movement pose' },
  { value: 'casual',        label: 'Casual',           desc: 'Relaxed everyday stance' },
];

export default function ModelSelector({ modelConfig, onSelect }) {
  const [config, setConfig] = useState(modelConfig || {
    gender: 'female',
    bodyType: 'regular',
    pose: 'front',
    background: 'none',
  });

  const update = (key, value) => {
    const next = { ...config, [key]: value };
    setConfig(next);
    onSelect(next);
  };

  // Auto-select on mount if not already set
  useEffect(() => {
    if (!modelConfig) onSelect(config);
  }, []);

  return (
    <div className="space-y-5">

      {/* Info banner */}
      <div className="flex items-start gap-2.5 bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 rounded-2xl p-3.5">
        <Sparkles size={15} className="text-[#E8B86D] mt-0.5 shrink-0" />
        <p className="text-xs font-dm text-gray-600 leading-relaxed">
          <span className="font-semibold text-[#1A1A2E]">AI-generated models.</span>{' '}
          FASHN creates a professional fashion model based on your selections — no stock photos, optimized for clothing.
        </p>
      </div>

      {/* Gender */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {GENDER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => update('gender', value)}
            className={`flex-1 py-2 rounded-lg text-sm font-dm font-semibold transition-all ${
              config.gender === value ? 'bg-[#1A1A2E] text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Body Type */}
      <div>
        <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide mb-2">Body Type</p>
        <div className="grid grid-cols-2 gap-2">
          {BODY_TYPES.map(bt => (
            <button
              key={bt.value}
              onClick={() => update('bodyType', bt.value)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border-2 text-left transition-all ${
                config.bodyType === bt.value
                  ? 'border-[#E8B86D] bg-[#E8B86D]/10'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <span className={`text-sm font-dm font-semibold ${config.bodyType === bt.value ? 'text-[#1A1A2E]' : 'text-gray-700'}`}>
                {bt.label}
              </span>
              {config.bodyType === bt.value && <Check size={13} className="text-[#E8B86D]" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>

      {/* Pose */}
      <div>
        <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide mb-2">Model Pose</p>
        <div className="flex flex-col gap-2">
          {POSES.map(p => (
            <button
              key={p.value}
              onClick={() => update('pose', p.value)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                config.pose === p.value
                  ? 'border-[#1A1A2E] bg-[#1A1A2E] text-white'
                  : 'border-gray-100 bg-white text-gray-700 hover:border-gray-200'
              }`}
            >
              <div>
                <p className="text-sm font-dm font-semibold">{p.label}</p>
                <p className={`text-[11px] mt-0.5 ${config.pose === p.value ? 'text-white/60' : 'text-gray-400'}`}>{p.desc}</p>
              </div>
              {config.pose === p.value && <Check size={14} strokeWidth={3} />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}