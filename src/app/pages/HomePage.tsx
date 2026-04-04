import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { FilterBar } from '../components/FilterBar';
import { VendorCard } from '../components/VendorCard';
import { MapView } from '../components/MapView';
import { LocationPermissionModal } from '../components/LocationPermissionModal';
import { PromotionModal } from '../components/PromotionModal';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { Footer } from '../components/Footer';
import { mockVendors } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState('Detecting...');
  const [showLocationModal, setShowLocationModal] = useState(!isAuthenticated);
  const [showPromotion, setShowPromotion] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [vegOnly, setVegOnly] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAllowLocation = () => {
    setShowLocationModal(false);
    setCurrentLocation('Connaught Place, Delhi');
    if (isAuthenticated) {
      setTimeout(() => setShowPromotion(true), 2000);
    }
  };

  const handleManualLocation = (location: string) => {
    setShowLocationModal(false);
    setCurrentLocation(location);
  };

  const filteredVendors = vegOnly ? mockVendors.filter(v => v.isVeg) : mockVendors;

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
        title={t('welcome') + '!'}
        description={language === 'en' ? "Discover amazing street food vendors near you. Your culinary adventure starts here!" : "अपने आस-पास अद्भुत स्ट्रीट फूड विक्रेता खोजें। आपका पाक साहसिक कार्य यहां शुरू होता है!"}
        discount="🎉"
      />

      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <Navbar
        currentLocation={currentLocation}
        onMenuClick={() => setMenuOpen(true)}
        onLocationClick={() => setShowLocationModal(true)}
        notificationCount={3}
      />

      <main className="flex-1 overflow-y-auto">
        <FilterBar
          vegOnly={vegOnly}
          onVegToggle={setVegOnly}
          onViewChange={setViewMode}
          currentView={viewMode}
        />

        {viewMode === 'grid' ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24"
            >
              {filteredVendors.map((vendor, index) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <VendorCard
                    vendor={vendor}
                    onClick={() => navigate(`/vendor/${vendor.id}`)}
                  />
                </motion.div>
              ))}
            </motion.div>
            <Footer />
          </>
        ) : (
          <MapView
            vendors={filteredVendors}
            userLocation={{ lat: 28.6139, lng: 77.2090 }}
            onVendorClick={(id) => navigate(`/vendor/${id}`)}
          />
        )}
      </main>

      <FloatingActionButton />
      <BottomNav activeTab="home" />
    </div>
  );
}
