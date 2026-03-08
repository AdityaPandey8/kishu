import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronRight } from 'lucide-react';

interface Tip {
  text: string;
  action?: () => void;
}

interface GrowthTipsBannerProps {
  tips: Tip[];
}

export const GrowthTipsBanner = ({ tips }: GrowthTipsBannerProps) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (tips.length <= 1) return;
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tips.length]);

  if (tips.length === 0) return null;

  return (
    <div
      className="bg-primary/5 border border-primary/20 rounded-2xl p-4 cursor-pointer hover:bg-primary/10 transition-colors"
      onClick={tips[index]?.action}
    >
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-foreground flex-1"
          >
            {tips[index].text}
          </motion.p>
        </AnimatePresence>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
      {tips.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {tips.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${i === index ? 'w-4 bg-primary' : 'w-1 bg-primary/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
