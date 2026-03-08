import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const WeatherAlertsWidget = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cityName, setCityName] = useState(() => localStorage.getItem('kishu_device_city') || '');
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    if (cityName) return;
    if (!navigator.geolocation) return;
    
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { data } = await supabase.functions.invoke('search-weather', {
            body: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          });
          if (data?.location) {
            setCityName(data.location);
            localStorage.setItem('kishu_device_city', data.location);
          }
        } catch {
          // silently fail
        } finally {
          setDetecting(false);
        }
      },
      () => setDetecting(false),
      { timeout: 5000 }
    );
  }, []);

  return (
    <motion.button
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => navigate('/weather-alerts')}
      className="w-full rounded-2xl bg-amber-50 border border-amber-200 p-4 shadow-soft text-left dark:bg-amber-950/30 dark:border-amber-800"
      style={{ transformPerspective: 1000 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </motion.div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
              {t('home.weather')} {t('common.appName') ? '' : 'Alert'}
              {cityName && (
                <span className="text-xs font-normal text-amber-600 dark:text-amber-400 flex items-center gap-0.5">
                  <MapPin className="h-3 w-3" />
                  {cityName}
                </span>
              )}
              {detecting && <Loader2 className="h-3 w-3 animate-spin text-amber-500" />}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300">
              {t('weather.today')}
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      </div>
    </motion.button>
  );
};
