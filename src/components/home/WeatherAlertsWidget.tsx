import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, ChevronRight, AlertTriangle } from 'lucide-react';

export const WeatherAlertsWidget = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';

  return (
    <motion.button
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => navigate('/weather-alerts')}
      className="w-full rounded-2xl bg-amber-50 border border-amber-200 p-4 shadow-soft text-left"
      style={{ transformPerspective: 1000 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </motion.div>
          <div>
            <p className="font-semibold text-amber-800">
              {isHindi ? 'मौसम अलर्ट' : 'Weather Alert'}
            </p>
            <p className="text-xs text-amber-700">
              {isHindi ? 'भारी बारिश की संभावना' : 'Heavy rain expected'}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-amber-600" />
      </div>
    </motion.button>
  );
};
