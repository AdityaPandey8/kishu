import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Package, ShoppingCart, Plus, Minus, MapPin, Check, Truck, Shield, Heart, Share2, Tag, CreditCard, ChevronRight, Zap } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addToCart, getCartItemCount, platformUsers, isWishlisted, toggleWishlist } = useData();
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState('');

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
  const discount = 20;
  const mrp = Math.round(product.price * 1.25);
  const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 6);

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

  const checkPincode = () => {
    if (pincode.length === 6) {
      setDeliveryInfo('Delivery by Mon, Mar 15 | Free ₹0');
    } else {
      setDeliveryInfo('Enter valid 6-digit pincode');
    }
  };

  // Rating distribution mock
  const ratingBars = [
    { stars: 5, pct: 60 },
    { stars: 4, pct: 25 },
    { stars: 3, pct: 10 },
    { stars: 2, pct: 3 },
    { stars: 1, pct: 2 },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => toggleWishlist(product.id)}>
                <Heart className={cn('h-5 w-5', isWishlisted(product.id) ? 'fill-destructive text-destructive' : '')} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/cart')} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => toast.success('Link copied!')}>
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="container px-4 py-4 space-y-5">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-72 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center relative"
          >
            <Package className="h-28 w-28 text-primary/30" />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className={cn('h-1.5 rounded-full', i === 0 ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30')} />
              ))}
            </div>
          </motion.div>

          {/* Category + Name */}
          <div>
            <Badge variant="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="text-xl font-bold text-foreground">{product.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 bg-primary px-2 py-0.5 rounded">
                <span className="text-xs font-bold text-primary-foreground">{product.rating?.toFixed(1) || '4.0'}</span>
                <Star className="h-3 w-3 fill-primary-foreground text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">{product.reviews || 0} Ratings & Reviews</span>
            </div>
          </div>

          {/* Price */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">₹{product.price}</span>
              <span className="text-sm text-muted-foreground line-through">₹{mrp}</span>
              <span className="text-sm font-semibold text-primary">{discount}% off</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">inclusive of all taxes</p>
          </div>

          {/* Offers */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" /> Available Offers
            </h3>
            <div className="space-y-2">
              {[
                'Bank Offer: 10% off on SBI Credit Card, up to ₹500 on orders above ₹2000',
                'Partner Offer: Sign up for Kishu Pay & get ₹100 cashback',
                'Combo Offer: Buy 2 or more, get 5% extra discount',
              ].map((offer, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground">{offer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Check */}
          <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Truck className="h-4 w-4" /> Delivery
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="flex-1 rounded-lg"
              />
              <Button variant="outline" onClick={checkPincode} className="text-primary font-semibold">
                Check
              </Button>
            </div>
            {deliveryInfo && (
              <p className={cn('text-sm', deliveryInfo.includes('Mon') ? 'text-primary font-medium' : 'text-destructive')}>
                {deliveryInfo}
              </p>
            )}
          </div>

          {/* Seller Info */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-foreground mb-3">Seller</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{dealer?.name || 'Unknown Dealer'}</p>
                  <p className="text-xs text-muted-foreground">{dealer?.location || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-xs font-bold text-primary">4.5</span>
              </div>
            </div>
          </div>

          {/* Description / Highlights */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Highlights</h3>
            <ul className="space-y-1.5">
              {product.description.split('. ').filter(Boolean).map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  {line.trim().replace(/\.$/, '')}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                Quality assured product
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <Check className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-foreground font-medium">Genuine</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <Truck className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-foreground font-medium">Free Delivery</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center">
              <Shield className="h-5 w-5 text-primary mx-auto mb-1" />
              <p className="text-xs text-foreground font-medium">Secure Pay</p>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <h3 className="font-semibold text-foreground mb-3">Ratings & Reviews</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-foreground">{product.rating?.toFixed(1) || '4.0'}</p>
                <div className="flex gap-0.5 justify-center mt-1">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={cn('h-3.5 w-3.5', s <= Math.round(product.rating || 4) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{product.reviews || 0} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {ratingBars.map(bar => (
                  <div key={bar.stars} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4">{bar.stars}</span>
                    <Star className="h-3 w-3 text-muted-foreground/50" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${bar.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-7">{bar.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="font-medium text-foreground">Quantity:</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className={cn('text-sm', product.stock > 20 ? 'text-primary' : 'text-destructive')}>
              {product.stock > 20 ? 'In Stock' : `Only ${product.stock} left`}
            </span>
          </div>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center justify-between">
                Similar Products
                <button className="text-sm text-primary font-medium flex items-center gap-1">
                  View All <ChevronRight className="h-4 w-4" />
                </button>
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {similarProducts.map(p => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/shop/${p.id}`)}
                    className="flex-shrink-0 w-36 bg-card border border-border rounded-xl overflow-hidden cursor-pointer"
                  >
                    <div className="h-24 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Package className="h-8 w-8 text-primary/30" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground line-clamp-2">{p.name}</p>
                      <p className="text-sm font-bold text-foreground mt-1">₹{p.price}</p>
                      <div className="flex items-center gap-0.5 mt-0.5">
                        <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                        <span className="text-[10px] text-muted-foreground">{p.rating?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="fixed bottom-16 left-0 right-0 bg-background border-t border-border safe-area-inset z-40">
          <div className="container flex">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-secondary text-secondary-foreground font-semibold border-r border-border"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 gradient-kishu text-primary-foreground font-semibold"
            >
              <Zap className="h-5 w-5" />
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProductDetail;
