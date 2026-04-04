import { useNavigate } from 'react-router';
import { ChevronLeft, Star } from 'lucide-react';
import { useState } from 'react';
import { BottomNav } from '../components/BottomNav';

interface Review {
  id: string;
  vendorName: string;
  rating: number;
  comment: string;
  date: string;
}

export function MyReviewsPage() {
  const navigate = useNavigate();
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      vendorName: 'Street Taco Corner',
      rating: 5,
      comment: 'Amazing tacos! The best I\'ve had in Delhi. Will definitely come back.',
      date: '2 days ago',
    },
    {
      id: '2',
      vendorName: 'Burger Paradise',
      rating: 4,
      comment: 'Great burgers, but the service could be faster during peak hours.',
      date: '1 week ago',
    },
    {
      id: '3',
      vendorName: 'Chaat Express',
      rating: 5,
      comment: 'Authentic street food taste! Loved the pani puri.',
      date: '2 weeks ago',
    },
  ]);

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] z-10">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center gap-2">
            <Star size={24} className="text-[var(--brand-orange)]" />
            <h1 className="text-2xl">My Reviews</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-primary)]"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{review.vendorName}</h3>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating
                        ? "text-[var(--brand-orange)] fill-[var(--brand-orange)]"
                        : "text-[var(--text-secondary)]"
                      }
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-[var(--text-primary)] mb-3">
                {review.comment}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-secondary)]">{review.date}</span>
                <button
                  onClick={() => alert('Edit review coming soon!')}
                  className="text-sm text-[var(--brand-orange)] hover:underline"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
