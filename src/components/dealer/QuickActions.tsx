import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={action.onClick}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all',
              action.variant === 'primary' && 'gradient-kishu text-white shadow-kishu',
              action.variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
              action.variant === 'outline' && 'bg-card border border-border text-foreground hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4" />
            {action.label}
          </motion.button>
        );
      })}
    </div>
  );
};
