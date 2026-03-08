import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Settings, Plus, BadgeCheck, TrendingUp, IndianRupee
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { OrderLifecycleCards } from '@/components/dealer/OrderLifecycleCards';
import { PerformanceScorecard } from '@/components/dealer/PerformanceScorecard';
import { PendingTasks, TaskItem } from '@/components/dealer/PendingTasks';
import { GrowthTipsBanner } from '@/components/dealer/GrowthTipsBanner';
import { TopProducts } from '@/components/dealer/TopProducts';
import { InventoryAlert } from '@/components/dealer/InventoryAlert';
import { InquiryDetailModal } from '@/components/dealer/InquiryDetailModal';
import { RevenueChart } from '@/components/dealer/RevenueChart';
import { Inquiry } from '@/contexts/DataContext';
import { toast } from 'sonner';

const DealerDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, inquiries, updateInquiryStatus, notifications } = useData();
  const isHindi = i18n.language === 'hi';
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [revenuePeriod, setRevenuePeriod] = useState<'week' | 'month' | 'year'>('month');

  const dealerProducts = products.filter(p => p.dealerId === user?.id);
  const dealerInquiries = inquiries.filter(i => i.dealerId === user?.id);
  const dealerNotifications = notifications.filter(n => n.userId === user?.id && !n.read);

  const pendingCount = dealerInquiries.filter(i => i.status === 'pending').length;
  const inProgressCount = dealerInquiries.filter(i => i.status === 'responded').length;
  const resolvedCount = dealerInquiries.filter(i => i.status === 'resolved').length;
  const totalRevenue = dealerProducts.reduce((acc, p) => acc + p.price * p.sales, 0);
  const topProducts = [...dealerProducts].sort((a, b) => b.sales - a.sales).slice(0, 5);
  const lowStockItems = dealerProducts.filter(p => p.stock < 50).map(p => ({
    id: p.id, name: p.name, stock: p.stock, threshold: 50, category: p.category
  }));

  // Performance scores
  const listingQuality = dealerProducts.length > 0 
    ? Math.round((dealerProducts.filter(p => p.image && p.description).length / dealerProducts.length) * 100) 
    : 0;
  const responseRate = dealerInquiries.length > 0 
    ? Math.round(((resolvedCount + inProgressCount) / dealerInquiries.length) * 100) 
    : 0;
  const customerRating = 87; // mock

  const performanceScores = [
    { label: isHindi ? 'लिस्टिंग गुणवत्ता' : 'Listing Quality', score: listingQuality, maxScore: 100, color: '' },
    { label: isHindi ? 'प्रतिक्रिया दर' : 'Response Rate', score: responseRate, maxScore: 100, color: '' },
    { label: isHindi ? 'ग्राहक रेटिंग' : 'Customer Rating', score: customerRating, maxScore: 100, color: '' },
  ];

  // Pending tasks
  const pendingTasks: TaskItem[] = [];
  if (pendingCount > 0) {
    pendingTasks.push({
      id: 'respond-inquiries', icon: 'inquiry',
      title: isHindi ? `${pendingCount} पूछताछ का जवाब दें` : `Respond to ${pendingCount} inquiries`,
      description: isHindi ? 'किसान आपके जवाब का इंतज़ार कर रहे हैं' : 'Farmers are waiting for your response',
      priority: 'high', action: () => navigate('/inquiries'),
    });
  }
  if (lowStockItems.length > 0) {
    pendingTasks.push({
      id: 'restock', icon: 'stock',
      title: isHindi ? `${lowStockItems.length} आइटम रीस्टॉक करें` : `Restock ${lowStockItems.length} items`,
      description: isHindi ? 'स्टॉक कम हो रहा है' : 'Stock running low',
      priority: 'medium', action: () => navigate('/products'),
    });
  }
  pendingTasks.push({
    id: 'add-products', icon: 'alert',
    title: isHindi ? 'नए उत्पाद जोड़ें' : 'Add new products',
    description: isHindi ? 'अधिक किसानों तक पहुंचें' : 'Reach more farmers',
    priority: 'low', action: () => navigate('/products'),
  });

  // Revenue chart data
  const revenueData = [
    { name: 'Jan', value: 12000 }, { name: 'Feb', value: 19000 },
    { name: 'Mar', value: 15000 }, { name: 'Apr', value: 22000 },
    { name: 'May', value: 28000 }, { name: 'Jun', value: totalRevenue || 25000 },
  ];

  // Growth tips
  const growthTips = [
    { text: isHindi ? '5 और उत्पाद जोड़ें और 30% अधिक ग्राहक पाएं' : 'Add 5 more products to increase visibility by 30%', action: () => navigate('/products') },
    { text: isHindi ? 'पूछताछ का 1 घंटे में जवाब दें — बिक्री 2x बढ़ती है' : 'Respond to inquiries within 1 hour — sales increase 2x', action: () => navigate('/inquiries') },
    { text: isHindi ? 'उत्पाद फ़ोटो जोड़ें — 40% अधिक क्लिक मिलते हैं' : 'Add product photos — get 40% more clicks', action: () => navigate('/products') },
  ];

  // Handlers
  const handleRespond = (id: string) => {
    const inquiry = dealerInquiries.find(i => i.id === id);
    if (inquiry) setSelectedInquiry(inquiry);
  };
  const handleCall = (_id: string) => {
    toast.success(isHindi ? 'कॉल शुरू हो रहा है...' : 'Initiating call...');
  };
  const handleInquiryRespond = (id: string, response: string) => {
    updateInquiryStatus(id, 'responded', response);
    toast.success(isHindi ? 'उत्तर भेजा गया' : 'Response sent');
    setSelectedInquiry(null);
  };
  const handleInquiryResolve = (id: string) => {
    updateInquiryStatus(id, 'resolved');
    toast.success(isHindi ? 'पूछताछ हल की गई' : 'Inquiry resolved');
    setSelectedInquiry(null);
  };

  const periods = [
    { key: 'week' as const, label: isHindi ? 'सप्ताह' : 'Week' },
    { key: 'month' as const, label: isHindi ? 'महीना' : 'Month' },
    { key: 'year' as const, label: isHindi ? 'वर्ष' : 'Year' },
  ];

  return (
    <AppLayout>
      <motion.div
        className="container px-4 py-5 pb-24 space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Header — Store Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {(user?.name || 'D')[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold text-foreground">{user?.name || 'Dealer Store'}</h1>
                <BadgeCheck className="h-4 w-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">{isHindi ? 'विक्रेता' : 'Seller'} • {isHindi ? 'मार्च 2024 से' : 'Since Mar 2024'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9" onClick={() => navigate('/notifications')}>
              <Bell className="h-4.5 w-4.5" />
              {dealerNotifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive rounded-full text-[9px] text-white flex items-center justify-center font-medium">
                  {dealerNotifications.length}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9" onClick={() => navigate('/settings')}>
              <Settings className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>

        {/* Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-primary rounded-2xl p-4 text-primary-foreground"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {isHindi ? '🚀 अपना व्यापार बढ़ाएं!' : '🚀 Grow Your Business!'}
              </p>
              <p className="text-xs opacity-90 mt-0.5">
                {isHindi ? 'अधिक लिस्टिंग जोड़ें और किसानों तक पहुंचें' : 'Add more listings to reach more farmers'}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              className="shrink-0 rounded-xl text-xs h-8"
              onClick={() => navigate('/products')}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              {isHindi ? 'जोड़ें' : 'Add'}
            </Button>
          </div>
        </motion.div>

        {/* Order Lifecycle */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">
            {isHindi ? 'पूछताछ अवलोकन' : 'Inquiry Overview'}
          </h3>
          <OrderLifecycleCards items={[
            { label: isHindi ? 'लंबित' : 'Pending', count: pendingCount, icon: 'pending', onClick: () => navigate('/inquiries') },
            { label: isHindi ? 'प्रगति में' : 'In Progress', count: inProgressCount, icon: 'progress', onClick: () => navigate('/inquiries') },
            { label: isHindi ? 'हल किया' : 'Resolved', count: resolvedCount, icon: 'resolved', onClick: () => navigate('/inquiries') },
            { label: isHindi ? 'कुल' : 'Total', count: dealerInquiries.length, icon: 'total', onClick: () => navigate('/inquiries') },
          ]} />
        </div>

        {/* Revenue Summary */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground">
              {isHindi ? 'राजस्व सारांश' : 'Revenue Summary'}
            </h3>
            <div className="flex bg-muted rounded-lg p-0.5">
              {periods.map(p => (
                <button
                  key={p.key}
                  onClick={() => setRevenuePeriod(p.key)}
                  className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-colors ${
                    revenuePeriod === p.key ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee className="h-5 w-5 text-foreground" />
              <span className="text-2xl font-bold text-foreground">
                {(totalRevenue / 1000).toFixed(1)}K
              </span>
              <Badge variant="secondary" className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20">
                <TrendingUp className="h-3 w-3 mr-0.5" /> +18%
              </Badge>
            </div>
            <RevenueChart
              type="area"
              data={revenueData}
              title=""
              colors={['hsl(var(--primary))']}
            />
          </div>
        </div>

        {/* Performance Scorecard */}
        <PerformanceScorecard
          title={isHindi ? 'प्रदर्शन स्कोरकार्ड' : 'Performance Scorecard'}
          scores={performanceScores}
        />

        {/* Pending Tasks */}
        <PendingTasks
          title={isHindi ? 'लंबित कार्य' : 'Pending Tasks'}
          tasks={pendingTasks}
        />

        {/* Top Products */}
        <TopProducts
          products={topProducts}
          title={isHindi ? 'सबसे ज्यादा बिकने वाले' : 'Top Selling'}
          onViewAll={() => navigate('/products')}
          onViewProduct={() => navigate('/products')}
        />

        {/* Inventory Alerts */}
        <InventoryAlert items={lowStockItems} onReorder={() => navigate('/products')} />

        {/* Growth Tips */}
        <GrowthTipsBanner tips={growthTips} />
      </motion.div>

      <AnimatePresence>
        {selectedInquiry && (
          <InquiryDetailModal
            inquiry={selectedInquiry}
            products={dealerProducts}
            onClose={() => setSelectedInquiry(null)}
            onRespond={handleInquiryRespond}
            onResolve={handleInquiryResolve}
            onCall={handleCall}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default DealerDashboard;
