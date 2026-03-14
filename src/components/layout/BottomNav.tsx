import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Camera, User, Users, Package, MessageSquare, TrendingUp, ShoppingBag, Play, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const farmerNavItems = [
    { key: 'home', icon: Home, path: '/', label: t('nav.home') },
    { key: 'shop', icon: ShoppingBag, path: '/shop', label: 'Shop' },
    { key: 'reels', icon: Play, path: '/reels', label: 'Reels' },
    { key: 'community', icon: Users, path: '/community', label: 'Community' },
    { key: 'profile', icon: User, path: '/profile', label: t('nav.profile') },
  ];

  const dealerNavItems = [
    { key: 'home', icon: Home, path: '/', label: 'Dashboard' },
    { key: 'products', icon: Package, path: '/products', label: 'Products' },
    { key: 'inquiries', icon: MessageSquare, path: '/inquiries', label: 'Inquiries' },
    { key: 'analytics', icon: TrendingUp, path: '/analytics', label: 'Analytics' },
    { key: 'profile', icon: User, path: '/profile', label: t('nav.profile') },
  ];

  const adminNavItems = [
    { key: 'home', icon: Home, path: '/', label: 'Dashboard' },
    { key: 'users', icon: Users, path: '/users', label: 'Users' },
    { key: 'kyc', icon: Package, path: '/admin/kyc', label: 'KYC' },
    { key: 'experts', icon: TrendingUp, path: '/admin/experts', label: 'Experts' },
    { key: 'profile', icon: User, path: '/profile', label: t('nav.profile') },
  ];

  const getNavItems = () => {
    switch (user?.role) {
      case 'dealer': return dealerNavItems;
      case 'admin': return adminNavItems;
      default: return farmerNavItems;
    }
  };

  const navItems = getNavItems();

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset"
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20, delay: 0.3 }}
    >
      <div className="container flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-colors',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className={cn('h-5 w-5 relative z-10', isActive && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium relative z-10">
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
};
