import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, MapPin, Wheat, Globe, Bell, ChevronRight, LogOut, 
  Settings, Shield, Camera, Edit2, Phone, Mail, Ruler, Clock,
  Award, Leaf, TrendingUp
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHindi = i18n.language === 'hi';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const roleConfig = {
    farmer: { 
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: Leaf,
      label: isHindi ? 'किसान' : 'Farmer',
    },
    dealer: { 
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: Award,
      label: isHindi ? 'डीलर' : 'Dealer',
    },
    admin: { 
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: Shield,
      label: isHindi ? 'एडमिन' : 'Admin',
    },
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
          {/* Background decoration */}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3"
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-card border border-border rounded-2xl p-4 text-center shadow-soft"
              >
                <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Achievements */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {isHindi ? 'उपलब्धियां' : 'Achievements'}
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex-shrink-0 flex flex-col items-center gap-1 px-4 py-3 rounded-xl border',
                    achievement.earned 
                      ? 'bg-primary/5 border-primary/20' 
                      : 'bg-muted/50 border-border opacity-50'
                  )}
                >
                  <span className="text-2xl">{achievement.icon}</span>
                  <span className="text-xs font-medium text-foreground whitespace-nowrap">
                    {achievement.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Profile Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">
            {isHindi ? 'प्रोफ़ाइल विवरण' : 'Profile Details'}
          </h2>
          <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
            {profileDetails.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 border-b border-border last:border-0"
                >
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

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <Button 
            variant="outline" 
            className="w-full h-12 rounded-xl justify-between"
            onClick={() => navigate('/settings')}
          >
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5" />
              {isHindi ? 'सेटिंग्स' : 'Settings'}
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>

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
