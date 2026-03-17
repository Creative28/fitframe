import { Sparkles, X } from 'lucide-react';
import { useChat } from '@/lib/ChatContext';
import ChatPanel from './ChatPanel';

// hasBottomNav: true on authenticated screens (sits above the nav bar)
export default function ChatBubble({ hasBottomNav = false }) {
  const { isOpen, open, close, isPulsing, showTooltip, setShowTooltip } = useChat();

  const bottomPos = hasBottomNav ? 'bottom-[76px]' : 'bottom-6';

  return (
    <>
      {/* Floating button */}
      <div className={`fixed right-5 ${bottomPos} z-50 flex flex-col items-end gap-2`}>
        {/* Tooltip */}
        {showTooltip && !isOpen && (
          <div className="flex items-center gap-2 bg-[#1A1A2E] text-white px-3 py-2 rounded-2xl rounded-br-sm text-xs font-dm shadow-lg max-w-[180px] text-right">
            Need help getting started? 💬
            <button onClick={() => setShowTooltip(false)} className="opacity-60 hover:opacity-100 flex-shrink-0">
              <X size={12} />
            </button>
          </div>
        )}

        {/* Circle button */}
        <button
          onClick={isOpen ? close : open}
          className={`w-14 h-14 rounded-full bg-[#1A1A2E] text-white shadow-xl flex items-center justify-center hover:bg-[#2a2a4e] transition-all active:scale-95 ${
            isPulsing && !isOpen ? 'animate-pulse' : ''
          }`}
          aria-label="Open support chat"
        >
          {isOpen ? (
            <X size={22} />
          ) : (
            <Sparkles size={22} className="text-[#E8B86D]" />
          )}
        </button>
      </div>

      {/* Chat panel */}
      {isOpen && <ChatPanel />}
    </>
  );
}