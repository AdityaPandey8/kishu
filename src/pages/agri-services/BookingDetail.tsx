import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import {
  ArrowLeft, CheckCircle2, Clock, Circle, AlertTriangle,
  MapPin, CalendarDays, CreditCard, Star, User, Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusSteps = [
  { key: 'pending', label: 'Pending', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'in_progress', label: 'In Progress', icon: Circle },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
];

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { serviceBookings, updateBookingStatus, rateService } = useData();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [showRating, setShowRating] = useState(false);

  const booking = serviceBookings.find(b => b.id === id);

  if (!booking) {
    return (
      <AppLayout>
        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">Booking not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/my-bookings')}>Back</Button>
        </div>
      </AppLayout>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.key === booking.status);
  const isCancelled = booking.status === 'cancelled';
  const isDisputed = booking.status === 'disputed';
  const isCompleted = booking.status === 'completed';

  const handleCancel = () => {
    updateBookingStatus(booking.id, 'cancelled');
    toast.info('Booking cancelled');
  };

  const handleDispute = () => {
    updateBookingStatus(booking.id, 'disputed');
    toast.info('Dispute raised. Our team will contact you.');
  };

  const handleRate = () => {
    if (rating === 0) { toast.error('Please select a rating'); return; }
    rateService(booking.id, rating, review.trim());
    setShowRating(false);
    toast.success('Thank you for your feedback!');
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6 pb-24 space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Booking Details</h1>
        </div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-5"
        >
          <h2 className="font-semibold mb-4">Status</h2>
          {isCancelled ? (
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Booking Cancelled</span>
            </div>
          ) : isDisputed ? (
            <div className="flex items-center gap-2 text-destructive">
              <Flag className="h-5 w-5" />
              <span className="font-medium">Dispute Raised — Under Review</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {statusSteps.map((step, i) => {
                const active = i <= currentStepIndex;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center gap-1 flex-1">
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
                      active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={cn('h-0.5 flex-1', active && i < currentStepIndex ? 'bg-primary' : 'bg-muted')} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {!isCancelled && !isDisputed && (
            <div className="flex justify-between mt-2 text-[9px] text-muted-foreground">
              {statusSteps.map(s => <span key={s.key}>{s.label}</span>)}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold">{booking.serviceName}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-4 w-4" /> {booking.providerName}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" /> {booking.scheduledDate} at {booking.scheduledTime}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {booking.location}
            </div>
            {booking.acres && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="h-4 w-4 text-center text-xs font-bold">A</span> {booking.acres} acres
              </div>
            )}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-2">
          <h2 className="font-semibold flex items-center gap-2"><CreditCard className="h-4 w-4" /> Payment</h2>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Method</span>
            <span className="uppercase font-medium">{booking.paymentMethod}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={cn('font-medium capitalize', booking.paymentStatus === 'paid' ? 'text-primary' : 'text-amber-600')}>
              {booking.paymentStatus}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="font-medium">Total</span>
            <span className="text-xl font-extrabold text-primary">₹{booking.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Rating */}
        {isCompleted && !booking.rating && (
          <div className="space-y-3">
            {!showRating ? (
              <Button variant="outline" className="w-full rounded-xl" onClick={() => setShowRating(true)}>
                <Star className="h-4 w-4 mr-2" /> Rate This Service
              </Button>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
                <h2 className="font-semibold">Rate & Review</h2>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button key={n} onClick={() => setRating(n)}>
                      <Star className={cn('h-8 w-8', n <= rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground')} />
                    </button>
                  ))}
                </div>
                <Textarea
                  placeholder="Write a review (optional)..."
                  value={review}
                  onChange={e => setReview(e.target.value)}
                  maxLength={500}
                  className="rounded-xl"
                />
                <Button className="w-full rounded-xl" onClick={handleRate}>Submit Review</Button>
              </div>
            )}
          </div>
        )}

        {booking.rating && (
          <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(n => (
                <Star key={n} className={cn('h-4 w-4', n <= booking.rating! ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground')} />
              ))}
            </div>
            {booking.review && <p className="text-sm text-muted-foreground flex-1">{booking.review}</p>}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {booking.status === 'pending' && (
            <Button variant="destructive" className="flex-1 rounded-xl" onClick={handleCancel}>
              Cancel Booking
            </Button>
          )}
          {isCompleted && !isDisputed && (
            <Button variant="outline" className="flex-1 rounded-xl" onClick={handleDispute}>
              <Flag className="h-4 w-4 mr-1" /> Raise Dispute
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default BookingDetail;
