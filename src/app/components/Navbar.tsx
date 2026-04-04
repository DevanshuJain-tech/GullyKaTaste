import { useNavigate } from 'react-router';
import { MapPin, Bell, Menu, Search, Globe, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentLocation: string;
  onMenuClick: () => void;
  onLocationClick?: () => void;
  notificationCount?: number;
  showAppName?: boolean;
}

export function Navbar({ currentLocation, onMenuClick, onLocationClick, notificationCount = 0, showAppName = true }: NavbarProps) {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-40 bg-[var(--bg-primary)]/95 backdrop-blur-lg border-b border-[var(--border-color)]">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
            >
              <Menu size={24} className="text-[var(--text-primary)]" />
            </button>

            {showAppName && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍜</span>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-orange-dark)] bg-clip-text text-transparent">
                  Gully Ka Taste
                </h1>
              </div>
            )}

            <button
              onClick={onLocationClick}
              className="flex items-center gap-2 bg-[var(--bg-secondary)] px-4 py-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <MapPin size={18} className="text-[var(--brand-orange)]" />
              <span className="text-sm text-[var(--text-primary)]">{currentLocation}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors relative group"
              title={language === 'en' ? 'Switch to Hindi' : 'Switch to English'}
            >
              <Globe size={22} className="text-[var(--text-primary)]" />
              <span className="absolute -bottom-1 -right-1 text-xs font-bold bg-[var(--brand-orange)] text-white rounded-full size-5 flex items-center justify-center">
                {language.toUpperCase()}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun size={22} className="text-[var(--brand-orange)]" />
              ) : (
                <Moon size={22} className="text-[var(--brand-orange)]" />
              )}
            </button>

            {/* Search */}
            <button
              onClick={() => navigate('/search')}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
            >
              <Search size={22} className="text-[var(--text-primary)]" />
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate('/notifications')}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors relative"
            >
              <Bell size={22} className="text-[var(--text-primary)]" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 size-5 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-xs font-semibold text-white">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
