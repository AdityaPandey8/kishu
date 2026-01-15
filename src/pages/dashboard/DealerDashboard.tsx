import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Store, Package, Users, TrendingUp, MapPin, Phone, 
  Plus, ChevronRight, Eye, MessageSquare, IndianRupee
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Inquiries', value: '24', change: '+12%', icon: MessageSquare, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Products Listed', value: '18', change: '+3', icon: Package, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Farmers Reached', value: '156', change: '+28', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'This Month', value: '₹45K', change: '+18%', icon: IndianRupee, color: 'text-amber-600', bg: 'bg-amber-100' },
];

const mockInquiries = [
  { id: '1', farmer: 'Ramesh Kumar', crop: 'Tomato - Early Blight', location: 'Jaipur, RJ', time: '2h ago', urgent: true },
  { id: '2', farmer: 'Sunil Yadav', crop: 'Rice - Leaf Rust', location: 'Lucknow, UP', time: '5h ago', urgent: false },
  { id: '3', farmer: 'Priya Sharma', crop: 'Cotton - Pest Attack', location: 'Ahmedabad, GJ', time: '1d ago', urgent: true },
];

const mockProducts = [
  { id: '1', name: 'Mancozeb 75% WP', category: 'Fungicide', price: 450, stock: 120, sales: 45 },
  { id: '2', name: 'Neem Oil Organic', category: 'Organic', price: 320, stock: 85, sales: 72 },
  { id: '3', name: 'DAP Fertilizer', category: 'Fertilizer', price: 1200, stock: 200, sales: 38 },
];

const DealerDashboard = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const isHindi = i18n.language === 'hi';

  return (
    <AppLayout>
      <div className="container px-4 py-6 space-y-5">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-sm text-muted-foreground">{isHindi ? 'स्वागत है' : 'Welcome'},</p>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {user?.name || 'Dealer'} 
              <Store className="h-5 w-5 text-primary" />
            </h1>
          </div>
          <Button className="gradient-kishu shadow-kishu rounded-xl">
            <Plus className="h-4 w-4 mr-1" />
            {isHindi ? 'उत्पाद जोड़ें' : 'Add Product'}
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-soft"
              >
                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', stat.bg)}>
                  <Icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                  <span className="text-xs font-medium text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                    {stat.change}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Inquiries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">{isHindi ? 'हाल की पूछताछ' : 'Recent Inquiries'}</h2>
            <Button variant="ghost" size="sm" className="text-xs">
              {isHindi ? 'सभी देखें' : 'View All'} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {mockInquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="bg-card border border-border rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{inquiry.farmer}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {inquiry.location}
                      </p>
                    </div>
                  </div>
                  {inquiry.urgent && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground mb-2">{inquiry.crop}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{inquiry.time}</span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs rounded-lg">
                      <Phone className="h-3 w-3 mr-1" /> Call
                    </Button>
                    <Button size="sm" className="h-7 text-xs rounded-lg gradient-kishu">
                      Respond
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">{isHindi ? 'मेरे उत्पाद' : 'My Products'}</h2>
            <Button variant="ghost" size="sm" className="text-xs">
              {isHindi ? 'सभी देखें' : 'Manage'} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {mockProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                className="bg-card border border-border rounded-xl p-3 flex items-center gap-3 shadow-soft"
              >
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                  <Package className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.category} • Stock: {product.stock}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">₹{product.price}</p>
                  <p className="text-xs text-green-600">{product.sales} sold</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default DealerDashboard;
