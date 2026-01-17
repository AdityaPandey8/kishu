import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  index?: number;
  onClick?: () => void;
}

export const StatsCard = ({ 
  label, 
  value, 
  change, 
  icon: Icon, 
  color, 
  bgColor, 
  index = 0,
  onClick 
}: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={cn(
        'bg-card border border-border rounded-2xl p-4 shadow-soft',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow'
      )}
    >
      <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-3', bgColor)}>
        <Icon className={cn('h-5 w-5', color)} />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
        {change && (
          <span className={cn(
            'text-xs font-medium px-1.5 py-0.5 rounded',
            change.startsWith('+') || change.startsWith('↑') 
              ? 'text-green-600 bg-green-100' 
              : change.startsWith('-') || change.startsWith('↓')
                ? 'text-red-600 bg-red-100'
                : 'text-muted-foreground bg-muted'
          )}>
            {change}
          </span>
        )}
      </div>
    </motion.div>
  );
};
