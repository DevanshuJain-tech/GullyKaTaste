import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Plus, Store, Camera, Edit3, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface FloatingActionButtonProps {
  onVendorDashboard?: () => void;
}

export function FloatingActionButton({ onVendorDashboard }: FloatingActionButtonProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Edit3,
      label: language === 'en' ? 'Create Post' : 'पोस्ट बनाएं',
      onClick: () => {
        setIsOpen(false);
        navigate('/community/create');
      },
      color: 'bg-blue-500',
    },
    {
      icon: Camera,
      label: language === 'en' ? 'Create Reel' : 'रील बनाएं',
      onClick: () => {
        setIsOpen(false);
        navigate('/reels/create');
      },
      color: 'bg-purple-500',
    },
    {
      icon: Store,
      label: language === 'en' ? 'Become Vendor' : 'विक्रेता बनें',
      onClick: () => {
        setIsOpen(false);
        navigate('/vendor-onboarding');
      },
      color: 'bg-[var(--brand-orange)]',
    },
  ];

  return (
    <div className="fixed bottom-24 right-6 z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                onClick={action.onClick}
                className={`flex items-center gap-3 ${action.color} text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all whitespace-nowrap`}
              >
                <action.icon size={20} />
                <span className="font-medium">{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="size-14 bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-orange-dark)] text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <Plus size={24} />}
      </button>
    </div>
  );
}
