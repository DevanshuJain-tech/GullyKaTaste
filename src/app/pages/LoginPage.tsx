import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Chrome, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-[#242424] to-[#1A1A1A] flex flex-col p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="self-start mb-8 text-gray-400 hover:text-white transition-colors"
      >
        ← {t('home')}
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl mb-2">{t('welcomeBack')}</h1>
          <p className="text-gray-400 mb-8">
            {language === 'en'
              ? 'Sign in to continue discovering amazing vendors'
              : 'अद्भुत विक्रेताओं की खोज जारी रखने के लिए साइन इन करें'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('email')}
                required
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#FF8C42] transition-colors"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            {/* Forgot Password */}
            <div className="text-right">
              <button
                type="button"
                className="text-[#FF8C42] hover:underline text-sm"
              >
                {t('forgotPassword')}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF8C42] text-white py-4 rounded-2xl font-semibold text-lg hover:bg-[#FF7A30] transition-all shadow-lg shadow-[#FF8C42]/20 disabled:opacity-50"
            >
              {loading ? (language === 'en' ? 'Signing in...' : 'साइन इन हो रहा है...') : t('login')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#1A1A1A] text-gray-400">{t('orContinueWith')}</span>
            </div>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-3"
          >
            <Chrome className="size-5" />
            Google
          </button>

          {/* Sign Up Link */}
          <p className="text-center text-gray-400 mt-6">
            {t('dontHaveAccount')}{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#FF8C42] hover:underline"
            >
              {t('signup')}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
