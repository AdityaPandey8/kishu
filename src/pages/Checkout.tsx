import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, Banknote, Smartphone, Check, Truck } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: Banknote, description: 'Pay when delivered' },
  { id: 'upi', label: 'UPI Payment', icon: Smartphone, description: 'GPay, PhonePe, Paytm' },
  { id: 'online', label: 'Card/Netbanking', icon: CreditCard, description: 'Debit/Credit Card' },
] as const;

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart, placeOrder, addNotification, platformUsers } = useData();
  
  const [address, setAddress] = useState(user?.location || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online' | 'upi'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const cartTotal = getCartTotal();

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  // Group items by dealer
  const ordersByDealer = cart.reduce((acc, item) => {
    if (!acc[item.dealerId]) {
      acc[item.dealerId] = {
        dealerName: item.dealerName,
        items: [],
        total: 0,
      };
    }
    acc[item.dealerId].items.push({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
    });
    acc[item.dealerId].total += item.price * item.quantity;
    return acc;
  }, {} as Record<string, { dealerName: string; items: { productId: string; productName: string; quantity: number; price: number }[]; total: number }>);

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast.error('Please enter delivery address');
      return;
    }

    if (!user) {
      toast.error('Please login to place order');
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create orders for each dealer
    Object.entries(ordersByDealer).forEach(([dealerId, { dealerName, items, total }]) => {
      placeOrder({
        farmerId: user.id,
        dealerId,
        dealerName,
        items,
        totalAmount: total,
        status: 'pending',
        paymentMethod,
        shippingAddress: address,
      });

      // Notify dealer
      addNotification({
        userId: dealerId,
        type: 'order',
        title: 'New Order Received!',
        message: `${user.name} placed an order worth ₹${total}`,
      });
    });

    // Notify farmer
    addNotification({
      userId: user.id,
      type: 'order',
      title: 'Order Placed Successfully!',
      message: `Your order of ₹${cartTotal} has been placed`,
    });

    clearCart();
    setIsProcessing(false);
    toast.success('Order placed successfully!');
    navigate('/orders');
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6 pb-40">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Checkout</h1>
        </div>

        <div className="space-y-6">
          {/* Delivery Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Delivery Address</h2>
            </div>
            <Textarea
              placeholder="Enter your full delivery address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="min-h-[100px] rounded-xl"
            />
          </motion.div>

          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Payment Method</h2>
            </div>
            <div className="space-y-2">
              {paymentMethods.map(method => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border transition-all',
                      paymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      paymentMethod === method.id ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      <Icon className={cn(
                        'h-5 w-5',
                        paymentMethod === method.id ? 'text-primary' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{method.label}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                    {paymentMethod === method.id && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Order Summary</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(ordersByDealer).map(([dealerId, { dealerName, items, total }]) => (
                <div key={dealerId} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-foreground mb-2">{dealerName}</p>
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.productName} x{item.quantity}</span>
                      <span className="text-foreground">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border p-4 safe-area-inset">
        <div className="container">
          <div className="flex items-center justify-between mb-3">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">₹{cartTotal}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-green-600 font-medium">Free</span>
          </div>
          <div className="flex items-center justify-between mb-4 pt-3 border-t border-border">
            <span className="font-semibold text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">₹{cartTotal}</span>
          </div>
          <Button 
            className="w-full h-12 rounded-xl gradient-kishu shadow-kishu"
            onClick={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Checkout;
