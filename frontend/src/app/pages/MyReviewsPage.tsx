import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Star, Trash2, Edit } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { deleteReview, getMyReviews, patchReview, type ReviewListItem } from "../lib/api";

export function MyReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getMyReviews({ pageSize: 100 });
      setReviews(response.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleEdit = async (review: ReviewListItem) => {
    const nextRatingRaw = prompt("Rating (1-5)", String(review.rating));
    if (!nextRatingRaw) {
      return;
    }

    const nextRating = Number(nextRatingRaw);
    if (!Number.isInteger(nextRating) || nextRating < 1 || nextRating > 5) {
      alert("Invalid rating");
      return;
    }

    const nextComment = prompt("Comment", review.comment ?? "") ?? "";

    const updated = await patchReview(review.id, {
      rating: nextRating,
      comment: nextComment,
    });

    setReviews((previous) =>
      previous.map((item) =>
        item.id === review.id
          ? {
              ...item,
              rating: updated.rating,
              comment: updated.comment,
              updated_at: updated.updated_at,
            }
          : item,
      ),
    );
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Delete this review?")) {
      return;
    }

    await deleteReview(reviewId);
    setReviews((previous) => previous.filter((review) => review.id !== reviewId));
  };

  return (
    <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col overflow-hidden">
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

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24 space-y-4">
          {loading ? (
            <p className="text-[var(--text-secondary)]">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-[var(--text-secondary)]">You have not posted any reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review.id}
                className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-primary)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{review.vendorName || "Vendor"}</h3>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className={
                          index < review.rating
                            ? "text-[var(--brand-orange)] fill-[var(--brand-orange)]"
                            : "text-[var(--text-secondary)]"
                        }
                      />
                    ))}
                  </div>
                </div>

                {review.comment && (
                  <p className="text-sm text-[var(--text-primary)] mb-3">{review.comment}</p>
                )}

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[var(--text-secondary)]">
                    {new Date(review.updated_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-sm text-[var(--brand-orange)] hover:underline flex items-center gap-1"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-sm text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}