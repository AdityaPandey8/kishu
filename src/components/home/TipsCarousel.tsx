import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tips = ['tip1', 'tip2', 'tip3'];

export const TipsCarousel = () => {
  const { t } = useTranslation();
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextTip = () => setCurrentTip((prev) => (prev + 1) % tips.length);
  const prevTip = () => setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="rounded-2xl bg-card border border-border p-4 shadow-soft"
      style={{ transformPerspective: 1000 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Lightbulb className="h-4 w-4 text-accent-foreground" />
          </motion.div>
          <h3 className="font-semibold text-foreground">{t('home.tips')}</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevTip}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextTip}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative min-h-[60px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTip}
            initial={{ opacity: 0, x: 30, rotateY: -10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -30, rotateY: 10 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {t(`tips.${tips[currentTip]}`)}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        {tips.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentTip(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentTip ? 'w-4 bg-primary' : 'w-1.5 bg-muted-foreground/30'
            }`}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        ))}
      </div>
    </motion.div>
  );
};
