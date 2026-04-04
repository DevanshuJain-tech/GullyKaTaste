import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search as SearchIcon, X, TrendingUp, Clock } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { BottomNav } from '../components/BottomNav';
import { VendorCard } from '../components/VendorCard';
import { HamburgerMenu } from '../components/HamburgerMenu';
import { mockVendors } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

export function SearchPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState(['Burger', 'Pizza', 'Dosa', 'Chai']);

  const filteredVendors = searchQuery
    ? mockVendors.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="h-screen bg-[#1A1A1A] text-white flex flex-col overflow-hidden">
      <HamburgerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Navbar
        currentLocation="Connaught Place, Delhi"
        onMenuClick={() => setMenuOpen(true)}
        notificationCount={3}
      />

      <main className="flex-1 overflow-y-auto">
        {/* Search Header */}
        <div className="sticky top-0 bg-[#1A1A1A] p-4 border-b border-[#333333] z-10">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchVendors')}
              className="w-full bg-[#242424] border border-[#333333] rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF8C42] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 pb-24">
          {!searchQuery ? (
            <>
              {/* Recent Searches */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={20} className="text-gray-400" />
                  <h2 className="text-xl">Recent Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((term, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSearchQuery(term)}
                      className="px-4 py-2 bg-[#242424] rounded-full hover:bg-[#2A2A2A] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp size={20} className="text-[#FF8C42]" />
                  <h2 className="text-xl">Trending Now</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockVendors.slice(0, 3).map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      onClick={() => navigate(`/vendor/${vendor.id}`)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Search Results */}
              {filteredVendors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVendors.map((vendor) => (
                    <VendorCard
                      key={vendor.id}
                      vendor={vendor}
                      onClick={() => navigate(`/vendor/${vendor.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No vendors found</p>
                  <p className="text-gray-500 text-sm mt-2">Try a different search term</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
