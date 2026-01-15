import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, AlertTriangle, CheckCircle, ChevronRight, Filter } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Mock data
const mockHistory = [
  { id: '1', crop: 'Tomato', disease: 'Early Blight', severity: 'medium', date: 'Jan 15, 2026' },
  { id: '2', crop: 'Rice', disease: 'Healthy', severity: 'none', date: 'Jan 14, 2026' },
  { id: '3', crop: 'Wheat', disease: 'Leaf Rust', severity: 'high', date: 'Jan 12, 2026' },
  { id: '4', crop: 'Cotton', disease: 'Healthy', severity: 'none', date: 'Jan 10, 2026' },
];

const severityConfig = {
  none: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Healthy' },
  low: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Low' },
  medium: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Medium' },
  high: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', label: 'High' },
};

const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">{t('history.title')}</h1>
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-1.5" />
            {t('common.filter')}
          </Button>
        </motion.div>

        {mockHistory.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Leaf className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{t('history.empty')}</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {mockHistory.map((item, index) => {
              const severity = severityConfig[item.severity as keyof typeof severityConfig];
              const Icon = severity.icon;

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  onClick={() => navigate(`/diagnosis/${item.id}`)}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-soft hover:shadow-md transition-all text-left"
                >
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl', severity.bg)}>
                    <Icon className={cn('h-6 w-6', severity.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-foreground truncate">{item.disease}</span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', severity.bg, severity.color)}>
                        {severity.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{item.crop}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default History;
