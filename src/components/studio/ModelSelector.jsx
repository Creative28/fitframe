import { useState } from 'react';
import { Check } from 'lucide-react';
import { MODEL_SETS, getSuggestedModelId } from './modelLibrary';

export { getSuggestedModelId };

const VIEWS = ['front', 'side', 'back'];
const VIEW_LABELS = { front: 'Front', side: 'Side', back: 'Back' };
const VIEW_ICONS  = { front: '⬆️', side: '↗️', back: '⬇️' };

const BODY_TYPES = [
  { value: 'all',     label: 'All' },
  { value: 'slim',    label: 'Slim' },
  { value: 'regular', label: 'Regular' },
  { value: 'plus',    label: 'Plus Size' },
];

const AGE_GROUPS = [
  { value: 'all',   label: 'All Ages' },
  { value: 'teen',  label: 'Teen' },
  { value: 'adult', label: 'Adult' },
];

export default function ModelSelector({ selectedModelId, selectedView, onSelect, suggestedModelId }) {
  const [gender, setGender]         = useState('female');
  const [bodyFilter, setBodyFilter] = useState('all');
  const [ageFilter, setAgeFilter]   = useState('all');

  const filtered = MODEL_SETS.filter(m => {
    if (m.gender !== gender) return false;
    if (bodyFilter !== 'all' && m.body_type !== bodyFilter) return false;
    if (ageFilter  !== 'all' && m.age_group !== ageFilter)  return false;
    return true;
  });

  const handleSelectModel = (modelSet, view) => {
    onSelect({
      ...modelSet,
      thumbnail_url: modelSet.views[view],
      selectedView: view,
    });
  };

  return (
    <div className="space-y-4">

      {/* Gender toggle */}
      <div className="flex bg-gray-100 rounded-xl p-1">
        {[['female', 'Women'], ['male', 'Men']].map(([g, label]) => (
          <button
            key={g}
            onClick={() => setGender(g)}
            className={`flex-1 py-2 rounded-lg text-sm font-dm font-semibold transition-all ${
              gender === g ? 'bg-[#1A1A2E] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Body type chips */}
      <div>
        <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Body Type</p>
        <div className="flex gap-1.5 flex-wrap">
          {BODY_TYPES.map(bt => (
            <button
              key={bt.value}
              onClick={() => setBodyFilter(bt.value)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-dm font-medium transition-colors ${
                bodyFilter === bt.value
                  ? 'bg-[#E8B86D] text-[#1A1A2E]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {bt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Age chips */}
      <div>
        <p className="text-[10px] font-dm font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Age Group</p>
        <div className="flex gap-1.5">
          {AGE_GROUPS.map(ag => (
            <button
              key={ag.value}
              onClick={() => setAgeFilter(ag.value)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-dm font-medium transition-colors ${
                ageFilter === ag.value
                  ? 'bg-[#1A1A2E] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {ag.label}
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] font-dm text-gray-400">
        {filtered.length} model set{filtered.length !== 1 ? 's' : ''} · select a set and choose a view
      </p>

      {/* Model sets grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-8 text-gray-400 font-dm text-sm">
          No models match — try different filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((modelSet) => {
            const isSetSelected = selectedModelId === modelSet.id;

            return (
              <div
                key={modelSet.id}
                className={`rounded-2xl border-2 p-3 transition-all ${
                  isSetSelected
                    ? 'border-[#E8B86D] bg-[#E8B86D]/5'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <p className="text-sm font-dm font-bold text-[#1A1A2E]">{modelSet.name}</p>
                    <p className="text-[11px] font-dm text-gray-400 capitalize">
                      {modelSet.body_type} · {modelSet.age_group} · {modelSet.gender}
                    </p>
                  </div>
                  {isSetSelected && (
                    <span className="flex items-center gap-1 text-[11px] font-dm font-semibold text-[#E8B86D] bg-[#E8B86D]/10 px-2 py-0.5 rounded-full">
                      <Check size={9} strokeWidth={3} /> Selected
                    </span>
                  )}
                </div>

                {/* 3 view thumbnails */}
                <div className="grid grid-cols-3 gap-2">
                  {VIEWS.map((view) => {
                    const isViewSelected = isSetSelected && selectedView === view;
                    return (
                      <button
                        key={view}
                        onClick={() => handleSelectModel(modelSet, view)}
                        className={`flex flex-col gap-1 rounded-xl overflow-hidden border-2 transition-all ${
                          isViewSelected
                            ? 'border-[#E8B86D] scale-[1.03]'
                            : 'border-transparent hover:border-gray-200'
                        }`}
                      >
                        <div className="relative w-full bg-gray-100" style={{ aspectRatio: '2/3' }}>
                          <img
                            src={modelSet.views[view]}
                            alt={`${modelSet.name} ${view}`}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                          {isViewSelected && (
                            <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-[#E8B86D] rounded-full flex items-center justify-center shadow">
                              <Check size={10} strokeWidth={3} className="text-white" />
                            </div>
                          )}
                        </div>
                        <p className={`text-[10px] font-dm font-semibold text-center pb-1 ${
                          isViewSelected ? 'text-[#E8B86D]' : 'text-gray-400'
                        }`}>
                          {VIEW_ICONS[view]} {VIEW_LABELS[view]}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 font-dm pt-1">
        All views use the same model — consistent sizing across shots
      </p>
    </div>
  );
}