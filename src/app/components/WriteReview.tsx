import { useState } from 'react';
import { Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface WriteReviewProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  onSubmit: (rating: number, comment: string) => void;
}

export function WriteReview({ isOpen, onClose, vendorName, onSubmit }: WriteReviewProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, comment);
      setRating(0);
      setComment('');
      onClose();
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
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {language === 'en' ? 'Write a Review' : 'समीक्षा लिखें'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Vendor Name */}
              <div className="mb-6">
                <p className="text-[var(--text-secondary)] text-sm mb-1">
                  {language === 'en' ? 'Reviewing' : 'समीक्षा करना'}
                </p>
                <p className="font-semibold text-lg">{vendorName}</p>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <p className="text-sm font-medium mb-3">
                  {language === 'en' ? 'Your Rating' : 'आपकी रेटिंग'}
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
                        className={`${
                          star <= (hoverRating || rating)
                            ? 'text-[var(--brand-orange)] fill-[var(--brand-orange)]'
                            : 'text-[var(--text-tertiary)]'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">
                  {language === 'en' ? 'Your Review' : 'आपकी समीक्षा'}{' '}
                  <span className="text-[var(--text-secondary)]">
                    ({language === 'en' ? 'Optional' : 'वैकल्पिक'})
                  </span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    language === 'en'
                      ? 'Share your experience with others...'
                      : 'दूसरों के साथ अपना अनुभव साझा करें...'
                  }
                  rows={4}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-2xl font-semibold bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="flex-1 py-3 rounded-2xl font-semibold bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {language === 'en' ? 'Submit' : 'जमा करें'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
