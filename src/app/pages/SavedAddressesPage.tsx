import { useNavigate } from 'react-router';
import { ChevronLeft, MapPin, Home, Briefcase, Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { BottomNav } from '../components/BottomNav';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  label: string;
  address: string;
  isDefault: boolean;
}

export function SavedAddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      label: 'Home',
      address: '123 Main Street, Connaught Place, New Delhi, 110001',
      isDefault: true,
    },
    {
      id: '2',
      type: 'work',
      label: 'Office',
      address: '456 Business Park, Cyber City, Gurugram, 122002',
      isDefault: false,
    },
  ]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Briefcase;
      default: return MapPin;
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    }
  };

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
          <h1 className="text-2xl">Saved Addresses</h1>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 pb-24 space-y-4">
          {addresses.map((address) => {
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
                      {address.isDefault && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">{address.address}</p>

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => alert('Edit address coming soon!')}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-primary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
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
          })}

          <button
            onClick={() => alert('Add new address coming soon!')}
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
