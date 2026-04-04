import { X, Tag } from 'lucide-react';

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  discount: string;
}

export function PromotionModal({ isOpen, onClose, title, description, discount }: PromotionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#242424] rounded-3xl p-8 max-w-md w-[90%] relative animate-fade-in overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] opacity-20 rounded-full blur-3xl" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#B0B0B0] hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] flex items-center justify-center mb-6">
            <Tag size={40} className="text-white" />
          </div>

          <div className="inline-block px-6 py-2 bg-[#FF8C42] rounded-full mb-4">
            <span className="text-2xl">{discount}</span>
          </div>

          <h2 className="text-2xl mb-3">{title}</h2>
          <p className="text-[#B0B0B0] mb-8 leading-relaxed">
            {description}
          </p>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#FF8C42] to-[#FF6B35] text-white hover:opacity-90 transition-opacity"
          >
            Claim Offer
          </button>

          <button
            onClick={onClose}
            className="mt-3 text-[#B0B0B0] hover:text-white transition-colors text-sm"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
