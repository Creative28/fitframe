import { Link, useLocation } from 'react-router-dom';
import { Camera, Images, Link2, User } from 'lucide-react';

const tabs = [
  { path: '/studio', icon: Camera, label: 'Studio' },
  { path: '/my-photos', icon: Images, label: 'My Photos' },
  { path: '/tryon-links', icon: Link2, label: 'Try-On Links' },
  { path: '/account', icon: User, label: 'Account' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-inset-bottom">
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ path, icon: NavIcon, label }) => {
          const active = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex-1 flex flex-col items-center justify-center py-4 gap-1 transition-colors min-h-[56px] ${
                active ? 'text-[#1A1A2E]' : 'text-gray-400'
              }`}
            >
              <NavIcon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium font-dm">{label}</span>
              {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#E8B86D] rounded-t-full" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}