import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, MapPin, Navigation, Star, Phone, Clock, Share, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { WriteReview } from './WriteReview';

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
  menu: Array<{ id: string; name: string; nameHi?: string; price: number; isVeg: boolean; category: string; categoryHi?: string }>;
  reviews: Array<{ id: string; userName: string; rating: number; comment: string; date: string }>;
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

  const displayName = language === 'hi' && vendor.nameHi ? vendor.nameHi : vendor.name;

  const handleSubmitReview = (rating: number, comment: string) => {
    const newReview = {
      id: `r${reviews.length + 1}`,
      userName: 'Current User',
      rating,
      comment,
      date: 'Just now'
    };
    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] overflow-y-auto">
      {/* Hero Image */}
      <div className="relative h-80">
        <img
          src={vendor.images[0]}
          alt={displayName}
          className="size-full object-cover"
        />
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-3 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
        >
          <X size={24} className="text-white" />
        </button>
        <button className="absolute top-6 right-6 p-3 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors">
          <Heart size={24} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Header Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl mb-2">{displayName}</h1>
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <MapPin size={18} />
                <span>{vendor.distance} km away</span>
                <span>•</span>
                <span className={vendor.isOpen ? 'text-green-500' : 'text-red-500'}>
                  {vendor.isOpen ? t('openNow') : t('closed')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-4 py-2 rounded-xl">
              <Star size={20} className="text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
              <span className="text-xl font-semibold">{vendor.rating}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`)}
            className="flex flex-col items-center gap-2 bg-[var(--brand-orange)] py-4 rounded-2xl hover:bg-[var(--brand-orange-dark)] transition-colors"
          >
            <Navigation size={22} />
            <span className="text-sm">{t('getDirections')}</span>
          </button>
          <button
            onClick={() => window.open(`tel:${vendor.phone}`)}
            className="flex flex-col items-center gap-2 bg-[var(--bg-secondary)] py-4 rounded-2xl hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Phone size={22} />
            <span className="text-sm">{language === 'en' ? 'Call' : 'कॉल करें'}</span>
          </button>
          <button className="flex flex-col items-center gap-2 bg-[var(--bg-secondary)] py-4 rounded-2xl hover:bg-[var(--bg-hover)] transition-colors">
            <Share size={22} />
            <span className="text-sm">{t('share')}</span>
          </button>
        </div>

        {/* Hours */}
        <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-[var(--brand-orange)]" />
            <div>
              <p className="text-sm text-[var(--text-secondary)]">{language === 'en' ? 'Operating Hours' : 'संचालन समय'}</p>
              <p className="font-semibold">{vendor.hours}</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div>
          <h2 className="text-2xl mb-4">{t('menu')}</h2>
          <div className="space-y-4">
            {vendor.menu.map((item) => {
              const itemName = language === 'hi' && item.nameHi ? item.nameHi : item.name;
              const itemCategory = language === 'hi' && item.categoryHi ? item.categoryHi : item.category;

              return (
                <div key={item.id} className="bg-[var(--bg-secondary)] p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{itemName}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{itemCategory}</p>
                  </div>
                  <div className="text-[var(--brand-orange)] font-semibold">₹{item.price}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reviews */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl">{t('reviews')} ({vendor.reviewCount + reviews.length - vendor.reviews.length})</h2>
            <button
              onClick={() => setShowWriteReview(true)}
              className="px-4 py-2 bg-[var(--brand-orange)] text-white rounded-xl font-medium hover:bg-[var(--brand-orange-dark)] transition-colors"
            >
              {language === 'en' ? 'Write Review' : 'समीक्षा लिखें'}
            </button>
          </div>
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-[var(--bg-secondary)] p-4 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <div className="size-10 bg-[var(--brand-orange)] rounded-full flex items-center justify-center font-semibold text-white">
                    {review.userName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{review.userName}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)]">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <WriteReview
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        vendorName={displayName}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
}
