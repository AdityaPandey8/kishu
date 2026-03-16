import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ServiceBooking } from '@/contexts/DataContext';

interface BookingCalendarProps {
  bookings: ServiceBooking[];
}

export const BookingCalendar = ({ bookings }: BookingCalendarProps) => {
  const today = new Date();
  const upcoming = bookings
    .filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status))
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
    .slice(0, 5);

  const statusDot: Record<string, string> = {
    pending: 'bg-amber-500',
    confirmed: 'bg-blue-500',
    in_progress: 'bg-purple-500',
  };

  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    return d;
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(b => b.scheduledDate === dateStr && ['pending', 'confirmed', 'in_progress'].includes(b.status));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">Schedule</h3>
      </div>

      {/* Week strip */}
      <div className="flex gap-1 mb-4">
        {days.map((d, i) => {
          const hasBookings = getBookingsForDate(d).length > 0;
          const isToday = i === 0;
          return (
            <div
              key={i}
              className={cn(
                'flex-1 flex flex-col items-center py-2 rounded-xl text-[10px] transition-colors',
                isToday ? 'bg-primary text-primary-foreground' : 'bg-muted/50',
                hasBookings && !isToday && 'ring-1 ring-primary/30'
              )}
            >
              <span className="font-medium">{dayNames[d.getDay()]}</span>
              <span className={cn('text-lg font-bold', !isToday && 'text-foreground')}>{d.getDate()}</span>
              {hasBookings && (
                <div className={cn('w-1.5 h-1.5 rounded-full mt-0.5', isToday ? 'bg-primary-foreground' : 'bg-primary')} />
              )}
            </div>
          );
        })}
      </div>

      {/* Upcoming list */}
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">Upcoming Jobs</p>
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No upcoming bookings</p>
      ) : (
        <div className="space-y-2">
          {upcoming.map(b => (
            <div key={b.id} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/30 border border-border/50">
              <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', statusDot[b.status])} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{b.serviceName}</p>
                <p className="text-[10px] text-muted-foreground">{b.farmerName}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{b.scheduledDate} {b.scheduledTime}</span>
                  <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{b.location.split(',')[0]}</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground">₹{b.totalAmount}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};
