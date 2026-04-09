import { useState } from "react";
import { X, MapPin, Star, Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { WriteReview } from "./WriteReview";
import type { VendorDetail } from "../lib/api";

interface VendorDetailModalProps {
  vendor: VendorDetail;
  onClose: () => void;
  onSubmitReview?: (
    rating: number,
    comment: string,
    user: { nickname?: string; name?: string; avatar?: string | null },
  ) => Promise<void> | void;
  onToggleFavorite?: () => Promise<void> | void;
  isFavorite?: boolean;
}

export function VendorDetailModal({
  vendor,
  onClose,
  onSubmitReview,
  onToggleFavorite,
  isFavorite,
}: VendorDetailModalProps) {
  const { t } = useLanguage();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleSubmitReview = async (
    rating: number,
    comment: string,
    user: { nickname?: string; name?: string; avatar?: string | null },
  ) => {
    if (!onSubmitReview) {
      return;
    }

    setSubmittingReview(true);
    try {
      await onSubmitReview(rating, comment, user);
      setShowWriteReview(false);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] overflow-y-auto">
      <div className="relative h-80">
        <img
          src={vendor.images[0] || vendor.image || "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop"}
          alt={vendor.name}
          className="size-full object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-3 bg-black/40 rounded-full"
        >
          <X size={24} className="text-white" />
        </button>
        <button
          onClick={() => onToggleFavorite?.()}
          className="absolute top-6 right-6 p-3 bg-black/40 rounded-full"
        >
          <Heart
            size={24}
            className={isFavorite ? "text-[var(--brand-orange)] fill-[var(--brand-orange)]" : "text-white"}
          />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="flex justify-between gap-4">
          <div>
            <h1 className="text-3xl">{vendor.name}</h1>
            <div className="flex gap-2 text-[var(--text-secondary)] mt-1 text-sm">
              <MapPin size={16} />
              <span>{vendor.address || "Address unavailable"}</span>
              <span>•</span>
              <span className={vendor.isOpen ? "text-green-500" : "text-red-500"}>
                {vendor.isOpen ? t("openNow") : t("closed")}
              </span>
            </div>
            {vendor.tags.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {vendor.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full bg-[var(--bg-secondary)] text-xs text-[var(--text-secondary)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-4 py-2 rounded-xl h-fit">
            <Star className="text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
            {vendor.rating.toFixed(1)}
          </div>
        </div>

        {vendor.description && (
          <div>
            <h2 className="text-xl mb-2">About</h2>
            <p className="text-[var(--text-secondary)]">{vendor.description}</p>
          </div>
        )}

        <div>
          <h2 className="text-2xl mb-4">Menu</h2>
          {vendor.menu.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No menu items yet.</p>
          ) : (
            <div className="space-y-3">
              {vendor.menu.map((item) => (
                <div key={item.id} className="bg-[var(--bg-secondary)] p-4 rounded-2xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3>{item.name}</h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {item.isVeg ? "Veg" : "Non-veg"}
                        {item.available ? " • Available" : " • Unavailable"}
                      </p>
                    </div>
                    <p className="font-semibold">?{Math.round(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl">{t("reviews")}</h2>
            {onSubmitReview && (
              <button
                onClick={() => setShowWriteReview(true)}
                className="bg-[var(--brand-orange)] text-white px-4 py-2 rounded-xl"
              >
                Write Review
              </button>
            )}
          </div>

          {vendor.reviews.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No reviews yet.</p>
          ) : (
            vendor.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[var(--bg-secondary)] p-4 rounded-2xl mb-3"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative size-10">
                    {review.userAvatar && (
                      <img
                        src={review.userAvatar}
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                        className="absolute inset-0 size-full rounded-full object-cover"
                      />
                    )}
                    <div className="size-10 rounded-full bg-[var(--brand-orange)] flex items-center justify-center text-white">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{review.userName}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <Star
                      className="text-[var(--brand-orange)] fill-[var(--brand-orange)]"
                      size={16}
                    />
                    {review.rating}
                  </div>
                </div>

                {review.comment && (
                  <p className="text-[var(--text-secondary)]">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <WriteReview
        isOpen={showWriteReview}
        onClose={() => !submittingReview && setShowWriteReview(false)}
        vendorName={vendor.name}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}