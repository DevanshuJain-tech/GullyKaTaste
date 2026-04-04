import { Settings, Heart, MapPin, Star, ChevronRight, LogOut, User, Bell, Shield, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProfileView() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', onClick: () => navigate('/profile/edit') },
        { icon: Bell, label: 'Notifications', onClick: () => navigate('/notifications') },
        { icon: MapPin, label: 'Saved Addresses', onClick: () => navigate('/profile/addresses') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Heart, label: 'Favorite Vendors', count: 12, onClick: () => navigate('/profile/favorites') },
        { icon: Star, label: 'My Reviews', count: 8, onClick: () => navigate('/profile/reviews') },
        { icon: Settings, label: 'Settings', onClick: () => navigate('/settings') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', onClick: () => alert('Help & Support coming soon!') },
        { icon: Shield, label: 'Privacy Policy', onClick: () => alert('Privacy Policy coming soon!') },
      ]
    }
  ];

  const handleCompleteProfile = () => {
    navigate('/profile/edit');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className="pb-24 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-dark)] p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/40">
            <User size={40} className="text-white" />
          </div>

          <div>
            <h2 className="text-2xl text-white mb-1">Guest User</h2>
            <p className="text-white/80 text-sm">guest@example.com</p>
          </div>
        </div>

        <button
          onClick={handleCompleteProfile}
          className="w-full py-3 rounded-full bg-white text-[var(--brand-orange)] hover:bg-white/90 transition-colors"
        >
          Complete Profile
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">12</p>
          <p className="text-xs text-[var(--text-secondary)]">Favorites</p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">8</p>
          <p className="text-xs text-[var(--text-secondary)]">Reviews</p>
        </div>
        <div className="bg-[var(--bg-secondary)] rounded-xl p-4 text-center">
          <p className="text-2xl mb-1">24</p>
          <p className="text-xs text-[var(--text-secondary)]">Check-ins</p>
        </div>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section, idx) => (
        <div key={idx} className="border-b border-[var(--border-primary)]">
          <h3 className="px-4 py-3 text-sm text-[var(--text-secondary)]">{section.title}</h3>

          {section.items.map((item, itemIdx) => {
            const Icon = item.icon;
            return (
              <button
                key={itemIdx}
                onClick={item.onClick}
                className="w-full flex items-center justify-between px-4 py-4 hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center">
                    <Icon size={20} className="text-[var(--brand-orange)]" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {'count' in item && (
                    <span className="text-sm text-[var(--text-secondary)]">{item.count}</span>
                  )}
                  <ChevronRight size={20} className="text-[var(--text-secondary)]" />
                </div>
              </button>
            );
          })}
        </div>
      ))}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-3 px-4 py-4 text-red-500 hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}
