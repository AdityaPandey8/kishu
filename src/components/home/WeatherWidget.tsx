import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Sun } from 'lucide-react';

// Mock weather data - will be replaced with API
const mockWeather = {
  temp: 28,
  condition: 'Partly Cloudy',
  humidity: 65,
  wind: 12,
  location: 'Delhi, India',
};

export const WeatherWidget = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="rounded-2xl gradient-earth p-4 shadow-soft"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-accent-foreground" />
          <span className="text-sm font-medium text-secondary-foreground">{t('home.weather')}</span>
        </div>
        <span className="text-xs text-muted-foreground">{mockWeather.location}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cloud className="h-10 w-10 text-secondary-foreground" />
          <div>
            <div className="text-3xl font-bold text-secondary-foreground">{mockWeather.temp}°</div>
            <div className="text-xs text-muted-foreground">{mockWeather.condition}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Droplets className="h-3.5 w-3.5" />
            <span>{mockWeather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wind className="h-3.5 w-3.5" />
            <span>{mockWeather.wind} km/h</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
