import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AppHeader({ title }) {
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    base44.auth.me().then(user => {
      if (user) setCredits(user.credits_remaining ?? 5);
    }).catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-playfair text-xl font-bold text-[#1A1A2E]">
          {title || 'Just Fit It'}
        </h1>
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