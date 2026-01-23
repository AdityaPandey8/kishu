import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Star, TrendingUp, TrendingDown, 
  Filter, Bell, ChevronDown, MapPin
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CropPrice {
  id: string;
  cropName: string;
  cropNameHi: string;
  category: 'grains' | 'vegetables' | 'fruits' | 'pulses' | 'oilseeds';
  price: number;
  previousPrice: number;
  unit: 'kg' | 'quintal' | 'ton';
  mandi: string;
  state: string;
  updatedAt: string;
}

const mockCropPrices: CropPrice[] = [
  { id: 'cp1', cropName: 'Wheat', cropNameHi: 'गेहूं', category: 'grains', price: 2250, previousPrice: 2200, unit: 'quintal', mandi: 'Azadpur', state: 'Delhi', updatedAt: new Date().toISOString() },
  { id: 'cp2', cropName: 'Rice (Basmati)', cropNameHi: 'बासमती चावल', category: 'grains', price: 3100, previousPrice: 3150, unit: 'quintal', mandi: 'Karnal', state: 'Haryana', updatedAt: new Date().toISOString() },
  { id: 'cp3', cropName: 'Tomato', cropNameHi: 'टमाटर', category: 'vegetables', price: 45, previousPrice: 42, unit: 'kg', mandi: 'Azadpur', state: 'Delhi', updatedAt: new Date().toISOString() },
  { id: 'cp4', cropName: 'Onion', cropNameHi: 'प्याज', category: 'vegetables', price: 32, previousPrice: 35, unit: 'kg', mandi: 'Lasalgaon', state: 'Maharashtra', updatedAt: new Date().toISOString() },
  { id: 'cp5', cropName: 'Potato', cropNameHi: 'आलू', category: 'vegetables', price: 22, previousPrice: 20, unit: 'kg', mandi: 'Agra', state: 'Uttar Pradesh', updatedAt: new Date().toISOString() },
  { id: 'cp6', cropName: 'Chana (Gram)', cropNameHi: 'चना', category: 'pulses', price: 5200, previousPrice: 5100, unit: 'quintal', mandi: 'Indore', state: 'Madhya Pradesh', updatedAt: new Date().toISOString() },
  { id: 'cp7', cropName: 'Soybean', cropNameHi: 'सोयाबीन', category: 'oilseeds', price: 4800, previousPrice: 4750, unit: 'quintal', mandi: 'Indore', state: 'Madhya Pradesh', updatedAt: new Date().toISOString() },
  { id: 'cp8', cropName: 'Mustard', cropNameHi: 'सरसों', category: 'oilseeds', price: 5500, previousPrice: 5400, unit: 'quintal', mandi: 'Jaipur', state: 'Rajasthan', updatedAt: new Date().toISOString() },
  { id: 'cp9', cropName: 'Apple', cropNameHi: 'सेब', category: 'fruits', price: 120, previousPrice: 110, unit: 'kg', mandi: 'Shimla', state: 'Himachal Pradesh', updatedAt: new Date().toISOString() },
  { id: 'cp10', cropName: 'Mango', cropNameHi: 'आम', category: 'fruits', price: 80, previousPrice: 85, unit: 'kg', mandi: 'Lucknow', state: 'Uttar Pradesh', updatedAt: new Date().toISOString() },
  { id: 'cp11', cropName: 'Cotton', cropNameHi: 'कपास', category: 'oilseeds', price: 6500, previousPrice: 6300, unit: 'quintal', mandi: 'Rajkot', state: 'Gujarat', updatedAt: new Date().toISOString() },
  { id: 'cp12', cropName: 'Maize', cropNameHi: 'मक्का', category: 'grains', price: 1900, previousPrice: 1850, unit: 'quintal', mandi: 'Davangere', state: 'Karnataka', updatedAt: new Date().toISOString() },
];

