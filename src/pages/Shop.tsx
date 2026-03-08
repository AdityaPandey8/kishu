import { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Star, Package, Heart, Zap, Sprout, Bug, Leaf, Wrench, FlaskConical, Pill, ChevronRight, Timer } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

const categoryIcons = [
  { name: 'All', icon: Package, color: 'bg-primary/10 text-primary' },
  { name: 'Fertilizer', icon: Sprout, color: 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400' },
  { name: 'Seeds', icon: Leaf, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
  { name: 'Insecticide', icon: Bug, color: 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400' },
  { name: 'Fungicide', icon: FlaskConical, color: 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400' },
  { name: 'Organic', icon: Leaf, color: 'bg-lime-100 text-lime-600 dark:bg-lime-950 dark:text-lime-400' },
  { name: 'Equipment', icon: Wrench, color: 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
];

const banners = [
  { id: 1, title: 'Kharif Season Sale', subtitle: 'Up to 30% off on Fertilizers', gradient: 'from-primary to-primary/70' },
  { id: 2, title: 'Organic Week', subtitle: 'Premium organic products at best prices', gradient: 'from-emerald-600 to-emerald-400' },
  { id: 3, title: 'Fertilizer Deals', subtitle: 'DAP & Urea at wholesale rates', gradient: 'from-amber-600 to-amber-400' },
  { id: 4, title: 'Pest Control Essentials', subtitle: 'Protect your crops this season', gradient: 'from-red-600 to-red-400' },
];

const Shop = () => {
  const navigate = useNavigate();
  const { products, getCartItemCount, platformUsers, isWishlisted, toggleWishlist } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedBanner, setSelectedBanner] = useState(0);

  const cartItemCount = getCartItemCount();

  // Auto-slide banners
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 3500);
    emblaApi.on('select', () => setSelectedBanner(emblaApi.selectedScrollSnap()));
    return () => clearInterval(interval);
  }, [emblaApi]);

  const getDealerName = (dealerId: string) => {
    const dealer = platformUsers.find(u => u.id === dealerId);
    return dealer?.name || 'Unknown Dealer';
  };

  const getDiscount = () => Math.floor(Math.random() * 15) + 10;

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.stock > 0);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    return filtered;
  }, [products, searchQuery, selectedCategory]);

  const dealOfDay = useMemo(() =>
    [...products].filter(p => p.stock > 0).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6),
    [products]
  );

  const trending = useMemo(() =>
    [...products].filter(p => p.stock > 0).sort((a, b) => b.sales - a.sales).slice(0, 6),
    [products]
  );

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 42, s: 18 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleWishlistClick = useCallback((e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    toggleWishlist(productId);
  }, [toggleWishlist]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-4">
        {/* Sticky Search Bar */}
        <div className="sticky top-0 z-50 bg-primary px-4 py-3 safe-area-inset">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-lg bg-background border-0 h-10"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-primary/80"
              onClick={() => navigate('/wishlist')}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative text-primary-foreground hover:bg-primary/80"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Banner Carousel */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="px-4 pt-4">
            <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
              <div className="flex">
                {banners.map(banner => (
                  <div key={banner.id} className="flex-[0_0_100%] min-w-0">
                    <div className={`bg-gradient-to-r ${banner.gradient} rounded-2xl p-5 h-36 flex flex-col justify-center`}>
                      <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Limited Offer</p>
                      <h2 className="text-white text-xl font-bold mt-1">{banner.title}</h2>
                      <p className="text-white/90 text-sm mt-1">{banner.subtitle}</p>
                      <Button size="sm" className="mt-3 w-fit bg-white text-foreground hover:bg-white/90 rounded-full text-xs h-7 px-4">
                        Shop Now
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-1.5 mt-3">
              {banners.map((_, i) => (
                <div key={i} className={cn('h-1.5 rounded-full transition-all', i === selectedBanner ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30')} />
              ))}
            </div>
          </div>
        )}

        {/* Category Icons */}
        <div className="px-4 pt-4">
          <div className="grid grid-cols-4 gap-3">
            {categoryIcons.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all',
                    selectedCategory === cat.name && 'ring-2 ring-primary bg-primary/5'
                  )}
                >
                  <div className={cn('w-12 h-12 rounded-full flex items-center justify-center', cat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-foreground truncate">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Deal of the Day */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="pt-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                <h2 className="text-lg font-bold text-foreground">Deal of the Day</h2>
              </div>
              <div className="flex items-center gap-1 bg-destructive/10 px-2.5 py-1 rounded-full">
                <Timer className="h-3.5 w-3.5 text-destructive" />
                <span className="text-xs font-bold text-destructive font-mono">
                  {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
                </span>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
              {dealOfDay.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => navigate(`/shop/${product.id}`)}
                  className="flex-shrink-0 w-36 bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
                >
                  <div className="h-28 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                    <Package className="h-10 w-10 text-primary/30" />
                    <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5">
                      {getDiscount()}% OFF
                    </Badge>
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs text-foreground font-medium line-clamp-2 min-h-[32px]">{product.name}</p>
                    <p className="text-sm font-bold text-primary mt-1">₹{product.price}</p>
                    <p className="text-[10px] text-muted-foreground line-through">₹{Math.round(product.price * 1.2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Now */}
        {!searchQuery && selectedCategory === 'All' && (
          <div className="pt-6">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-lg font-bold text-foreground">🔥 Trending Now</h2>
              <button className="text-sm text-primary font-medium flex items-center gap-1" onClick={() => {}}>
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
              {trending.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => navigate(`/shop/${product.id}`)}
                  className="flex-shrink-0 w-44 bg-card border border-border rounded-2xl overflow-hidden cursor-pointer"
                >
                  <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                    <Package className="h-12 w-12 text-primary/30" />
                    <button
                      onClick={(e) => handleWishlistClick(e, product.id)}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 flex items-center justify-center"
                    >
                      <Heart className={cn('h-4 w-4', isWishlisted(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-muted-foreground">{getDealerName(product.dealerId)}</p>
                    <p className="text-sm font-medium text-foreground line-clamp-2 min-h-[36px] mt-0.5">{product.name}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs text-muted-foreground">{product.rating?.toFixed(1)}</span>
                    </div>
                    <p className="text-base font-bold text-foreground mt-1">₹{product.price}</p>
                    <p className="text-[10px] text-primary font-medium mt-0.5">Free Delivery</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Section Title */}
        <div className="px-4 pt-6 pb-2">
          <h2 className="text-lg font-bold text-foreground">
            {selectedCategory !== 'All' ? selectedCategory : 'All Products'}
          </h2>
          <p className="text-xs text-muted-foreground">{filteredProducts.length} products</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 px-4">
          {filteredProducts.map((product, index) => {
            const discount = getDiscount();
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => navigate(`/shop/${product.id}`)}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                  <Package className="h-12 w-12 text-primary/30" />
                  <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5">
                    {discount}% OFF
                  </Badge>
                  <button
                    onClick={(e) => handleWishlistClick(e, product.id)}
                    className="absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 flex items-center justify-center"
                  >
                    <Heart className={cn('h-4 w-4', isWishlisted(product.id) ? 'fill-destructive text-destructive' : 'text-muted-foreground')} />
                  </button>
                  {product.stock < 20 && (
                    <Badge variant="destructive" className="absolute bottom-2 left-2 text-[10px]">
                      Low Stock
                    </Badge>
                  )}
                </div>

                <div className="p-3">
                  <p className="text-[10px] text-muted-foreground truncate">{getDealerName(product.dealerId)}</p>
                  <h3 className="font-medium text-foreground text-sm line-clamp-2 min-h-[36px] mt-0.5">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex items-center gap-0.5 bg-primary/10 px-1.5 py-0.5 rounded">
                      <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                      <span className="text-[10px] font-bold text-primary">{product.rating?.toFixed(1) || '4.0'}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">({product.reviews || 0})</span>
                  </div>

                  <div className="mt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-bold text-foreground text-base">₹{product.price}</span>
                      <span className="text-[10px] text-muted-foreground line-through">₹{Math.round(product.price * (1 + discount / 100))}</span>
                    </div>
                    <p className="text-[10px] text-primary font-medium mt-0.5">Free Delivery</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 px-4">
            <Package className="h-14 w-14 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium text-foreground">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Shop;
