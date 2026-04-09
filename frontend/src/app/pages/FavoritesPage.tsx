import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Heart } from "lucide-react";
import { VendorCard } from "../components/VendorCard";
import { BottomNav } from "../components/BottomNav";
import { useLanguage } from "../context/LanguageContext";
import { getFavorites, type VendorSummary } from "../lib/api";

const fallbackVendorImage =
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop";

function toVendorCardModel(vendor: VendorSummary) {
  return {
    id: vendor.id,
    name: vendor.name,
    image: vendor.image ?? fallbackVendorImage,
    distance: vendor.distance ?? 0,
    rating: vendor.rating,
    reviewCount: vendor.reviewCount,
    isVeg: vendor.isVeg,
    tags: vendor.tags.length > 0 ? vendor.tags : ["Street Food"],
    isOpen: vendor.isOpen,
    latitude: vendor.latitude ?? undefined,
    longitude: vendor.longitude ?? undefined,
  };
}

export function FavoritesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [favorites, setFavorites] = useState<VendorSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const response = await getFavorites({ pageSize: 100 });
        if (!cancelled) {
          setFavorites(response.data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Heart
              size={24}
              className="text-[var(--brand-orange)] fill-[var(--brand-orange)]"
            />
            <h1 className="text-2xl">{t("savedVendors")}</h1>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24">
          {loading ? (
            <p className="text-[var(--text-secondary)]">Loading favorites...</p>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((vendor) => {
                const cardVendor = toVendorCardModel(vendor);
                return (
                  <VendorCard
                    key={vendor.id}
                    vendor={cardVendor}
                    onClick={() => navigate(`/vendor/${vendor.id}`)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart
                size={64}
                className="mx-auto text-[var(--text-tertiary)] mb-4"
              />
              <p className="text-[var(--text-secondary)] text-lg">
                No saved vendors yet
              </p>
              <p className="text-[var(--text-tertiary)] text-sm mt-2">
                Start exploring and save your favorites!
              </p>
              <button
                onClick={() => navigate("/home")}
                className="mt-6 px-6 py-3 bg-[var(--brand-orange)] text-white rounded-2xl hover:bg-[var(--brand-orange-dark)] transition-colors"
              >
                Explore Vendors
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}