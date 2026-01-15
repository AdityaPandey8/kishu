import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { QuickScanCard } from '@/components/home/QuickScanCard';
import { TipsCarousel } from '@/components/home/TipsCarousel';
import { WeatherWidget } from '@/components/home/WeatherWidget';
import { RecentDiagnoses } from '@/components/home/RecentDiagnoses';

const Index = () => {
  const { t } = useTranslation();

  // Mock user name - will be replaced with actual auth
  const userName = 'Farmer';

  return (
    <AppLayout>
      <div className="container px-4 py-6 space-y-5">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm text-muted-foreground">{t('home.welcome')},</p>
          <h1 className="text-2xl font-bold text-foreground">{userName} 👋</h1>
        </motion.div>

        {/* Quick Scan Card */}
        <QuickScanCard />

        {/* Weather Widget */}
        <WeatherWidget />

        {/* Tips Carousel */}
        <TipsCarousel />

        {/* Recent Diagnoses */}
        <RecentDiagnoses />
      </div>
    </AppLayout>
  );
};

export default Index;
