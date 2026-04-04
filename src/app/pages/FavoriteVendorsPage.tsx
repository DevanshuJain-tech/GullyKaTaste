import { useNavigate } from 'react-router';
import { ChevronLeft, Star, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';
import { BottomNav } from '../components/BottomNav';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { mockVendors } from '../data/mockData';

export function FavoriteVendorsPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(mockVendors.slice(0, 3));

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(v => v.id !== id));
  };

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
          <div className="flex items-center gap-2">
            <Heart size={24} className="text-[var(--brand-orange)]" />
            <h1 className="text-2xl">Favorite Vendors</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24 space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={64} className="mx-auto text-[var(--text-secondary)] mb-4" />
              <p className="text-[var(--text-secondary)]">No favorite vendors yet</p>
            </div>
          ) : (
            favorites.map((vendor) => (
              <div
                key={vendor.id}
                onClick={() => alert(`View ${vendor.name}`)}
                className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="relative w-28 h-28 flex-shrink-0">
                    <ImageWithFallback
                      src={vendor.image}
                      alt={vendor.name}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="flex-1 py-3 pr-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{vendor.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(vendor.id);
                        }}
                        className="p-1.5 hover:bg-[var(--bg-hover)] rounded-full transition-colors"
                      >
                        <Heart size={20} className="text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[var(--text-secondary)] text-sm mb-2">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
                        <span>{vendor.rating}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{vendor.distance} km</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {vendor.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-[var(--bg-primary)] rounded-full text-xs text-[var(--text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
