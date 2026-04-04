import { SlidersHorizontal, Leaf, MapIcon, Grid3x3, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';
import { useNavigate } from 'react-router';

interface FilterBarProps {
  vegOnly: boolean;
  onVegToggle: (isVeg: boolean) => void;
  onViewChange: (view: 'grid' | 'map') => void;
  currentView: 'grid' | 'map';
}

export function FilterBar({ vegOnly, onVegToggle, onViewChange, currentView }: FilterBarProps) {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    fastService: false,
    popular: false,
    rated4Plus: false,
    freeDelivery: false,
    openNow: false,
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="px-4 py-4 flex items-center gap-3 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] sticky top-0 z-30"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-full hover:bg-[var(--bg-hover)] transition-colors"
        >
          <SlidersHorizontal size={18} />
          <span className="text-sm">{t('filters')}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onVegToggle(!vegOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
            vegOnly
              ? 'bg-green-500 text-white'
              : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)]'
          }`}
        >
          <Leaf size={18} />
          <span className="text-sm">{t('veg')}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/reels/create')}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--brand-orange)] text-white rounded-full hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          <span className="text-sm">{language === 'en' ? 'Create Reel' : 'रील बनाएं'}</span>
        </motion.button>

        <div className="flex-1" />

        <div className="flex gap-2 bg-[var(--bg-secondary)] rounded-full p-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onViewChange('grid')}
            className={`p-2 rounded-full transition-colors ${
              currentView === 'grid'
                ? 'bg-[var(--brand-orange)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title={t('listView')}
          >
            <Grid3x3 size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onViewChange('map')}
            className={`p-2 rounded-full transition-colors ${
              currentView === 'map'
                ? 'bg-[var(--brand-orange)] text-white'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
            title={t('mapView')}
          >
            <MapIcon size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* Filter Modal */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowFilters(false)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--bg-primary)] rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">{language === 'en' ? 'Filters' : 'फ़िल्टर'}</h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <FilterOption
                  label={language === 'en' ? 'Fast Service' : 'तेज़ सेवा'}
                  checked={filters.fastService}
                  onChange={() => toggleFilter('fastService')}
                />
                <FilterOption
                  label={language === 'en' ? 'Popular' : 'लोकप्रिय'}
                  checked={filters.popular}
                  onChange={() => toggleFilter('popular')}
                />
                <FilterOption
                  label={language === 'en' ? '4+ Rated' : '4+ रेटेड'}
                  checked={filters.rated4Plus}
                  onChange={() => toggleFilter('rated4Plus')}
                />
                <FilterOption
                  label={language === 'en' ? 'Free Delivery' : 'मुफ़्त डिलीवरी'}
                  checked={filters.freeDelivery}
                  onChange={() => toggleFilter('freeDelivery')}
                />
                <FilterOption
                  label={language === 'en' ? 'Open Now' : 'अभी खुला'}
                  checked={filters.openNow}
                  onChange={() => toggleFilter('openNow')}
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setFilters({
                    fastService: false,
                    popular: false,
                    rated4Plus: false,
                    freeDelivery: false,
                    openNow: false,
                  })}
                  className="flex-1 py-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
                >
                  {language === 'en' ? 'Clear All' : 'सभी साफ़ करें'}
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-3 bg-[var(--brand-orange)] text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  {language === 'en' ? 'Apply' : 'लागू करें'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterOption({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-xl cursor-pointer hover:bg-[var(--bg-hover)] transition-colors">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 accent-[var(--brand-orange)] cursor-pointer"
      />
    </label>
  );
}
