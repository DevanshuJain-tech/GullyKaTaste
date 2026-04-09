import { Star, MapPin, Leaf, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../context/LanguageContext';

interface Vendor {
  id: string;
  name: string;
  nameHi?: string;
  image: string;
  distance: number;
  rating: number;
  reviewCount: number;
  isVeg: boolean;
  tags: string[];
  tagsHi?: string[];
  isOpen: boolean;
  latitude?: number;
  longitude?: number;
}

interface VendorCardProps {
  vendor: Vendor;
  onClick: () => void;
}

export function VendorCard({ vendor, onClick }: VendorCardProps) {
  const { language } = useLanguage();
  const { name, nameHi, image, distance, rating, reviewCount, isVeg, tags, tagsHi, isOpen } = vendor;

  const displayName = language === 'hi' && nameHi ? nameHi : name;
  const displayTags = language === 'hi' && tagsHi ? tagsHi : tags;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={name}
          className="size-full object-cover"
        />

        <div className="absolute top-3 left-3 flex gap-2">
          {isVeg && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-green-500 px-3 py-1 rounded-full flex items-center gap-1"
            >
              <Leaf size={14} className="text-white" />
              <span className="text-xs text-white">Veg</span>
            </motion.div>
          )}
          {isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-[var(--brand-orange)] px-3 py-1 rounded-full"
            >
              <span className="text-xs text-white">Open</span>
            </motion.div>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            if (
              typeof vendor.latitude !== "number" ||
              typeof vendor.longitude !== "number" ||
              Number.isNaN(vendor.latitude) ||
              Number.isNaN(vendor.longitude)
            ) {
              return;
            }
            const destination = encodeURIComponent(`${vendor.latitude},${vendor.longitude}`);
            window.open(
              `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
              "_blank",
              "noopener,noreferrer",
            );
          }}
          className="absolute top-3 right-3 p-2 bg-black/40 backdrop-blur-sm rounded-full hover:bg-black/60 transition-colors"
        >
          <Navigation size={16} className="text-white" />
        </motion.button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg">{displayName}</h3>
          <div className="flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-1 rounded-lg">
            <Star size={14} className="text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
            <span className="text-sm">{rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-3">
          <MapPin size={14} />
          <span>{distance} km away</span>
          <span>•</span>
          <span>{reviewCount} reviews</span>
        </div>

        <div className="flex gap-2 flex-wrap">
          {displayTags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-[var(--bg-primary)] rounded-full text-xs text-[var(--text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
