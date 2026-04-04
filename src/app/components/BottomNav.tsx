import { useNavigate, useLocation } from 'react-router';
import { Home, Compass, Video, Users, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab?: string;
}

export function BottomNav({ activeTab: propActiveTab }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // Determine active tab from location if not provided
  const getActiveTab = () => {
    if (propActiveTab) return propActiveTab;
    const path = location.pathname;
    if (path === '/home') return 'home';
    if (path === '/reels') return 'reels';
    if (path === '/community') return 'community';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  const navItems = [
    { id: 'home', icon: Home, label: t('home'), path: '/home' },
    { id: 'discover', icon: Compass, label: t('discover'), path: '/home' },
    { id: 'reels', icon: Video, label: t('reels'), path: '/reels' },
    { id: 'community', icon: Users, label: t('community'), path: '/community' },
    { id: 'profile', icon: User, label: t('profile'), path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-t border-[var(--border-primary)]">
      <div className="flex items-center justify-around px-4 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 min-w-[60px] transition-all"
            >
              <div className={`p-2 rounded-full transition-colors ${
                isActive ? 'bg-[var(--brand-orange)]' : 'bg-transparent'
              }`}>
                <Icon
                  size={22}
                  className={isActive ? 'text-white' : 'text-[var(--text-secondary)]'}
                />
              </div>
              <span className={`text-xs ${
                isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
