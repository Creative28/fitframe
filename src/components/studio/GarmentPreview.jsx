import { useState } from 'react';
import { Edit2, Check } from 'lucide-react';

const CATEGORIES = [
  { value: 'tops', label: 'Top' },
  { value: 'bottoms', label: 'Bottom' },
  { value: 'one-pieces', label: 'One-Piece' },
];

export default function GarmentPreview({ imageUrl, category, color, displayCategory, onCategoryChange, onColorChange }) {
  const [editingColor, setEditingColor] = useState(false);
  const [colorInput, setColorInput] = useState(color || '');

  const handleColorSave = () => {
    onColorChange(colorInput);
    setEditingColor(false);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="relative bg-gray-50 flex items-center justify-center" style={{ minHeight: 280 }}>
        <img
          src={imageUrl}
          alt="Garment preview"
          className="max-h-72 w-auto object-contain"
          style={{ maxWidth: '100%' }}
        />
        <div className="absolute top-3 right-3 bg-[#1A1A2E]/70 text-white text-xs px-2.5 py-1 rounded-full font-dm">
          Background removed
        </div>
      </div>
      <div className="p-4 flex flex-wrap gap-2 items-center">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-dm font-medium transition-colors ${
              category === cat.value
                ? 'bg-[#1A1A2E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
        <div className="flex items-center gap-2 ml-auto">
          {editingColor ? (
            <>
              <input
                value={colorInput}
                onChange={e => setColorInput(e.target.value)}
                className="border border-gray-200 rounded-full px-3 py-1 text-sm w-24 font-dm"
                placeholder="Color"
                onKeyDown={e => e.key === 'Enter' && handleColorSave()}
                autoFocus
              />
              <button onClick={handleColorSave} className="p-1.5 rounded-full bg-[#E8B86D] text-white">
                <Check size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={() => { setColorInput(color || ''); setEditingColor(true); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-sm font-dm hover:bg-gray-200"
            >
              <span>{color || 'Add color'}</span>
              <Edit2 size={12} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}