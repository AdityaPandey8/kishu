import { motion } from 'framer-motion';

interface ScoreItem {
  label: string;
  score: number;
  maxScore: number;
  color: string;
}

interface PerformanceScorecardProps {
  scores: ScoreItem[];
  title: string;
}

const CircularProgress = ({ score, maxScore, color, label }: ScoreItem) => {
  const percentage = Math.round((score / maxScore) * 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (pct: number) => {
    if (pct >= 80) return 'text-green-500 stroke-green-500';
    if (pct >= 50) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  const colorClass = getColor(percentage);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth="6"
          />
          <motion.circle
            cx="40" cy="40" r={radius}
            fill="none"
            className={colorClass}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${colorClass.split(' ')[0]}`}>{percentage}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    </motion.div>
  );
};

export const PerformanceScorecard = ({ scores, title }: PerformanceScorecardProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <h3 className="font-semibold text-foreground text-sm mb-4">{title}</h3>
      <div className="flex justify-around">
        {scores.map((item, i) => (
          <CircularProgress key={i} {...item} />
        ))}
      </div>
    </div>
  );
};
