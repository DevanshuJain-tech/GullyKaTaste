import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', hi: 'होम' },
  discover: { en: 'Discover', hi: 'खोजें' },
  reels: { en: 'Reels', hi: 'रील्स' },
  community: { en: 'Community', hi: 'समुदाय' },
  profile: { en: 'Profile', hi: 'प्रोफ़ाइल' },
  search: { en: 'Search', hi: 'खोज' },
  searchVendors: { en: 'Search street food vendors...', hi: 'स्ट्रीट फूड विक्रेता खोजें...' },
  nearby: { en: 'Nearby Vendors', hi: 'पास के विक्रेता' },
  distance: { en: 'Distance', hi: 'दूरी' },
  rating: { en: 'Rating', hi: 'रेटिंग' },
  reviews: { en: 'Reviews', hi: 'समीक्षा' },
  menu: { en: 'Menu', hi: 'मेनू' },
  photos: { en: 'Photos', hi: 'फ़ोटो' },
  getDirections: { en: 'Get Directions', hi: 'दिशा प्राप्त करें' },
  save: { en: 'Save', hi: 'सहेजें' },
  share: { en: 'Share', hi: 'शेयर करें' },
  openNow: { en: 'Open Now', hi: 'अभी खुला' },
  closed: { en: 'Closed', hi: 'बंद' },
  veg: { en: 'Veg', hi: 'शाकाहारी' },
  nonVeg: { en: 'Non-Veg', hi: 'मांसाहारी' },
  login: { en: 'Login', hi: 'लॉग इन करें' },
  signup: { en: 'Sign Up', hi: 'साइन अप करें' },
  email: { en: 'Email', hi: 'ईमेल' },
  password: { en: 'Password', hi: 'पासवर्ड' },
  confirmPassword: { en: 'Confirm Password', hi: 'पासवर्ड की पुष्टि करें' },
  fullName: { en: 'Full Name', hi: 'पूरा नाम' },
  phone: { en: 'Phone Number', hi: 'फ़ोन नंबर' },
  forgotPassword: { en: 'Forgot Password?', hi: 'पासवर्ड भूल गए?' },
  orContinueWith: { en: 'Or continue with', hi: 'या जारी रखें' },
  alreadyHaveAccount: { en: 'Already have an account?', hi: 'पहले से खाता है?' },
  dontHaveAccount: { en: "Don't have an account?", hi: 'खाता नहीं है?' },
  welcome: { en: 'Welcome to Gully Ka Taste', hi: 'गली का टेस्ट में आपका स्वागत है' },
  welcomeBack: { en: 'Welcome Back', hi: 'वापस स्वागत है' },
  getStarted: { en: 'Get Started', hi: 'शुरू करें' },
  settings: { en: 'Settings', hi: 'सेटिंग्स' },
  notifications: { en: 'Notifications', hi: 'सूचनाएं' },
  favorites: { en: 'Favorites', hi: 'पसंदीदा' },
  orders: { en: 'Orders', hi: 'ऑर्डर' },
  help: { en: 'Help & Support', hi: 'मदद और सहायता' },
  about: { en: 'About', hi: 'के बारे में' },
  logout: { en: 'Logout', hi: 'लॉग आउट' },
  language: { en: 'Language', hi: 'भाषा' },
  editProfile: { en: 'Edit Profile', hi: 'प्रोफ़ाइल संपादित करें' },
  myOrders: { en: 'My Orders', hi: 'मेरे ऑर्डर' },
  savedVendors: { en: 'Saved Vendors', hi: 'सहेजे गए विक्रेता' },
  accountSettings: { en: 'Account Settings', hi: 'खाता सेटिंग्स' },
  privacyPolicy: { en: 'Privacy Policy', hi: 'गोपनीयता नीति' },
  termsConditions: { en: 'Terms & Conditions', hi: 'नियम और शर्तें' },
  becomeVendor: { en: 'Become a Vendor', hi: 'विक्रेता बनें' },
  vendorDashboard: { en: 'Vendor Dashboard', hi: 'विक्रेता डैशबोर्ड' },
  mapView: { en: 'Map View', hi: 'नक्शा दृश्य' },
  listView: { en: 'List View', hi: 'सूची दृश्य' },
  filters: { en: 'Filters', hi: 'फ़िल्टर' },
  sortBy: { en: 'Sort By', hi: 'क्रमबद्ध करें' },
  popular: { en: 'Popular', hi: 'लोकप्रिय' },
  nearestFirst: { en: 'Nearest First', hi: 'निकटतम पहले' },
  topRated: { en: 'Top Rated', hi: 'शीर्ष रेटेड' },
  viewAll: { en: 'View All', hi: 'सभी देखें' },
  seeMore: { en: 'See More', hi: 'और देखें' },
  locationPermission: { en: 'Location Permission', hi: 'स्थान अनुमति' },
  allowLocation: { en: 'Allow Location Access', hi: 'स्थान एक्सेस की अनुमति दें' },
  enterManually: { en: 'Enter Manually', hi: 'मैन्युअल रूप से दर्ज करें' },
  locationMessage: { en: 'We need your location to show street food vendors within 1km radius', hi: 'हमें 1 किमी के दायरे में गली के खाने के विक्रेताओं को दिखाने के लिए आपके स्थान की आवश्यकता है' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
