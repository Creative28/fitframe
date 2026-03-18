import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';

// ─── MODEL LIBRARY ────────────────────────────────────────────────────────────
// All models: full/upper/lower body visible, neutral poses, clothing-friendly
// Sources: Unsplash photos of people in plain clothing, full body visible

const FEMALE_MODELS = [
  // FULL BODY
  {
    id: 'f-slim-fullbody-casual',
    name: 'Emma',
    gender: 'female',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    skin_tone: 'light',
    thumbnail_url: 'https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'f-regular-fullbody-casual',
    name: 'Sofia',
    gender: 'female',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    skin_tone: 'medium',
    thumbnail_url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'f-regular-fullbody-fashion',
    name: 'Aisha',
    gender: 'female',
    body_type: 'Regular',
    style: 'Fashion',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    skin_tone: 'dark',
    thumbnail_url: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'f-curvy-fullbody-casual',
    name: 'Keisha',
    gender: 'female',
    body_type: 'Curvy',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    skin_tone: 'dark',
    thumbnail_url: 'https://images.unsplash.com/photo-1593484892932-3c5db7e9c8ee?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'f-plus-fullbody-casual',
    name: 'Nia',
    gender: 'female',
    body_type: 'Plus Size',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    skin_tone: 'brown',
    thumbnail_url: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'f-athletic-fullbody',
    name: 'Zara',
    gender: 'female',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    skin_tone: 'tan',
    thumbnail_url: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'f-mature-fullbody-casual',
    name: 'Diane',
    gender: 'female',
    body_type: 'Regular',
    style: 'Mature',
    age_group: 'Mature',
    view_type: 'Full Body',
    skin_tone: 'medium',
    thumbnail_url: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=500&h=800&fit=crop&crop=top',
  },
  // UPPER BODY
  {
    id: 'f-slim-upper-casual',
    name: 'Maya',
    gender: 'female',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    skin_tone: 'light',
    thumbnail_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=700&fit=crop&crop=top',
  },
  {
    id: 'f-regular-upper-streetwear',
    name: 'Jordan',
    gender: 'female',
    body_type: 'Regular',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    skin_tone: 'brown',
    thumbnail_url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=500&h=700&fit=crop&crop=top',
  },
  {
    id: 'f-plus-upper-casual',
    name: 'Rosa',
    gender: 'female',
    body_type: 'Plus Size',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Upper Body',
    skin_tone: 'medium',
    thumbnail_url: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=500&h=700&fit=crop&crop=top',
  },
  {
    id: 'f-athletic-upper',
    name: 'Dana',
    gender: 'female',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Adult',
    view_type: 'Upper Body',
    skin_tone: 'tan',
    thumbnail_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&h=700&fit=crop&crop=top',
  },
  // LOWER BODY
  {
    id: 'f-slim-lower-casual',
    name: 'Mia',
    gender: 'female',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Lower Body',
    skin_tone: 'light',
    thumbnail_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=700&fit=crop&crop=bottom',
  },
  {
    id: 'f-regular-lower-casual',
    name: 'Nadia',
    gender: 'female',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Lower Body',
    skin_tone: 'light',
    thumbnail_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop&crop=bottom',
  },
  {
    id: 'f-athletic-lower',
    name: 'Tara',
    gender: 'female',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Young Adult',
    view_type: 'Lower Body',
    skin_tone: 'medium',
    thumbnail_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&h=700&fit=crop&crop=bottom',
  },
];

