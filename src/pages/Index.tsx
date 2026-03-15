import { useAuth } from '@/contexts/AuthContext';
import Home from './Home';
import FarmerDashboard from './dashboard/FarmerDashboard';
import DealerDashboard from './dashboard/DealerDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import ProviderDashboard from './dashboard/ProviderDashboard';
import ProviderPending from './provider/ProviderPending';
import ProviderRejected from './provider/ProviderRejected';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Home />;
  }

  switch (user.role) {
    case 'dealer':
      return <DealerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    case 'service_provider':
      if (user.providerStatus === 'pending') return <ProviderPending />;
      if (user.providerStatus === 'rejected') return <ProviderRejected />;
      return <ProviderDashboard />;
    default:
      return <FarmerDashboard />;
  }
};

export default Index;
