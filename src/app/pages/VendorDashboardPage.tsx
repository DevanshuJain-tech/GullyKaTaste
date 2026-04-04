import { useNavigate } from 'react-router';
import { VendorDashboard } from '../components/VendorDashboard';

export function VendorDashboardPage() {
  const navigate = useNavigate();

  return <VendorDashboard onClose={() => navigate('/home')} />;
}
