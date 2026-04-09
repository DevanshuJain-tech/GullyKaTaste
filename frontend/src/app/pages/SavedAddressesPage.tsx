import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, MapPin, Home, Briefcase, Plus, Trash2, Edit, Check } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  patchAddress,
  setDefaultAddress,
  type AddressItem,
} from "../lib/api";

export function SavedAddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    try {
      const items = await getAddresses();
      setAddresses(items);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const getIcon = (type: string) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Briefcase;
      default:
        return MapPin;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      await deleteAddress(id);
      setAddresses((previous) => previous.filter((address) => address.id !== id));
    }
  };

  const handleEdit = async (address: AddressItem) => {
    const nextLabel = prompt("Label", address.label);
    if (!nextLabel) {
      return;
    }

    const nextAddress = prompt("Address", address.address_text);
    if (!nextAddress) {
      return;
    }

    const updated = await patchAddress(address.id, {
      label: nextLabel,
      address_text: nextAddress,
    });

    setAddresses((previous) =>
      previous.map((item) => (item.id === address.id ? updated : item)),
    );
  };

  const handleAdd = async () => {
    const label = prompt("Label for this address (Home/Office/etc)");
    if (!label) {
      return;
    }

    const addressText = prompt("Full address");
    if (!addressText) {
      return;
    }

    const typeInput =
      prompt("Type: home, work, or other", "other")?.toLowerCase() ?? "other";
    const type = ["home", "work", "other"].includes(typeInput)
      ? (typeInput as "home" | "work" | "other")
      : "other";

    const created = await createAddress({
      label,
      type,
      address_text: addressText,
      is_default: addresses.length === 0,
    });

    setAddresses((previous) => [created, ...previous]);
  };

  const handleSetDefault = async (id: string) => {
    const updated = await setDefaultAddress(id);
    setAddresses((previous) =>
      previous.map((address) => ({
        ...address,
        is_default: address.id === updated.id,
      })),
    );
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
          <h1 className="text-2xl">Saved Addresses</h1>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24 space-y-4">
          {loading ? (
            <p className="text-[var(--text-secondary)]">Loading addresses...</p>
          ) : (
            addresses.map((address) => {
              const Icon = getIcon(address.type);
              return (
                <div
                  key={address.id}
                  className="bg-[var(--bg-secondary)] rounded-2xl p-4 border border-[var(--border-primary)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--brand-orange)]/20 rounded-full">
                      <Icon size={24} className="text-[var(--brand-orange)]" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{address.label}</h3>
                        {address.is_default && (
                          <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{address.address_text}</p>

                      <div className="flex gap-2 mt-3 flex-wrap">
                        <button
                          onClick={() => handleEdit(address)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        {!address.is_default && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors text-sm"
                          >
                            <Check size={16} />
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(address.id)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-2 p-4 bg-[var(--bg-secondary)] border-2 border-dashed border-[var(--border-primary)] rounded-2xl hover:bg-[var(--bg-hover)] hover:border-[var(--brand-orange)] transition-colors"
          >
            <Plus size={24} className="text-[var(--brand-orange)]" />
            <span>Add New Address</span>
          </button>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}