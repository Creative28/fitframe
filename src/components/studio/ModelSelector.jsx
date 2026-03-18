import { useState, useEffect } from 'react';
import { Check, Sparkles } from 'lucide-react';

// ─── CURATED MODEL LIBRARY ────────────────────────────────────────────────────
// 10 women + 8 men = 18 total. All full-body, neutral pose, clear silhouette.

const FEMALE_MODELS = [
  {
    id: 'f-slim-casual',
    name: 'Maya',
    style: 'Casual',
    body_type: 'Slim',
    skin_tone: 'medium',
    age: '20s',
    gender: 'female',
    tags: ['casual', 'everyday', 'tops', 'bottoms', 'dress'],
    thumbnail_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-petite',
    name: 'Mei',
    style: 'Petite',
    body_type: 'Petite',
    skin_tone: 'tan',
    age: '20s',
    gender: 'female',
    tags: ['casual', 'tops', 'bottoms', 'petite'],
    thumbnail_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-regular-casual',
    name: 'Nadia',
    style: 'Casual',
    body_type: 'Regular',
    skin_tone: 'light',
    age: '30s',
    gender: 'female',
    tags: ['casual', 'hoodie', 'tops', 'bottoms', 'everyday'],
    thumbnail_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-regular-casual-2',
    name: 'Amara',
    style: 'Casual',
    body_type: 'Regular',
    skin_tone: 'dark',
    age: '20s',
    gender: 'female',
    tags: ['casual', 'tops', 'everyday'],
    thumbnail_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-athletic',
    name: 'Zara',
    style: 'Athletic',
    body_type: 'Athletic',
    skin_tone: 'medium',
    age: '20s',
    gender: 'female',
    tags: ['athletic', 'activewear', 'sportswear', 'leggings', 'tops'],
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-streetwear',
    name: 'Jordan',
    style: 'Streetwear',
    body_type: 'Regular',
    skin_tone: 'brown',
    age: '20s',
    gender: 'female',
    tags: ['streetwear', 'hoodie', 'oversized', 'casual'],
    thumbnail_url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-fashion',
    name: 'Sofia',
    style: 'Fashion',
    body_type: 'Slim',
    skin_tone: 'light',
    age: '20s',
    gender: 'female',
    tags: ['fashion', 'dress', 'elegant', 'editorial'],
    thumbnail_url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-curvy',
    name: 'Keisha',
    style: 'Curvy',
    body_type: 'Curvy',
    skin_tone: 'dark',
    age: '30s',
    gender: 'female',
    tags: ['curvy', 'casual', 'tops', 'dress'],
    thumbnail_url: 'https://images.unsplash.com/photo-1493455198445-863243d88564?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-plus',
    name: 'Nia',
    style: 'Plus Size',
    body_type: 'Plus Size',
    skin_tone: 'brown',
    age: '30s',
    gender: 'female',
    tags: ['plus', 'casual', 'tops', 'bottoms', 'everyday'],
    thumbnail_url: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'f-mature',
    name: 'Diane',
    style: 'Mature',
    body_type: 'Regular',
    skin_tone: 'medium',
    age: '40s+',
    gender: 'female',
    tags: ['mature', 'casual', 'tops', 'everyday', 'bottoms'],
    thumbnail_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=900&fit=crop&crop=top',
  },
];

const MALE_MODELS = [
  {
    id: 'm-slim-casual',
    name: 'Liam',
    style: 'Casual',
    body_type: 'Slim',
    skin_tone: 'light',
    age: '20s',
    gender: 'male',
    tags: ['casual', 'tops', 'everyday', 'slim'],
    thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'm-regular-casual',
    name: 'Andre',
    style: 'Casual',
    body_type: 'Regular',
    skin_tone: 'dark',
    age: '30s',
    gender: 'male',
    tags: ['casual', 'hoodie', 'tops', 'everyday'],
    thumbnail_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'm-regular-casual-2',
    name: 'Jordan',
    style: 'Casual',
    body_type: 'Regular',
    skin_tone: 'medium',
    age: '20s',
    gender: 'male',
    tags: ['casual', 'tops', 'bottoms', 'everyday'],
    thumbnail_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'm-athletic',
    name: 'Marcus',
    style: 'Athletic',
    body_type: 'Athletic',
    skin_tone: 'tan',
    age: '20s',
    gender: 'male',
    tags: ['athletic', 'activewear', 'sportswear', 'tops'],
    thumbnail_url: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'm-streetwear',
    name: 'Darius',
    style: 'Streetwear',
    body_type: 'Regular',
    skin_tone: 'dark',
    age: '20s',
    gender: 'male',
    tags: ['streetwear', 'hoodie', 'oversized', 'casual'],
    thumbnail_url: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'm-fashion',
    name: 'James',
    style: 'Fashion',
    body_type: 'Slim',
    skin_tone: 'medium',
    age: '30s',
    gender: 'male',
    tags: ['fashion', 'editorial', 'tops', 'elegant'],
    thumbnail_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'm-plus',
    name: 'Omar',
    style: 'Plus Size',
    body_type: 'Plus Size',
    skin_tone: 'medium',
    age: '30s',
    gender: 'male',
    tags: ['plus', 'casual', 'tops', 'everyday'],
    thumbnail_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=900&fit=crop&crop=top',
  },
  {
    id: 'm-mature',
    name: 'Devon',
    style: 'Mature',
    body_type: 'Regular',
    skin_tone: 'dark',
    age: '40s+',
    gender: 'male',
    tags: ['mature', 'casual', 'tops', 'everyday'],
    thumbnail_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&h=900&fit=crop&crop=top',
  },
];

