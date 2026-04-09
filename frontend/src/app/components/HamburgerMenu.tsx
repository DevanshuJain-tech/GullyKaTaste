import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Home,
  User,
  Settings,
  Heart,
  HelpCircle,
  Info,
  FileText,
  Shield,
  Store,
  LogOut,
  Globe,
} from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLanguage } from "../context/LanguageContext";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loginWithRedirect } = useAuth0();
  const { t, language, setLanguage } = useLanguage();

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const menuItems = [
    { icon: Home, label: t("home"), path: "/home" },
    { icon: User, label: t("profile"), path: "/profile" },
    { icon: Heart, label: t("favorites"), path: "/favorites" },
    { icon: Settings, label: t("settings"), path: "/settings" },
    { icon: Store, label: t("becomeVendor"), path: "/vendor-dashboard" },
    { icon: HelpCircle, label: t("help"), path: "/help" },
    { icon: Info, label: t("about"), path: "/about" },
    { icon: Shield, label: t("privacyPolicy"), path: "/privacy" },
    { icon: FileText, label: t("termsConditions"), path: "/terms" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-[var(--bg-primary)] border-r border-[var(--border-primary)] z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border-primary)]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl text-[var(--text-primary)]">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* User Info */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-2xl">
                  <div className="relative size-12">
                    {/* Image */}
                    {user?.picture && (
                      <img
                        src={user.picture}
                        alt="user"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 size-full rounded-full object-cover"
                      />
                    )}

                    {/* Fallback */}
                    <div className="size-12 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-xl font-semibold text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-[var(--text-primary)]">
                      {user?.name}
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      loginWithRedirect();
                      onClose();
                    }}
                    className="flex-1 bg-[var(--brand-orange)] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition-colors"
                  >
                    {t("login")}
                  </button>
                  <button
                    onClick={() => {
                      loginWithRedirect({
                        authorizationParams: { screen_hint: "signup" },
                      });
                      onClose();
                    }}
                    className="flex-1 bg-[var(--bg-secondary)] text-[var(--text-primary)] py-2 rounded-xl font-semibold hover:bg-[var(--bg-hover)] transition-colors border border-[var(--border-primary)]"
                  >
                    {t("signup")}
                  </button>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigate(item.path)}
                  className="w-full flex items-center gap-4 p-4 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors text-left"
                >
                  <item.icon
                    size={22}
                    className="text-[var(--text-secondary)]"
                  />
                  <span className="text-[var(--text-primary)]">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <div className="p-4 border-t border-[var(--border-primary)]">
              <button
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="w-full flex items-center gap-4 p-4 bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] rounded-xl transition-colors"
              >
                <Globe size={22} className="text-[var(--text-secondary)]" />
                <span className="text-[var(--text-primary)]">
                  {language === "en" ? "Switch to Hindi" : "Switch to English"}
                </span>
              </button>
            </div>

            {/* Logout */}
            {isAuthenticated && (
              <div className="p-4 border-t border-[var(--border-primary)]">
                <button
                  onClick={() => {
                    logout({
                      logoutParams: {
                        returnTo: window.location.origin,
                      },
                    });
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"
                >
                  <LogOut size={22} />
                  <span>{t("logout")}</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
