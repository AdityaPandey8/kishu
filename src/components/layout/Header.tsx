import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Globe, User, LogIn, Bell, Search, Moon, Sun, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useSettings } from '@/contexts/SettingsContext';

export const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { unreadCount } = useData();
  const { settings, toggleDarkMode } = useSettings();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('kishu-language', lang);
  };

  const currentLang = i18n.language;
  const isHindi = currentLang === 'hi';
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  if (isAuthPage) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return isHindi ? 'सुप्रभात' : 'Good Morning';
    if (hour < 17) return isHindi ? 'शुभ दोपहर' : 'Good Afternoon';
    return isHindi ? 'शुभ संध्या' : 'Good Evening';
  };

  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'farmer': return isHindi ? 'किसान' : 'Farmer';
      case 'dealer': return isHindi ? 'डीलर' : 'Dealer';
      case 'admin': return isHindi ? 'एडमिन' : 'Admin';
      default: return '';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full safe-area-inset">
      {/* Glass-morphism header background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-b border-border/40" />
      
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container relative flex h-16 items-center justify-between px-4">
        {/* Logo & Greeting */}
        <motion.button 
          onClick={() => navigate('/')}
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div 
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg"
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Leaf className="h-5 w-5 text-primary-foreground" />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-xl bg-primary/30 blur-lg -z-10" />
          </motion.div>
          <div className="flex flex-col">
            {user ? (
              <>
                <span className="text-xs text-muted-foreground leading-tight">
                  {getGreeting()}
                </span>
                <span className="text-sm font-semibold text-foreground leading-tight truncate max-w-[120px]">
                  {user.name?.split(' ')[0] || getRoleLabel()}
                </span>
              </>
            ) : (
              <>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent leading-tight">
                  {t('common.appName')}
                </span>
                <span className="text-[10px] text-muted-foreground leading-none hidden sm:block">
                  {t('common.tagline')}
                </span>
              </>
            )}
          </div>
        </motion.button>

        {/* Right Actions */}
        <motion.div 
          className="flex items-center gap-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Search */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-primary/10"
              onClick={() => navigate('/search')}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          </motion.div>

          {/* Dark Mode Toggle */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-primary/10"
              onClick={toggleDarkMode}
            >
              <motion.div
                initial={false}
                animate={{ rotate: settings.darkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {settings.darkMode ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4 text-muted-foreground" />
                )}
              </motion.div>
            </Button>
          </motion.div>

          {/* Notifications */}
          {user && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl relative hover:bg-primary/10"
                onClick={() => navigate('/notifications')}
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center font-medium shadow-lg"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </Button>
            </motion.div>
          )}

          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-9 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground hover:bg-primary/10 rounded-xl"
                >
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase">{currentLang}</span>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px] rounded-xl">
              <DropdownMenuItem 
                onClick={() => toggleLanguage('en')}
                className={cn(
                  'rounded-lg cursor-pointer',
                  currentLang === 'en' && 'bg-primary/10 text-primary'
                )}
              >
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => toggleLanguage('hi')}
                className={cn(
                  'rounded-lg cursor-pointer',
                  currentLang === 'hi' && 'bg-primary/10 text-primary'
                )}
              >
                🇮🇳 हिंदी
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth / Profile */}
          {user ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl p-0 overflow-hidden hover:ring-2 hover:ring-primary/30"
                onClick={() => navigate('/profile')}
              >
                <div className="h-full w-full rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center relative">
                  <User className="h-4 w-4 text-primary-foreground" />
                  {/* Online indicator */}
                  <span className="absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full bg-green-500 ring-2 ring-background" />
                </div>
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="sm"
                className="h-9 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25"
                onClick={() => navigate('/login')}
              >
                <LogIn className="h-4 w-4 mr-1" />
                {t('auth.login')}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </header>
  );
};
