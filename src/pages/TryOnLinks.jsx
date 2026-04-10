import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import AppHeader from '@/components/layout/AppHeader';
import { Link2, Eye, CheckCircle, Copy, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';

export default function TryOnLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const ls = await base44.entities.TryOnLink.filter({ created_by: user.email }, '-created_date', 50);
      setLinks(ls);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (code, id) => {
    const url = `${window.location.origin}/try/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleLink = async (link) => {
    await base44.entities.TryOnLink.update(link.id, { is_active: !link.is_active });
    setLinks(prev => prev.map(l => l.id === link.id ? { ...l, is_active: !l.is_active } : l));
  };

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0 && !refreshing) setPullY(Math.min(delta * 0.4, 70));
  };
  const handleTouchEnd = async () => {
    if (pullY > 50 && !refreshing) {
      setRefreshing(true);
      await loadLinks();
      setRefreshing(false);
    }
    setPullY(0);
    touchStartY.current = null;
  };

  return (
    <div
      className="min-h-screen bg-[#FAFAF8]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullY > 0 || refreshing) && (
        <div className="flex justify-center pt-3 pb-1 transition-all" style={{ height: pullY > 0 ? pullY : refreshing ? 48 : 0 }}>
          <div className={`w-6 h-6 border-2 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full ${refreshing ? 'animate-spin' : ''}`} />
        </div>
      )}
      <AppHeader title="Try-On Links" />
      <div className="px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#E8B86D]/30 border-t-[#E8B86D] rounded-full animate-spin" />
          </div>
        ) : links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <div className="text-6xl">🔗</div>
            <h3 className="font-playfair text-xl font-bold text-[#1A1A2E]">No try-on links yet</h3>
            <p className="text-gray-400 font-dm text-sm max-w-xs">
              After generating a photo, tap "Create Customer Try-On Link" to let customers see how items look on them
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-400 font-dm">{links.length} link{links.length !== 1 ? 's' : ''} created</p>
            {links.map(link => (
              <div key={link.id} className={`bg-white rounded-2xl p-4 border ${link.is_active ? 'border-gray-100' : 'border-gray-100 opacity-60'}`}>
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    {link.garment_image_url ? (
                      <img src={link.garment_image_url} alt="item" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200">👕</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${link.is_active ? 'bg-green-400' : 'bg-gray-300'}`} />
                      <p className="text-sm font-dm font-medium text-[#1A1A2E] truncate">
                        /try/{link.unique_code}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-dm">
                      <span className="flex items-center gap-1"><Eye size={12} />{link.views_count || 0} views</span>
                      <span className="flex items-center gap-1"><CheckCircle size={12} />{link.completions_count || 0} try-ons</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
                  <button
                    onClick={() => copyLink(link.unique_code, link.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-50 rounded-xl text-sm font-dm text-gray-600 hover:bg-gray-100"
                  >
                    {copiedId === link.id ? <CheckCircle size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copiedId === link.id ? 'Copied!' : 'Copy link'}
                  </button>
                  <a
                    href={`/try/${link.unique_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center p-2 bg-gray-50 rounded-xl hover:bg-gray-100"
                  >
                    <ExternalLink size={16} className="text-gray-500" />
                  </a>
                  <button
                    onClick={() => toggleLink(link)}
                    className="flex items-center justify-center p-2 bg-gray-50 rounded-xl hover:bg-gray-100"
                  >
                    {link.is_active
                      ? <ToggleRight size={18} className="text-green-500" />
                      : <ToggleLeft size={18} className="text-gray-400" />
                    }
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}