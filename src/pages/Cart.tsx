import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Package } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, products } = useData();

  const cartTotal = getCartTotal();

  // Group cart items by dealer
  const groupedByDealer = cart.reduce((acc, item) => {
    if (!acc[item.dealerId]) {
      acc[item.dealerId] = {
        dealerName: item.dealerName,
        items: [],
      };
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
            <Button onClick={() => navigate('/shop')} className="rounded-xl">
              Browse Products
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container px-4 py-6 pb-40">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">My Cart ({cart.length})</h1>
        </div>

        {/* Cart Items grouped by dealer */}
        <div className="space-y-6">
          {Object.entries(groupedByDealer).map(([dealerId, { dealerName, items }]) => (
            <motion.div
              key={dealerId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* Dealer Header */}
              <div className="bg-muted/50 px-4 py-3 border-b border-border">
                <p className="font-medium text-foreground">{dealerName}</p>
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {items.map(item => {
                  const product = products.find(p => p.id === item.productId);
                  return (
                    <div key={item.productId} className="p-4 flex gap-3">
                      {/* Product Image */}
                      <div className="h-20 w-20 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="h-8 w-8 text-primary/40" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm line-clamp-2">{item.productName}</h3>
                        <p className="text-primary font-bold mt-1">₹{item.price}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 rounded-full"
                              onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-7 w-7 rounded-full"
                              onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                              disabled={product && item.quantity >= product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
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
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Cart;
