import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import ModelSelector from '@/components/studio/ModelSelector.jsx';
import BackgroundSelector from '@/components/studio/BackgroundSelector';

export default function GenerateDrawer({ garment, credits, onGenerate, onClose }) {
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedBackground, setSelectedBackground] = useState('none');
  const [tab, setTab] = useState('model'); // 'model' | 'background'

  const canGenerate = !!selectedModel;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/40" onClick={onClose}>
      <div
        className="bg-[#FAFAF8] rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src={garment.file_url} alt="Garment" className="w-12 h-12 object-cover rounded-xl" />
            <div>
              <p className="font-playfair font-bold text-[#1A1A2E] text-base">Configure & Generate</p>
              <p className="text-xs font-dm text-gray-400">{credits} credits remaining</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
            <X size={16} />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex bg-gray-100 rounded-xl p-1 mx-5 mt-4 flex-shrink-0">
          <button
            onClick={() => setTab('model')}
            className={`flex-1 py-2 rounded-lg text-sm font-dm font-semibold transition-all ${
              tab === 'model' ? 'bg-[#1A1A2E] text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            Model {selectedModel && '✓'}
          </button>
          <button
            onClick={() => setTab('background')}
            className={`flex-1 py-2 rounded-lg text-sm font-dm font-semibold transition-all ${
              tab === 'background' ? 'bg-[#1A1A2E] text-white shadow-sm' : 'text-gray-500'
            }`}
          >
            Background
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          {tab === 'model' && (
            <ModelSelector
              selectedModelId={selectedModel?.id}
              onSelect={(m) => { setSelectedModel(m); setTab('background'); }}
            />
          )}
          {tab === 'background' && (
            <BackgroundSelector
              selected={selectedBackground}
              onSelect={setSelectedBackground}
            />
          )}
        </div>

        {/* Generate button */}
        <div className="px-5 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={() => onGenerate(garment, selectedModel, selectedBackground)}
            disabled={!canGenerate}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#1A1A2E] text-white rounded-2xl font-playfair font-bold text-base disabled:opacity-40 min-h-[56px]"
          >
            <Sparkles size={18} className="text-[#E8B86D]" />
            Generate Photo
          </button>
          {!selectedModel && (
            <p className="text-xs text-center text-gray-400 font-dm mt-2">Please select a model first</p>
          )}
        </div>
      </div>
    </div>
  );
}