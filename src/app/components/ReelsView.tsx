import { Heart, MessageCircle, Share2, MoreVertical, Play } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Reel {
  id: string;
  vendorName: string;
  thumbnail: string;
  likes: number;
  comments: number;
  description: string;
}

interface ReelsViewProps {
  reels: Reel[];
}

export function ReelsView({ reels }: ReelsViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const itemHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < reels.length) {
        setCurrentIndex(newIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentIndex, reels.length]);

  const toggleLike = (reelId: string) => {
    setLikedReels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reelId)) {
        newSet.delete(reelId);
      } else {
        newSet.add(reelId);
      }
      return newSet;
    });
  };

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-140px)] overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
    >
      {reels.map((reel) => (
        <div
          key={reel.id}
          className="h-[calc(100vh-140px)] snap-start relative bg-black"
        >
          {/* Video Thumbnail (simulated) */}
          <div className="relative w-full h-full">
            <ImageWithFallback
              src={reel.thumbnail}
              alt={reel.vendorName}
              className="w-full h-full object-cover"
            />

            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                <Play size={32} className="text-white ml-1" fill="white" />
              </div>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
          </div>

          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                <h3 className="text-xl mb-2">{reel.vendorName}</h3>
                <p className="text-sm text-[#B0B0B0] line-clamp-2">
                  {reel.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 ml-4">
                <button
                  onClick={() => toggleLike(reel.id)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="w-12 h-12 rounded-full bg-[#242424]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#2A2A2A]/80 transition-colors">
                    <Heart
                      size={24}
                      className={likedReels.has(reel.id)
                        ? "text-[#FF8C42] fill-[#FF8C42]"
                        : "text-white"
                      }
                    />
                  </div>
                  <span className="text-xs">
                    {reel.likes + (likedReels.has(reel.id) ? 1 : 0)}
                  </span>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-[#242424]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#2A2A2A]/80 transition-colors">
                    <MessageCircle size={24} className="text-white" />
                  </div>
                  <span className="text-xs">{reel.comments}</span>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-[#242424]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#2A2A2A]/80 transition-colors">
                    <Share2 size={24} className="text-white" />
                  </div>
                </button>

                <button className="flex flex-col items-center gap-1">
                  <div className="w-12 h-12 rounded-full bg-[#242424]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#2A2A2A]/80 transition-colors">
                    <MoreVertical size={24} className="text-white" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
