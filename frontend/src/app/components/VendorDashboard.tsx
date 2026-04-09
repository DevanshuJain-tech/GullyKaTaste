import {
  LayoutDashboard,
  Menu as MenuIcon,
  Image,
  Star,
  Tag,
  Settings,
  TrendingUp,
  Users,
  DollarSign,
  Eye,
  Upload,
  X
} from 'lucide-react';
import { useState } from 'react';

interface DashboardStats {
  views: number;
  orders: number;
  revenue: number;
  rating: number;
}

interface VendorDashboardProps {
  onClose: () => void;
}

export function VendorDashboard({ onClose }: VendorDashboardProps) {
  const [activeSection, setActiveSection] = useState<'overview' | 'menu' | 'media' | 'reviews' | 'offers' | 'settings'>('overview');

  const stats: DashboardStats = {
    views: 1234,
    orders: 89,
    revenue: 12450,
    rating: 4.5,
  };

  const menuItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'menu', icon: MenuIcon, label: 'Menu Management' },
    { id: 'media', icon: Image, label: 'Photos & Videos' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
    { id: 'offers', icon: Tag, label: 'Offers & Promotions' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[var(--bg-secondary)] border-r border-[var(--border-primary)] flex flex-col">
        <div className="p-6 border-b border-[var(--border-primary)]">
          <h2 className="text-xl">Vendor Dashboard</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your business</p>
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-colors ${
                  isActive
                    ? 'bg-[var(--brand-orange)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={onClose}
          className="m-4 py-3 px-4 rounded-xl border border-[var(--border-primary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-center gap-2"
        >
          <X size={18} />
          <span>Close Dashboard</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeSection === 'overview' && (
            <div>
              <h1 className="text-3xl mb-8">Dashboard Overview</h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Eye size={24} className="text-blue-400" />
                    </div>
                    <TrendingUp size={20} className="text-green-400" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Total Views</p>
                  <p className="text-3xl">{stats.views.toLocaleString()}</p>
                  <p className="text-xs text-green-400 mt-2">+12% from last week</p>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#FF8C42]/20 flex items-center justify-center">
                      <Users size={24} className="text-[var(--brand-orange)]" />
                    </div>
                    <TrendingUp size={20} className="text-green-400" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Orders</p>
                  <p className="text-3xl">{stats.orders}</p>
                  <p className="text-xs text-green-400 mt-2">+8% from last week</p>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <DollarSign size={24} className="text-green-400" />
                    </div>
                    <TrendingUp size={20} className="text-green-400" />
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Revenue</p>
                  <p className="text-3xl">₹{stats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-green-400 mt-2">+15% from last week</p>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <Star size={24} className="text-yellow-400" />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">245 reviews</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-1">Rating</p>
                  <p className="text-3xl">{stats.rating}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-2">Overall rating</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                <h3 className="text-xl mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveSection('media')}
                    className="p-6 bg-[var(--bg-primary)] rounded-xl hover:bg-[var(--bg-hover)] transition-colors flex flex-col items-center gap-3"
                  >
                    <Upload size={32} className="text-[var(--brand-orange)]" />
                    <span className="text-sm">Upload Media</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('menu')}
                    className="p-6 bg-[var(--bg-primary)] rounded-xl hover:bg-[var(--bg-hover)] transition-colors flex flex-col items-center gap-3"
                  >
                    <MenuIcon size={32} className="text-[var(--brand-orange)]" />
                    <span className="text-sm">Update Menu</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('offers')}
                    className="p-6 bg-[var(--bg-primary)] rounded-xl hover:bg-[var(--bg-hover)] transition-colors flex flex-col items-center gap-3"
                  >
                    <Tag size={32} className="text-[var(--brand-orange)]" />
                    <span className="text-sm">Create Offer</span>
                  </button>

                  <button
                    onClick={() => setActiveSection('reviews')}
                    className="p-6 bg-[var(--bg-primary)] rounded-xl hover:bg-[var(--bg-hover)] transition-colors flex flex-col items-center gap-3"
                  >
                    <Star size={32} className="text-[var(--brand-orange)]" />
                    <span className="text-sm">View Reviews</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'menu' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl">Menu Management</h1>
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] text-white hover:opacity-90 transition-opacity">
                  Add New Item
                </button>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                <p className="text-[var(--text-secondary)] text-center py-12">
                  Menu management interface would be displayed here with CRUD operations for menu items.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'media' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl">Photos & Videos</h1>
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] text-white hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Upload size={18} />
                  <span>Upload Media</span>
                </button>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                <p className="text-[var(--text-secondary)] text-center py-12">
                  Media gallery and upload interface would be displayed here.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'reviews' && (
            <div>
              <h1 className="text-3xl mb-8">Customer Reviews</h1>
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                <p className="text-[var(--text-secondary)] text-center py-12">
                  Reviews management interface would be displayed here.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'offers' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl">Offers & Promotions</h1>
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] text-white hover:opacity-90 transition-opacity">
                  Create Offer
                </button>
              </div>

              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                <p className="text-[var(--text-secondary)] text-center py-12">
                  Offers and promotions management interface would be displayed here.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div>
              <h1 className="text-3xl mb-8">Settings</h1>
              <div className="bg-[var(--bg-secondary)] rounded-2xl p-6">
                <p className="text-[var(--text-secondary)] text-center py-12">
                  Vendor profile settings and configurations would be displayed here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
