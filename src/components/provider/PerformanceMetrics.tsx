import { motion } from 'framer-motion';
import { TrendingUp, Clock, ThumbsUp, Target, Zap, Award } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface PerformanceMetricsProps {
  completedCount: number;
  totalCount: number;
  avgRating: number;
}

export const PerformanceMetrics = ({ completedCount, totalCount, avgRating }: PerformanceMetricsProps) => {
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const responseTime = '28 min';
  const repeatRate = 68;
  const satisfactionScore = avgRating > 0 ? Math.round(avgRating * 20) : 85;

  const metrics = [
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      progress: completionRate,
      icon: Target,
      color: 'text-blue-600',
      progressColor: 'bg-blue-500',
    },
    {
      label: 'Avg Response Time',
      value: responseTime,
      progress: 72,
      icon: Clock,
      color: 'text-amber-600',
      progressColor: 'bg-amber-500',
    },
    {
      label: 'Customer Satisfaction',
      value: `${satisfactionScore}%`,
      progress: satisfactionScore,
      icon: ThumbsUp,
      color: 'text-green-600',
      progressColor: 'bg-green-500',
    },
    {
      label: 'Repeat Customers',
      value: `${repeatRate}%`,
      progress: repeatRate,
      icon: Award,
      color: 'text-purple-600',
      progressColor: 'bg-purple-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card border border-border rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm text-foreground">Performance</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-3 rounded-xl bg-muted/30 border border-border/50"
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className={cn('h-3.5 w-3.5', m.color)} />
                <span className="text-[10px] text-muted-foreground">{m.label}</span>
              </div>
              <p className="text-lg font-bold text-foreground mb-1.5">{m.value}</p>
              <Progress value={m.progress} className={cn('h-1.5 [&>div]:transition-all', `[&>div]:${m.progressColor}`)} />
            </motion.div>
          );
        })}
      </div>

      {/* Quick insight */}
      <div className="mt-3 p-2.5 rounded-xl bg-primary/5 border border-primary/10">
        <div className="flex items-start gap-2">
          <TrendingUp className="h-3.5 w-3.5 text-primary mt-0.5" />
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground">Top Performer!</span> Your completion rate is above 90% of providers in your area. Keep it up!
          </p>
        </div>
      </div>
    </motion.div>
  );
};
