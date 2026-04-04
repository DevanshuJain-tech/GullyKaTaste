import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';

export function TermsPage() {
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
          <h1 className="text-2xl">Terms & Conditions</h1>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pb-24 space-y-6">
          <div>
            <p className="text-gray-400 mb-4">Last updated: April 4, 2026</p>
            <p className="text-gray-300 leading-relaxed">
              Please read these Terms and Conditions carefully before using the VendorApp mobile application.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              By accessing and using VendorApp, you accept and agree to be bound by the terms and provision
              of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">2. Use of Service</h2>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>You must be at least 13 years old to use this service</li>
              <li>You are responsible for maintaining the security of your account</li>
              <li>You agree not to misuse our services or help anyone else do so</li>
              <li>You will not engage in any fraudulent activities</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl mb-3">3. User Content</h2>
            <p className="text-gray-400 leading-relaxed mb-2">
              You retain ownership of content you post, but grant us license to use it. You agree that:
            </p>
            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
              <li>Your content does not violate any laws or regulations</li>
              <li>Your content does not infringe on others' intellectual property</li>
              <li>We may remove content that violates these terms</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl mb-3">4. Vendor Relationships</h2>
            <p className="text-gray-400 leading-relaxed">
              VendorApp acts as a platform connecting users with vendors. We are not responsible for the
              quality, safety, or legality of items offered by vendors.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">5. Limitation of Liability</h2>
            <p className="text-gray-400 leading-relaxed">
              VendorApp shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages resulting from your use of or inability to use the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">6. Changes to Terms</h2>
            <p className="text-gray-400 leading-relaxed">
              We reserve the right to modify these terms at any time. We will notify users of any changes
              by updating the "Last updated" date.
            </p>
          </div>

          <div>
            <h2 className="text-xl mb-3">7. Contact Us</h2>
            <p className="text-gray-400 leading-relaxed">
              If you have any questions about these Terms, please contact us at legal@vendorapp.com
            </p>
          </div>

          <div className="bg-[#242424] p-4 rounded-2xl">
            <p className="text-sm text-gray-400">
              By using VendorApp, you acknowledge that you have read and understood these Terms and Conditions.
            </p>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
