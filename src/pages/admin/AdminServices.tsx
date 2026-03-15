import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wrench, Calendar, Search, Star } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

const AdminServices = () => {
  const navigate = useNavigate();
  const { agriServices, serviceBookings } = useData();
  const [tab, setTab] = useState<'services' | 'bookings'>('services');
  const [search, setSearch] = useState('');

  const filteredServices = agriServices.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));
  const filteredBookings = serviceBookings.filter(b => !search || b.serviceName.toLowerCase().includes(search.toLowerCase()) || b.farmerName.toLowerCase().includes(search.toLowerCase()));

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700',
    in_progress: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700', disputed: 'bg-red-100 text-red-700',
  };

  return (
    <AppLayout hideNav>
      <motion.div className="container px-4 py-6 space-y-4 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Services Management</h1>
        </div>

        <div className="flex gap-2">
          <Button variant={tab === 'services' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs" onClick={() => setTab('services')}>
            Services ({agriServices.length})
          </Button>
          <Button variant={tab === 'bookings' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs" onClick={() => setTab('bookings')}>
            <Calendar className="h-3.5 w-3.5 mr-1" /> Bookings ({serviceBookings.length})
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>

        {tab === 'services' && (
          <div className="space-y-3">
            {filteredServices.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex gap-3">
                  <img src={s.image} alt={s.name} className="h-14 w-14 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-sm text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.providerName} • {s.category.replace('-', ' ')}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs">
                      <span className="font-semibold text-foreground">₹{s.price}/{s.priceUnit.replace('_', ' ')}</span>
                      <span className="flex items-center gap-0.5 text-muted-foreground"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />{s.rating}</span>
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

        {tab === 'bookings' && (
          <div className="space-y-3">
            {filteredBookings.map((b, i) => (
              <motion.div key={b.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{b.serviceName}</p>
                    <p className="text-[10px] text-muted-foreground">{b.farmerName} → {b.providerName}</p>
                    <p className="text-[10px] text-muted-foreground">{b.scheduledDate} • ₹{b.totalAmount}</p>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', statusColors[b.status])}>{b.status.replace('_', ' ')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default AdminServices;
