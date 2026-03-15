import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <main className="max-w-lg mx-auto pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}