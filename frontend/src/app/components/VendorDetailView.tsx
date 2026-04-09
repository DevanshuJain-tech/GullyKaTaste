import { X, Star, MapPin, Navigation, Share2, Heart, Phone, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  category: string;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface VendorDetailViewProps {
  vendor: {
    id: string;
    name: string;
    images: string[];
    rating: number;
    reviewCount: number;
    distance: number;
    isOpen: boolean;
    phone: string;
    hours: string;
    menu: MenuItem[];
    reviews: Review[];
  };
  onClose: () => void;
}

export function VendorDetailView({ vendor, onClose }: VendorDetailViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'photos'>('menu');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % vendor.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + vendor.images.length) % vendor.images.length);
  };

  const menuCategories = [...new Set(vendor.menu.map(item => item.category))];

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A] overflow-y-auto">
      {/* Header with Image Carousel */}
      <div className="relative h-[400px]">
        <ImageWithFallback
          src={vendor.images[currentImageIndex]}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />

        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
          >
            <X size={24} className="text-white" />
          </button>

          <div className="flex gap-2">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
            >
              <Heart
                size={22}
                className={isSaved ? "text-[#FF8C42] fill-[#FF8C42]" : "text-white"}
              />
            </button>

            <button className="p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors">
              <Share2 size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Image Navigation */}
        {vendor.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
            >
              <ChevronRight size={24} className="text-white" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {vendor.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex
                      ? 'w-8 bg-[#FF8C42]'
                      : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Vendor Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl mb-2">{vendor.name}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-[#FF8C42] fill-[#FF8C42]" />
              <span>{vendor.rating}</span>
              <span className="text-[#B0B0B0]">({vendor.reviewCount})</span>
            </div>

            <div className="flex items-center gap-1 text-[#B0B0B0]">
              <MapPin size={16} />
              <span>{vendor.distance} km</span>
            </div>

            <div className={`px-3 py-1 rounded-full text-xs ${
              vendor.isOpen
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {vendor.isOpen ? 'Open Now' : 'Closed'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 py-4 flex gap-3">
        <button className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Navigation size={18} />
          <span>Get Directions</span>
        </button>

        <button className="p-3 rounded-full border border-[#333333] hover:bg-[#242424] transition-colors">
          <Phone size={20} />
        </button>
      </div>

      {/* Quick Info */}
      <div className="px-4 py-4 flex items-center gap-4 border-b border-[#333333]">
        <div className="flex items-center gap-2 text-sm text-[#B0B0B0]">
          <Clock size={18} />
          <span>{vendor.hours}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 px-4 py-4 border-b border-[#333333]">
        {(['menu', 'reviews', 'photos'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize transition-colors relative ${
              activeTab === tab
                ? 'text-[#FF8C42]'
                : 'text-[#B0B0B0]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF8C42]" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        {activeTab === 'menu' && (
          <div className="space-y-6">
            {menuCategories.map((category) => (
              <div key={category}>
                <h3 className="text-xl mb-4 text-[#FF8C42]">{category}</h3>
                <div className="space-y-3">
                  {vendor.menu
                    .filter(item => item.category === category)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="bg-[#242424] rounded-xl p-4 flex items-center justify-between hover:bg-[#2A2A2A] transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-3 h-3 rounded-sm border-2 ${
                              item.isVeg
                                ? 'border-green-500'
                                : 'border-red-500'
                            }`}>
                              <div className={`w-1.5 h-1.5 rounded-full m-auto ${
                                item.isVeg ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                            </div>
                            <span>{item.name}</span>
                          </div>
                        </div>
                        <div className="text-[#FF8C42]">₹{item.price}</div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {vendor.reviews.map((review) => (
              <div key={review.id} className="bg-[#242424] rounded-xl p-4">
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#FF8C42] flex items-center justify-center">
                    <span className="text-sm">{review.userName[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span>{review.userName}</span>
                      <span className="text-xs text-[#B0B0B0]">{review.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={14}
                          className={idx < review.rating
                            ? "text-[#FF8C42] fill-[#FF8C42]"
                            : "text-[#333333]"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-[#B0B0B0]">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 gap-3">
            {vendor.images.map((image, idx) => (
              <div key={idx} className="aspect-square rounded-xl overflow-hidden">
                <ImageWithFallback
                  src={image}
                  alt={`${vendor.name} photo ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
