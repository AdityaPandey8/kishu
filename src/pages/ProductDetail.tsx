import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Package, ShoppingCart, Plus, Minus, MapPin, Check, Truck, Shield } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addToCart, getCartItemCount, platformUsers } = useData();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === productId);
  const cartItemCount = getCartItemCount();

  if (!product) {
    return (
      <AppLayout>
        <div className="container px-4 py-6 text-center">
          <p className="text-muted-foreground">Product not found</p>
          <Button onClick={() => navigate('/shop')} className="mt-4">Back to Shop</Button>
        </div>
      </AppLayout>
    );
  }

  const dealer = platformUsers.find(u => u.id === product.dealerId);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    addToCart({
      productId: product.id,
      dealerId: product.dealerId,
      dealerName: dealer?.name || 'Unknown',
      productName: product.name,
      price: product.price,
      quantity,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-foreground">Product Details</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="container px-4 py-6 space-y-6">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl flex items-center justify-center"
          >
            <Package className="h-24 w-24 text-primary/40" />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div>
              <Badge variant="secondary" className="mb-2">{product.category}</Badge>
              <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{product.rating?.toFixed(1) || '4.0'}</span>
                </div>
                <span className="text-muted-foreground">({product.reviews || 0} reviews)</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{product.sales} sold</span>
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">₹{product.price}</span>
              <span className="text-muted-foreground line-through">₹{Math.round(product.price * 1.2)}</span>
              <Badge variant="destructive">20% OFF</Badge>
            </div>

            {/* Dealer Info */}
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{dealer?.name || 'Unknown Dealer'}</p>
                  <p className="text-sm text-muted-foreground">{dealer?.location || 'Location N/A'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 dark:bg-green-950/20 rounded-xl p-3 text-center">
                <Check className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-xs text-green-700 dark:text-green-400">Quality Assured</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-3 text-center">
                <Truck className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                <p className="text-xs text-blue-700 dark:text-blue-400">Fast Delivery</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-950/20 rounded-xl p-3 text-center">
                <Shield className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                <p className="text-xs text-purple-700 dark:text-purple-400">Secure Payment</p>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={product.stock > 20 ? 'text-green-600' : 'text-amber-600'}>
                {product.stock > 20 ? 'In Stock' : `Only ${product.stock} left`}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="font-medium text-foreground">Quantity:</span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 rounded-full"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border p-4 safe-area-inset">
          <div className="container flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-xl"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button 
              className="flex-1 h-12 rounded-xl gradient-kishu shadow-kishu"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetail;
