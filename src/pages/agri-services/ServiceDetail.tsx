import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Star, MapPin, Clock, User, CheckCircle2 } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agriServices } = useData();

  const service = agriServices.find(s => s.id === id);

  if (!service) {
    return (
      <AppLayout>
        <div className="container px-4 py-20 text-center">
          <p className="text-muted-foreground">Service not found</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate('/agri-services')}>Back to Services</Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="pb-24">
        {/* Image Header */}
        <div className="relative h-56 bg-muted">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 bg-background/80 backdrop-blur rounded-full"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="container px-4 -mt-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold">{service.name}</h1>
                <Badge variant="secondary" className="mt-1 capitalize">{service.category.replace('-', ' ')}</Badge>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-sm">{service.rating.toFixed(1)}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Price</p>
                <p className="font-bold text-primary text-lg">₹{service.price}
                  <span className="text-xs text-muted-foreground font-normal">/{service.priceUnit.replace('per_', '')}</span>
                </p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Bookings</p>
                <p className="font-bold text-lg">{service.totalBookings}+</p>
              </div>
            </div>

            {/* Provider Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{service.providerName}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-primary" /> Verified Provider
                </p>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={service.availability ? 'text-primary font-medium' : 'text-destructive'}>
                {service.availability ? 'Available Now' : 'Currently Unavailable'}
              </span>
            </div>
          </motion.div>

          {/* Book Button */}
          <div className="mt-4 px-1">
            <Button
              className="w-full rounded-xl h-12 text-base"
              disabled={!service.availability}
              onClick={() => navigate(`/agri-services/${service.id}/book`)}
            >
              {service.availability ? 'Book Now' : 'Unavailable'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ServiceDetail;
