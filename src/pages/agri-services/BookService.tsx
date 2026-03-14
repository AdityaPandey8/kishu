import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, CalendarDays, Clock, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const paymentMethods = [
  { key: 'upi' as const, label: 'UPI' },
  { key: 'online' as const, label: 'Online' },
  { key: 'cod' as const, label: 'Cash on Delivery' },
];

const BookService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agriServices, addServiceBooking } = useData();
  const { user } = useAuth();

  const service = agriServices.find(s => s.id === id);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [acres, setAcres] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | 'upi'>('upi');

  if (!service) {
    return (
      <AppLayout>
        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">Service not found</p>
        </div>
      </AppLayout>
    );
  }

  const acresNum = parseFloat(acres) || 1;
  const totalAmount = service.priceUnit === 'per_acre' ? service.price * acresNum : service.price;

  const handleSubmit = () => {
    if (!date || !time || !location.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    addServiceBooking({
      serviceId: service.id,
      serviceName: service.name,
      category: service.category,
      farmerId: user?.id || 'farmer-001',
      farmerName: user?.name || 'Farmer',
      providerId: service.providerId,
      providerName: service.providerName,
      status: 'pending',
      scheduledDate: date,
      scheduledTime: time,
      location: location.trim(),
      acres: acresNum,
      totalAmount,
      paymentStatus: 'pending',
      paymentMethod,
    });

    toast.success('Booking confirmed! Provider will contact you soon.');
    navigate('/my-bookings');
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6 pb-24 space-y-5">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Book Service</h1>
        </div>

        {/* Service Summary */}
        <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
          <img src={service.image} alt={service.name} className="h-16 w-16 rounded-xl object-cover" />
          <div>
            <p className="font-semibold">{service.name}</p>
            <p className="text-sm text-muted-foreground">{service.providerName}</p>
            <p className="text-sm font-bold text-primary">₹{service.price}/{service.priceUnit.replace('per_', '')}</p>
          </div>
        </div>

        {/* Booking Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs"><CalendarDays className="h-3.5 w-3.5" /> Date *</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs"><Clock className="h-3.5 w-3.5" /> Time *</Label>
              <Input type="time" value={time} onChange={e => setTime(e.target.value)} className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs"><MapPin className="h-3.5 w-3.5" /> Location *</Label>
            <Input
              placeholder="Village, District, State"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="rounded-xl"
              maxLength={200}
            />
          </div>

          {(service.priceUnit === 'per_acre') && (
            <div className="space-y-1.5">
              <Label className="text-xs">Number of Acres</Label>
              <Input
                type="number"
                min="0.5"
                step="0.5"
                placeholder="e.g. 5"
                value={acres}
                onChange={e => setAcres(e.target.value)}
                className="rounded-xl"
              />
            </div>
          )}

          {/* Payment Method */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5 text-xs"><CreditCard className="h-3.5 w-3.5" /> Payment Method</Label>
            <div className="flex gap-2">
              {paymentMethods.map(pm => (
                <Button
                  key={pm.key}
                  variant={paymentMethod === pm.key ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full flex-1"
                  onClick={() => setPaymentMethod(pm.key)}
                >
                  {pm.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center justify-between">
          <span className="font-medium">Total Amount</span>
          <span className="text-2xl font-extrabold text-primary">₹{totalAmount.toLocaleString()}</span>
        </div>

        <Button className="w-full rounded-xl h-12 text-base" onClick={handleSubmit}>
          Confirm Booking
        </Button>
      </div>
    </AppLayout>
  );
};

export default BookService;
