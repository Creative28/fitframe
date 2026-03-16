const BACKGROUNDS = [
  { id: 'none', label: 'Original', emoji: '🏷️', desc: 'Keep as-is' },
  { id: 'studio', label: 'Studio', emoji: '💡', desc: 'Clean white studio' },
  { id: 'outdoor', label: 'Outdoor', emoji: '🌿', desc: 'Lifestyle outdoor' },
  { id: 'neutral', label: 'Neutral Wall', emoji: '🪟', desc: 'Minimal background' },
];

export { BACKGROUNDS };

export default function BackgroundSelector({ selected, onSelect }) {
  return (
    <div>
      <h3 className="font-playfair text-lg font-semibold text-[#1A1A2E] mb-3 px-1">Choose Background</h3>
      <div className="grid grid-cols-2 gap-2 px-1">
        {BACKGROUNDS.map(bg => (
          <button
            key={bg.id}
            onClick={() => onSelect(bg.id)}
            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left transition-all ${
              selected === bg.id
                ? 'border-[#E8B86D] bg-[#E8B86D]/10'
                : 'border-gray-100 bg-white hover:border-gray-200'
            }`}
          >
            <span className="text-2xl">{bg.emoji}</span>
            <div>
              <p className={`text-sm font-dm font-semibold ${selected === bg.id ? 'text-[#1A1A2E]' : 'text-gray-700'}`}>
                {bg.label}
              </p>
              <p className="text-[11px] font-dm text-gray-400">{bg.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}