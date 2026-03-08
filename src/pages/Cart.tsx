import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Package, Tag, ChevronDown, ChevronUp, Shield, Truck, RotateCcw } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, products } = useData();
  const [couponCode, setCouponCode] = useState('');
  const [couponOpen, setCouponOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const cartTotal = getCartTotal();
  const mrpTotal = Math.round(cartTotal * 1.25);
  const discount = mrpTotal - cartTotal;
  const deliveryCharge = cartTotal > 500 ? 0 : 40;
  const finalTotal = cartTotal + deliveryCharge - (appliedCoupon ? 50 : 0);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'KISHU50') {
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success('Coupon applied! ₹50 off');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  // Group by dealer
  const groupedByDealer = cart.reduce((acc, item) => {
    if (!acc[item.dealerId]) {
      acc[item.dealerId] = { dealerName: item.dealerName, items: [] };
    }
    acc[item.dealerId].items.push(item);
    return acc;
  }, {} as Record<string, { dealerName: string; items: typeof cart }>);

  if (cart.length === 0) {
    return (
      <AppLayout>
        <div className="container px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">My Cart</h1>
          </div>
          <div className="text-center py-20">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Explore products and add them to your cart</p>
            <Button onClick={() => navigate('/shop')} className="rounded-xl gradient-kishu shadow-kishu">
              Browse Products
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-muted/30 pb-44">
        {/* Header */}
        <div className="bg-background border-b border-border sticky top-0 z-40">
          <div className="container px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-foreground">My Cart ({cart.length})</h1>
          </div>

          {/* Step Indicator */}
          <div className="container px-4 pb-3">
            <div className="flex items-center justify-center gap-0">
              {['Cart', 'Address', 'Payment'].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
                    i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}>
                    <span className="w-4 h-4 rounded-full bg-background/20 flex items-center justify-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    {step}
                  </div>
                  {i < 2 && <div className="w-6 h-px bg-border mx-1" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container px-4 py-4 space-y-3">
          {/* Coupon Section */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <button
              onClick={() => setCouponOpen(!couponOpen)}
              className="w-full flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {appliedCoupon ? `Coupon "${appliedCoupon}" applied` : 'Apply Coupon'}
                </span>
              </div>
              {couponOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {couponOpen && (
              <div className="px-4 pb-4 flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 rounded-lg"
                />
                <Button onClick={applyCoupon} className="rounded-lg">Apply</Button>
              </div>
            )}
          </div>

          {/* Cart Items by Dealer */}
          {Object.entries(groupedByDealer).map(([dealerId, { dealerName, items }]) => (
            <motion.div
              key={dealerId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              <div className="bg-muted/50 px-4 py-2.5 border-b border-border flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{dealerName}</p>
              </div>

              <div className="divide-y divide-border">
                {items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  const mrp = Math.round(item.price * 1.25);
                  return (
                    <div key={item.productId} className="p-4">
                      <div className="flex gap-3">
                        <div className="h-20 w-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="h-8 w-8 text-primary/30" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground text-sm line-clamp-2">{item.productName}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">Seller: {item.dealerName}</p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="font-bold text-foreground">₹{item.price}</span>
                            <span className="text-xs text-muted-foreground line-through">₹{mrp}</span>
                            <span className="text-xs text-primary font-medium">20% off</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            className="px-2.5 py-1.5 text-muted-foreground hover:bg-muted"
                            onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-4 py-1.5 text-sm font-medium border-x border-border bg-background">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2.5 py-1.5 text-muted-foreground hover:bg-muted disabled:opacity-50"
                            onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                            disabled={product && item.quantity >= product.stock}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-xs text-muted-foreground hover:text-destructive font-medium uppercase tracking-wide"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Assurance Section */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="flex flex-col items-center gap-1">
                <Shield className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground font-medium">Safe & Secure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground font-medium">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-[10px] text-muted-foreground font-medium">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Price Details */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">
              Price Details ({cart.length} {cart.length === 1 ? 'Item' : 'Items'})
            </h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total MRP</span>
                <span className="text-foreground">₹{mrpTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount on MRP</span>
                <span className="text-primary font-medium">-₹{discount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Coupon Discount</span>
                  <span className="text-primary font-medium">-₹50</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Charge</span>
                <span className={deliveryCharge === 0 ? 'text-primary font-medium' : 'text-foreground'}>
                  {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="border-t border-border pt-2.5 flex justify-between">
                <span className="font-bold text-foreground">Total Amount</span>
                <span className="font-bold text-foreground">₹{finalTotal}</span>
              </div>
            </div>
            {discount > 0 && (
              <div className="mt-3 bg-primary/10 rounded-lg p-2.5 text-center">
                <span className="text-sm text-primary font-semibold">You will save ₹{discount + (appliedCoupon ? 50 : 0)} on this order</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Fixed */}
        <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border safe-area-inset z-40">
          <div className="container px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xl font-bold text-foreground">₹{finalTotal}</p>
              <button className="text-xs text-primary font-medium">View price details</button>
            </div>
            <Button
              className="h-12 px-8 rounded-xl gradient-kishu shadow-kishu text-base font-semibold"
              onClick={() => navigate('/checkout')}
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Cart;
