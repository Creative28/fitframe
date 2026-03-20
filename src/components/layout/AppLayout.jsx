import { Outlet, useLocation } from 'react-router-dom';
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
        <Outlet />
      </main>
      <BottomNav />
      <ChatBubble hasBottomNav={true} />
    </div>
  );
}

export default function AppLayout() {
  return <AppLayoutInner />;
}