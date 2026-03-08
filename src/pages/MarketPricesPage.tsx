import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, TrendingUp, TrendingDown, 
  Bell, MapPin, Loader2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface CropPrice {
  cropName: string;
  cropNameHi: string;
  price: number;
  unit: string;
  mandi: string;
  state: string;
  trend: number;
}

const MarketPricesPage = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [prices, setPrices] = useState<CropPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQuery.trim()) {
      toast.error(isHindi ? 'कृपया फसल का नाम दर्ज करें' : 'Please enter a crop name');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-market-prices', {
        body: { query: searchQuery.trim(), location: locationQuery.trim() || undefined },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setPrices(data?.prices || []);
      if (!data?.prices?.length) {
        toast.info(isHindi ? 'कोई परिणाम नहीं मिला' : 'No results found');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to fetch prices');
      setPrices([]);
    } finally {
      setLoading(false);
    }
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
            <p className="text-xs text-muted-foreground">
              {isHindi ? 'फसल खोजें और लाइव मंडी भाव देखें' : 'Search crops for live mandi rates'}
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

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3 mb-6"
          onSubmit={handleSearch}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'फसल का नाम (जैसे गेहूं, टमाटर)...' : 'Crop name (e.g. wheat, tomato)...'}
              className="h-12 pl-10 pr-4 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'राज्य या मंडी (वैकल्पिक)...' : 'State or mandi (optional)...'}
              className="h-12 pl-10 pr-4 rounded-xl"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-base" disabled={loading}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Search className="h-5 w-5 mr-2" />
            )}
            {isHindi ? 'भाव खोजें' : 'Search Prices'}
          </Button>
        </motion.form>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4">
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-3 w-32 mb-4" />
                <Skeleton className="h-8 w-20 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {!loading && prices.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {prices.map((crop, index) => {
              const isPositive = crop.trend >= 0;

              return (
                <motion.div
                  key={`${crop.cropName}-${crop.mandi}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-soft"
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-foreground">
                      {isHindi ? crop.cropNameHi : crop.cropName}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {crop.mandi}, {crop.state}
                    </p>
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
                      {Math.abs(crop.trend)}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && searched && prices.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {isHindi ? 'कोई फसल नहीं मिली। दूसरा नाम आज़माएं।' : 'No crops found. Try a different name.'}
            </p>
          </div>
        )}

        {/* Initial state */}
        {!loading && !searched && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {isHindi ? 'ऊपर फसल का नाम खोजें' : 'Search a crop name above to see mandi prices'}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default MarketPricesPage;