const MALE_MODELS = [
  // FULL BODY
  {
    id: 'm-slim-fullbody-casual',
    name: 'Liam',
    gender: 'male',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    skin_tone: 'light',
    thumbnail_url: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'm-regular-fullbody-casual',
    name: 'Andre',
    gender: 'male',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    skin_tone: 'dark',
    thumbnail_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'm-regular-fullbody-streetwear',
    name: 'Darius',
    gender: 'male',
    body_type: 'Regular',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    skin_tone: 'dark',
    thumbnail_url: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'm-athletic-fullbody',
    name: 'Marcus',
    gender: 'male',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Young Adult',
    view_type: 'Full Body',
    skin_tone: 'tan',
    thumbnail_url: 'https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'm-plus-fullbody-casual',
    name: 'Omar',
    gender: 'male',
    body_type: 'Plus Size',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Full Body',
    skin_tone: 'medium',
    thumbnail_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'm-mature-fullbody-casual',
    name: 'Devon',
    gender: 'male',
    body_type: 'Regular',
    style: 'Mature',
    age_group: 'Mature',
    view_type: 'Full Body',
    skin_tone: 'dark',
    thumbnail_url: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=500&h=800&fit=crop&crop=top',
  },
  {
    id: 'm-regular-fullbody-fashion',
    name: 'James',
    gender: 'male',
    body_type: 'Slim',
    style: 'Fashion',
    age_group: 'Adult',
    view_type: 'Full Body',
    skin_tone: 'medium',
    thumbnail_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=800&fit=crop&crop=top',
  },
  // UPPER BODY
  {
    id: 'm-slim-upper-casual',
    name: 'Noah',
    gender: 'male',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    skin_tone: 'light',
    thumbnail_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=700&fit=crop&crop=top',
  },
  {
    id: 'm-regular-upper-streetwear',
    name: 'Jordan',
    gender: 'male',
    body_type: 'Regular',
    style: 'Streetwear',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    skin_tone: 'medium',
    thumbnail_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=700&fit=crop&crop=top',
  },
  {
    id: 'm-athletic-upper',
    name: 'Tyler',
    gender: 'male',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Young Adult',
    view_type: 'Upper Body',
    skin_tone: 'tan',
    thumbnail_url: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?w=500&h=700&fit=crop&crop=top',
  },
  {
    id: 'm-plus-upper-casual',
    name: 'Ben',
    gender: 'male',
    body_type: 'Plus Size',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Upper Body',
    skin_tone: 'light',
    thumbnail_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=700&fit=crop&crop=top',
  },
  // LOWER BODY
  {
    id: 'm-slim-lower-casual',
    name: 'Ethan',
    gender: 'male',
    body_type: 'Slim',
    style: 'Casual',
    age_group: 'Young Adult',
    view_type: 'Lower Body',
    skin_tone: 'light',
    thumbnail_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=700&fit=crop&crop=bottom',
  },
  {
    id: 'm-regular-lower-casual',
    name: 'Caleb',
    gender: 'male',
    body_type: 'Regular',
    style: 'Casual',
    age_group: 'Adult',
    view_type: 'Lower Body',
    skin_tone: 'dark',
    thumbnail_url: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=500&h=700&fit=crop&crop=bottom',
  },
  {
    id: 'm-athletic-lower',
    name: 'Miles',
    gender: 'male',
    body_type: 'Athletic',
    style: 'Athletic',
    age_group: 'Young Adult',
    view_type: 'Lower Body',
    skin_tone: 'medium',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=700&fit=crop&crop=bottom',
  },
];

export const BUILTIN_MODELS = [...FEMALE_MODELS, ...MALE_MODELS];

