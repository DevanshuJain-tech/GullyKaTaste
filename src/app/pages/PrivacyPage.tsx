import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

export function PrivacyPage() {
  const navigate = useNavigate();

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
          <h1 className="text-2xl">Privacy Policy</h1>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pb-24 space-y-6">
          <div>
            <p className="text-gray-400 mb-4">Last updated: April 4, 2026</p>
            <p className="text-gray-300 leading-relaxed">
              At VendorApp, we take your privacy seriously. This Privacy Policy explains how we collect,
              use, disclose, and safeguard your information when you use our mobile application.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">Information We Collect</h2>
            <p className="text-gray-400 leading-relaxed mb-2">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Name, email address, and phone number</li>
              <li>Location data to show nearby vendors</li>
              <li>Photos and reviews you post</li>
              <li>Order history and preferences</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>To provide and maintain our services</li>
              <li>To show you relevant vendors in your area</li>
              <li>To process your orders and transactions</li>
              <li>To send you updates and promotional materials</li>
              <li>To improve our app and user experience</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl mb-3">Data Security</h2>
            <p className="text-gray-400 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your
              personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">Your Rights</h2>
            <p className="text-gray-400 leading-relaxed">
              You have the right to access, update, or delete your personal information at any time.
              Contact us at privacy@vendorapp.com for any privacy-related concerns.
            </p>
          </div>

          <div className="bg-[#242424] p-4 rounded-2xl">
            <p className="text-sm text-gray-400">
              By using VendorApp, you consent to our Privacy Policy and agree to its terms.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
