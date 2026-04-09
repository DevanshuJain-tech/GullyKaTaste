import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search as SearchIcon, X, TrendingUp, Clock } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";
import { VendorCard } from "../components/VendorCard";
import { HamburgerMenu } from "../components/HamburgerMenu";
import { useLanguage } from "../context/LanguageContext";
import { getVendors, type VendorSummary } from "../lib/api";

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

export function SearchPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches] = useState(["Burger", "Pizza", "Dosa", "Chai"]);

  const [trending, setTrending] = useState<VendorSummary[]>([]);
  const [results, setResults] = useState<VendorSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const response = await getVendors({ pageSize: 6 });
        if (!cancelled) {
          setTrending(response.data);
        }
      } catch {
        if (!cancelled) {
          setTrending([]);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await getVendors({
          pageSize: 30,
          query: searchQuery.trim(),
        });
        if (!cancelled) {
          setResults(response.data);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  return (
    <div className="h-screen bg-[#1A1A1A] text-white flex flex-col overflow-hidden">
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Navbar
        currentLocation="Connaught Place, Delhi"
        onMenuClick={() => setMenuOpen(true)}
        notificationCount={0}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="sticky top-0 bg-[#1A1A1A] p-4 border-b border-[#333333] z-10">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchVendors")}
              className="w-full bg-[#242424] border border-[#333333] rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF8C42] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 pb-24">
          {!searchQuery ? (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} className="text-gray-400" />
                  <h2 className="text-xl">Recent Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 bg-[#242424] rounded-full hover:bg-[#2A2A2A] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-[#FF8C42]" />
                  <h2 className="text-xl">Trending Now</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trending.map((vendor) => {
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
              </div>
            </>
          ) : loading ? (
            <p className="text-gray-400">Searching...</p>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((vendor) => {
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
              <p className="text-gray-400 text-lg">No vendors found</p>
              <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
