import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Sprout, Sun, CloudRain } from 'lucide-react';

const currentMonth = new Date().toLocaleString('default', { month: 'long' });

const seasonalTasks = [
  { icon: Sprout, task: 'Start wheat sowing', taskHi: 'गेहूं की बुवाई शुरू करें', priority: 'high' },
  { icon: CloudRain, task: 'Prepare for winter irrigation', taskHi: 'सर्दियों की सिंचाई की तैयारी', priority: 'medium' },
  { icon: Sun, task: 'Apply organic manure', taskHi: 'जैविक खाद डालें', priority: 'low' },
];

const priorityColors = {
  high: 'bg-red-100 text-red-600 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-green-100 text-green-600 border-green-200',
};

export const SeasonalCalendar = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl bg-card border border-border p-4 shadow-soft"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          {isHindi ? 'मौसमी कार्य' : 'Seasonal Tasks'}
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
          {currentMonth}
        </span>
      </div>

      <div className="space-y-2">
        {seasonalTasks.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl border ${priorityColors[item.priority as keyof typeof priorityColors]}`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">
                {isHindi ? item.taskHi : item.task}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
