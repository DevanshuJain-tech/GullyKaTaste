import { useState } from "react";
import { useNavigate } from "react-router";
import {
  X,
  MapPin,
  Navigation,
  Star,
  Phone,
  Clock,
  Share,
  Heart,
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { WriteReview } from "./WriteReview";

interface Vendor {
  id: string;
  name: string;
  nameHi?: string;
  images: string[];
  distance: number;
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  isOpen: boolean;
  phone: string;
  hours: string;
  latitude: number;
  longitude: number;
  menu: Array<{
    id: string;
    name: string;
    nameHi?: string;
    price: number;
    isVeg: boolean;
    category: string;
    categoryHi?: string;
  }>;
  reviews: Array<{
    id: string;
    userName: string;
    userAvatar?: string | null;
    rating: number;
    comment: string;
    date: string;
  }>;
}

interface VendorDetailModalProps {
  vendor: Vendor;
  onClose: () => void;
}

export function VendorDetailModal({ vendor, onClose }: VendorDetailModalProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviews, setReviews] = useState(vendor.reviews);

  const displayName =
    language === "hi" && vendor.nameHi ? vendor.nameHi : vendor.name;

  const handleSubmitReview = (
    rating: number,
    comment: string,
    user: { nickname?: string; name?: string; avatar?: string | null },
  ) => {
    const displayName = user.nickname || user.name || "User";

    const newReview = {
      id: `r${reviews.length + 1}`,
      userName: displayName,
      userAvatar: user.avatar || null,
      rating,
      comment,
      date: "Just now",
    };

    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] overflow-y-auto">
      {/* Hero */}
      <div className="relative h-80">
        <img
          src={vendor.images[0]}
          alt={displayName}
          className="size-full object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-3 bg-black/40 rounded-full"
        >
          <X size={24} className="text-white" />
        </button>
        <button className="absolute top-6 right-6 p-3 bg-black/40 rounded-full">
          <Heart size={24} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl">{displayName}</h1>
            <div className="flex gap-2 text-[var(--text-secondary)]">
              <MapPin size={16} />
              {vendor.distance} km •{" "}
              <span
                className={vendor.isOpen ? "text-green-500" : "text-red-500"}
              >
                {vendor.isOpen ? t("openNow") : t("closed")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-4 py-2 rounded-xl">
            <Star className="text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
            {vendor.rating}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl">{t("reviews")}</h2>
            <button
              onClick={() => setShowWriteReview(true)}
              className="bg-[var(--brand-orange)] text-white px-4 py-2 rounded-xl"
            >
              Write Review
            </button>
          </div>

          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[var(--bg-secondary)] p-4 rounded-2xl mb-3"
            >
              <div className="flex items-center gap-3 mb-2">
                {/* ✅ Avatar */}
                <div className="relative size-10">
                  {review.userAvatar && (
                    <img
                      src={review.userAvatar}
                      referrerPolicy="no-referrer"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                      className="absolute inset-0 size-full rounded-full object-cover"
                    />
                  )}

                  <div className="size-10 rounded-full bg-[var(--brand-orange)] flex items-center justify-center text-white">
                    {review.userName.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="font-semibold">{review.userName}</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {review.date}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Star
                    className="text-[var(--brand-orange)] fill-[var(--brand-orange)]"
                    size={16}
                  />
                  {review.rating}
                </div>
              </div>

              <p className="text-[var(--text-secondary)]">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <WriteReview
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        vendorName={displayName}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
