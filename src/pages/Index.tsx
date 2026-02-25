import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
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

  // If not logged in, show farmer dashboard as guest
  if (!user) {
    return <Navigate to="/auth" replace />;
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
