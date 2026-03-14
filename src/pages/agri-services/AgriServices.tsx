import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import {
  Search, Star, Tractor, FlaskConical, Bug, Users, Wrench,
  MapPin, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const categories = [
  { key: 'all', label: 'All', icon: Wrench },
  { key: 'equipment-rental', label: 'Equipment', icon: Tractor },
  { key: 'soil-testing', label: 'Soil Testing', icon: FlaskConical },
  { key: 'spraying', label: 'Spraying', icon: Bug },
  { key: 'harvesting', label: 'Harvesting', icon: Users },
] as const;

const AgriServices = () => {
  const navigate = useNavigate();
  const { agriServices } = useData();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filtered = agriServices.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AppLayout>
      <div className="container px-4 py-6 pb-24 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Agri Services</h1>
            <p className="text-sm text-muted-foreground">Book farm services on-demand</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-10 rounded-xl"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(c => {
            const Icon = c.icon;
            const active = activeCategory === c.key;
            return (
              <Button
                key={c.key}
                variant={active ? 'default' : 'outline'}
                size="sm"
                className="rounded-full flex-shrink-0 gap-1.5"
                onClick={() => setActiveCategory(c.key)}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.label}
              </Button>
            );
          })}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/agri-services/${service.id}`)}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="h-36 bg-muted relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {!service.availability && (
                  <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                    <Badge variant="secondary">Unavailable</Badge>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight">{service.name}</h3>
                  <div className="flex items-center gap-0.5 text-xs text-amber-600 flex-shrink-0">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    {service.rating.toFixed(1)}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-primary">
                    ₹{service.price}
                    <span className="text-[10px] text-muted-foreground font-normal ml-1">
                      /{service.priceUnit.replace('per_', '').replace('_', ' ')}
                    </span>
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {service.totalBookings} bookings
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Wrench className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No services found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AgriServices;
