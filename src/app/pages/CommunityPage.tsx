import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { CommunityView } from '../components/CommunityView';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { mockCommunityPosts } from '../data/mockData';

export function CommunityPage() {
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
        <CommunityView posts={mockCommunityPosts} />
      </main>
      <BottomNav activeTab="community" />
    </div>
  );
}
