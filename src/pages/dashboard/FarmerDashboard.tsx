import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { QuickScanCard } from '@/components/home/QuickScanCard';
import { WeatherWidget } from '@/components/home/WeatherWidget';
import { RecentDiagnoses } from '@/components/home/RecentDiagnoses';
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