export const BUILTIN_MODELS = [...FEMALE_MODELS, ...MALE_MODELS];

// ─── SMART SUGGESTION ─────────────────────────────────────────────────────────
// Returns the best-match model ID given a garment type
export function getSuggestedModelId(garmentType, gender = 'female') {
  const map = {
    hoodie:  gender === 'male' ? 'm-streetwear'      : 'f-streetwear',
    jacket:  gender === 'male' ? 'm-regular-casual'  : 'f-regular-casual',
    tshirt:  gender === 'male' ? 'm-regular-casual-2': 'f-regular-casual',
    dress:   'f-fashion',
    pants:   gender === 'male' ? 'm-regular-casual'  : 'f-regular-casual',
    activewear: gender === 'male' ? 'm-athletic'     : 'f-athletic',
  };
  return map[garmentType] || (gender === 'male' ? 'm-regular-casual' : 'f-regular-casual');
}

// ─── FILTER CONFIG ────────────────────────────────────────────────────────────
const FEMALE_FILTERS = ['All', 'Casual', 'Athletic', 'Streetwear', 'Fashion', 'Curvy', 'Plus Size', 'Mature', 'Petite'];
const MALE_FILTERS   = ['All', 'Casual', 'Athletic', 'Streetwear', 'Fashion', 'Plus Size', 'Mature'];

const SKIN_TONE_COLORS = {
  light: '#F5DEB3',
  medium: '#C68642',
  tan: '#D2691E',
  brown: '#8B4513',
  dark: '#3D1C02',
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ModelSelector({ selectedModelId, onSelect, suggestedModelId }) {
  const [gender, setGender] = useState('female');
  const [activeFilter, setActiveFilter] = useState('All');

  const models  = gender === 'female' ? FEMALE_MODELS : MALE_MODELS;
  const filters = gender === 'female' ? FEMALE_FILTERS : MALE_FILTERS;

  const filtered = activeFilter === 'All'
    ? models
    : models.filter(m => m.style === activeFilter || m.body_type === activeFilter);

  const handleGenderSwitch = (g) => {
    setGender(g);
    setActiveFilter('All');
  };

  return (
    <div>
      {/* Gender toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-3">
        {['female', 'male'].map(g => (
          <button
            key={g}
            onClick={() => handleGenderSwitch(g)}
            className={`flex-1 py-2 rounded-lg text-sm font-dm font-semibold transition-all ${
              gender === g ? 'bg-[#1A1A2E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {g === 'female' ? 'Women' : 'Men'}
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-3" style={{ scrollbarWidth: 'none' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-dm font-medium transition-colors ${
              activeFilter === f
                ? 'bg-[#1A1A2E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Model grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {filtered.map((model) => {
          const selected   = selectedModelId === model.id;
          const suggested  = suggestedModelId === model.id && !selectedModelId;

          return (
            <button
              key={model.id}
              onClick={() => onSelect(model)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all border-2 text-left ${
                selected
                  ? 'border-[#E8B86D] bg-[#E8B86D]/10 scale-[1.02]'
                  : suggested
                  ? 'border-[#1A1A2E]/30 bg-[#1A1A2E]/5'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <div className="relative rounded-xl overflow-hidden w-full" style={{ aspectRatio: '3/4' }}>
                <img
                  src={model.thumbnail_url}
                  alt={model.name}
                  className="w-full h-full object-cover object-top"
                />
                {selected && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#E8B86D] rounded-full flex items-center justify-center shadow">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </div>
                )}
                {suggested && !selected && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#1A1A2E]/80 text-white text-[10px] font-dm font-semibold px-2 py-1 rounded-full">
                    <Sparkles size={9} className="text-[#E8B86D]" />
                    Suggested
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between w-full px-0.5">
                <div>
                  <p className={`text-xs font-dm font-semibold ${selected ? 'text-[#1A1A2E]' : 'text-gray-700'}`}>
                    {model.name}
                  </p>
                  <p className="text-[10px] font-dm text-gray-400">{model.style} · {model.age}</p>
                </div>
                <div
                  className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0"
                  style={{ backgroundColor: SKIN_TONE_COLORS[model.skin_tone] }}
                  title={model.skin_tone}
                />
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-400 font-dm mt-4">
        Choose the model that best represents your customers
      </p>
    </div>
  );
}