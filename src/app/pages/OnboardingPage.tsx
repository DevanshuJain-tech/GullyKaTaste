import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { MapPin, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { t, setLanguage, language } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: language === 'en' ? 'Discover Local Street Food' : 'स्थानीय स्ट्रीट फूड खोजें',
      subtitle: language === 'en'
        ? 'Find amazing gully food vendors within 1km radius'
        : '1 किमी के दायरे में अद्भुत गली के खाने के विक्रेता खोजें',
      emoji: '🍜',
    },
    {
      title: language === 'en' ? 'Watch Food Reels' : 'फूड रील्स देखें',
      subtitle: language === 'en'
        ? 'Explore delicious content from street vendors'
        : 'स्ट्रीट विक्रेताओं से स्वादिष्ट सामग्री देखें',
      emoji: '📱',
    },
    {
      title: language === 'en' ? 'Join the Community' : 'समुदाय में शामिल हों',
      subtitle: language === 'en'
        ? 'Share your gully food discoveries'
        : 'अपनी गली के खाने की खोज साझा करें',
      emoji: '👥',
    },
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-primary)] flex flex-col">
      {/* Language Selector */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all"
        >
          <Globe className="size-5" />
          <span className="font-medium">{language === 'en' ? 'English' : 'हिंदी'}</span>
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          {/* App Logo */}
          <div className="mb-8">
            <div className="text-6xl mb-4">{slides[currentSlide].emoji}</div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-orange-dark)] bg-clip-text text-transparent">
                Gully Ka Taste
              </span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              {language === 'en' ? 'Discover Street Food Near You' : 'अपने आस-पास स्ट्रीट फूड खोजें'}
            </p>
          </div>

          <div className="mb-8 relative">
            <div className="w-64 h-64 mx-auto rounded-full overflow-hidden shadow-2xl border-4 border-[var(--brand-orange)]/30 bg-[var(--bg-primary)]">
              {/* Radar Animation */}
              <div className="relative w-full h-full bg-gradient-to-br from-green-950/50 to-green-900/30">
                {/* Grid circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-[90%] h-[90%] border border-green-500/20 rounded-full"></div>
                  <div className="absolute w-[70%] h-[70%] border border-green-500/20 rounded-full"></div>
                  <div className="absolute w-[50%] h-[50%] border border-green-500/20 rounded-full"></div>
                  <div className="absolute w-[30%] h-[30%] border border-green-500/20 rounded-full"></div>
                </div>

                {/* Crosshair */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-full h-[1px] bg-green-500/20"></div>
                  <div className="absolute h-full w-[1px] bg-green-500/20"></div>
                </div>

                {/* Center dot */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>

                {/* Rotating sweep */}
                <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                  <div
                    className="absolute top-1/2 left-1/2 w-1/2 h-[2px] origin-left"
                    style={{
                      background: 'linear-gradient(to right, rgba(34, 197, 94, 0.8), transparent)',
                      boxShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
                    }}
                  ></div>
                  <div
                    className="absolute top-1/2 left-1/2 origin-left"
                    style={{
                      width: '50%',
                      height: '50%',
                      background: 'conic-gradient(from 0deg, rgba(34, 197, 94, 0.3), transparent 60deg)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%)'
                    }}
                  ></div>
                </div>

                {/* Blips representing vendors */}
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-[30%] left-[40%] w-3 h-3 bg-[var(--brand-orange)] rounded-full shadow-lg shadow-[var(--brand-orange)]/50"
                ></motion.div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-[60%] left-[70%] w-3 h-3 bg-[var(--brand-orange)] rounded-full shadow-lg shadow-[var(--brand-orange)]/50"
                ></motion.div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute top-[40%] right-[25%] w-3 h-3 bg-[var(--brand-orange)] rounded-full shadow-lg shadow-[var(--brand-orange)]/50"
                ></motion.div>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                  className="absolute bottom-[30%] left-[30%] w-3 h-3 bg-[var(--brand-orange)] rounded-full shadow-lg shadow-[var(--brand-orange)]/50"
                ></motion.div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 size-16 bg-[var(--brand-orange)] rounded-full flex items-center justify-center shadow-lg">
              <MapPin className="size-8 text-white" />
            </div>
          </div>

          <h1 className="text-4xl mb-4 text-[var(--text-primary)]">
            {slides[currentSlide].title}
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-8">
            {slides[currentSlide].subtitle}
          </p>

          {/* Dots Indicator */}
          <div className="flex gap-2 justify-center mb-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-[var(--brand-orange)] w-8' : 'bg-[var(--text-tertiary)] w-2'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Actions */}
      <div className="p-6 space-y-3">
        <button
          onClick={() => navigate('/home')}
          className="w-full bg-[var(--brand-orange)] text-white py-4 rounded-2xl font-semibold text-lg hover:bg-[var(--brand-orange-dark)] transition-all shadow-lg shadow-[var(--brand-orange)]/20"
        >
          {t('getStarted')}
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full bg-white/10 backdrop-blur-md text-[var(--text-primary)] py-4 rounded-2xl font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
        >
          {t('login')}
        </button>
        <p className="text-center text-[var(--text-secondary)] text-sm">
          {t('dontHaveAccount')}{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-[var(--brand-orange)] hover:underline"
          >
            {t('signup')}
          </button>
        </p>
      </div>
    </div>
  );
}
