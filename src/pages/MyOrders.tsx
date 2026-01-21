import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Truck, Check, Clock, X, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmed', icon: Check, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  shipped: { label: 'Shipped', icon: Truck, color: 'bg-purple-100 text-purple-700 border-purple-200' },
  delivered: { label: 'Delivered', icon: Check, color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Cancelled', icon: X, color: 'bg-red-100 text-red-700 border-red-200' },
};

const MyOrders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getOrdersByFarmer } = useData();

  const orders = user ? getOrdersByFarmer(user.id) : [];

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button onClick={() => navigate('/shop')} className="rounded-xl">
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Order #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <Badge className={cn('border', status.color)}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.label}
                      </Badge>
                    </div>
                    <p className="font-medium text-foreground">{order.dealerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm a')}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-2 mb-3">
                      {order.items.slice(0, 2).map(item => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.productName} x{item.quantity}
                          </span>
                          <span className="text-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-sm text-muted-foreground">
                          +{order.items.length - 2} more items
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="font-bold text-foreground">₹{order.totalAmount}</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  {order.status !== 'cancelled' && (
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-2">
                        {['pending', 'confirmed', 'shipped', 'delivered'].map((step, i) => {
                          const stepIndex = ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(order.status);
                          const isCompleted = i <= stepIndex;
                          const isCurrent = i === stepIndex;
                          
                          return (
                            <div key={step} className="flex-1 flex items-center gap-2">
                              <div className={cn(
                                'h-2 w-2 rounded-full',
                                isCompleted ? 'bg-primary' : 'bg-muted'
                              )} />
                              {i < 3 && (
                                <div className={cn(
                                  'flex-1 h-0.5',
                                  isCompleted && i < stepIndex ? 'bg-primary' : 'bg-muted'
                                )} />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MyOrders;
