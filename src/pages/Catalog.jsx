import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import { Plus, Tag, Trash2 } from 'lucide-react';

export default function Catalog() {
  const navigate = useNavigate();
  const [garments, setGarments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generations, setGenerations] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const gs = await base44.entities.Garment.filter({ created_by: user.email }, '-created_date', 50);
      setGarments(gs);

      // Load one generation per garment
      const genMap = {};
      await Promise.all(gs.map(async (g) => {
        const gens = await base44.entities.Generation.filter({ garment_id: g.id, status: 'completed' }, '-created_date', 1);
        if (gens[0]) genMap[g.id] = gens[0];
      }));
      setGenerations(genMap);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    await base44.entities.Garment.delete(id);
    setGarments(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <AppHeader title="My Catalog" />
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
          </div>
        ) : garments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-6xl">👗</div>
            <h3 className="font-playfair text-xl font-bold text-[#1A1A2E]">No items yet</h3>
            <p className="text-gray-400 font-dm text-sm">Generate your first model photo and save it here</p>
            <button
              onClick={() => navigate('/studio')}
              className="px-6 py-3 bg-[#1A1A2E] text-white rounded-full font-dm font-medium text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              Create first photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {garments.map(garment => {
              const gen = generations[garment.id];
              const imageUrl = gen?.result_image_url || garment.processed_image_url || garment.original_image_url;
              return (
                <div key={garment.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                  <div className="relative aspect-[3/4] bg-gray-50">
                    {imageUrl ? (
                      <img src={imageUrl} alt={garment.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">👕</div>
                    )}
                    <button
                      onClick={() => handleDelete(garment.id)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="font-dm font-semibold text-[#1A1A2E] text-sm truncate">
                      {garment.name || garment.display_category || 'Item'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      {garment.color && (
                        <span className="text-xs text-gray-400 font-dm">{garment.color}</span>
                      )}
                      {garment.display_category && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-dm">
                          {garment.display_category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => navigate('/studio')}
              className="bg-white border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 aspect-[3/4] hover:border-[#E8B86D]/50 transition-colors"
            >
              <Plus size={24} className="text-gray-300" />
              <span className="text-xs text-gray-300 font-dm">New photo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}