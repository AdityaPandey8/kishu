import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Camera, History, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { key: 'home', icon: Home, path: '/' },
  { key: 'scan', icon: Camera, path: '/scan' },
  { key: 'history', icon: History, path: '/history' },
  { key: 'profile', icon: User, path: '/profile' },
];

export const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-inset">
      <div className="container flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex flex-col items-center justify-center gap-0.5 px-4 py-2 rounded-xl transition-colors',
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              )}
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
                {t(`nav.${item.key}`)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
