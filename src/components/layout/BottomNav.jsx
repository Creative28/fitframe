import { Camera, Images, Link2, User } from 'lucide-react';
import { useTabStack } from '@/hooks/useTabStack';

const tabs = [
  { path: '/studio', icon: Camera, label: 'Studio' },
  { path: '/my-photos', icon: Images, label: 'My Photos' },
  { path: '/tryon-links', icon: Link2, label: 'Try-On Links' },
  { path: '/account', icon: User, label: 'Account' },
];

export default function BottomNav() {
  const { activeTab, switchToTab, resetTab } = useTabStack();

  const handleClick = (path) => {
    if (activeTab === path) {
      resetTab(path);
    } else {
      switchToTab(path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-lg mx-auto flex">
        {tabs.map(({ path, icon: NavIcon, label }) => {
          const active = activeTab === path;
          return (
            <button
              key={path}
              type="button"
              aria-label={label}
              onClick={() => handleClick(path)}
              className={`relative flex-1 flex flex-col items-center justify-center py-4 gap-1 transition-colors min-h-[56px] ${
                active ? 'text-brand-text' : 'text-gray-400'
              }`}
            >
              <NavIcon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-xs font-medium font-dm">{label}</span>
              {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-accent rounded-t-full" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}