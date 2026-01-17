import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Globe, User, LogIn, Bell, Search, Moon, Sun } from 'lucide-react';
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
  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <motion.button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-kishu shadow-kishu">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gradient-kishu leading-tight">
              {t('common.appName')}
            </span>
            <span className="text-[10px] text-muted-foreground leading-none hidden sm:block">
              {t('common.tagline')}
            </span>
          </div>
        </motion.button>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl"
            onClick={() => navigate('/search')}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl"
            onClick={toggleDarkMode}
          >
            {settings.darkMode ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>

          {/* Notifications */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl relative"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] text-white flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Button>
          )}

          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-9 gap-1.5 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">{currentLang}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
              <DropdownMenuItem 
                onClick={() => toggleLanguage('en')}
                className={cn(currentLang === 'en' && 'bg-primary/10 text-primary')}
              >
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => toggleLanguage('hi')}
                className={cn(currentLang === 'hi' && 'bg-primary/10 text-primary')}
              >
                🇮🇳 हिंदी
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth / Profile */}
          {user ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => navigate('/profile')}
            >
              <div className="h-7 w-7 rounded-lg gradient-kishu flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </Button>
          ) : (
            <Button
              size="sm"
              className="h-9 rounded-xl gradient-kishu shadow-kishu"
              onClick={() => navigate('/login')}
            >
              <LogIn className="h-4 w-4 mr-1" />
              {t('auth.login')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
