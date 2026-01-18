import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, TrendingUp, TrendingDown, Calendar, Download,
  IndianRupee, Package, Users, BarChart3, PieChart, Share2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/dealer/StatsCard';
import { RevenueChart } from '@/components/dealer/RevenueChart';
import { TopProducts } from '@/components/dealer/TopProducts';
import { toast } from 'sonner';

const DealerAnalytics = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, inquiries } = useData();
  const isHindi = i18n.language === 'hi';

  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const dealerProducts = products.filter(p => p.dealerId === user?.id);
  const dealerInquiries = inquiries.filter(i => i.dealerId === user?.id);

  // Calculate stats
  const totalRevenue = dealerProducts.reduce((acc, p) => acc + (p.price * p.sales), 0);
  const totalSales = dealerProducts.reduce((acc, p) => acc + p.sales, 0);
  const totalCustomers = new Set(dealerInquiries.map(i => i.farmerId)).size;
  const resolvedRate = dealerInquiries.length > 0 
    ? Math.round((dealerInquiries.filter(i => i.status === 'resolved').length / dealerInquiries.length) * 100)
    : 0;

  // Mock revenue data
  const revenueData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 19000 },
    { name: 'Mar', value: 15000 },
    { name: 'Apr', value: 22000 },
    { name: 'May', value: 28000 },
    { name: 'Jun', value: 25000 },
    { name: 'Jul', value: 32000 },
  ];

  // Category distribution
  const categoryData = dealerProducts.reduce((acc, p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) {
      existing.value += p.sales;
    } else {
      acc.push({ name: p.category, value: p.sales });
    }
    return acc;
  }, [] as Array<{ name: string; value: number }>);

  // Top products by sales
  const topProducts = [...dealerProducts].sort((a, b) => b.sales - a.sales);

  const stats = [
    { 
      label: isHindi ? 'कुल राजस्व' : 'Total Revenue', 
      value: `₹${(totalRevenue / 1000).toFixed(1)}K`, 
      change: '+18%', 
      icon: IndianRupee, 
      color: 'text-green-600', 
      bgColor: 'bg-green-100' 
    },
    { 
      label: isHindi ? 'कुल बिक्री' : 'Total Sales', 
      value: totalSales, 
      change: '+12%', 
      icon: Package, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-100' 
    },
    { 
      label: isHindi ? 'ग्राहक' : 'Customers', 
      value: totalCustomers, 
      change: '+8%', 
      icon: Users, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-100' 
    },
    { 
      label: isHindi ? 'समाधान दर' : 'Resolution Rate', 
      value: `${resolvedRate}%`, 
      change: '+5%', 
      icon: TrendingUp, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-100' 
    },
  ];

  const handleExport = () => {
    toast.success(isHindi ? 'रिपोर्ट डाउनलोड हो रही है...' : 'Downloading report...');
  };

  const handleShare = () => {
    toast.success(isHindi ? 'रिपोर्ट साझा की गई' : 'Report shared');
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                {isHindi ? 'एनालिटिक्स' : 'Analytics'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'आपके व्यापार की जानकारी' : 'Your business insights'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="rounded-xl" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-xl" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6"
        >
          {[
            { id: 'week', label: isHindi ? 'सप्ताह' : 'Week' },
            { id: 'month', label: isHindi ? 'महीना' : 'Month' },
            { id: 'year', label: isHindi ? 'वर्ष' : 'Year' },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id as typeof timeRange)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                timeRange === range.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {range.label}
            </button>
          ))}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => (
            <StatsCard key={stat.label} {...stat} index={index} />
          ))}
        </div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <RevenueChart
            type="area"
            data={revenueData}
            title={isHindi ? 'राजस्व अवलोकन' : 'Revenue Overview'}
            subtitle={isHindi ? 'पिछले 7 महीने' : 'Last 7 months'}
            trend={{ value: 18, isPositive: true }}
          />
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6"
        >
          <RevenueChart
            type="pie"
            data={categoryData}
            title={isHindi ? 'श्रेणी वितरण' : 'Category Distribution'}
            subtitle={isHindi ? 'बिक्री के अनुसार' : 'By sales'}
            colors={['#16a34a', '#2563eb', '#7c3aed', '#ea580c', '#0891b2']}
          />
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <TopProducts
            products={topProducts}
            title={isHindi ? 'सबसे ज्यादा बिकने वाले' : 'Top Selling'}
            onViewAll={() => navigate('/products')}
          />
        </motion.div>

        {/* Customer Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card border border-border rounded-2xl p-4 shadow-soft"
        >
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            {isHindi ? 'ग्राहक जानकारी' : 'Customer Insights'}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{totalCustomers}</p>
              <p className="text-xs text-muted-foreground">{isHindi ? 'कुल ग्राहक' : 'Total'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {dealerInquiries.filter(i => i.status === 'resolved').length}
              </p>
              <p className="text-xs text-muted-foreground">{isHindi ? 'संतुष्ट' : 'Satisfied'}</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {dealerInquiries.filter(i => i.status === 'pending').length}
              </p>
              <p className="text-xs text-muted-foreground">{isHindi ? 'लंबित' : 'Pending'}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DealerAnalytics;
