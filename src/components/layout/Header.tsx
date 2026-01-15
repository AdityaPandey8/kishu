import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Leaf, Globe, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenu?: boolean;
}

export const Header = ({ onMenuToggle, showMenu }: HeaderProps) => {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('kishu-language', lang);
  };

  const currentLang = i18n.language;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset">
      <div className="container flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <motion.div 
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
            <span className="text-[10px] text-muted-foreground leading-none">
              {t('common.tagline')}
            </span>
          </div>
        </motion.div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
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

          {/* Menu Toggle */}
          {showMenu && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                onMenuToggle?.();
              }}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
