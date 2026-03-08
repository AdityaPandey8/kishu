import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, ShoppingCart, Package, Star, Trash2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getWishlistProducts, toggleWishlist, addToCart, platformUsers } = useData();

  const wishlistProducts = getWishlistProducts();

  const getDealerName = (dealerId: string) => {
    const dealer = platformUsers.find(u => u.id === dealerId);
    return dealer?.name || 'Unknown Dealer';
  };

  const handleMoveToCart = (product: typeof wishlistProducts[0]) => {
    if (!user) {
      toast.error('Please login first');
      navigate('/auth');
      return;
    }
    addToCart({
      productId: product.id,
      dealerId: product.dealerId,
      dealerName: getDealerName(product.dealerId),
      productName: product.name,
      price: product.price,
      quantity: 1,
    });
    toggleWishlist(product.id);
    toast.success('Moved to cart!');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">My Wishlist ({wishlistProducts.length})</h1>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-6">Save products you love to buy later</p>
              <Button onClick={() => navigate('/shop')} className="rounded-xl gradient-kishu shadow-kishu">
                Browse Products
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card border border-border rounded-2xl p-4 flex gap-3"
                >
                  <div
                    className="h-24 w-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/shop/${product.id}`)}
                  >
                    <Package className="h-10 w-10 text-primary/30" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">{getDealerName(product.dealerId)}</p>
                    <h3 className="font-medium text-foreground text-sm line-clamp-2 cursor-pointer" onClick={() => navigate(`/shop/${product.id}`)}>
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{product.rating?.toFixed(1) || '4.0'}</span>
                    </div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold text-foreground">₹{product.price}</span>
                      <span className="text-xs text-muted-foreground line-through">₹{Math.round(product.price * 1.25)}</span>
                      <span className="text-xs text-primary font-medium">20% off</span>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        className="rounded-lg gradient-kishu text-xs h-8 flex-1"
                        onClick={() => handleMoveToCart(product)}
                      >
                        <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                        Move to Cart
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg h-8"
                        onClick={() => toggleWishlist(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Wishlist;
