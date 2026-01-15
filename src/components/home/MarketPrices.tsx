import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockPrices = [
  { crop: 'Wheat', cropHi: 'गेहूं', price: 2250, change: 2.5, unit: 'quintal' },
  { crop: 'Rice', cropHi: 'चावल', price: 3100, change: -1.2, unit: 'quintal' },
  { crop: 'Tomato', cropHi: 'टमाटर', price: 45, change: 8.5, unit: 'kg' },
  { crop: 'Onion', cropHi: 'प्याज', price: 32, change: -3.2, unit: 'kg' },
];

export const MarketPrices = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-2xl bg-card border border-border p-4 shadow-soft"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <IndianRupee className="h-4 w-4 text-primary" />
          {isHindi ? 'बाजार भाव' : 'Market Prices'}
        </h3>
        <span className="text-xs text-muted-foreground">Mandi rates</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {mockPrices.map((item, index) => {
          const isPositive = item.change > 0;
          return (
            <motion.div
              key={item.crop}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-muted/50 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-foreground">
                  {isHindi ? item.cropHi : item.crop}
                </span>
                <div className={cn(
                  'flex items-center gap-0.5 text-xs font-medium',
                  isPositive ? 'text-green-600' : 'text-red-500'
                )}>
                  {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(item.change)}%
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-foreground">₹{item.price}</span>
                <span className="text-[10px] text-muted-foreground">/{item.unit}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
