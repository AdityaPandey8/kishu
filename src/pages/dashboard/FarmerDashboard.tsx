import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { QuickScanCard } from '@/components/home/QuickScanCard';
import { WeatherWidget } from '@/components/home/WeatherWidget';

import { MarketPrices } from '@/components/home/MarketPrices';

import { ExpertHelp } from '@/components/home/ExpertHelp';
import { WeatherAlertsWidget } from '@/components/home/WeatherAlertsWidget';
import { AppSuggests } from '@/components/home/AppSuggests';
import { useAuth } from '@/contexts/AuthContext';
import { lazy, Suspense } from 'react';

const FarmingChatbot = lazy(() => import('@/components/chat/FarmingChatbot'));

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FarmerDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <AppLayout>
      <motion.div
        className="container px-4 py-6 space-y-5"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div variants={staggerItem}>
          <p className="text-sm text-muted-foreground">{t('home.welcome')},</p>
          <h1 className="text-2xl font-bold text-foreground">{user?.name || 'Farmer'} 👋</h1>
        </motion.div>

        {/* Quick Scan Card */}
        <QuickScanCard />

        {/* Weather Alert */}
        <WeatherAlertsWidget />

        {/* Weather + Market Prices Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <WeatherWidget />
          <MarketPrices />
        </div>


        {/* Agri Services Quick Card */}
        <motion.div
          variants={staggerItem}
          onClick={() => window.location.href = '/agri-services'}
          className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl">🚜</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Agri Services</h3>
              <p className="text-xs text-muted-foreground">Book equipment, spraying, soil testing & more</p>
            </div>
            <span className="text-primary font-bold text-sm">→</span>
          </div>
        </motion.div>

        {/* App Suggests */}
        <AppSuggests />

        {/* Expert Help */}
        <ExpertHelp />

        {/* Recent Diagnoses */}
        <RecentDiagnoses />
      </motion.div>
      <Suspense fallback={null}>
        <FarmingChatbot />
      </Suspense>
    </AppLayout>
  );
};

export default FarmerDashboard;
