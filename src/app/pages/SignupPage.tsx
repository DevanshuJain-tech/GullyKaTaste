import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, Chrome, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function SignupPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(language === 'en' ? 'Passwords do not match!' : 'पासवर्ड मेल नहीं खाते!');
      return;
    }
    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.phone, formData.password);
      navigate('/home');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#242424] to-[#1A1A1A] flex flex-col p-6">
      <button
        onClick={() => navigate('/')}
        className="self-start mb-8 text-gray-400 hover:text-white transition-colors"
      >
        ← {t('home')}
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl mb-2">{t('welcome')}</h1>
          <p className="text-gray-400 mb-8">
            {language === 'en'
              ? 'Create an account to start discovering'
              : 'खोज शुरू करने के लिए एक खाता बनाएं'}
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('fullName')}
                required
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={t('email')}
                required
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={t('phone')}
                required
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder={t('password')}
                required
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder={t('confirmPassword')}
                required
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8C42] text-white py-4 rounded-2xl font-semibold text-lg hover:bg-[#FF7A30] transition-all shadow-lg shadow-[#FF8C42]/20 disabled:opacity-50"
            >
              {loading ? (language === 'en' ? 'Creating account...' : 'खाता बनाया जा रहा है...') : t('signup')}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1A1A1A] text-gray-400">{t('orContinueWith')}</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3"
          >
            <Chrome className="size-5" />
            Google
          </button>

          <p className="text-center text-gray-400 mt-6">
            {t('alreadyHaveAccount')}{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#FF8C42] hover:underline"
            >
              {t('login')}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
