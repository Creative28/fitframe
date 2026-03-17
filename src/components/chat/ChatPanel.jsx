import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { useChat } from '@/lib/ChatContext';
import { base44 } from '@/api/base44Client';

const STARTERS = [
  "How do I generate my first photo? 🖼",
  "How does the try-on link work? 🔗",
  "How many credits do I have? 💳",
];

export default function ChatPanel({ isAuthenticated }) {
  const { close, messages, setMessages, isLoading, setIsLoading } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content || isLoading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await base44.functions.invoke('aiChat', { messages: newMessages });
      const reply = res.data?.reply || "Sorry, I couldn't get a response. Please try again!";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Hmm, something went wrong. Please try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const showStarters = messages.length === 0;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-none">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 pointer-events-auto" onClick={close} />

      {/* Panel */}
      <div className="relative pointer-events-auto bg-white rounded-t-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: '80vh', minHeight: '50vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#1A1A2E] flex items-center justify-center">
              <Sparkles size={16} className="text-[#E8B86D]" />
            </div>
            <div>
              <p className="font-playfair font-bold text-[#1A1A2E] text-base">Just Fit It Assistant</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                <p className="text-xs font-dm text-gray-400">Online</p>
              </div>
            </div>
          </div>
          <button onClick={close} className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {showStarters && (
            <div className="space-y-3">
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                  <p className="text-sm font-dm text-gray-700">👋 Hi! I'm your Just Fit It assistant. How can I help you today?</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                {STARTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left px-4 py-3 bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 rounded-xl text-sm font-dm text-[#1A1A2E] hover:bg-[#1A1A2E]/10 transition-colors min-h-[48px]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm font-dm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#1A1A2E] text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-700 rounded-tl-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-4">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0 flex gap-2 items-end pb-safe">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask me anything…"
            rows={1}
            className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-3 text-sm font-dm focus:outline-none focus:border-[#1A1A2E]/30 max-h-24"
            style={{ minHeight: '48px' }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 flex items-center justify-center bg-[#1A1A2E] text-white rounded-2xl disabled:opacity-40 flex-shrink-0 hover:bg-[#2a2a4e] transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}