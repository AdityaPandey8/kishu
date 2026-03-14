import { useAuth } from '@/contexts/AuthContext';
import Home from './Home';
import FarmerDashboard from './dashboard/FarmerDashboard';
import DealerDashboard from './dashboard/DealerDashboard';
import AdminDashboard from './dashboard/AdminDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // If not logged in, show public home page
  if (!user) {
    return <Home />;
  }

  // Role-based dashboard routing
  switch (user.role) {
    case 'dealer':
      return <DealerDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <FarmerDashboard />;
  }
};

export default Index;
