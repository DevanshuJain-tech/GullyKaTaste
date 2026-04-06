import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Camera } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { useAuth0 } from '@auth0/auth0-react';
import { useLanguage } from '../context/LanguageContext';

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // ✅ Populate from Auth0
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '', // Auth0 doesn't provide phone by default
      });
    }
  }, [user]);

  const handleSave = () => {
    // ⚠️ No backend → just UI for now
    console.log('Updated data (not persisted):', formData);
    navigate('/profile');
  };

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <h1 className="text-xl">{t('editProfile')}</h1>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[var(--brand-orange)] text-white rounded-xl hover:opacity-90 transition-colors"
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

              {user?.picture ? (
                <img
                  src={user.picture}
                  className="size-24 rounded-full object-cover"
                />
              ) : (
                <div className="size-24 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-4xl font-semibold text-white">
                  {formData.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <button className="absolute bottom-0 right-0 p-2 bg-[var(--bg-secondary)] rounded-full border-2 border-[var(--bg-primary)] hover:bg-[var(--bg-hover)] transition-colors">
                <Camera size={18} />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                {t('fullName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-4 px-4 focus:outline-none focus:border-[var(--brand-orange)]"
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                {t('email')}
              </label>
              <input
                type="email"
                value={formData.email}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-4 px-4 opacity-70 cursor-not-allowed"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                {t('phone')}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl py-4 px-4 focus:outline-none focus:border-[var(--brand-orange)]"
              />
            </div>

          </div>

          {/* ⚠️ Notice */}
          <p className="text-xs text-[var(--text-secondary)] mt-6 text-center">
            Changes are local only (no backend connected)
          </p>

        </div>
      </main>

      <BottomNav />
    </div>
  );
}