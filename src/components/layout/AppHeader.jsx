import { Sparkles, ChevronLeft } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { useLocation, useNavigate } from 'react-router-dom';

const ROOT_TABS = ['/', '/studio', '/bulk-studio', '/my-photos', '/catalog', '/tryon-links', '/account'];

export default function AppHeader({ title }) {
  const { credits } = useCredits();
  const location = useLocation();
  const navigate = useNavigate();
  const isRootTab = ROOT_TABS.includes(location.pathname);

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-gray-100 relative" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        {!isRootTab ? (
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#1A1A2E] font-dm font-medium text-sm -ml-1">
            <ChevronLeft size={20} />
            Back
          </button>
        ) : (
          <h1 className="font-playfair text-xl font-bold text-[#1A1A2E]">{title || 'Just Fit It'}</h1>
        )}

        {!isRootTab && (
          <h1 className="font-playfair text-xl font-bold text-[#1A1A2E] absolute left-1/2 -translate-x-1/2">{title || 'Just Fit It'}</h1>
        )}

        {credits !== null && (
          <div className="flex items-center gap-1.5 bg-[#1A1A2E] text-white px-3 py-1.5 rounded-full text-sm">
            <Sparkles size={14} className="text-[#E8B86D]" />
            <span className="font-dm font-medium">{credits} credits</span>
          </div>
        )}
      </div>
    </header>
  );
}