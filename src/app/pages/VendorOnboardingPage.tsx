import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Store, MapPin, Camera, Upload, CheckCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function VendorOnboardingPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stallName: '',
    description: '',
    foodType: [] as string[],
    location: '',
    coordinates: { lat: 0, lng: 0 },
    phone: '',
    openTime: '09:00',
    closeTime: '21:00',
    photos: [] as string[],
    menuItems: [] as Array<{ name: string; price: string; isVeg: boolean }>,
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Save vendor profile
    updateProfile({ isVendor: true });
    navigate('/vendor-dashboard');
  };

  const toggleFoodType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      foodType: prev.foodType.includes(type)
        ? prev.foodType.filter(t => t !== type)
        : [...prev.foodType, type]
    }));
  };

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, { name: '', price: '', isVeg: true }]
    }));
  };

  const updateMenuItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...urls] }));
    }
  };

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          },
          location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        }));
      },
      (error) => {
        alert('Unable to get location. Please enter manually.');
      }
    );
  };

  const foodTypes = [
    { id: 'street-food', name: language === 'en' ? 'Street Food' : 'स्ट्रीट फूड', icon: '🌮' },
    { id: 'chai', name: language === 'en' ? 'Tea/Coffee' : 'चाय/कॉफी', icon: '☕' },
    { id: 'snacks', name: language === 'en' ? 'Snacks' : 'नाश्ता', icon: '🍿' },
    { id: 'sweets', name: language === 'en' ? 'Sweets' : 'मिठाई', icon: '🍬' },
    { id: 'meals', name: language === 'en' ? 'Meals' : 'भोजन', icon: '🍛' },
    { id: 'juice', name: language === 'en' ? 'Juice/Drinks' : 'जूस/पेय', icon: '🥤' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-color)] z-10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => step === 1 ? navigate(-1) : handleBack()}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">
              {language === 'en' ? 'Become a Vendor' : 'विक्रेता बनें'}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {language === 'en' ? `Step ${step} of 5` : `चरण ${step} में से 5`}
            </p>
          </div>
          <div className="size-10" />
        </div>

        {/* Progress Bar */}
        <div className="mt-4 max-w-4xl mx-auto">
          <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[var(--brand-orange)]"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="size-20 bg-[var(--brand-orange)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store size={40} className="text-[var(--brand-orange)]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'en' ? 'Basic Information' : 'बुनियादी जानकारी'}
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    {language === 'en'
                      ? 'Tell us about your stall'
                      : 'अपने स्टॉल के बारे में बताएं'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'en' ? 'Stall Name' : 'स्टॉल का नाम'}
                    </label>
                    <input
                      type="text"
                      value={formData.stallName}
                      onChange={(e) => setFormData({...formData, stallName: e.target.value})}
                      placeholder={language === 'en' ? "e.g., Raju's Chai Cart" : "जैसे, राजू की चाय की दुकान"}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'en' ? 'Description' : 'विवरण'}
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder={language === 'en' ? 'Describe your stall and what makes it special...' : 'अपने स्टॉल का वर्णन करें...'}
                      rows={4}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'en' ? 'Phone Number' : 'फोन नंबर'}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Food Type */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'en' ? 'What do you sell?' : 'आप क्या बेचते हैं?'}
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    {language === 'en' ? 'Select all that apply' : 'सभी लागू का चयन करें'}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {foodTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => toggleFoodType(type.id)}
                      className={`p-6 rounded-2xl border-2 transition-all ${
                        formData.foodType.includes(type.id)
                          ? 'border-[var(--brand-orange)] bg-[var(--brand-orange)]/10'
                          : 'border-[var(--border-color)] hover:border-[var(--brand-orange)]/50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{type.icon}</div>
                      <div className="font-medium">{type.name}</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="size-20 bg-[var(--brand-orange)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin size={40} className="text-[var(--brand-orange)]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'en' ? 'Location' : 'स्थान'}
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    {language === 'en' ? 'Where is your stall located?' : 'आपका स्टॉल कहां स्थित है?'}
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleGetLocation}
                    className="w-full bg-[var(--brand-orange)] text-white py-4 rounded-2xl font-semibold hover:bg-[var(--brand-orange-dark)] transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin size={20} />
                    {language === 'en' ? 'Use Current Location' : 'वर्तमान स्थान का उपयोग करें'}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[var(--border-color)]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-[var(--bg-primary)] text-[var(--text-secondary)]">
                        {language === 'en' ? 'or enter manually' : 'या मैन्युअल रूप से दर्ज करें'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'en' ? 'Address' : 'पता'}
                    </label>
                    <textarea
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder={language === 'en' ? 'Enter your stall address...' : 'अपने स्टॉल का पता दर्ज करें...'}
                      rows={3}
                      className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'en' ? 'Open Time' : 'खुलने का समय'}
                      </label>
                      <input
                        type="time"
                        value={formData.openTime}
                        onChange={(e) => setFormData({...formData, openTime: e.target.value})}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'en' ? 'Close Time' : 'बंद होने का समय'}
                      </label>
                      <input
                        type="time"
                        value={formData.closeTime}
                        onChange={(e) => setFormData({...formData, closeTime: e.target.value})}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Photos */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <div className="size-20 bg-[var(--brand-orange)]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera size={40} className="text-[var(--brand-orange)]" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'en' ? 'Photos' : 'फोटो'}
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    {language === 'en' ? 'Add photos of your stall and food' : 'अपने स्टॉल और भोजन की तस्वीरें जोड़ें'}
                  </p>
                </div>

                <div>
                  <label className="block w-full border-2 border-dashed border-[var(--border-color)] rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--brand-orange)] transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <Upload size={48} className="mx-auto mb-4 text-[var(--text-secondary)]" />
                    <p className="text-[var(--text-secondary)]">
                      {language === 'en' ? 'Click to upload photos' : 'फोटो अपलोड करने के लिए क्लिक करें'}
                    </p>
                  </label>
                </div>

                {formData.photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {formData.photos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                        <img src={photo} alt={`Photo ${idx + 1}`} className="size-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Menu Items */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'en' ? 'Add Menu Items' : 'मेनू आइटम जोड़ें'}
                  </h2>
                  <p className="text-[var(--text-secondary)]">
                    {language === 'en' ? 'List items you sell (optional)' : 'आप जो बेचते हैं उसकी सूची बनाएं'}
                  </p>
                </div>

                <div className="space-y-4">
                  {formData.menuItems.map((item, idx) => (
                    <div key={idx} className="bg-[var(--bg-secondary)] p-4 rounded-2xl space-y-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateMenuItem(idx, 'name', e.target.value)}
                        placeholder={language === 'en' ? 'Item name' : 'आइटम का नाम'}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 px-3 focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                      />
                      <div className="flex gap-3">
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updateMenuItem(idx, 'price', e.target.value)}
                          placeholder={language === 'en' ? 'Price' : 'कीमत'}
                          className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 px-3 focus:outline-none focus:border-[var(--brand-orange)] transition-colors"
                        />
                        <button
                          onClick={() => updateMenuItem(idx, 'isVeg', !item.isVeg)}
                          className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                            item.isVeg
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {item.isVeg ? '🥬 Veg' : '🍖 Non-Veg'}
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={addMenuItem}
                    className="w-full py-3 border-2 border-dashed border-[var(--border-color)] rounded-2xl text-[var(--text-secondary)] hover:border-[var(--brand-orange)] hover:text-[var(--brand-orange)] transition-colors"
                  >
                    + {language === 'en' ? 'Add Item' : 'आइटम जोड़ें'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-[var(--bg-primary)] border-t border-[var(--border-color)] p-6">
        <div className="max-w-2xl mx-auto flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex-1 bg-[var(--bg-secondary)] py-4 rounded-2xl font-semibold hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              {language === 'en' ? 'Back' : 'पीछे'}
            </button>
          )}
          <button
            onClick={step === 5 ? handleSubmit : handleNext}
            disabled={
              (step === 1 && !formData.stallName) ||
              (step === 2 && formData.foodType.length === 0) ||
              (step === 3 && !formData.location)
            }
            className="flex-1 bg-[var(--brand-orange)] text-white py-4 rounded-2xl font-semibold hover:bg-[var(--brand-orange-dark)] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 5 ? (
              <>
                <CheckCircle size={20} />
                {language === 'en' ? 'Complete Setup' : 'सेटअप पूर्ण करें'}
              </>
            ) : (
              <>
                {language === 'en' ? 'Next' : 'अगला'}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
