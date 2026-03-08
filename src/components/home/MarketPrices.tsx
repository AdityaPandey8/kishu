import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, IndianRupee, ChevronRight } from 'lucide-react';

export const MarketPrices = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';

  return (
    <motion.button
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.15 }}
      whileHover={{ scale: 1.03, y: -4 }}
      onClick={() => navigate('/market-prices')}
      className="w-full rounded-2xl bg-card border border-border p-4 shadow-soft text-left"
      style={{ transformPerspective: 1000 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <IndianRupee className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {isHindi ? 'बाजार भाव' : 'Market Prices'}
              <TrendingUp className="h-4 w-4 text-green-600" />
            </h3>
            <p className="text-xs text-muted-foreground">
              {isHindi ? 'फसल खोजें और मंडी भाव देखें' : 'Search crops & check mandi rates'}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </motion.button>
  );
};
