import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { useAuth0 } from "@auth0/auth0-react";

import { Navbar } from "../components/Navbar";
import { BottomNav } from "../components/BottomNav";
import { FilterBar } from "../components/FilterBar";
import { VendorCard } from "../components/VendorCard";
import { MapView } from "../components/MapView";
import { LocationPermissionModal } from "../components/LocationPermissionModal";
import { PromotionModal } from "../components/PromotionModal";
import { FloatingActionButton } from "../components/FloatingActionButton";
import { HamburgerMenu } from "../components/HamburgerMenu";
import { Footer } from "../components/Footer";
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

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth0();
  const { t, language } = useLanguage();

  const [currentLocation, setCurrentLocation] = useState("Detecting...");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [vegOnly, setVegOnly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [vendors, setVendors] = useState<VendorSummary[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setShowLocationModal(!isAuthenticated);
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoadingVendors(true);
      try {
        const response = await getVendors({ pageSize: 50, veg: vegOnly });
        if (!cancelled) {
          setVendors(response.data);
        }
      } catch {
        if (!cancelled) {
          setVendors([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingVendors(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [vegOnly]);

  const vendorCards = useMemo(() => vendors.map(toVendorCardModel), [vendors]);

  const handleAllowLocation = () => {
    setShowLocationModal(false);
    setCurrentLocation("Connaught Place, Delhi");

    if (isAuthenticated) {
      setTimeout(() => setShowPromotion(true), 2000);
    }
  };

  const handleManualLocation = (location: string) => {
    setShowLocationModal(false);
    setCurrentLocation(location);
  };

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden flex flex-col">
      <LocationPermissionModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onAllow={handleAllowLocation}
        onManual={handleManualLocation}
      />

      <PromotionModal
        isOpen={showPromotion}
        onClose={() => setShowPromotion(false)}
        title={`${t("welcome")}!`}
        description={
          language === "en"
            ? "Discover amazing street food vendors near you."
            : "Discover amazing street food vendors near you."
        }
        discount=""
      />

      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <Navbar
        currentLocation={currentLocation}
        onMenuClick={() => setMenuOpen(true)}
        onLocationClick={() => setShowLocationModal(true)}
        notificationCount={0}
      />

      <main className="flex-1 overflow-y-auto">
        <FilterBar
          vegOnly={vegOnly}
          onVegToggle={setVegOnly}
          onViewChange={setViewMode}
          currentView={viewMode}
        />

        {viewMode === "grid" ? (
          <>
            {loadingVendors ? (
              <div className="p-6 pb-24 text-[var(--text-secondary)]">Loading vendors...</div>
            ) : vendorCards.length === 0 ? (
              <div className="p-6 pb-24 text-[var(--text-secondary)]">No vendors found.</div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24"
              >
                {vendorCards.map((vendor, index) => (
                  <motion.div
                    key={vendor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.25 }}
                  >
                    <VendorCard
                      vendor={vendor}
                      onClick={() => navigate(`/vendor/${vendor.id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            <Footer />
          </>
        ) : (
          <MapView
            vendors={vendorCards.filter(
              (vendor) =>
                typeof vendor.latitude === "number" && typeof vendor.longitude === "number",
            )}
            userLocation={{ lat: 28.6139, lng: 77.209 }}
            onVendorClick={(id) => navigate(`/vendor/${id}`)}
          />
        )}
      </main>

      <FloatingActionButton />
      <BottomNav activeTab="home" />
    </div>
  );
}
