import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, MapPin, Wheat, Globe, Bell, ChevronRight, LogOut, Settings, Shield, Camera } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const roleColors = {
    farmer: 'bg-green-100 text-green-700',
    dealer: 'bg-purple-100 text-purple-700',
    admin: 'bg-blue-100 text-blue-700',
  };

  const menuItems = [
    { icon: MapPin, label: t('profile.location'), value: user?.location || 'Not set' },
    { icon: Wheat, label: t('profile.crops'), value: user?.crops?.join(', ') || 'Not set' },
    { icon: Globe, label: t('profile.language'), value: i18n.language === 'en' ? 'English' : 'हिंदी' },
  ];

  return (
    <AppLayout>
      <div className="container px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative mb-4">
            <div className="h-24 w-24 rounded-2xl gradient-kishu flex items-center justify-center shadow-kishu">
              <User className="h-12 w-12 text-primary-foreground" />
            </div>
            <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-card border border-border shadow-soft flex items-center justify-center">
              <Camera className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <h1 className="text-xl font-bold text-foreground">{user?.name || 'Guest'}</h1>
          <p className="text-sm text-muted-foreground">{user?.email || 'Not logged in'}</p>
          {user && (
            <span className={cn(
              'inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium capitalize',
              roleColors[user.role]
            )}>
              {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
              {t(`auth.${user.role}`)}
            </span>
          )}
        </motion.div>

        {/* Quick Stats */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-card border border-border rounded-xl p-3 text-center shadow-soft">
              <p className="text-2xl font-bold text-primary">12</p>
              <p className="text-xs text-muted-foreground">Scans</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center shadow-soft">
              <p className="text-2xl font-bold text-green-600">8</p>
              <p className="text-xs text-muted-foreground">Healthy</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-3 text-center shadow-soft">
              <p className="text-2xl font-bold text-amber-600">4</p>
              <p className="text-xs text-muted-foreground">Issues</p>
            </div>
          </motion.div>
        )}

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
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
            <Switch defaultChecked />
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl justify-start"
            onClick={() => {}}
          >
            <Settings className="h-5 w-5 mr-3" />
            {t('nav.settings')}
            <ChevronRight className="h-5 w-5 ml-auto" />
          </Button>
        </motion.div>

        {/* Auth Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {user ? (
            <Button 
              variant="outline" 
              className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              {t('auth.logout')}
            </Button>
          ) : (
            <Button 
              className="w-full h-12 rounded-xl gradient-kishu shadow-kishu"
              onClick={() => navigate('/login')}
            >
              {t('auth.login')}
            </Button>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Profile;
