import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Globe, Bell, Moon, Sun, Shield, Smartphone, 
  HelpCircle, FileText, MessageSquare, Trash2, ChevronRight,
  Volume2, Vibrate, Download, RefreshCw
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isHindi = i18n.language === 'hi';
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [autoSync, setAutoSync] = useState(true);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('kishu-language', lang);
    toast.success(lang === 'hi' ? 'भाषा बदली गई' : 'Language changed');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    toast.error('This feature requires backend integration');
  };

  const settingsSections = [
    {
      title: isHindi ? 'सामान्य' : 'General',
      items: [
        {
          icon: Globe,
          label: isHindi ? 'भाषा' : 'Language',
          description: i18n.language === 'hi' ? 'हिंदी' : 'English',
          action: 'language',
        },
        {
          icon: darkMode ? Moon : Sun,
          label: isHindi ? 'डार्क मोड' : 'Dark Mode',
          description: isHindi ? 'आंखों पर आसान' : 'Easy on eyes',
          toggle: true,
          value: darkMode,
          onChange: setDarkMode,
        },
      ],
    },
    {
      title: isHindi ? 'सूचनाएं' : 'Notifications',
      items: [
        {
          icon: Bell,
          label: isHindi ? 'पुश सूचनाएं' : 'Push Notifications',
          description: isHindi ? 'अलर्ट और अपडेट' : 'Alerts & updates',
          toggle: true,
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Volume2,
          label: isHindi ? 'ध्वनि' : 'Sound',
          description: isHindi ? 'अधिसूचना ध्वनि' : 'Notification sound',
          toggle: true,
          value: soundEnabled,
          onChange: setSoundEnabled,
        },
        {
          icon: Vibrate,
          label: isHindi ? 'कंपन' : 'Vibration',
          description: isHindi ? 'कंपन अलर्ट' : 'Haptic feedback',
          toggle: true,
          value: vibrationEnabled,
          onChange: setVibrationEnabled,
        },
      ],
    },
    {
      title: isHindi ? 'डेटा और स्टोरेज' : 'Data & Storage',
      items: [
        {
          icon: Download,
          label: isHindi ? 'ऑफलाइन मोड' : 'Offline Mode',
          description: isHindi ? 'बिना इंटरनेट उपयोग' : 'Use without internet',
          toggle: true,
          value: offlineMode,
          onChange: setOfflineMode,
        },
        {
          icon: RefreshCw,
          label: isHindi ? 'ऑटो सिंक' : 'Auto Sync',
          description: isHindi ? 'स्वचालित डेटा सिंक' : 'Automatic data sync',
          toggle: true,
          value: autoSync,
          onChange: setAutoSync,
        },
      ],
    },
    {
      title: isHindi ? 'सहायता' : 'Support',
      items: [
        {
          icon: HelpCircle,
          label: isHindi ? 'सहायता केंद्र' : 'Help Center',
          description: isHindi ? 'FAQ और गाइड' : 'FAQs & guides',
          action: 'help',
        },
        {
          icon: MessageSquare,
          label: isHindi ? 'प्रतिक्रिया भेजें' : 'Send Feedback',
          description: isHindi ? 'हमें बताएं' : 'Let us know',
          action: 'feedback',
        },
        {
          icon: FileText,
          label: isHindi ? 'नियम और शर्तें' : 'Terms & Conditions',
          description: isHindi ? 'कानूनी जानकारी' : 'Legal information',
          action: 'terms',
        },
      ],
    },
  ];

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            {isHindi ? 'सेटिंग्स' : 'Settings'}
          </h1>
        </motion.div>

        <div className="space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
                {section.title}
              </h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
                {section.items.map((item, itemIndex) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={itemIndex}
                      className={cn(
                        'flex items-center gap-3 p-4 border-b border-border last:border-0',
                        item.action && 'cursor-pointer hover:bg-muted/50 transition-colors'
                      )}
                      onClick={() => {
                        if (item.action === 'language') {
                          handleLanguageChange(i18n.language === 'hi' ? 'en' : 'hi');
                        } else if (item.action) {
                          toast.info('This feature is coming soon!');
                        }
                      }}
                    >
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                      {item.toggle ? (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Account Actions */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-3 pt-4"
            >
              <Button 
                variant="outline" 
                className="w-full h-12 rounded-xl text-foreground"
                onClick={handleLogout}
              >
                {isHindi ? 'लॉग आउट करें' : 'Log Out'}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleDeleteAccount}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isHindi ? 'खाता हटाएं' : 'Delete Account'}
              </Button>
            </motion.div>
          )}

          {/* App Version */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center pt-4"
          >
            <p className="text-xs text-muted-foreground">
              KISHU v1.0.0 • Made with 💚 for Indian Farmers
            </p>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
