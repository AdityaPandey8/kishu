import { motion } from 'framer-motion';
import { 
  MessageSquare, Package, CheckCircle, UserPlus, 
  TrendingUp, AlertTriangle, LucideIcon 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ActivityItem {
  id: string;
  type: 'inquiry' | 'product' | 'response' | 'customer' | 'sale' | 'alert';
  title: string;
  description: string;
  timestamp: string;
}

const activityConfig: Record<string, { icon: LucideIcon; color: string; bgColor: string }> = {
  inquiry: { icon: MessageSquare, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  product: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  response: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
  customer: { icon: UserPlus, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  sale: { icon: TrendingUp, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  alert: { icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100' },
};

interface ActivityTimelineProps {
  activities: ActivityItem[];
  title?: string;
}

export const ActivityTimeline = ({ activities, title = 'Recent Activity' }: ActivityTimelineProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
      <h3 className="font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={cn('h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0', config.bgColor)}>
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
              </div>
              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
