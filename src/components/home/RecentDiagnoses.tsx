import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Leaf, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mockDiagnoses = [
  {
    id: '1',
    crop: 'Tomato',
    disease: 'Early Blight',
    severity: 'medium',
    date: '2 hours ago',
    thumbnail: null,
  },
  {
    id: '2',
    crop: 'Rice',
    disease: 'Healthy',
    severity: 'none',
    date: 'Yesterday',
    thumbnail: null,
  },
];

const severityConfig = {
  none: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
  low: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  medium: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
  high: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
};

export const RecentDiagnoses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (mockDiagnoses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="rounded-2xl bg-card border border-border p-6 text-center shadow-soft"
      >
        <Leaf className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">{t('home.noDiagnoses')}</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground">{t('home.recentDiagnoses')}</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-xs text-muted-foreground"
          onClick={() => navigate('/history')}
        >
          {t('home.viewAll')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-2">
        {mockDiagnoses.map((diagnosis, index) => {
          const severity = severityConfig[diagnosis.severity as keyof typeof severityConfig];
          const Icon = severity.icon;

          return (
            <motion.button
              key={diagnosis.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 120, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 4 }}
              onClick={() => navigate(`/diagnosis/${diagnosis.id}`)}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-card border border-border shadow-soft hover:shadow-md transition-shadow text-left"
              style={{ transformPerspective: 800 }}
            >
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', severity.bg)}>
                <Icon className={cn('h-5 w-5', severity.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">{diagnosis.disease}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{diagnosis.crop}</span>
                  <span>•</span>
                  <span>{diagnosis.date}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};
