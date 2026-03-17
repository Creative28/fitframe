import { createContext, useContext, useState, useCallback } from 'react';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content: string }
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  const open = useCallback(() => { setIsOpen(true); setShowTooltip(false); setIsPulsing(false); }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const triggerProactiveHint = useCallback(() => {
    setIsPulsing(true);
    setShowTooltip(true);
  }, []);

  const addMessage = useCallback((msg) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  return (
    <ChatContext.Provider value={{
      isOpen, open, close,
      messages, setMessages,
      isLoading, setIsLoading,
      showTooltip, setShowTooltip,
      isPulsing, setIsPulsing,
      triggerProactiveHint,
      addMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}