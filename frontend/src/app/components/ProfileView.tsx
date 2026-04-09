import {
  Settings,
  Heart,
  MapPin,
  Star,
  ChevronRight,
  LogOut,
  User,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth0 } from "@auth0/auth0-react";
import { useAppSelector } from "../store/hooks";

export function ProfileView() {
  const navigate = useNavigate();
  const { user, logout } = useAuth0();
  const me = useAppSelector((state) => state.user.me);

  const favoritesCount = me?.stats.favorites_count ?? 0;
  const reviewsCount = me?.stats.reviews_count ?? 0;

  const menuSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Edit Profile",
          onClick: () => navigate("/profile/edit"),
        },
        {
          icon: Bell,
          label: "Notifications",
          onClick: () => navigate("/notifications"),
        },
        {
          icon: MapPin,
          label: "Saved Addresses",
          onClick: () => navigate("/profile/addresses"),
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Heart,
          label: "Favorite Vendors",
          count: favoritesCount,
          onClick: () => navigate("/profile/favorites"),
        },
        {
          icon: Star,
          label: "My Reviews",
          count: reviewsCount,
          onClick: () => navigate("/profile/reviews"),
        },
        {
          icon: Settings,
          label: "Settings",
          onClick: () => navigate("/settings"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          onClick: () => navigate("/help"),
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          onClick: () => navigate("/privacy"),
        },
      ],
    },
  ];

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  return (
    <div className="pb-24 bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-dark)] p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative size-12">
            {user?.picture && (
              <img
                src={user.picture}
                alt="user"
                referrerPolicy="no-referrer"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
                className="absolute inset-0 size-full rounded-full object-cover"
              />
            )}

            <div className="size-12 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-xl font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>

          <div>
            <h2 className="text-2xl text-white mb-1">{me?.user.full_name || user?.name || "User"}</h2>
            <p className="text-white/80 text-sm">{me?.user.email || user?.email}</p>
          </div>
        </div>
      </div>

      {menuSections.map((section) => (
        <div key={section.title} className="border-b border-[var(--border-primary)]">
          <h3 className="px-4 py-3 text-sm text-[var(--text-secondary)]">{section.title}</h3>

          {section.items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex justify-between items-center px-4 py-4 hover:bg-[var(--bg-secondary)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
                    <Icon size={20} className="text-[var(--brand-orange)]" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {"count" in item && (
                    <span className="text-sm text-[var(--text-secondary)]">{item.count}</span>
                  )}
                  <ChevronRight size={20} className="text-[var(--text-secondary)]" />
                </div>
              </button>
            );
          })}
        </div>
      ))}

      <button
        onClick={handleLogout}
        className="w-full flex justify-center items-center gap-3 px-4 py-4 text-red-500 hover:bg-[var(--bg-secondary)]"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}