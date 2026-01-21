import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Star, Package, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

const categories = ['All', 'Fertilizer', 'Fungicide', 'Insecticide', 'Organic', 'Seeds', 'Equipment'];

const Shop = () => {
  const navigate = useNavigate();
  const { products, getCartItemCount, platformUsers } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating' | 'popular'>('popular');

  const cartItemCount = getCartItemCount();

  // Get dealer names for products
  const getDealerName = (dealerId: string) => {
    const dealer = platformUsers.find(u => u.id === dealerId);
    return dealer?.name || 'Unknown Dealer';
  };

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

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy]);

  return (
    <AppLayout>
      <div className="container px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Shop</h1>
            <p className="text-sm text-muted-foreground">Buy quality agri products</p>
          </div>
          <Button 
            variant="outline" 
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

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              className="flex-shrink-0 rounded-full"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Sort Options */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { value: 'popular', label: 'Popular' },
            { value: 'price-low', label: 'Price: Low' },
            { value: 'price-high', label: 'Price: High' },
            { value: 'rating', label: 'Top Rated' },
          ].map(option => (
            <Badge
              key={option.value}
              variant={sortBy === option.value ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSortBy(option.value as typeof sortBy)}
            >
              {option.label}
            </Badge>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/shop/${product.id}`)}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Product Image Placeholder */}
              <div className="h-28 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center relative">
                <Package className="h-12 w-12 text-primary/40" />
                {product.stock < 20 && (
                  <Badge variant="destructive" className="absolute top-2 left-2 text-xs">
                    Low Stock
                  </Badge>
                )}
              </div>

              <div className="p-3">
                <p className="text-xs text-muted-foreground truncate">{getDealerName(product.dealerId)}</p>
                <h3 className="font-medium text-foreground text-sm line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-muted-foreground">
                    {product.rating?.toFixed(1) || '4.0'} ({product.reviews || 0})
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-foreground">₹{product.price}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Shop;
