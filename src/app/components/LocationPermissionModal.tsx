import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAllow: () => void;
  onManual: (location: string) => void;
}

export function LocationPermissionModal({ isOpen, onClose, onAllow, onManual }: LocationPermissionModalProps) {
  const { t } = useLanguage();
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualLocation, setManualLocation] = useState('');

  if (!isOpen) return null;

  const handleManualSubmit = () => {
    if (manualLocation.trim()) {
      onManual(manualLocation);
      setShowManualInput(false);
      setManualLocation('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[var(--bg-secondary)] rounded-3xl p-8 max-w-md w-[90%] relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="size-20 rounded-full bg-gradient-to-br from-[var(--brand-orange)] to-[var(--brand-orange-dark)] flex items-center justify-center mb-6">
            <MapPin size={40} className="text-white" />
          </div>

          <h2 className="text-2xl mb-3 text-[var(--text-primary)]">{t('locationPermission')}</h2>
          <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
            {t('locationMessage')}
          </p>

          {!showManualInput ? (
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={onAllow}
                className="w-full py-4 rounded-full bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-orange-dark)] text-white hover:opacity-90 transition-opacity font-semibold"
              >
                {t('allowLocation')}
              </button>

              <button
                onClick={() => setShowManualInput(true)}
                className="w-full py-4 rounded-full border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
              >
                {t('enterManually')}
              </button>
            </div>
          ) : (
            <div className="w-full space-y-3">
              <input
                type="text"
                value={manualLocation}
                onChange={(e) => setManualLocation(e.target.value)}
                placeholder="Enter your location..."
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-2xl text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowManualInput(false)}
                  className="flex-1 py-3 rounded-full border border-[var(--border-primary)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleManualSubmit}
                  className="flex-1 py-3 rounded-full bg-[var(--brand-orange)] text-white hover:bg-[var(--brand-orange-dark)] transition-colors font-semibold"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
