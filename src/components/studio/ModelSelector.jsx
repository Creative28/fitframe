import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { FEMALE_MODELS, MALE_MODELS } from './modelLibrary';

export { getSuggestedModelId } from './modelLibrary';

const VIEW_TYPES = ['All', 'Full Body', 'Upper Body', 'Lower Body'];
const BODY_TYPES = ['All', 'Slim', 'Regular', 'Curvy', 'Plus Size', 'Athletic'];
const STYLES     = ['All', 'Casual', 'Streetwear', 'Athletic', 'Fashion', 'Mature'];

const VIEW_BADGE = {
  'Full Body':  'bg-blue-50 text-blue-700',
  'Upper Body': 'bg-purple-50 text-purple-700',
  'Lower Body': 'bg-green-50 text-green-700',
};

export default function ModelSelector({ selectedModelId, onSelect, suggestedModelId }) {
  const [gender, setGender]       = useState('female');
  const [viewFilter, setViewFilter] = useState('All');
  const [bodyFilter, setBodyFilter] = useState('All');
  const [styleFilter, setStyleFilter] = useState('All');

  const allModels = gender === 'female' ? FEMALE_MODELS : MALE_MODELS;

  const filtered = allModels.filter(m => {
    if (viewFilter  !== 'All' && m.view_type  !== viewFilter)  return false;
    if (bodyFilter  !== 'All' && m.body_type  !== bodyFilter)  return false;
    if (styleFilter !== 'All' && m.style      !== styleFilter) return false;
    return true;
  });

  const switchGender = (g) => {
    setGender(g);
    setViewFilter('All');
    setBodyFilter('All');
    setStyleFilter('All');
  };

  const ChipRow = ({ label, options, value, onChange, activeClass }) => (
    <div className="mb-3">
      <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{label}</p>
      <div className="flex gap-1.5 flex-wrap">
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-dm font-medium transition-colors ${
              value === o ? activeClass : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Gender toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
        {[['female', 'Women'], ['male', 'Men']].map(([g, label]) => (
          <button
            key={g}
            onClick={() => switchGender(g)}
            className={`flex-1 py-2 rounded-lg text-sm font-dm font-semibold transition-all ${
              gender === g ? 'bg-[#1A1A2E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <ChipRow
        label="Body View"
        options={VIEW_TYPES}
        value={viewFilter}
        onChange={setViewFilter}
        activeClass="bg-[#1A1A2E] text-white"
      />
      <ChipRow
        label="Body Type"
        options={BODY_TYPES}
        value={bodyFilter}
        onChange={setBodyFilter}
        activeClass="bg-[#E8B86D] text-[#1A1A2E]"
      />
      <ChipRow
        label="Style"
        options={STYLES}
        value={styleFilter}
        onChange={setStyleFilter}
        activeClass="bg-[#E8B86D] text-[#1A1A2E]"
      />

      <p className="text-[11px] font-dm text-gray-400 mb-3">
        {filtered.length} model{filtered.length !== 1 ? 's' : ''} available
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-400 font-dm text-sm">
          No models match these filters — try adjusting your selection.
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
                className={`flex flex-col gap-1.5 p-2 rounded-2xl transition-all border-2 text-left ${
                  selected
                    ? 'border-[#E8B86D] bg-[#E8B86D]/10 scale-[1.02]'
                    : suggested
                    ? 'border-[#1A1A2E]/30 bg-[#1A1A2E]/5'
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative rounded-xl overflow-hidden w-full bg-gray-100" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={model.thumbnail_url}
                    alt={model.name}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                  {/* View type badge */}
                  <span className={`absolute top-1.5 left-1.5 text-[9px] font-dm font-bold px-1.5 py-0.5 rounded-full ${VIEW_BADGE[model.view_type]}`}>
                    {model.view_type}
                  </span>
                  {/* Selected checkmark */}
                  {selected && (
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#E8B86D] rounded-full flex items-center justify-center shadow">
                      <Check size={12} strokeWidth={3} className="text-white" />
                    </div>
                  )}
                  {/* Suggested badge */}
                  {suggested && !selected && (
                    <div className="absolute bottom-2 left-1.5 flex items-center gap-1 bg-[#1A1A2E]/80 text-white text-[9px] font-dm font-semibold px-1.5 py-0.5 rounded-full">
                      <Sparkles size={8} className="text-[#E8B86D]" />
                      Suggested
                    </div>
                  )}
                </div>

                {/* Labels */}
                <div className="w-full px-0.5">
                  <p className={`text-xs font-dm font-semibold ${selected ? 'text-[#1A1A2E]' : 'text-gray-700'}`}>
                    {model.name}
                  </p>
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