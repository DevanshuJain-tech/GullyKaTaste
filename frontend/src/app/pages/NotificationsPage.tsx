import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Bell, Store, Tag, Package } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useLanguage } from "../context/LanguageContext";
import {
  getNotifications,
  markNotificationRead,
  type NotificationItem,
} from "../lib/api";

const typeIconMap: Record<string, typeof Store> = {
  vendor_onboarding: Store,
  new_review: Store,
  offer: Tag,
  order: Package,
};

function formatRelativeTime(isoString: string) {
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export function NotificationsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getNotifications({ pageSize: 50 });
      setNotifications(response.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleOpenNotification = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      const updated = await markNotificationRead(notification.id);
      setNotifications((previous) =>
        previous.map((item) => (item.id === updated.id ? updated : item)),
      );
    }
  };

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
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
            <h1 className="text-2xl">{t("notifications")}</h1>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="pb-24">
          {loading ? (
            <div className="p-6 text-[var(--text-secondary)]">Loading notifications...</div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-[var(--text-secondary)]">No notifications yet.</div>
          ) : (
            notifications.map((notification) => {
              const Icon = typeIconMap[notification.type] ?? Bell;
              return (
                <button
                  key={notification.id}
                  onClick={() => handleOpenNotification(notification)}
                  className={`w-full p-4 border-b border-[var(--border-primary)] hover:bg-[var(--bg-secondary)] transition-colors text-left ${
                    !notification.is_read ? "bg-[var(--bg-secondary)]/50" : ""
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="p-3 rounded-full bg-[var(--brand-orange)]/20">
                      <Icon size={24} className="text-[var(--brand-orange)]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold">{notification.title}</h3>
                        {!notification.is_read && (
                          <div className="size-2 bg-[var(--brand-orange)] rounded-full mt-2" />
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">{notification.message}</p>
                      <p className="text-xs text-[var(--text-secondary)]/70">
                        {formatRelativeTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}