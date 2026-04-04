import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { ReelsView } from '../components/ReelsView';
import { mockReels } from '../data/mockData';

export function ReelsPage() {
  return (
    <div className="h-screen bg-[#1A1A1A] text-white flex flex-col overflow-hidden">
      <ReelsView reels={mockReels} />
      <BottomNav activeTab="reels" />
    </div>
  );
}
