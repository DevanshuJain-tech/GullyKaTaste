import { useNavigate } from 'react-router';
import { ChevronLeft, Bell, Store, Tag, Package } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { useLanguage } from '../context/LanguageContext';

const mockNotifications = [
  {
    id: '1',
    title: 'New Vendor Nearby',
    message: 'Ice Cream Truck just opened 0.6km from your location!',
    time: '10 minutes ago',
    read: false,
    type: 'vendor',
    icon: Store,
  },
  {
    id: '2',
    title: 'Special Offer',
    message: 'Get 20% off on your next order from Street Taco Corner',
    time: '2 hours ago',
    read: false,
    type: 'offer',
    icon: Tag,
  },
  {
    id: '3',
    title: 'Order Delivered',
    message: 'Your order #ORD-1234 has been delivered successfully',
    time: '1 day ago',
    read: true,
    type: 'order',
    icon: Package,
  },
  {
    id: '4',
    title: 'Vendor Update',
    message: 'Burger Paradise has added new items to their menu',
    time: '2 days ago',
    read: true,
    type: 'vendor',
    icon: Store,
  },
];

export function NotificationsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Bell size={24} className="text-[var(--brand-orange)]" />
            <h1 className="text-2xl">{t('notifications')}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="pb-24">
          {mockNotifications.map((notification) => {
            const Icon = notification.icon;
            return (
              <div
                key={notification.id}
                className={`p-4 border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer ${
                  !notification.read ? 'bg-[var(--bg-secondary)]/50' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`p-3 rounded-full ${
                    notification.type === 'offer' ? 'bg-green-500/20' :
                    notification.type === 'order' ? 'bg-blue-500/20' : 'bg-[var(--brand-orange)]/20'
                  }`}>
                    <Icon size={24} className={
                      notification.type === 'offer' ? 'text-green-500' :
                      notification.type === 'order' ? 'text-blue-500' : 'text-[var(--brand-orange)]'
                    } />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.read && (
                        <div className="size-2 bg-[var(--brand-orange)] rounded-full mt-2" />
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{notification.message}</p>
                    <p className="text-xs text-[var(--text-secondary)]/70">{notification.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
