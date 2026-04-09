import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { ProfileView } from '../components/ProfileView';
import { HamburgerMenu } from '../components/HamburgerMenu';

export function ProfilePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Navbar
        currentLocation="Connaught Place, Delhi"
        onMenuClick={() => setMenuOpen(true)}
        notificationCount={3}
      />
      <main className="flex-1 overflow-y-auto">
        <ProfileView />
      </main>
      <BottomNav activeTab="profile" />
    </div>
  );
}
