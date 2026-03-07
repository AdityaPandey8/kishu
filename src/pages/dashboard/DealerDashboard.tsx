import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, ChevronRight, TrendingUp, MessageSquare, IndianRupee, Users, FileText, BarChart3, Bell, Settings } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { StatsCard } from '@/components/dealer/StatsCard';
import { QuickActions } from '@/components/dealer/QuickActions';
import { UrgentInquiries } from '@/components/dealer/UrgentInquiries';
import { TopProducts } from '@/components/dealer/TopProducts';
import { InventoryAlert } from '@/components/dealer/InventoryAlert';
import { ActivityTimeline, ActivityItem } from '@/components/dealer/ActivityTimeline';
import { InquiryDetailModal } from '@/components/dealer/InquiryDetailModal';
import { Inquiry } from '@/contexts/DataContext';
import { toast } from 'sonner';

const DealerDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, inquiries, updateInquiryStatus, notifications } = useData();
  const isHindi = i18n.language === 'hi';
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  const dealerProducts = products.filter(p => p.dealerId === user?.id);
  const dealerInquiries = inquiries.filter(i => i.dealerId === user?.id);
  const dealerNotifications = notifications.filter(n => n.userId === user?.id && !n.read);

  const totalProducts = dealerProducts.length;
  const pendingInquiries = dealerInquiries.filter(i => i.status === 'pending').length;
  const urgentCount = dealerInquiries.filter(i => i.urgent && i.status === 'pending').length;
  const totalRevenue = dealerProducts.reduce((acc, p) => acc + p.price * p.sales, 0);
  const totalFarmers = new Set(dealerInquiries.map(i => i.farmerId)).size;
  const totalStock = dealerProducts.reduce((acc, p) => acc + p.stock, 0);
  const topProducts = [...dealerProducts].sort((a, b) => b.sales - a.sales).slice(0, 5);
  const lowStockItems = dealerProducts.filter(p => p.stock < 50).map(p => ({
    id: p.id, name: p.name, stock: p.stock, threshold: 50, category: p.category
  }));

  const recentActivities: ActivityItem[] = [
    { id: '1', type: 'inquiry', title: 'New inquiry received', description: 'Ramesh Kumar asked about fungicides', timestamp: new Date().toISOString() },
    { id: '2', type: 'response', title: 'Response sent', description: 'Replied to Sunil Yadav', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: '3', type: 'product', title: 'Product updated', description: 'Updated stock for Mancozeb 75%', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: '4', type: 'sale', title: 'New sale', description: 'Sold 5 units of Neem Oil', timestamp: new Date(Date.now() - 10800000).toISOString() },
  ];

  const stats = [
    { label: isHindi ? 'कुल उत्पाद' : 'Total Products', value: totalProducts, change: `${totalStock} stock`, icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: isHindi ? 'लंबित पूछताछ' : 'Pending Inquiries', value: pendingInquiries, change: urgentCount > 0 ? `${urgentCount} urgent` : undefined, icon: MessageSquare, color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { label: isHindi ? 'मासिक राजस्व' : 'Monthly Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, change: '+18%', icon: IndianRupee, color: 'text-green-600', bgColor: 'bg-green-100' },
    { label: isHindi ? 'किसान संपर्क' : 'Farmers Reached', value: totalFarmers, change: '+12', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  const quickActions = [
    { id: 'add-product', label: isHindi ? 'उत्पाद जोड़ें' : 'Add Product', icon: Plus, variant: 'primary' as const, onClick: () => navigate('/products') },
    { id: 'inquiries', label: isHindi ? 'पूछताछ' : 'Inquiries', icon: MessageSquare, variant: 'secondary' as const, onClick: () => navigate('/inquiries') },
    { id: 'new-quote', label: isHindi ? 'कोटेशन' : 'New Quote', icon: FileText, variant: 'outline' as const, onClick: () => navigate('/quotes/new') },
    { id: 'analytics', label: isHindi ? 'एनालिटिक्स' : 'Analytics', icon: BarChart3, variant: 'outline' as const, onClick: () => navigate('/analytics') },
  ];

  const handleRespond = (id: string) => {
    const inquiry = dealerInquiries.find(i => i.id === id);
    if (inquiry) setSelectedInquiry(inquiry);
  };
  const handleCall = (_id: string) => {
    toast.success(isHindi ? 'कॉल शुरू हो रहा है...' : 'Initiating call...');
  };
  const handleInquiryRespond = (id: string, response: string, _productIds?: string[]) => {
    updateInquiryStatus(id, 'responded', response);
    toast.success(isHindi ? 'उत्तर भेजा गया' : 'Response sent');
    setSelectedInquiry(null);
  };
  const handleInquiryResolve = (id: string) => {
    updateInquiryStatus(id, 'resolved');
    toast.success(isHindi ? 'पूछताछ हल की गई' : 'Inquiry resolved');
    setSelectedInquiry(null);
  };

  return (
    <AppLayout>
      <motion.div
        className="container px-4 py-6 pb-24 space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{isHindi ? 'स्वागत है' : 'Welcome back'},</p>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {user?.name || 'Dealer'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative rounded-xl" onClick={() => navigate('/notifications')}>
              <Bell className="h-5 w-5" />
              {dealerNotifications.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center"
                >
                  {dealerNotifications.length}
                </motion.span>
              )}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate('/settings')}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.05 }}
        >
          <QuickActions actions={quickActions} />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, delay: index * 0.06 }}
              whileHover={{ scale: 1.05, y: -4 }}
              style={{ transformPerspective: 800 }}
            >
              <StatsCard {...stat} index={index} onClick={() => {
                if (stat.label.includes('Product')) navigate('/products');
                else if (stat.label.includes('Inquir')) navigate('/inquiries');
                else if (stat.label.includes('Revenue')) navigate('/analytics');
              }} />
            </motion.div>
          ))}
        </div>

        {/* Urgent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <UrgentInquiries inquiries={dealerInquiries} onRespond={handleRespond} onCall={handleCall} onViewAll={() => navigate('/inquiries')} onViewDetails={inquiry => setSelectedInquiry(inquiry)} />
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <InventoryAlert items={lowStockItems} onReorder={_id => navigate('/products')} />
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <TopProducts products={topProducts} title={isHindi ? 'सबसे ज्यादा बिकने वाले' : 'Top Selling'} onViewAll={() => navigate('/products')} onViewProduct={() => navigate('/products')} />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <ActivityTimeline activities={recentActivities} title={isHindi ? 'हाल की गतिविधि' : 'Recent Activity'} />
        </motion.div>
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
