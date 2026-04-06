import { useNavigate } from "react-router";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "../components/BottomNav";

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl">Terms & Conditions</h1>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pb-24 space-y-6">
          <p className="text-[var(--text-secondary)]">
            Last updated: April 4, 2026
          </p>

          <div>
            <h2 className="text-xl mb-3">1. Acceptance of Terms</h2>
            <p className="text-[var(--text-secondary)]">
              By using this app, you agree to our terms.
            </p>
          </div>

          <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl">
            <p className="text-sm text-[var(--text-secondary)]">
              You acknowledge these terms.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}