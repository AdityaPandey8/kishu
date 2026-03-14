import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, CalendarDays, Clock, MapPin, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' },
  in_progress: { label: 'In Progress', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30' },
  disputed: { label: 'Disputed', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30' },
};

const MyBookings = () => {
  const navigate = useNavigate();
  const { serviceBookings } = useData();
  const { user } = useAuth();

  const myBookings = serviceBookings
    .filter(b => b.farmerId === (user?.id || 'farmer-001'))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <AppLayout>
      <div className="container px-4 py-6 pb-24 space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">My Bookings</h1>
            <p className="text-sm text-muted-foreground">{myBookings.length} bookings</p>
          </div>
        </div>

        {myBookings.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No bookings yet</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => navigate('/agri-services')}>
              Browse Services
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {myBookings.map((booking, i) => {
              const sc = statusConfig[booking.status] || statusConfig.pending;
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/my-bookings/${booking.id}`)}
                  className="bg-card border border-border rounded-2xl p-4 space-y-2.5 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{booking.serviceName}</h3>
                      <p className="text-xs text-muted-foreground">{booking.providerName}</p>
                    </div>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', sc.color)}>
                      {sc.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{booking.scheduledDate}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{booking.scheduledTime}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{booking.location.slice(0, 20)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">₹{booking.totalAmount.toLocaleString()}</span>
                    {booking.rating && (
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {booking.rating}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyBookings;
