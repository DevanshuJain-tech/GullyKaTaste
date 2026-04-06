import { useNavigate } from "react-router";
import { ChevronLeft, Mail, Phone, MessageCircle } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { useLanguage } from "../context/LanguageContext";

export function HelpPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const helpCategories = [
    {
      title: "Getting Started",
      questions: [
        "How to find vendors near me?",
        "How to create an account?",
        "How to become a vendor?",
      ],
    },
    {
      title: "Orders & Payment",
      questions: [
        "How to place an order?",
        "What payment methods are supported?",
        "How to track my order?",
      ],
    },
    {
      title: "Account & Settings",
      questions: [
        "How to change my location?",
        "How to update my profile?",
        "How to manage notifications?",
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
          <h1 className="text-2xl">{t("help")}</h1>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="pb-24">
          {/* Contact Options */}
          <div className="p-4 space-y-3">
            <button className="w-full flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-2xl hover:bg-[var(--bg-hover)] transition-colors">
              <div className="p-3 bg-[var(--brand-orange)]/20 rounded-full">
                <Mail size={22} className="text-[var(--brand-orange)]" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Email Support</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  support@vendorapp.com
                </p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-2xl hover:bg-[var(--bg-hover)] transition-colors">
              <div className="p-3 bg-green-500/20 rounded-full">
                <Phone size={22} className="text-green-500" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Call Us</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  +91 1800-123-4567
                </p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-2xl hover:bg-[var(--bg-hover)] transition-colors">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <MessageCircle size={22} className="text-blue-500" />
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Live Chat</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Available 24/7
                </p>
              </div>
            </button>
          </div>

          {/* FAQ */}
          <div className="mt-6">
            <h2 className="px-6 py-3 text-lg font-semibold">
              Frequently Asked Questions
            </h2>

            {helpCategories.map((category, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="px-6 py-2 text-sm text-[var(--text-secondary)] font-semibold">
                  {category.title}
                </h3>

                <div className="bg-[var(--bg-secondary)]">
                  {category.questions.map((question, qIdx) => (
                    <button
                      key={qIdx}
                      className="w-full p-4 text-left hover:bg-[var(--bg-hover)] transition-colors border-b border-[var(--border-primary)] last:border-b-0"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}