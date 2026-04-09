import { useLanguage } from '../context/LanguageContext';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  const { language } = useLanguage();

  const footerLinks = {
    company: {
      title: language === 'en' ? 'Company' : 'कंपनी',
      links: [
        { label: language === 'en' ? 'About Us' : 'हमारे बारे में', href: '/about' },
        { label: language === 'en' ? 'Help Center' : 'सहायता केंद्र', href: '/help' },
        { label: language === 'en' ? 'Terms' : 'शर्तें', href: '/terms' },
        { label: language === 'en' ? 'Privacy' : 'गोपनीयता', href: '/privacy' },
      ],
    },
    vendors: {
      title: language === 'en' ? 'For Vendors' : 'विक्रेताओं के लिए',
      links: [
        { label: language === 'en' ? 'Become a Vendor' : 'विक्रेता बनें', href: '/vendor-onboarding' },
        { label: language === 'en' ? 'Vendor Dashboard' : 'विक्रेता डैशबोर्ड', href: '/vendor-dashboard' },
      ],
    },
    community: {
      title: language === 'en' ? 'Community' : 'समुदाय',
      links: [
        { label: language === 'en' ? 'Community' : 'समुदाय', href: '/community' },
        { label: language === 'en' ? 'Reels' : 'रील्स', href: '/reels' },
      ],
    },
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">🍜</span>
              <h3 className="text-xl font-bold bg-gradient-to-r from-[var(--brand-orange)] to-[var(--brand-orange-dark)] bg-clip-text text-transparent">
                Gully Ka Taste
              </h3>
            </div>
            <p className="text-[var(--text-secondary)] text-sm mb-4">
              {language === 'en'
                ? 'Discover authentic street food near you'
                : 'अपने आस-पास प्रामाणिक स्ट्रीट फूड खोजें'}
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[var(--bg-primary)] rounded-full hover:bg-[var(--brand-orange)] hover:text-white transition-colors"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[var(--bg-primary)] rounded-full hover:bg-[var(--brand-orange)] hover:text-white transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[var(--bg-primary)] rounded-full hover:bg-[var(--brand-orange)] hover:text-white transition-colors"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section, idx) => (
            <div key={idx}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-[var(--text-secondary)] text-sm hover:text-[var(--brand-orange)] transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[var(--border-primary)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-secondary)] text-sm">
            © 2026 Gully Ka Taste. {language === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}
          </p>
          <p className="text-[var(--text-secondary)] text-sm flex items-center gap-1">
            {language === 'en' ? 'Made with' : 'के साथ बनाया गया'}{' '}
            <Heart size={14} className="text-red-500 fill-red-500" />{' '}
            {language === 'en' ? 'for street food lovers' : 'स्ट्रीट फूड प्रेमियों के लिए'}
          </p>
        </div>
      </div>
    </footer>
  );
}
