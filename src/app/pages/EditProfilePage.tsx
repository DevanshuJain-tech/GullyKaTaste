import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Camera } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSave = () => {
    updateProfile(formData);
    navigate('/profile');
  };

  return (
    <div className="h-screen bg-[#1A1A1A] text-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-[#1A1A1A] border-b border-[#333333] z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#242424] rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl">{t('editProfile')}</h1>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#FF8C42] rounded-xl hover:bg-[#FF7A30] transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 pb-24">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="size-24 bg-[#FF8C42] rounded-full flex items-center justify-center text-4xl font-semibold">
                {formData.name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-[#242424] rounded-full border-2 border-[#1A1A1A] hover:bg-[#2A2A2A] transition-colors">
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">{t('fullName')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#242424] border border-[#333333] rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">{t('email')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#242424] border border-[#333333] rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">{t('phone')}</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#242424] border border-[#333333] rounded-2xl py-4 px-4 text-white focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
