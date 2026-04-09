import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Star, Store, Camera, Utensils } from "lucide-react";
import { getVendorMe, type VendorDetail } from "../lib/api";

export function VendorDashboardPage() {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const loadVendor = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVendorMe();
      setVendor(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVendor();
  }, [loadVendor]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  if (!vendor) {
    return (
      <div className="h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 mb-6 text-[var(--text-secondary)]"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl font-semibold mb-3">Vendor Dashboard</h1>
        <p className="text-[var(--text-secondary)] mb-6">You have not created a vendor profile yet.</p>
        <button
          onClick={() => navigate("/vendor-onboarding")}
          className="px-5 py-3 rounded-xl bg-[var(--brand-orange)] text-white"
        >
          Start Vendor Onboarding
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6 pb-20">
      <button
        onClick={() => navigate("/home")}
        className="flex items-center gap-2 mb-6 text-[var(--text-secondary)]"
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 mb-6 border border-[var(--border-primary)]">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-2">{vendor.name}</h1>
            <p className="text-[var(--text-secondary)] mb-1">Status: {vendor.status}</p>
            <p className="text-[var(--text-secondary)]">{vendor.address || "Address not set"}</p>
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-primary)] px-3 py-2 rounded-xl">
            <Star size={16} className="text-[var(--brand-orange)] fill-[var(--brand-orange)]" />
            <span>{vendor.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-primary)]">
          <div className="flex items-center gap-2 mb-2">
            <Utensils size={18} className="text-[var(--brand-orange)]" />
            <h2 className="font-semibold">Menu Items</h2>
          </div>
          <p className="text-2xl">{vendor.menu.length}</p>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-primary)]">
          <div className="flex items-center gap-2 mb-2">
            <Camera size={18} className="text-[var(--brand-orange)]" />
            <h2 className="font-semibold">Photos</h2>
          </div>
          <p className="text-2xl">{vendor.photos.length}</p>
        </div>

        <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-primary)]">
          <div className="flex items-center gap-2 mb-2">
            <Store size={18} className="text-[var(--brand-orange)]" />
            <h2 className="font-semibold">Reviews</h2>
          </div>
          <p className="text-2xl">{vendor.reviewCount}</p>
        </div>
      </div>

      <div className="bg-[var(--bg-secondary)] rounded-2xl p-6 border border-[var(--border-primary)]">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/vendor-onboarding")}
            className="px-4 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-primary)]"
          >
            Edit Vendor Profile
          </button>
          <button
            onClick={() => loadVendor()}
            className="px-4 py-2 rounded-xl bg-[var(--brand-orange)] text-white"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}