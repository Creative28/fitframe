import { useState } from 'react';
import { Check } from 'lucide-react';

const BUILTIN_MODELS = [
  // Petite / Slim
  { id: 'm1', name: 'Sofia', body_type: 'Petite', skin_tone: 'medium', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=300&fit=crop&crop=face' },
  { id: 'm3', name: 'Priya', body_type: 'Petite', skin_tone: 'tan', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=300&fit=crop&crop=face' },
  { id: 'm5', name: 'Emma', body_type: 'Petite', skin_tone: 'light', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop&crop=face' },
  { id: 'm8', name: 'Lena', body_type: 'Petite', skin_tone: 'light', age: '30s', thumbnail_url: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=200&h=300&fit=crop&crop=face' },
  { id: 'm10', name: 'Mei', body_type: 'Petite', skin_tone: 'tan', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200&h=300&fit=crop&crop=face' },
  // Average
  { id: 'm2', name: 'Amara', body_type: 'Average', skin_tone: 'dark', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=300&fit=crop&crop=face' },
  { id: 'm6', name: 'Nadia', body_type: 'Average', skin_tone: 'light', age: '30s', thumbnail_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=300&fit=crop&crop=face' },
  { id: 'm11', name: 'Rosa', body_type: 'Average', skin_tone: 'medium', age: '30s', thumbnail_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=300&fit=crop&crop=face' },
  { id: 'm13', name: 'Chloe', body_type: 'Average', skin_tone: 'light', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1502767089025-6572583495b9?w=200&h=300&fit=crop&crop=face' },
  { id: 'm14', name: 'Diane', body_type: 'Average', skin_tone: 'medium', age: '40s', thumbnail_url: 'https://images.unsplash.com/photo-1546961342-ea5f62d9d6e0?w=200&h=300&fit=crop&crop=face' },
  // Curvy
  { id: 'm4', name: 'Jade', body_type: 'Curvy', skin_tone: 'brown', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=300&fit=crop&crop=face' },
  { id: 'm9', name: 'Keisha', body_type: 'Curvy', skin_tone: 'dark', age: '30s', thumbnail_url: 'https://images.unsplash.com/photo-1493455198445-863243d88564?w=200&h=300&fit=crop&crop=face' },
  { id: 'm15', name: 'Bianca', body_type: 'Curvy', skin_tone: 'tan', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=200&h=300&fit=crop&crop=face' },
  // Plus Size
  { id: 'm12', name: 'Nia', body_type: 'Plus Size', skin_tone: 'brown', age: '30s', thumbnail_url: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=200&h=300&fit=crop&crop=face' },
  { id: 'm16', name: 'Tasha', body_type: 'Plus Size', skin_tone: 'dark', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&h=300&fit=crop&crop=face' },
  { id: 'm17', name: 'Mara', body_type: 'Plus Size', skin_tone: 'medium', age: '40s', thumbnail_url: 'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=200&h=300&fit=crop&crop=face' },
  { id: 'm18', name: 'Gloria', body_type: 'Plus Size', skin_tone: 'light', age: '40s', thumbnail_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=300&fit=crop&crop=face' },
  // Athletic
  { id: 'm7', name: 'Zara', body_type: 'Athletic', skin_tone: 'medium', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=300&fit=crop&crop=face' },
  { id: 'm19', name: 'Dana', body_type: 'Athletic', skin_tone: 'tan', age: '30s', thumbnail_url: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?w=200&h=300&fit=crop&crop=face' },
  { id: 'm20', name: 'Serena', body_type: 'Athletic', skin_tone: 'brown', age: '20s', thumbnail_url: 'https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=200&h=300&fit=crop&crop=face' },
];

const SKIN_TONE_COLORS = {
  light: '#F5DEB3',
  medium: '#C68642',
  tan: '#D2691E',
  brown: '#8B4513',
  dark: '#3D1C02',
};

const FILTERS = ['All', 'Petite', 'Average', 'Curvy', 'Plus Size', 'Athletic'];

export default function ModelSelector({ selectedModelId, onSelect }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = activeFilter === 'All'
    ? BUILTIN_MODELS
    : BUILTIN_MODELS.filter(m => m.body_type === activeFilter);

  return (
    <div>
      <h3 className="font-playfair text-lg font-semibold text-[#1A1A2E] mb-3 px-1">Choose Your Model</h3>

      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-1 mb-3" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
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

      {/* Model grid — 2 columns on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-1">
        {filtered.map((model) => {
          const selected = selectedModelId === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all border-2 ${
                selected
                  ? 'border-[#E8B86D] bg-[#E8B86D]/10 scale-[1.02]'
                  : 'border-transparent hover:border-gray-200'
              }`}
            >
              <div className="relative rounded-xl overflow-hidden w-full" style={{ aspectRatio: '3/4' }}>
                <img
                  src={model.thumbnail_url}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                {selected && (
                  <div className="absolute bottom-2 right-2 w-6 h-6 bg-[#E8B86D] rounded-full flex items-center justify-center">
                    <Check size={12} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between w-full px-0.5">
                <div className="text-left">
                  <p className={`text-xs font-dm font-semibold ${selected ? 'text-[#1A1A2E]' : 'text-gray-700'}`}>{model.name}</p>
                  <p className="text-[10px] font-dm text-gray-400">{model.body_type}</p>
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

      <p className="text-center text-xs text-gray-400 font-dm mt-4 px-1">
        Choose the model that best represents your customers
      </p>
    </div>
  );
}

export { BUILTIN_MODELS };