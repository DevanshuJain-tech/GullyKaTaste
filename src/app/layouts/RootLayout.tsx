import { Outlet, useLocation } from 'react-router';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export function RootLayout() {
  const location = useLocation();

  // Pages that don't need the default layout
  const noLayoutPages = ['/', '/login', '/signup', '/vendor-dashboard'];
  const hideLayout = noLayoutPages.includes(location.pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <div className="size-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <Outlet />
          </div>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
