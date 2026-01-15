import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const QuickScanCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl gradient-kishu p-6 shadow-kishu"
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -right-2 bottom-0 h-20 w-20 rounded-full bg-white/5" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary-foreground/80" />
              <span className="text-xs font-medium text-primary-foreground/80 uppercase tracking-wide">
                AI-Powered
              </span>
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground mb-1">
              {t('home.quickScan')}
            </h2>
            <p className="text-sm text-primary-foreground/80 max-w-[200px]">
              {t('home.scanDescription')}
            </p>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => navigate('/scan')}
              size="lg"
              className="h-16 w-16 rounded-2xl bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Camera className="h-7 w-7" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
