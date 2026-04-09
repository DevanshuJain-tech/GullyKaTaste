import { useState } from "react";
import { Star, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth0 } from "@auth0/auth0-react";

interface WriteReviewProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  onSubmit: (
    rating: number,
    comment: string,
    user: {
      nickname?: string;
      name?: string;
      avatar?: string | null;
    },
  ) => Promise<void> | void;
}

export function WriteReview({
  isOpen,
  onClose,
  vendorName,
  onSubmit,
}: WriteReviewProps) {
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth0();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert("Please login first");
      return;
    }

    if (rating === 0 || submitting) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(rating, comment, {
        nickname: user?.nickname,
        name: user?.name,
        avatar: user?.picture || null,
      });

      setRating(0);
      setComment("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[var(--bg-primary)] rounded-3xl shadow-2xl z-50 m-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {language === "en" ? "Write a Review" : "Write a Review"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-[var(--text-secondary)] text-sm mb-1">
                  {language === "en" ? "Reviewing" : "Reviewing"}
                </p>
                <p className="font-semibold text-lg">{vendorName}</p>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium mb-3">
                  {language === "en" ? "Your Rating" : "Your Rating"}
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={40}
                        className={
                          star <= (hoverRating || rating)
                            ? "text-[var(--brand-orange)] fill-[var(--brand-orange)]"
                            : "text-[var(--text-tertiary)]"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  {language === "en" ? "Your Review" : "Your Review"}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Share your experience..."
                      : "Share your experience..."
                  }
                  rows={4}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl font-semibold bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)]"
                >
                  {language === "en" ? "Cancel" : "Cancel"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0 || submitting}
                  className="flex-1 py-3 rounded-2xl font-semibold bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-dark)] disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting..."
                    : language === "en"
                      ? "Submit"
                      : "Submit"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
