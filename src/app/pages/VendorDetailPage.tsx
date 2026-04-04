import { useParams, useNavigate } from 'react-router';
import { mockVendors } from '../data/mockData';
import { VendorDetailModal } from '../components/VendorDetailModal';

export function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const vendor = mockVendors.find(v => v.id === id);

  if (!vendor) {
    navigate('/home');
    return null;
  }

  return <VendorDetailModal vendor={vendor} onClose={() => navigate(-1)} />;
}
