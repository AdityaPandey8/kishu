import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, AlertTriangle, CheckCircle, ChevronRight, Filter, Trash2, Bookmark } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const severityConfig = {
  none: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Healthy' },
  low: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Low' },
  medium: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Medium' },
  high: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', label: 'High' },
};

const History = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { diagnoses, deleteDiagnosis, toggleBookmark } = useData();
  const isHindi = i18n.language === 'hi';
  const [activeFilter, setActiveFilter] = useState<'all' | 'bookmarked'>('all');

  const userDiagnoses = diagnoses.filter(d => d.userId === user?.id);
  const filteredDiagnoses = activeFilter === 'bookmarked' 
    ? userDiagnoses.filter(d => d.bookmarked)
    : userDiagnoses;

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">{t('history.title')}</h1>
          <div className="flex gap-2">
            <Button 
              variant={activeFilter === 'all' ? 'default' : 'outline'} 
              size="sm" 
              className="h-9 rounded-xl"
              onClick={() => setActiveFilter('all')}
            >
              {isHindi ? 'सभी' : 'All'}
            </Button>
            <Button 
              variant={activeFilter === 'bookmarked' ? 'default' : 'outline'} 
              size="sm" 
              className="h-9 rounded-xl"
              onClick={() => setActiveFilter('bookmarked')}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {filteredDiagnoses.length === 0 ? (
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
            {filteredDiagnoses.map((item, index) => {
              const severity = severityConfig[item.severity];
              const Icon = severity.icon;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-soft"
                >
                  <button
                    onClick={() => navigate(`/diagnosis/${item.id}`)}
                    className="flex items-center gap-3 flex-1 text-left"
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
                        <span>•</span>
                        <span>{item.confidence}%</span>
                      </div>
                    </div>
                  </button>
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => toggleBookmark(item.id)}
                    >
                      <Bookmark className={cn('h-4 w-4', item.bookmarked ? 'fill-primary text-primary' : 'text-muted-foreground')} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => deleteDiagnosis(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default History;
