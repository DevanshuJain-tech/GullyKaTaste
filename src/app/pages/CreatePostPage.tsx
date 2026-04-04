import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Image, MapPin, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function CreatePostPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls = Array.from(files).map(file => URL.createObjectURL(file));
      setImages([...images, ...urls]);
    }
  };

  const handlePost = () => {
    // Save post logic here
    alert(language === 'en' ? 'Post created successfully!' : 'पोस्ट सफलतापूर्वक बनाई गई!');
    navigate('/community');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-color)] z-10 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">
            {language === 'en' ? 'Create Post' : 'पोस्ट बनाएं'}
          </h1>
          <button
            onClick={handlePost}
            disabled={!content.trim()}
            className="px-6 py-2 bg-[var(--brand-orange)] text-white rounded-full font-semibold hover:bg-[var(--brand-orange-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {language === 'en' ? 'Post' : 'पोस्ट करें'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="size-12 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-xl font-semibold text-white">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold">{user?.name}</p>
            <button
              onClick={() => navigator.geolocation.getCurrentPosition(
                (pos) => setLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`)
              )}
              className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--brand-orange)]"
            >
              <MapPin size={14} />
              {location || (language === 'en' ? 'Add location' : 'स्थान जोड़ें')}
            </button>
          </div>
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={language === 'en' ? 'Share your food discovery...' : 'अपनी खोज साझा करें...'}
          className="w-full bg-transparent border-none outline-none resize-none text-lg"
          rows={8}
          autoFocus
        />

        {/* Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden">
                <img src={img} alt="" className="size-full object-cover" />
                <button
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Image Button */}
        <label className="flex items-center gap-3 p-4 border-2 border-dashed border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--brand-orange)] transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Image size={24} className="text-[var(--text-secondary)]" />
          <span className="text-[var(--text-secondary)]">
            {language === 'en' ? 'Add photos' : 'फोटो जोड़ें'}
          </span>
        </label>
      </div>
    </div>
  );
}
