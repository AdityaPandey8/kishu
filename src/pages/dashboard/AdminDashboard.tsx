import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Store, Package, TrendingUp, 
  Clock, ChevronRight, 
  Activity, BarChart3, ShoppingBag, MessageSquare,
  AlertTriangle, FileText, Eye, Truck
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { 
    platformUsers, products, orders, inquiries, 
    notifications, expertApplications, dealerKYCs, posts, reels,
    serviceBookings, agriServices
  } = useData();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';

  // Live stats
  const farmers = platformUsers.filter(u => u.role === 'farmer');
  const dealers = platformUsers.filter(u => u.role === 'dealer');
  const providers = platformUsers.filter(u => u.role === 'service_provider');
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingKYC = dealerKYCs.filter(k => k.status === 'pending').length;
  const pendingExperts = expertApplications.filter(a => a.status === 'pending').length;
  const pendingProviders = providers.filter(p => p.status === 'pending').length;

  const stats = [
    { label: isHindi ? 'किसान' : 'Farmers', value: farmers.length, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: isHindi ? 'डीलर' : 'Dealers', value: dealers.length, icon: Store, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: isHindi ? 'उत्पाद' : 'Products', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: isHindi ? 'ऑर्डर' : 'Orders', value: orders.length, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: isHindi ? 'राजस्व' : 'Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: isHindi ? 'पूछताछ' : 'Inquiries', value: inquiries.length, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  ];

  // Quick actions
  const quickActions = [
    { label: isHindi ? 'उपयोगकर्ता' : 'Users', icon: Users, path: '/users', count: platformUsers.length },
    { label: isHindi ? 'KYC अनुमोदन' : 'KYC Approvals', icon: FileText, path: '/admin/kyc', count: pendingKYC, urgent: pendingKYC > 0 },
    { label: isHindi ? 'विशेषज्ञ' : 'Experts', icon: Shield, path: '/admin/experts', count: pendingExperts, urgent: pendingExperts > 0 },
    { label: isHindi ? 'ऑर्डर' : 'Orders', icon: Truck, path: '/admin/orders', count: orders.length },
    { label: isHindi ? 'सेवा प्रदाता' : 'Providers', icon: Activity, path: '/admin/service-providers', count: providers.length, urgent: pendingProviders > 0 },
    { label: isHindi ? 'सेवाएं' : 'Services', icon: Package, path: '/admin/services', count: agriServices.length },
    { label: isHindi ? 'पूछताछ' : 'Inquiries', icon: MessageSquare, path: '/admin/inquiries', count: inquiries.length },
    { label: isHindi ? 'सामग्री' : 'Content', icon: Eye, path: '/admin/content', count: posts.length + reels.length },
  ];

  // Order status breakdown for pie chart
  const orderStatusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { name: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, color: '#3b82f6' },
    { name: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, color: '#8b5cf6' },
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#10b981' },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'cancelled').length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Revenue by dealer
  const revenueByDealer: Record<string, number> = {};
  orders.forEach(o => {
    revenueByDealer[o.dealerName] = (revenueByDealer[o.dealerName] || 0) + o.totalAmount;
  });
  const revenueChartData = Object.entries(revenueByDealer).map(([name, revenue]) => ({ name: name.slice(0, 12), revenue }));

  // Low stock products
  const lowStockProducts = products.filter(p => p.stock < 50).slice(0, 5);

  // Recent notifications as activity
  const recentActivity = notifications.slice(0, 8);

  // Recent inquiries
  const recentInquiries = [...inquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const cardAnim = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
  };

  return (
    <AppLayout>
      <motion.div
        className="container px-4 py-6 space-y-5 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{isHindi ? 'एडमिन पैनल' : 'Admin Panel'}</p>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {user?.name || 'Admin'} <Shield className="h-5 w-5 text-primary" />
            </h1>
          </div>
          <Button variant="outline" className="rounded-xl" onClick={() => navigate('/admin/orders')}>
            <BarChart3 className="h-4 w-4 mr-1" />
            {isHindi ? 'रिपोर्ट' : 'Reports'}
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, delay: i * 0.04 }}
                className="bg-card border border-border rounded-2xl p-3 shadow-sm"
              >
                <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center mb-2', stat.bg)}>
                  <Icon className={cn('h-4 w-4', stat.color)} />
                </div>
                <p className="text-lg font-bold text-foreground">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div {...cardAnim}>
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            {isHindi ? 'त्वरित कार्य' : 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative bg-card border border-border rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm"
                >
                  {action.urgent && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {action.count}
                    </span>
                  )}
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-medium text-foreground text-center leading-tight">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Pending Approvals */}
        {(pendingKYC > 0 || pendingExperts > 0) && (
          <motion.div {...cardAnim} className="bg-card border border-amber-200 dark:border-amber-800 rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              {isHindi ? 'लंबित अनुमोदन' : 'Pending Approvals'}
            </h2>
            <div className="space-y-2">
              {pendingKYC > 0 && (
                <motion.div
                  whileHover={{ x: 4 }}
                  onClick={() => navigate('/admin/kyc')}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{isHindi ? 'KYC अनुमोदन' : 'KYC Approvals'}</p>
                      <p className="text-xs text-muted-foreground">{pendingKYC} {isHindi ? 'लंबित' : 'pending'}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              )}
              {pendingExperts > 0 && (
                <motion.div
                  whileHover={{ x: 4 }}
                  onClick={() => navigate('/admin/experts')}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{isHindi ? 'विशेषज्ञ अनुमोदन' : 'Expert Approvals'}</p>
                      <p className="text-xs text-muted-foreground">{pendingExperts} {isHindi ? 'लंबित' : 'pending'}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Revenue Chart */}
        {revenueChartData.length > 0 && (
          <motion.div {...cardAnim} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              {isHindi ? 'डीलर राजस्व' : 'Revenue by Dealer'}
            </h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* Order Status Breakdown */}
        {orderStatusData.length > 0 && (
          <motion.div {...cardAnim} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                {isHindi ? 'ऑर्डर स्थिति' : 'Order Status'}
              </h2>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/admin/orders')}>
                {isHindi ? 'सभी देखें' : 'View All'} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-32 w-32 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderStatusData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3}>
                      {orderStatusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 flex-1">
                {orderStatusData.map(d => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-muted-foreground flex-1">{d.name}</span>
                    <span className="font-semibold text-foreground">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Low Stock Alerts */}
        {lowStockProducts.length > 0 && (
          <motion.div {...cardAnim} className="bg-card border border-destructive/30 rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              {isHindi ? 'कम स्टॉक' : 'Low Stock Alerts'}
            </h2>
            <div className="space-y-2">
              {lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.category}</p>
                  </div>
                  <span className={cn(
                    'text-xs font-bold px-2 py-0.5 rounded-full',
                    p.stock < 20 ? 'bg-destructive/10 text-destructive' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                  )}>
                    {p.stock} left
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Inquiries */}
        {recentInquiries.length > 0 && (
          <motion.div {...cardAnim} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                {isHindi ? 'हाल की पूछताछ' : 'Recent Inquiries'}
              </h2>
              <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate('/admin/inquiries')}>
                {isHindi ? 'सभी' : 'All'} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-2">
              {recentInquiries.map(inq => {
                const typeBg = inq.type === 'stock' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : inq.type === 'delivery' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 'bg-muted text-muted-foreground';
                return (
                  <div key={inq.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{inq.subject}</p>
                      <p className="text-[10px] text-muted-foreground">{inq.farmerName} • {inq.createdAt}</p>
                    </div>
                    <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', typeBg)}>
                      {inq.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <motion.div {...cardAnim} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              {isHindi ? 'हाल की गतिविधि' : 'Recent Activity'}
            </h2>
            <div className="space-y-2">
              {recentActivity.map(n => (
                <div key={n.id} className="flex items-start gap-3 p-2 border-b border-border last:border-0">
                  <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{n.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default AdminDashboard;
