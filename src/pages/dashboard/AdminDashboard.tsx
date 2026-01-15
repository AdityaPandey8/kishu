import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Shield, Users, Store, Camera, TrendingUp, 
  CheckCircle, XCircle, Clock, ChevronRight, 
  AlertTriangle, Activity, BarChart3
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const platformStats = [
  { label: 'Total Users', value: '2,847', change: '+156 this week', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Total Scans', value: '12.4K', change: '+892 today', icon: Camera, color: 'text-green-600', bg: 'bg-green-100' },
  { label: 'Active Dealers', value: '186', change: '+12 pending', icon: Store, color: 'text-purple-600', bg: 'bg-purple-100' },
  { label: 'Success Rate', value: '94.2%', change: '+2.1%', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' },
];

const pendingApprovals = [
  { id: '1', name: 'Agri Solutions Pvt Ltd', type: 'Dealer', location: 'Mumbai, MH', date: '2 days ago' },
  { id: '2', name: 'Green Farm Supplies', type: 'Dealer', location: 'Pune, MH', date: '3 days ago' },
  { id: '3', name: 'Kisan Seva Center', type: 'Dealer', location: 'Nagpur, MH', date: '5 days ago' },
];

const recentActivity = [
  { action: 'New farmer registered', user: 'Ramesh Kumar', time: '5 min ago', icon: Users },
  { action: 'Disease detected', user: 'Wheat - Leaf Rust', time: '12 min ago', icon: AlertTriangle },
  { action: 'Dealer approved', user: 'Farm Tech Solutions', time: '1h ago', icon: CheckCircle },
  { action: 'New scan completed', user: 'Tomato - Early Blight', time: '2h ago', icon: Camera },
];

const AdminDashboard = () => {
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
            <p className="text-sm text-muted-foreground">{isHindi ? 'एडमिन पैनल' : 'Admin Panel'}</p>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {user?.name || 'Admin'} 
              <Shield className="h-5 w-5 text-primary" />
            </h1>
          </div>
          <Button variant="outline" className="rounded-xl">
            <BarChart3 className="h-4 w-4 mr-1" />
            {isHindi ? 'रिपोर्ट' : 'Reports'}
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {platformStats.map((stat, index) => {
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
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Pending Approvals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-4 shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-600" />
              {isHindi ? 'लंबित अनुमोदन' : 'Pending Approvals'}
            </h2>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
              {pendingApprovals.length} pending
            </span>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Store className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.location} • {item.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-100">
                    <XCircle className="h-4 w-4" />
                  </Button>
                  <Button size="icon" className="h-8 w-8 gradient-kishu">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              {isHindi ? 'हाल की गतिविधि' : 'Recent Activity'}
            </h2>
            <Button variant="ghost" size="sm" className="text-xs">
              {isHindi ? 'सभी देखें' : 'View All'} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 + index * 0.05 }}
                  className="flex items-center gap-3 p-3 border-b border-border last:border-0"
                >
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.user}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default AdminDashboard;
