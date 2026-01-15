import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, MapPin, Wheat, Globe, Bell, ChevronRight, LogOut } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Mock user data
const mockUser = {
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  location: 'Delhi, India',
  crops: ['Wheat', 'Rice', 'Tomato'],
  language: 'en',
  notifications: true,
};

const Profile = () => {
  const { t, i18n } = useTranslation();

  const menuItems = [
    { icon: MapPin, label: t('profile.location'), value: mockUser.location },
    { icon: Wheat, label: t('profile.crops'), value: mockUser.crops.join(', ') },
    { icon: Globe, label: t('profile.language'), value: i18n.language === 'en' ? 'English' : 'हिंदी' },
  ];

  return (
    <AppLayout>
      <div className="container px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="h-20 w-20 rounded-2xl gradient-kishu flex items-center justify-center shadow-kishu">
            <User className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{mockUser.name}</h1>
            <p className="text-sm text-muted-foreground">{mockUser.email}</p>
            <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {t('auth.farmer')}
            </span>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left border-b border-border last:border-0"
              >
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.value}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            );
          })}
        </motion.div>

        {/* Notifications Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t('profile.notifications')}</p>
                <p className="text-xs text-muted-foreground">Get alerts about your crops</p>
              </div>
            </div>
            <Switch defaultChecked={mockUser.notifications} />
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t('auth.logout')}
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
