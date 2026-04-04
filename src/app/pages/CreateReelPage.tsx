import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Video, X, Upload } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export function CreateReelPage() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      // Generate thumbnail from first frame
      const video = document.createElement('video');
      video.src = url;
      video.onloadeddata = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')?.drawImage(video, 0, 0);
        setThumbnail(canvas.toDataURL());
      };
    }
  };

  const handlePost = () => {
    if (!videoUrl) {
      alert(language === 'en' ? 'Please upload a video' : 'कृपया एक वीडियो अपलोड करें');
      return;
    }
    // Save reel logic here
    alert(language === 'en' ? 'Reel posted successfully!' : 'रील सफलतापूर्वक पोस्ट की गई!');
    navigate('/reels');
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
            {language === 'en' ? 'Create Reel' : 'रील बनाएं'}
          </h1>
          <button
            onClick={handlePost}
            disabled={!videoUrl}
            className="px-6 py-2 bg-[var(--brand-orange)] text-white rounded-full font-semibold hover:bg-[var(--brand-orange-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {language === 'en' ? 'Post' : 'पोस्ट करें'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Video Upload */}
        {!videoUrl ? (
          <label className="block aspect-[9/16] max-h-[600px] mx-auto border-2 border-dashed border-[var(--border-color)] rounded-2xl cursor-pointer hover:border-[var(--brand-orange)] transition-colors">
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <div className="size-full flex flex-col items-center justify-center">
              <Upload size={64} className="text-[var(--text-secondary)] mb-4" />
              <p className="text-lg font-medium mb-2">
                {language === 'en' ? 'Upload Video' : 'वीडियो अपलोड करें'}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {language === 'en' ? 'Click to select a video' : 'वीडियो चुनने के लिए क्लिक करें'}
              </p>
            </div>
          </label>
        ) : (
          <div className="relative aspect-[9/16] max-h-[600px] mx-auto rounded-2xl overflow-hidden bg-black">
            <video
              src={videoUrl}
              controls
              className="size-full object-contain"
            />
            <button
              onClick={() => {
                setVideoUrl('');
                setThumbnail('');
              }}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70"
            >
              <X size={20} className="text-white" />
            </button>
          </div>
        )}

        {/* Description */}
        {videoUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-[var(--brand-orange)] rounded-full flex items-center justify-center text-xl font-semibold text-white">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold">{user?.name}</p>
            </div>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'en' ? 'Add a description...' : 'विवरण जोड़ें...'}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl py-3 px-4 focus:outline-none focus:border-[var(--brand-orange)] transition-colors resize-none"
              rows={4}
            />

            <div className="bg-[var(--bg-secondary)] p-4 rounded-2xl">
              <p className="text-sm text-[var(--text-secondary)] mb-2">
                {language === 'en' ? 'Tips for great reels:' : 'बेहतरीन रील के लिए टिप्स:'}
              </p>
              <ul className="text-sm space-y-1 list-disc list-inside text-[var(--text-secondary)]">
                <li>{language === 'en' ? 'Keep it short and engaging' : 'इसे छोटा और दिलचस्प रखें'}</li>
                <li>{language === 'en' ? 'Show the food preparation' : 'खाना बनाने की प्रक्रिया दिखाएं'}</li>
                <li>{language === 'en' ? 'Add upbeat background music' : 'जीवंत पृष्ठभूमि संगीत जोड़ें'}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
