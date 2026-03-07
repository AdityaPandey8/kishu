import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { QuickScanCard } from '@/components/home/QuickScanCard';
import { TipsCarousel } from '@/components/home/TipsCarousel';
import { WeatherWidget } from '@/components/home/WeatherWidget';
import { RecentDiagnoses } from '@/components/home/RecentDiagnoses';
import { MarketPrices } from '@/components/home/MarketPrices';
import { SeasonalCalendar } from '@/components/home/SeasonalCalendar';
import { ExpertHelp } from '@/components/home/ExpertHelp';
import { CropGuide } from '@/components/home/CropGuide';
import { WeatherAlertsWidget } from '@/components/home/WeatherAlertsWidget';
import { useAuth } from '@/contexts/AuthContext';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
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

        {/* Tips Carousel */}
        <TipsCarousel />

        {/* Seasonal Calendar */}
        <SeasonalCalendar />

        {/* Expert Help */}
        <ExpertHelp />

        {/* Crop Guide */}
        <CropGuide />

        {/* Recent Diagnoses */}
        <RecentDiagnoses />
      </motion.div>
    </AppLayout>
  );
};

export default FarmerDashboard;
