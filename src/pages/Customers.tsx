import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Users, Search, Filter, Star, Phone, MapPin,
  MessageSquare, Grid, List, Plus, UserPlus
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  vip: 'bg-amber-100 text-amber-700',
};

const Customers = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { customers, toggleFavoriteCustomer, addCustomer } = useData();
  const isHindi = i18n.language === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'vip' | 'favorites'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    farmerName: '',
    phone: '',
    email: '',
    location: '',
  });

  const dealerCustomers = customers.filter(c => c.dealerId === user?.id);

  const filteredCustomers = useMemo(() => {
    return dealerCustomers.filter(c => {
      const matchesSearch = c.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery);
      
      if (activeFilter === 'favorites') return matchesSearch && c.isFavorite;
      if (activeFilter === 'vip') return matchesSearch && c.status === 'vip';
      if (activeFilter === 'active') return matchesSearch && c.status === 'active';
      return matchesSearch;
    });
  }, [dealerCustomers, searchQuery, activeFilter]);

  const filters = [
    { id: 'all', label: isHindi ? 'सभी' : 'All', count: dealerCustomers.length },
    { id: 'vip', label: 'VIP', count: dealerCustomers.filter(c => c.status === 'vip').length },
    { id: 'active', label: isHindi ? 'सक्रिय' : 'Active', count: dealerCustomers.filter(c => c.status === 'active').length },
    { id: 'favorites', label: isHindi ? 'पसंदीदा' : 'Favorites', count: dealerCustomers.filter(c => c.isFavorite).length },
  ];

  const handleAddCustomer = () => {
    if (!newCustomer.farmerName.trim() || !newCustomer.phone.trim()) {
      toast.error(isHindi ? 'कृपया नाम और फ़ोन दर्ज करें' : 'Please enter name and phone');
      return;
    }

    addCustomer({
      farmerId: `f${Date.now()}`,
      dealerId: user?.id || '',
      farmerName: newCustomer.farmerName,
      phone: newCustomer.phone,
      email: newCustomer.email,
      location: newCustomer.location,
      crops: [],
      status: 'active',
      isFavorite: false,
    });

    toast.success(isHindi ? 'ग्राहक जोड़ा गया' : 'Customer added');
    setIsAddDialogOpen(false);
    setNewCustomer({ farmerName: '', phone: '', email: '', location: '' });
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {isHindi ? 'ग्राहक' : 'Customers'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {dealerCustomers.length} {isHindi ? 'ग्राहक' : 'customers'}
              </p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gradient-kishu shadow-kishu">
                <UserPlus className="h-4 w-4 mr-1" />
                {isHindi ? 'जोड़ें' : 'Add'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{isHindi ? 'नया ग्राहक जोड़ें' : 'Add New Customer'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder={isHindi ? 'ग्राहक का नाम *' : 'Customer name *'}
                  value={newCustomer.farmerName}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, farmerName: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  placeholder={isHindi ? 'फोन नंबर *' : 'Phone number *'}
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  placeholder={isHindi ? 'ईमेल (वैकल्पिक)' : 'Email (optional)'}
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  className="rounded-xl"
                />
                <Input
                  placeholder={isHindi ? 'स्थान' : 'Location'}
                  value={newCustomer.location}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, location: e.target.value }))}
                  className="rounded-xl"
                />
                <Button 
                  className="w-full rounded-xl gradient-kishu shadow-kishu"
                  onClick={handleAddCustomer}
                >
                  {isHindi ? 'ग्राहक जोड़ें' : 'Add Customer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'ग्राहक खोजें...' : 'Search customers...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </motion.div>

        {/* Filters & View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 flex-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as typeof activeFilter)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1',
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                {filter.label}
                <span className="opacity-70">({filter.count})</span>
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 rounded-lg', viewMode === 'list' && 'bg-muted')}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn('h-8 w-8 rounded-lg', viewMode === 'grid' && 'bg-muted')}
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Customer List */}
        {filteredCustomers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Users className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">
              {isHindi ? 'कोई ग्राहक नहीं मिला' : 'No customers found'}
            </p>
          </motion.div>
        ) : (
          <div className={cn(
            viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'
          )}>
            <AnimatePresence mode="popLayout">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => navigate(`/customers/${customer.id}`)}
                  className={cn(
                    'bg-card border border-border rounded-xl p-4 shadow-soft cursor-pointer hover:border-primary/30 transition-colors',
                    viewMode === 'grid' && 'flex flex-col'
                  )}
                >
                  <div className={cn(
                    'flex items-start gap-3',
                    viewMode === 'grid' && 'flex-col items-center text-center'
                  )}>
                    {/* Avatar */}
                    <div className="relative">
                      <div className={cn(
                        'rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground font-semibold',
                        viewMode === 'grid' ? 'h-14 w-14 text-lg' : 'h-12 w-12'
                      )}>
                        {customer.farmerName.charAt(0)}
                      </div>
                      {customer.isFavorite && (
                        <Star className="absolute -top-1 -right-1 h-4 w-4 fill-amber-400 text-amber-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className={cn('flex-1 min-w-0', viewMode === 'grid' && 'w-full')}>
                      <div className="flex items-center gap-2 justify-between">
                        <h3 className="font-medium text-foreground text-sm truncate">
                          {customer.farmerName}
                        </h3>
                        {viewMode === 'list' && (
                          <span className={cn(
                            'px-2 py-0.5 rounded-full text-[10px] font-medium uppercase',
                            statusColors[customer.status]
                          )}>
                            {customer.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        {customer.location}
                      </p>
                      {viewMode === 'list' && (
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {customer.totalInquiries} {isHindi ? 'पूछताछ' : 'inquiries'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {customer.totalPurchases} {isHindi ? 'खरीद' : 'purchases'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions - Only for list view */}
                    {viewMode === 'list' && (
                      <div className="flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-green-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `tel:${customer.phone}`;
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteCustomer(customer.id);
                          }}
                        >
                          <Star className={cn(
                            'h-4 w-4',
                            customer.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                          )} />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Grid view status badge */}
                  {viewMode === 'grid' && (
                    <span className={cn(
                      'mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase self-center',
                      statusColors[customer.status]
                    )}>
                      {customer.status}
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Customers;
