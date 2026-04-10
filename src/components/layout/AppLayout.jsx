import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './BottomNav';
import ChatBubble from '@/components/chat/ChatBubble';
import useProactiveChatTrigger from '@/hooks/useProactiveChatTrigger';
import { useAuth } from '@/lib/AuthContext';
import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

function AppLayoutInner() {
  useProactiveChatTrigger();
  const { authError } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (authError?.type === 'auth_required') {
      base44.auth.redirectToLogin(location.pathname);
    }
  }, [authError, location.pathname]);

  if (authError?.type === 'auth_required') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <main className="max-w-lg mx-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <BottomNav />
      <ChatBubble hasBottomNav={true} />
    </div>
  );
}

export default function AppLayout() {
  return <AppLayoutInner />;
}