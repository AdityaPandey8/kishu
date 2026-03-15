import { motion } from 'framer-motion';
import { ArrowLeft, User, Leaf, Store, Shield, Wrench, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const roleConfig: Record<string, { icon: typeof User; label: string; color: string; bg: string }> = {
  farmer: { icon: Leaf, label: 'Farmer', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
  dealer: { icon: Store, label: 'Dealer', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  admin: { icon: Shield, label: 'Admin', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  service_provider: { icon: Wrench, label: 'Service Provider', color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30' },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  active: { color: 'bg-green-100 text-green-700', label: 'Active' },
  suspended: { color: 'bg-red-100 text-red-700', label: 'Suspended' },
  pending: { color: 'bg-amber-100 text-amber-700', label: 'Pending' },
};

const UserDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { platformUsers, updateUserStatus, updateUserRole, orders, serviceBookings, dealerKYCs, expertApplications, products } = useData();

  const userData = platformUsers.find(u => u.id === id);

  if (!userData) {
    return (
      <AppLayout hideNav>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </AppLayout>
    );
  }

  const role = roleConfig[userData.role] || roleConfig.farmer;
  const status = statusConfig[userData.status] || statusConfig.active;
  const RoleIcon = role.icon;

  // Role-specific data
  const userOrders = orders.filter(o => o.farmerId === userData.id || o.dealerId === userData.id);
  const userBookings = serviceBookings.filter(b => b.farmerId === userData.id || b.providerId === userData.id);
  const userKYC = dealerKYCs.find(k => k.dealerId === userData.id);
  const userExpert = expertApplications.find(e => e.userId === userData.id);
  const userProducts = products.filter(p => p.dealerId === userData.id);

  const handleSuspend = () => { updateUserStatus(userData.id, 'suspended'); toast.success('User suspended'); };
  const handleActivate = () => { updateUserStatus(userData.id, 'active'); toast.success('User activated'); };

  return (
    <AppLayout hideNav>
      <motion.div className="container px-4 py-6 space-y-5 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold text-foreground">User Details</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className={cn('h-14 w-14 rounded-xl flex items-center justify-center', role.bg)}>
              <RoleIcon className={cn('h-7 w-7', role.color)} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{userData.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', role.bg, role.color)}>{role.label}</span>
                <span className={cn('text-xs px-2 py-0.5 rounded-full', status.color)}>{status.label}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" /> {userData.email}
            </div>
            {userData.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" /> {userData.location}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" /> Joined: {userData.createdAt}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" /> Last active: {userData.lastActive}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            {userData.status === 'active' ? (
              <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs text-red-600 border-red-200" onClick={handleSuspend}>
                <XCircle className="h-3 w-3 mr-1" /> Suspend
              </Button>
            ) : (
              <Button size="sm" className="flex-1 rounded-xl text-xs" onClick={handleActivate}>
                <CheckCircle className="h-3 w-3 mr-1" /> Activate
              </Button>
            )}
          </div>
        </div>

        {/* Role-specific sections */}
        {userData.role === 'farmer' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Farmer Activity</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-foreground">{userOrders.length}</p>
                <p className="text-[10px] text-muted-foreground">Orders Placed</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-foreground">{userBookings.length}</p>
                <p className="text-[10px] text-muted-foreground">Service Bookings</p>
              </div>
            </div>
          </div>
        )}

        {userData.role === 'dealer' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Dealer Info</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-foreground">{userProducts.length}</p>
                <p className="text-[10px] text-muted-foreground">Products</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-foreground">{userOrders.length}</p>
                <p className="text-[10px] text-muted-foreground">Orders</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-foreground">₹{userOrders.reduce((s, o) => s + o.totalAmount, 0).toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Revenue</p>
              </div>
            </div>
            {userKYC && (
              <div className="bg-card border border-border rounded-xl p-3">
                <p className="text-xs font-medium text-foreground mb-1">KYC Status</p>
                <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', userKYC.status === 'approved' ? 'bg-green-100 text-green-700' : userKYC.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>
                  {userKYC.status}
                </span>
              </div>
            )}
          </div>
        )}

        {userData.role === 'service_provider' && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Provider Info</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-foreground">{userBookings.length}</p>
                <p className="text-[10px] text-muted-foreground">Bookings</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-foreground">₹{userBookings.reduce((s, b) => s + b.totalAmount, 0).toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Revenue</p>
              </div>
            </div>
          </div>
        )}

        {userExpert && (
          <div className="bg-card border border-border rounded-xl p-3">
            <p className="text-xs font-medium text-foreground mb-1">Expert Application</p>
            <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', userExpert.status === 'approved' ? 'bg-green-100 text-green-700' : userExpert.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700')}>
              {userExpert.status}
            </span>
            <p className="text-[10px] text-muted-foreground mt-1">Specialization: {userExpert.specialization.join(', ')}</p>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default UserDetail;
