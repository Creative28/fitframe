import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useChat } from '@/lib/ChatContext';

const UPLOAD_PATHS = ['/studio', '/bulk-studio'];
const TRIGGER_DELAY_MS = 60000; // 60 seconds

export default function useProactiveChatTrigger() {
  const location = useLocation();
  const { isOpen, triggerProactiveHint, messages } = useChat();
  const timerRef = useRef(null);

  useEffect(() => {
    const isUploadScreen = UPLOAD_PATHS.includes(location.pathname);

    clearTimeout(timerRef.current);

    if (isUploadScreen && !isOpen && messages.length === 0) {
      timerRef.current = setTimeout(() => {
        triggerProactiveHint();
      }, TRIGGER_DELAY_MS);
    }

    return () => clearTimeout(timerRef.current);
  }, [location.pathname, isOpen, messages.length]);
}