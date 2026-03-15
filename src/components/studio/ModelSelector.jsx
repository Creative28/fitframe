import { Check } from 'lucide-react';

// Diverse AI model library using professional stock photos
const BUILTIN_MODELS = [
  { id: 'm1', name: 'Sofia', thumbnail_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=300&fit=crop&crop=face', body_type: 'slim', skin_tone: 'medium' },
  { id: 'm2', name: 'Amara', thumbnail_url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=300&fit=crop&crop=face', body_type: 'average', skin_tone: 'dark' },
  { id: 'm3', name: 'Priya', thumbnail_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=300&fit=crop&crop=face', body_type: 'slim', skin_tone: 'tan' },
  { id: 'm4', name: 'Jade', thumbnail_url: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=200&h=300&fit=crop&crop=face', body_type: 'curvy', skin_tone: 'brown' },
  { id: 'm5', name: 'Emma', thumbnail_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=300&fit=crop&crop=face', body_type: 'slim', skin_tone: 'light' },
  { id: 'm6', name: 'Nadia', thumbnail_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=300&fit=crop&crop=face', body_type: 'average', skin_tone: 'light' },
  { id: 'm7', name: 'Zara', thumbnail_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=300&fit=crop&crop=face', body_type: 'athletic', skin_tone: 'medium' },
  { id: 'm8', name: 'Lena', thumbnail_url: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=200&h=300&fit=crop&crop=face', body_type: 'slim', skin_tone: 'light' },
  { id: 'm9', name: 'Keisha', thumbnail_url: 'https://images.unsplash.com/photo-1493455198445-863243d88564?w=200&h=300&fit=crop&crop=face', body_type: 'curvy', skin_tone: 'dark' },
  { id: 'm10', name: 'Mei', thumbnail_url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=200&h=300&fit=crop&crop=face', body_type: 'slim', skin_tone: 'tan' },
  { id: 'm11', name: 'Rosa', thumbnail_url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=300&fit=crop&crop=face', body_type: 'average', skin_tone: 'medium' },
  { id: 'm12', name: 'Nia', thumbnail_url: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=200&h=300&fit=crop&crop=face', body_type: 'plus', skin_tone: 'brown' },
];

export default function ModelSelector({ selectedModelId, onSelect }) {
  return (
    <div>
      <h3 className="font-playfair text-lg font-semibold text-[#1A1A2E] mb-3 px-1">Choose Your Model</h3>
      <div className="flex gap-3 overflow-x-auto pb-3 px-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {BUILTIN_MODELS.map((model) => {
          const selected = selectedModelId === model.id;
          return (
            <button
              key={model.id}
              onClick={() => onSelect(model)}
              className="flex-shrink-0 flex flex-col items-center gap-2"
            >
              <div className={`relative rounded-2xl overflow-hidden transition-all ${
                selected ? 'ring-3 ring-[#E8B86D] ring-offset-2 scale-105' : 'opacity-80 hover:opacity-100'
              }`} style={{ width: 80, height: 104 }}>
                <img
                  src={model.thumbnail_url}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
                {selected && (
                  <div className="absolute bottom-1.5 right-1.5 w-5 h-5 bg-[#E8B86D] rounded-full flex items-center justify-center">
                    <Check size={11} strokeWidth={3} className="text-white" />
                  </div>
                )}
              </div>
              <span className={`text-xs font-dm ${selected ? 'text-[#1A1A2E] font-semibold' : 'text-gray-400'}`}>
                {model.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { BUILTIN_MODELS };