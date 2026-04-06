import { useNavigate } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Globe,
  Bell,
  Lock,
  HelpCircle,
  Info,
  LogOut,
} from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: Globe,
          label: t("language"),
          value: language === "en" ? "English" : "हिंदी",
          onClick: () =>
            setLanguage(language === "en" ? "hi" : "en"),
        },
        {
          icon: Bell,
          label: t("notifications"),
          onClick: () => navigate("/notifications"),
        },
        {
          icon: Lock,
          label: "Privacy & Security",
          onClick: () => navigate("/privacy"),
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: t("help"),
          onClick: () => navigate("/help"),
        },
        {
          icon: Info,
          label: t("about"),
          onClick: () => navigate("/about"),
        },
      ],
    },
  ];

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
          <h1 className="text-2xl">{t("settings")}</h1>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="pb-24">
          {settingsSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h2 className="px-6 py-3 text-sm text-[var(--text-secondary)] uppercase tracking-wider">
                {section.title}
              </h2>

              <div className="bg-[var(--bg-secondary)]">
                {section.items.map((item, itemIdx) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={itemIdx}
                      onClick={item.onClick}
                      className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--border-primary)] last:border-b-0"
                    >
                      <div className="flex items-center gap-4">
                        <Icon
                          size={22}
                          className="text-[var(--text-secondary)]"
                        />
                        <span>{item.label}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        {item.value && (
                          <span className="text-sm">{item.value}</span>
                        )}
                        <ChevronRight size={20} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Logout */}
          <div className="px-4 mt-8">
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-3 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-colors"
            >
              <LogOut size={22} />
              <span className="font-semibold">{t("logout")}</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}