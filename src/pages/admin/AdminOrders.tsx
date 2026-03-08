import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '@/components/layout/AppLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30', icon: CheckCircle },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700 dark:bg-green-900/30', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

const AdminOrders = () => {
  const { i18n } = useTranslation();
  const { orders, updateOrderStatus } = useData();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filters = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  const filtered = orders
    .filter(o => filter === 'all' || o.status === filter)
    .filter(o => !search || o.farmerName.toLowerCase().includes(search.toLowerCase()) || o.dealerName.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <motion.div className="container px-4 py-6 space-y-4 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold text-foreground">{isHindi ? 'सभी ऑर्डर' : 'All Orders'}</h1>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length} orders</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or order ID..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {filters.map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" className="rounded-full capitalize text-xs flex-shrink-0" onClick={() => setFilter(f)}>
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No orders found</p>
            </div>
          )}
          {filtered.map((order, i) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const StatusIcon = sc.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.createdAt}</p>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1', sc.color)}>
                    <StatusIcon className="h-3 w-3" /> {sc.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-muted-foreground">Buyer</p>
                    <p className="font-medium text-foreground">{order.farmerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dealer</p>
                    <p className="font-medium text-foreground">{order.dealerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Items</p>
                    <p className="font-medium text-foreground">{order.items.length} items</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium text-foreground">₹{order.totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Payment:</span>
                  <span className="uppercase font-medium text-foreground">{order.paymentMethod}</span>
                </div>

                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="destructive" className="text-xs rounded-lg flex-1" onClick={() => updateOrderStatus(order.id, 'cancelled')}>
                      Cancel
                    </Button>
                    {order.status === 'pending' && (
                      <Button size="sm" className="text-xs rounded-lg flex-1" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                        Confirm
                      </Button>
                    )}
                    {order.status === 'confirmed' && (
                      <Button size="sm" className="text-xs rounded-lg flex-1" onClick={() => updateOrderStatus(order.id, 'shipped')}>
                        Ship
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button size="sm" className="text-xs rounded-lg flex-1" onClick={() => updateOrderStatus(order.id, 'delivered')}>
                        Deliver
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default AdminOrders;