// ─── SMART SUGGESTION ─────────────────────────────────────────────────────────
export function getSuggestedModelId(garmentType, gender = 'female') {
  const map = {
    hoodie:     gender === 'male' ? 'm-regular-upper-streetwear' : 'f-regular-upper-streetwear',
    tshirt:     gender === 'male' ? 'm-slim-upper-casual'        : 'f-slim-upper-casual',
    jacket:     gender === 'male' ? 'm-regular-fullbody-casual'  : 'f-regular-fullbody-casual',
    dress:      'f-regular-fullbody-fashion',
    pants:      gender === 'male' ? 'm-regular-lower-casual'     : 'f-regular-lower-casual',
    activewear: gender === 'male' ? 'm-athletic-lower'           : 'f-athletic-lower',
  };
  return map[garmentType] || (gender === 'male' ? 'm-regular-fullbody-casual' : 'f-regular-fullbody-casual');
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const VIEW_TYPES = ['All', 'Full Body', 'Upper Body', 'Lower Body'];
const BODY_TYPES = ['All', 'Slim', 'Regular', 'Curvy', 'Plus Size', 'Athletic'];
const STYLES     = ['All', 'Casual', 'Streetwear', 'Athletic', 'Fashion', 'Mature'];

const SKIN_TONE_COLORS = {
  light: '#F5DEB3',
  medium: '#C68642',
  tan: '#D2691E',
  brown: '#8B4513',
  dark: '#3D1C02',
};

const VIEW_TYPE_BADGE = {
  'Full Body':  'bg-blue-50 text-blue-600',
  'Upper Body': 'bg-purple-50 text-purple-600',
  'Lower Body': 'bg-green-50 text-green-600',
};

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function ModelSelector({ selectedModelId, onSelect, suggestedModelId }) {
  const [gender, setGender] = useState('female');
  const [viewFilter, setViewFilter] = useState('All');
  const [bodyFilter, setBodyFilter] = useState('All');
  const [styleFilter, setStyleFilter] = useState('All');

  const models = gender === 'female' ? FEMALE_MODELS : MALE_MODELS;

  const filtered = models.filter(m => {
    if (viewFilter  !== 'All' && m.view_type  !== viewFilter)  return false;
    if (bodyFilter  !== 'All' && m.body_type  !== bodyFilter)  return false;
    if (styleFilter !== 'All' && m.style      !== styleFilter) return false;
    return true;
  });

  const handleGenderSwitch = (g) => {
    setGender(g);
    setViewFilter('All');
    setBodyFilter('All');
    setStyleFilter('All');
  };

  return (
    <div>
      {/* Gender toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
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

      {/* View type filter — primary, most important */}
      <div className="mb-2">
        <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Body View</p>
        <div className="flex gap-2 flex-wrap">
          {VIEW_TYPES.map(v => (
            <button
              key={v}
              onClick={() => setViewFilter(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-dm font-medium transition-colors ${
                viewFilter === v ? 'bg-[#1A1A2E] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Body type + style filters */}
      <div className="flex gap-4 mb-4">
        <div className="flex-1">
          <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Body Type</p>
          <div className="flex gap-1.5 flex-wrap">
            {BODY_TYPES.map(b => (
              <button
                key={b}
                onClick={() => setBodyFilter(b)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-dm font-medium transition-colors ${
                  bodyFilter === b ? 'bg-[#E8B86D] text-[#1A1A2E]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Style filter */}
      <div className="mb-4">
        <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Style</p>
        <div className="flex gap-1.5 flex-wrap">
          {STYLES.map(s => (
            <button
              key={s}
              onClick={() => setStyleFilter(s)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-dm font-medium transition-colors ${
                styleFilter === s ? 'bg-[#E8B86D] text-[#1A1A2E]' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-[11px] font-dm text-gray-400 mb-3">{filtered.length} model{filtered.length !== 1 ? 's' : ''} available</p>

      {/* Model grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-400 font-dm text-sm">
          No models match these filters. Try adjusting your selection.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {filtered.map((model) => {
            const selected  = selectedModelId === model.id;
            const suggested = suggestedModelId === model.id && !selectedModelId;

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
                {/* Image */}
                <div className="relative rounded-xl overflow-hidden w-full" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={model.thumbnail_url}
                    alt={model.name}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* View type badge */}
                  <div className={`absolute top-2 left-2 text-[9px] font-dm font-bold px-1.5 py-0.5 rounded-full ${VIEW_TYPE_BADGE[model.view_type]}`}>
                    {model.view_type}
                  </div>
                  {selected && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#E8B86D] rounded-full flex items-center justify-center shadow">
                      <Check size={12} strokeWidth={3} className="text-white" />
                    </div>
                  )}
                  {suggested && !selected && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#1A1A2E]/80 text-white text-[9px] font-dm font-semibold px-2 py-1 rounded-full">
                      <Sparkles size={8} className="text-[#E8B86D]" />
                      Suggested
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="w-full px-0.5">
                  <div className="flex items-center justify-between">
                    <p className={`text-xs font-dm font-semibold ${selected ? 'text-[#1A1A2E]' : 'text-gray-700'}`}>
                      {model.name}
                    </p>
                    <div
                      className="w-3 h-3 rounded-full border border-gray-200 flex-shrink-0"
                      style={{ backgroundColor: SKIN_TONE_COLORS[model.skin_tone] }}
                      title={model.skin_tone}
                    />
                  </div>
                  <p className="text-[10px] font-dm text-gray-400 leading-tight">
                    {model.body_type} · {model.style}
                  </p>
                  <p className="text-[10px] font-dm text-gray-400 leading-tight">
                    {model.age_group}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 font-dm mt-4">
        Choose the model that best represents your customers
      </p>
    </div>
  );
}