const categories = [
  { id: 'all', label: 'All', labelHi: 'सभी' },
  { id: 'grains', label: 'Grains', labelHi: 'अनाज' },
  { id: 'vegetables', label: 'Vegetables', labelHi: 'सब्जियां' },
  { id: 'fruits', label: 'Fruits', labelHi: 'फल' },
  { id: 'pulses', label: 'Pulses', labelHi: 'दालें' },
  { id: 'oilseeds', label: 'Oilseeds', labelHi: 'तिलहन' },
];

const states = ['All States', 'Delhi', 'Haryana', 'Maharashtra', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Karnataka', 'Himachal Pradesh'];

const MarketPricesPage = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { trackedCrops, trackCrop, untrackCrop, isTrackedCrop } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedState, setSelectedState] = useState('All States');
  const [showStateFilter, setShowStateFilter] = useState(false);

  const filteredPrices = mockCropPrices.filter(crop => {
    const matchesSearch = crop.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.cropNameHi.includes(searchQuery);
    const matchesCategory = activeCategory === 'all' || crop.category === activeCategory;
    const matchesState = selectedState === 'All States' || crop.state === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const handleTrackCrop = (crop: CropPrice) => {
    if (!user) {
      toast.error(isHindi ? 'कृपया पहले लॉगिन करें' : 'Please login first');
      navigate('/login');
      return;
    }
    
    if (isTrackedCrop(crop.id)) {
      untrackCrop(crop.id);
      toast.success(isHindi ? 'ट्रैकिंग बंद' : 'Stopped tracking');
    } else {
      trackCrop({
        cropId: crop.id,
        cropName: crop.cropName,
        userId: user.id,
        alertEnabled: true,
      });
      toast.success(isHindi ? 'ट्रैक हो रहा है' : 'Now tracking');
    }
  };

  const getPriceChange = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return change.toFixed(1);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {isHindi ? 'मंडी भाव' : 'Market Prices'}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {user?.location || 'All India'}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'फसल खोजें...' : 'Search crops...'}
              className="h-12 pl-10 pr-4 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl flex items-center gap-2"
              onClick={() => setShowStateFilter(!showStateFilter)}
            >
              <Filter className="h-4 w-4" />
              {selectedState === 'All States' ? (isHindi ? 'राज्य' : 'State') : selectedState}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {showStateFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap gap-2"
            >
              {states.map((state) => (
                <Button
                  key={state}
                  variant={selectedState === state ? 'default' : 'outline'}
                  size="sm"
                  className="rounded-full"
                  onClick={() => {
                    setSelectedState(state);
                    setShowStateFilter(false);
                  }}
                >
                  {state}
                </Button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide"
        >
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              className="rounded-full whitespace-nowrap"
              onClick={() => setActiveCategory(cat.id)}
            >
              {isHindi ? cat.labelHi : cat.label}
            </Button>
          ))}
        </motion.div>

        {/* Tracked Crops Banner */}
        {trackedCrops.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/10 border border-primary/20 rounded-xl p-3 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-medium text-foreground">
                  {isHindi ? `${trackedCrops.length} फसलें ट्रैक हो रही हैं` : `Tracking ${trackedCrops.length} crops`}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="text-primary h-7">
                {isHindi ? 'देखें' : 'View'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredPrices.map((crop, index) => {
            const priceChange = parseFloat(getPriceChange(crop.price, crop.previousPrice));
            const isPositive = priceChange >= 0;
            const isTracked = isTrackedCrop(crop.id);

            return (
              <motion.div
                key={crop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.03 }}
                className="bg-card border border-border rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {isHindi ? crop.cropNameHi : crop.cropName}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {crop.mandi}, {crop.state}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleTrackCrop(crop)}
                  >
                    <Star className={cn(
                      'h-5 w-5',
                      isTracked ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'
                    )} />
                  </Button>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      ₹{crop.price.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">/{crop.unit}</p>
                  </div>
                  <div className={cn(
                    'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                    isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  )}>
                    {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(priceChange)}%
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] text-muted-foreground">
                    {isHindi ? 'अपडेटेड' : 'Updated'}: {new Date(crop.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredPrices.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {isHindi ? 'कोई फसल नहीं मिली' : 'No crops found'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MarketPricesPage;
