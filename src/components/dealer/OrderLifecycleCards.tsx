import { motion } from 'framer-motion';
import { Clock, Loader2, CheckCircle2, LayoutList } from 'lucide-react';

interface LifecycleItem {
  label: string;
  count: number;
  icon: 'pending' | 'progress' | 'resolved' | 'total';
  onClick?: () => void;
}

interface OrderLifecycleCardsProps {
  items: LifecycleItem[];
}

const iconMap = {
  pending: Clock,
  progress: Loader2,
  resolved: CheckCircle2,
  total: LayoutList,
};

const colorMap = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  progress: 'bg-primary/10 text-primary border-primary/30',
  resolved: 'bg-green-500/10 text-green-600 border-green-500/30',
  total: 'bg-muted text-muted-foreground border-border',
};

export const OrderLifecycleCards = ({ items }: OrderLifecycleCardsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {items.map((item, i) => {
        const Icon = iconMap[item.icon];
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={item.onClick}
            className={`flex-1 min-w-[80px] border rounded-xl p-3 text-center cursor-pointer hover:shadow-sm transition-shadow ${colorMap[item.icon]}`}
          >
            <Icon className="h-5 w-5 mx-auto mb-1.5" />
            <p className="text-xl font-bold">{item.count}</p>
            <p className="text-[10px] font-medium mt-0.5">{item.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};
