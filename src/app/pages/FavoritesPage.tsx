import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Heart } from 'lucide-react';
import { VendorCard } from '../components/VendorCard';
import { BottomNav } from '../components/BottomNav';
import { mockVendors } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export function FavoritesPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [favorites] = useState(mockVendors.slice(0, 4));

  return (
    <div className="h-screen bg-[#1A1A1A] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#333333] z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#242424] rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-3">
            <Heart size={24} className="text-[#FF8C42] fill-[#FF8C42]" />
            <h1 className="text-2xl">{t('savedVendors')}</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((vendor) => (
                <VendorCard
                  key={vendor.id}
                  vendor={vendor}
                  onClick={() => navigate(`/vendor/${vendor.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">No saved vendors yet</p>
              <p className="text-gray-500 text-sm mt-2">Start exploring and save your favorites!</p>
              <button
                onClick={() => navigate('/home')}
                className="mt-6 px-6 py-3 bg-[#FF8C42] rounded-2xl hover:bg-[#FF7A30] transition-colors"
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
