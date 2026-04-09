import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

export function PrivacyPage() {
  const navigate = useNavigate();

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
          <h1 className="text-2xl">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pb-24 space-y-6">
          <div>
            <p className="text-[var(--text-secondary)] mb-4">
              Last updated: April 4, 2026
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              At VendorApp, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our application.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">Information We Collect</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-2">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
              <li>Name, email address, and phone number</li>
              <li>Location data to show nearby vendors</li>
              <li>Photos and reviews you post</li>
              <li>Preferences and usage data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
              <li>To provide and maintain our services</li>
              <li>To show relevant vendors nearby</li>
              <li>To improve user experience</li>
              <li>To communicate updates</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl mb-3">Data Security</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We implement security measures to protect your data, but no system
              is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">Your Rights</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              You can access, update, or delete your data anytime.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl">
            <p className="text-sm text-[var(--text-secondary)]">
              By using VendorApp, you agree to this Privacy Policy.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}