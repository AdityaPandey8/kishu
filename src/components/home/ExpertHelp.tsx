import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Video, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ExpertHelp = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 border border-border p-4 shadow-soft"
      style={{ transformPerspective: 1000 }}
    >
      <div className="flex items-start gap-4">
        <motion.div
          className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MessageCircle className="h-6 w-6 text-primary" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            {isHindi ? 'विशेषज्ञ से बात करें' : 'Talk to an Expert'}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            {isHindi ? 'कृषि विशेषज्ञों से सीधे सलाह लें' : 'Get direct advice from agriculture experts'}
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">
              <Phone className="h-3 w-3 mr-1" />
              {isHindi ? 'कॉल' : 'Call'}
            </Button>
            <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">
              <Video className="h-3 w-3 mr-1" />
              {isHindi ? 'वीडियो' : 'Video'}
            </Button>
            <Button size="sm" className="h-8 rounded-lg text-xs gradient-kishu ml-auto">
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
