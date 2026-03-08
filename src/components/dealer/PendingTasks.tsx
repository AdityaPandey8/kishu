import { motion } from 'framer-motion';
import { ChevronRight, MessageSquare, Package, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface TaskItem {
  id: string;
  icon: 'inquiry' | 'stock' | 'kyc' | 'alert';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: () => void;
}

interface PendingTasksProps {
  tasks: TaskItem[];
  title: string;
}

const iconMap = {
  inquiry: MessageSquare,
  stock: Package,
  kyc: ShieldCheck,
  alert: AlertTriangle,
};

const priorityStyles = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  low: 'bg-muted text-muted-foreground border-border',
};

export const PendingTasks = ({ tasks, title }: PendingTasksProps) => {
  if (tasks.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground text-sm">{title}</h3>
        <Badge variant="secondary" className="text-xs">{tasks.length}</Badge>
      </div>
      <div className="space-y-2">
        {tasks.map((task, i) => {
          const Icon = iconMap[task.icon];
          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              onClick={task.action}
            >
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground truncate">{task.description}</p>
              </div>
              <Badge variant="outline" className={`text-[10px] shrink-0 ${priorityStyles[task.priority]}`}>
                {task.priority}
              </Badge>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
