import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import ChatBubble from '@/components/chat/ChatBubble';
import useProactiveChatTrigger from '@/hooks/useProactiveChatTrigger';

function AppLayoutInner() {
  useProactiveChatTrigger();
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