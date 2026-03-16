import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Calendar, IndianRupee, Star, CheckCircle, XCircle, Clock, Package, ChevronRight, BarChart3 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { EarningsChart } from '@/components/provider/EarningsChart';
import { BookingCalendar } from '@/components/provider/BookingCalendar';
import { PerformanceMetrics } from '@/components/provider/PerformanceMetrics';

const ProviderDashboard = () => {
  const { user } = useAuth();
  const { serviceBookings, agriServices, updateBookingStatus } = useData();
  const [tab, setTab] = useState<'overview' | 'bookings' | 'services'>('overview');

  const myBookings = serviceBookings.filter(b => b.providerId === 'sp1' || b.providerId === 'sp2' || b.providerId === 'sp3' || b.providerId === 'sp4');
  const myServices = agriServices.filter(s => s.providerId === 'sp1' || s.providerId === 'sp2' || s.providerId === 'sp3' || s.providerId === 'sp4');

  const activeBookings = myBookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status));
  const completedBookings = myBookings.filter(b => b.status === 'completed');
  const totalRevenue = completedBookings.reduce((s, b) => s + b.totalAmount, 0);
  const avgRating = completedBookings.filter(b => b.rating).reduce((s, b, _, a) => s + (b.rating || 0) / a.length, 0);

  const stats = [
    { label: 'Total Bookings', value: myBookings.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Active', value: activeBookings.length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Rating', value: avgRating ? avgRating.toFixed(1) : 'N/A', icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30',
    confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30',
    in_progress: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30',
    completed: 'bg-green-100 text-green-700 dark:bg-green-900/30',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30',
    disputed: 'bg-red-100 text-red-700 dark:bg-red-900/30',
  };

  const handleAccept = (id: string) => { updateBookingStatus(id, 'confirmed'); toast.success('Booking confirmed'); };
  const handleReject = (id: string) => { updateBookingStatus(id, 'cancelled'); toast.success('Booking cancelled'); };
  const handleStart = (id: string) => { updateBookingStatus(id, 'in_progress'); toast.success('Service started'); };
  const handleComplete = (id: string) => { updateBookingStatus(id, 'completed'); toast.success('Service completed'); };

  return (
    <AppLayout>
      <motion.div className="container px-4 py-6 space-y-5 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div>
          <p className="text-sm text-muted-foreground">Service Provider</p>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            {user?.name || 'Provider'} <Wrench className="h-5 w-5 text-teal-600" />
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-2xl p-3 shadow-sm">
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center mb-2', s.bg)}>
                  <Icon className={cn('h-4 w-4', s.color)} />
                </div>
                <p className="text-lg font-bold text-foreground">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          <Button variant={tab === 'overview' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs" onClick={() => setTab('overview')}>
            <BarChart3 className="h-3.5 w-3.5 mr-1" /> Overview
          </Button>
          <Button variant={tab === 'bookings' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs" onClick={() => setTab('bookings')}>
            <Calendar className="h-3.5 w-3.5 mr-1" /> Bookings ({myBookings.length})
          </Button>
          <Button variant={tab === 'services' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs" onClick={() => setTab('services')}>
            <Package className="h-3.5 w-3.5 mr-1" /> My Services ({myServices.length})
          </Button>
        </div>

        {/* Overview Tab */}
        {tab === 'overview' && (
          <div className="space-y-4">
            <EarningsChart totalRevenue={totalRevenue} />
            <BookingCalendar bookings={myBookings} />
            <PerformanceMetrics completedCount={completedBookings.length} totalCount={myBookings.length} avgRating={avgRating} />
          </div>
        )}

        {/* Bookings Tab */}
        {tab === 'bookings' && (
          <div className="space-y-3">
            {myBookings.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No bookings yet</p>}
            {myBookings.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{b.serviceName}</p>
                    <p className="text-[10px] text-muted-foreground">{b.farmerName} • {b.scheduledDate} at {b.scheduledTime}</p>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', statusColors[b.status])}>{b.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>📍 {b.location}</span>
                  {b.acres && <span>📐 {b.acres} acres</span>}
                  <span className="font-semibold text-foreground">₹{b.totalAmount}</span>
                </div>
                {b.status === 'pending' && (
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg text-red-600 border-red-200" onClick={() => handleReject(b.id)}>
                      <XCircle className="h-3 w-3 mr-1" /> Reject
                    </Button>
                    <Button size="sm" className="flex-1 h-8 text-xs rounded-lg bg-teal-600 text-white" onClick={() => handleAccept(b.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Accept
                    </Button>
                  </div>
                )}
                {b.status === 'confirmed' && (
                  <Button size="sm" className="w-full h-8 text-xs rounded-lg" onClick={() => handleStart(b.id)}>Start Service</Button>
                )}
                {b.status === 'in_progress' && (
                  <Button size="sm" className="w-full h-8 text-xs rounded-lg bg-green-600 text-white" onClick={() => handleComplete(b.id)}>Mark Complete</Button>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Services Tab */}
        {tab === 'services' && (
          <div className="space-y-3">
            {myServices.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3">
                  <img src={s.image} alt={s.name} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{s.category.replace('-', ' ')}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-foreground">₹{s.price}/{s.priceUnit.replace('_', ' ')}</span>
                      <span className="text-[10px] text-muted-foreground">⭐ {s.rating}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full', s.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                        {s.availability ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default ProviderDashboard;
