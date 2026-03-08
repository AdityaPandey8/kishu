import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Wheat, Globe, Bell, ChevronRight, LogOut, 
  Settings, Shield, Camera, Edit2, Phone, Mail, Ruler, Clock,
  Award, Leaf, TrendingUp, Video, ShoppingBag, Package, Play,
  Store, Star, BarChart3, BadgeCheck, FileText, IndianRupee,
  MessageSquare, Box, Users, Truck, Pencil
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ProfileActivityTabs from '@/components/profile/ProfileActivityTabs';
import EditStoreProfileDialog from '@/components/dealer/EditStoreProfileDialog';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCreatorProfile, orders, products, inquiries, getDealerKYC, customers } = useData();
  const isHindi = i18n.language === 'hi';
  
  const creatorProfile = user ? getCreatorProfile(user.id) : undefined;
  const isCreator = creatorProfile?.isCreator || false;
  const userOrders = orders.filter(o => o.farmerId === user?.id);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  // ─── Dealer-specific data ───
  const dealerProducts = products.filter(p => p.dealerId === user?.id);
  const dealerInquiries = inquiries.filter(i => i.dealerId === user?.id);
  const resolvedInquiries = dealerInquiries.filter(i => i.status === 'resolved');
  const dealerOrders = orders.filter(o => o.dealerId === user?.id);
  const dealerCustomers = customers.filter(c => c.dealerId === user?.id);
  const kycData = user ? getDealerKYC(user.id) : undefined;
  const totalRevenue = dealerOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgRating = dealerProducts.length > 0
    ? (dealerProducts.reduce((sum, p) => sum + (p.rating || 0), 0) / dealerProducts.length).toFixed(1)
    : '0';

  if (user?.role === 'dealer') {
    return <DealerProfile />;
  }

  // ─── Farmer / Default Profile ───
  return <FarmerProfile />;

  function DealerProfile() {
    const [editOpen, setEditOpen] = useState(false);
    const kycBadge = {
      approved: { label: isHindi ? 'सत्यापित' : 'Verified', class: 'bg-green-500/10 text-green-600 border-green-500/20' },
      pending: { label: isHindi ? 'समीक्षा में' : 'Under Review', class: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
      rejected: { label: isHindi ? 'अस्वीकृत' : 'Rejected', class: 'bg-destructive/10 text-destructive border-destructive/20' },
      not_submitted: { label: isHindi ? 'KYC अपूर्ण' : 'KYC Pending', class: 'bg-muted text-muted-foreground border-border' },
    };
    const kyc = kycBadge[user?.kycStatus || 'not_submitted'];

    const businessStats = [
      { icon: Box, value: dealerProducts.length.toString(), label: isHindi ? 'प्रोडक्ट' : 'Products', color: 'text-primary' },
      { icon: IndianRupee, value: `₹${(totalRevenue / 1000).toFixed(0)}K`, label: isHindi ? 'राजस्व' : 'Revenue', color: 'text-green-600' },
      { icon: MessageSquare, value: resolvedInquiries.length.toString(), label: isHindi ? 'हल किया' : 'Resolved', color: 'text-amber-600' },
      { icon: Star, value: avgRating, label: isHindi ? 'रेटिंग' : 'Rating', color: 'text-yellow-500' },
    ];

    const storeDetails = [
      { icon: Phone, label: isHindi ? 'फोन' : 'Phone', value: user?.phone || 'Not set' },
      { icon: Mail, label: isHindi ? 'ईमेल' : 'Email', value: user?.email || 'Not set' },
      { icon: MapPin, label: isHindi ? 'स्थान' : 'Location', value: kycData?.businessAddress ? `${kycData.city}, ${kycData.state}` : (user?.location || 'Not set') },
      { icon: FileText, label: 'GST', value: kycData?.gstNumber || 'Not submitted' },
      { icon: Store, label: isHindi ? 'व्यवसाय प्रकार' : 'Business Type', value: kycData?.businessType ? kycData.businessType.charAt(0).toUpperCase() + kycData.businessType.slice(1) : 'Not set' },
      { icon: Users, label: isHindi ? 'ग्राहक' : 'Customers', value: dealerCustomers.length.toString() },
      ...(user?.operatingHours ? [{ icon: Clock, label: isHindi ? 'कार्य समय' : 'Hours', value: `${user.operatingHours.open} – ${user.operatingHours.close} (${user.operatingHours.days.join(', ')})` }] : []),
    ];

    const quickActions = [
      { icon: Truck, label: isHindi ? 'ऑर्डर प्रबंधन' : 'Order Management', path: '/dealer/orders' },
      { icon: Box, label: isHindi ? 'प्रोडक्ट जोड़ें' : 'Add Product', path: '/products' },
      { icon: BarChart3, label: isHindi ? 'एनालिटिक्स' : 'Analytics', path: '/analytics' },
      { icon: Settings, label: isHindi ? 'सेटिंग्स' : 'Settings', path: '/settings' },
    ];

    const topProducts = [...dealerProducts].sort((a, b) => b.sales - a.sales).slice(0, 5);

    return (
      <AppLayout>
        <div className="container px-4 py-6 pb-28 space-y-5">
          {/* Store Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-6 shadow-soft relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5" />
            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary/10" />

            <div className="relative flex items-start gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg overflow-hidden">
                  {user?.storeLogo ? (
                    <img src={user.storeLogo} alt="Store" className="h-full w-full object-cover" />
                  ) : (
                    <Store className="h-10 w-10 text-primary-foreground" />
                  )}
                </div>
                <button
                  onClick={() => setEditOpen(true)}
                  className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card border border-border shadow-soft flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {kycData?.businessName || user?.name || 'My Store'}
                  </h1>
                  {user?.kycStatus === 'approved' && (
                    <BadgeCheck className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                  <button
                    onClick={() => setEditOpen(true)}
                    className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center hover:bg-accent transition-colors"
                  >
                    <Pencil className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                {user?.storeDescription && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{user.storeDescription}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className={cn('text-[10px] px-2 py-0.5', kyc.class)}>
                    {kyc.label}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {isHindi ? 'विक्रेता' : 'Seller since'} {kycData?.submittedAt ? new Date(kycData.submittedAt).getFullYear() : '2026'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Business Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-4 gap-2"
          >
            {businessStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="bg-card border border-border rounded-2xl p-3 text-center shadow-soft">
                  <Icon className={cn('h-4 w-4 mx-auto mb-1', stat.color)} />
                  <p className={cn('text-lg font-bold', stat.color)}>{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>

          {/* Store Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {isHindi ? 'स्टोर विवरण' : 'Store Details'}
            </h2>
            <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
              {storeDetails.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-3.5 border-b border-border last:border-0">
                    <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Top Products */}
          {topProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-foreground">
                  {isHindi ? 'टॉप प्रोडक्ट' : 'Top Products'}
                </h2>
                <button onClick={() => navigate('/products')} className="text-xs text-primary font-medium">
                  {isHindi ? 'सभी देखें →' : 'Manage All →'}
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                {topProducts.map(product => (
                  <div key={product.id} className="flex-shrink-0 w-28 bg-card border border-border rounded-xl overflow-hidden shadow-soft">
                    {product.image && (
                      <img src={product.image} alt={product.name} className="h-20 w-full object-cover" />
                    )}
                    <div className="p-2">
                      <p className="text-[10px] font-medium text-foreground truncate">{product.name}</p>
                      <p className="text-[10px] text-muted-foreground">{product.sales} {isHindi ? 'बिक्री' : 'sold'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Performance Snapshot */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {isHindi ? 'प्रदर्शन' : 'Performance'}
            </h2>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-soft space-y-3">
              {[
                { label: isHindi ? 'लिस्टिंग गुणवत्ता' : 'Listing Quality', value: Math.min(100, dealerProducts.length * 12), color: 'bg-primary' },
                { label: isHindi ? 'रिस्पॉन्स रेट' : 'Response Rate', value: dealerInquiries.length > 0 ? Math.round(((resolvedInquiries.length + dealerInquiries.filter(i => i.status === 'responded').length) / dealerInquiries.length) * 100) : 0, color: 'bg-green-500' },
                { label: isHindi ? 'ग्राहक संतुष्टि' : 'Customer Satisfaction', value: Math.round(Number(avgRating) * 20), color: 'bg-amber-500' },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{metric.label}</span>
                    <span className="font-medium text-foreground">{metric.value}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', metric.color)} style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-2"
          >
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full h-12 rounded-xl justify-between"
                  onClick={() => navigate(action.path)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-primary" />
                    {action.label}
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              );
            })}

            <Button
              variant="outline"
              className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              {t('auth.logout')}
            </Button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  function FarmerProfile() {
    const roleConfig = {
      farmer: { color: 'bg-green-100 text-green-700 border-green-200', icon: Leaf, label: isHindi ? 'किसान' : 'Farmer' },
      dealer: { color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Award, label: isHindi ? 'डीलर' : 'Dealer' },
      admin: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Shield, label: isHindi ? 'एडमिन' : 'Admin' },
    };
    const currentRole = user ? roleConfig[user.role] : null;
    const RoleIcon = currentRole?.icon || User;

    const stats = [
      { value: '12', label: isHindi ? 'स्कैन' : 'Scans', color: 'text-primary' },
      { value: '8', label: isHindi ? 'स्वस्थ' : 'Healthy', color: 'text-green-600' },
      { value: '4', label: isHindi ? 'समस्याएं' : 'Issues', color: 'text-amber-600' },
    ];

    const profileDetails = [
      { icon: Phone, label: isHindi ? 'फोन' : 'Phone', value: user?.phone || 'Not set' },
      { icon: Mail, label: isHindi ? 'ईमेल' : 'Email', value: user?.email || 'Not set' },
      { icon: MapPin, label: isHindi ? 'स्थान' : 'Location', value: user?.location || 'Not set' },
      { icon: Wheat, label: isHindi ? 'फसलें' : 'Crops', value: user?.crops?.join(', ') || 'Not set' },
      { icon: Ruler, label: isHindi ? 'खेत का आकार' : 'Farm Size', value: user?.farmSize || '5 Acres' },
      { icon: Clock, label: isHindi ? 'अनुभव' : 'Experience', value: user?.experience || '5+ years' },
    ];

    const achievements = [
      { icon: '🌱', label: isHindi ? 'पहला स्कैन' : 'First Scan', earned: true },
      { icon: '🏆', label: isHindi ? '10 स्कैन' : '10 Scans', earned: true },
      { icon: '⭐', label: isHindi ? 'विशेषज्ञ' : 'Expert', earned: false },
      { icon: '🎯', label: isHindi ? 'सटीक' : 'Accurate', earned: true },
    ];

    return (
      <AppLayout>
        <div className="container px-4 py-6 space-y-6">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-3xl p-6 shadow-soft relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5" />
            <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-primary/10" />
            
            <div className="relative flex items-start gap-4">
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl gradient-kishu flex items-center justify-center shadow-kishu">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-card border border-border shadow-soft flex items-center justify-center hover:bg-muted transition-colors">
                  <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-foreground truncate">
                    {user?.name || 'Guest User'}
                  </h1>
                  <button className="h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
                    <Edit2 className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground truncate">{user?.email || 'Not logged in'}</p>
                {currentRole && (
                  <span className={cn(
                    'inline-flex items-center gap-1 px-2.5 py-1 mt-2 rounded-full text-xs font-medium border',
                    currentRole.color
                  )}>
                    <RoleIcon className="h-3 w-3" />
                    {currentRole.label}
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {user && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
              {stats.map((stat, index) => (
                <div key={index} className="bg-card border border-border rounded-2xl p-4 text-center shadow-soft">
                  <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Achievements */}
          {user && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {isHindi ? 'उपलब्धियां' : 'Achievements'}
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={cn(
                    'flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border',
                    achievement.earned ? 'bg-primary/5 border-primary/20' : 'bg-muted/50 border-border opacity-50'
                  )}>
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="text-xs font-medium text-foreground whitespace-nowrap">{achievement.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Profile Details */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {isHindi ? 'प्रोफ़ाइल विवरण' : 'Profile Details'}
            </h2>
            <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
              {profileDetails.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="flex items-center gap-3 p-4 border-b border-border last:border-0">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground truncate">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Creator Section */}
          {user?.role === 'farmer' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              {isCreator ? (
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <Video className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{isHindi ? 'क्रिएटर स्टूडियो' : 'Creator Studio'}</p>
                        <p className="text-xs text-muted-foreground">{isHindi ? 'अपने वीडियो प्रबंधित करें' : 'Manage your videos'}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => navigate('/creator-studio')} className="rounded-xl gradient-kishu">
                      <Play className="h-4 w-4 mr-1" />
                      {isHindi ? 'खोलें' : 'Open'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Video className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{isHindi ? 'क्रिएटर बनें' : 'Become a Creator'}</p>
                      <p className="text-xs text-muted-foreground">{isHindi ? 'अपने ज्ञान को साझा करें और किसानों की मदद करें' : 'Share your knowledge and help farmers'}</p>
                    </div>
                  </div>
                  <Button onClick={() => navigate('/become-creator')} className="w-full rounded-xl gradient-kishu shadow-kishu">
                    {isHindi ? 'शुरू करें' : 'Get Started'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* My Orders */}
          {user?.role === 'farmer' && userOrders.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Button variant="outline" className="w-full h-12 rounded-xl justify-between" onClick={() => navigate('/orders')}>
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-primary" />
                  {isHindi ? 'मेरे ऑर्डर' : 'My Orders'}
                  <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{userOrders.length}</span>
                </div>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          )}

          {user && <ProfileActivityTabs />}

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="space-y-3">
            <Button variant="outline" className="w-full h-12 rounded-xl justify-between" onClick={() => navigate('/settings')}>
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                {isHindi ? 'सेटिंग्स' : 'Settings'}
              </div>
              <ChevronRight className="h-5 w-5" />
            </Button>

            {user ? (
              <Button variant="outline" className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-2" />
                {t('auth.logout')}
              </Button>
            ) : (
              <Button className="w-full h-12 rounded-xl gradient-kishu shadow-kishu" onClick={() => navigate('/login')}>
                {t('auth.login')}
              </Button>
            )}
          </motion.div>
        </div>
      </AppLayout>
    );
  }
};

export default Profile;
