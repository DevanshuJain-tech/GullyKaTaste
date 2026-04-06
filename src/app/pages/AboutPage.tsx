import { useNavigate } from "react-router";
import { ChevronLeft, MapPin, Users, Target } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useLanguage } from "../context/LanguageContext";

export function AboutPage() {
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
          <h1 className="text-2xl">{t("about")}</h1>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pb-24 space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <div className="size-24 mx-auto mb-4 bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-dark)] rounded-3xl flex items-center justify-center text-4xl font-bold text-white">
              V
            </div>
            <h2 className="text-3xl mb-2">VendorApp</h2>
            <p className="text-[var(--text-secondary)]">Version 1.0.0</p>
          </div>

          {/* Mission */}
          <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[var(--brand-orange)]/20 rounded-lg">
                <Target size={24} className="text-[var(--brand-orange)]" />
              </div>
              <h3 className="text-xl">Our Mission</h3>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Connecting food lovers with amazing local street vendors, food
              carts, and small businesses. We believe in supporting local
              economies and making great food accessible to everyone.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl text-center">
              <div className="text-3xl mb-2">500+</div>
              <div className="text-sm text-[var(--text-secondary)]">
                Vendors
              </div>
            </div>
            <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl text-center">
              <div className="text-3xl mb-2">10K+</div>
              <div className="text-sm text-[var(--text-secondary)]">
                Users
              </div>
            </div>
            <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl text-center">
              <div className="text-3xl mb-2">50+</div>
              <div className="text-sm text-[var(--text-secondary)]">
                Cities
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-xl mb-4">What We Offer</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-2xl">
                <MapPin size={22} className="text-[var(--brand-orange)]" />
                <div>
                  <p className="font-semibold">Location-Based Discovery</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Find vendors within 1km radius
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-2xl">
                <Users size={22} className="text-[var(--brand-orange)]" />
                <div>
                  <p className="font-semibold">Community Driven</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Share experiences and connect
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-[var(--text-secondary)] text-sm">
            <p>© 2026 VendorApp. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ for street food lovers</p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}