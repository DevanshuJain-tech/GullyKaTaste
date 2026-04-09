import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { VendorDetailModal } from "../components/VendorDetailModal";
import {
  addFavorite,
  createVendorReview,
  getVendorById,
  removeFavorite,
  type VendorDetail,
  type VendorReview,
} from "../lib/api";

export function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVendor = useCallback(async () => {
    if (!id) {
      navigate("/home", { replace: true });
      return;
    }

    setLoading(true);
    try {
      const data = await getVendorById(id);
      setVendor(data);
    } catch {
      navigate("/home", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    loadVendor();
  }, [loadVendor]);

  const handleSubmitReview = async (
    rating: number,
    comment: string,
    user: { nickname?: string; name?: string; avatar?: string | null },
  ) => {
    if (!id || !vendor) {
      return;
    }

    await createVendorReview(id, {
      rating,
      comment: comment.trim() || null,
    });

    const optimisticReview: VendorReview = {
      id: `tmp-${Date.now()}`,
      userName: user.nickname || user.name || "User",
      userAvatar: user.avatar ?? null,
      rating,
      comment: comment || null,
      created_at: new Date().toISOString(),
      date: new Date().toISOString(),
    };

    setVendor((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        reviews: [optimisticReview, ...current.reviews],
        reviewCount: current.reviewCount + 1,
      };
    });

    await loadVendor();
  };

  const handleToggleFavorite = async () => {
    if (!id || !vendor) {
      return;
    }

    if (vendor.isFavorite) {
      await removeFavorite(id);
      setVendor({ ...vendor, isFavorite: false });
      return;
    }

    await addFavorite(id);
    setVendor({ ...vendor, isFavorite: true });
  };

  if (loading || !vendor) {
    return <div className="h-screen flex items-center justify-center">Loading vendor...</div>;
  }

  return (
    <VendorDetailModal
      vendor={vendor}
      onClose={() => navigate(-1)}
      onSubmitReview={handleSubmitReview}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={vendor.isFavorite}
    />
  );
}