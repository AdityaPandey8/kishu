import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Sun, Search, Loader2, CloudRain, CloudSun, Mic } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';

interface WeatherData {
  location: string;
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
  };
}

export const WeatherWidget = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(() => localStorage.getItem('kishu_weather_location') || 'Delhi');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeather = useCallback(async (loc: string) => {
    setLoading(true);
    setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('search-weather', {
        body: { location: loc },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setWeather(data);
      setLocation(loc);
      localStorage.setItem('kishu_weather_location', loc);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }, []);

  const { isListening, startListening, stopListening, supported } = useVoiceSearch({
    onResult: (transcript) => {
      setSearchInput(transcript);
      fetchWeather(transcript.trim());
    },
  });

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  const conditionIcon = () => {
    if (!weather) return <Sun className="h-10 w-10 text-secondary-foreground" />;
    const c = weather.current.condition.toLowerCase();
    if (c.includes('rain') || c.includes('drizzle')) return <CloudRain className="h-10 w-10 text-secondary-foreground" />;
    if (c.includes('cloud') || c.includes('overcast')) return <Cloud className="h-10 w-10 text-secondary-foreground" />;
    if (c.includes('partly') || c.includes('mist')) return <CloudSun className="h-10 w-10 text-secondary-foreground" />;
    return <Sun className="h-10 w-10 text-secondary-foreground" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="rounded-2xl gradient-earth p-4 shadow-soft"
      style={{ transformPerspective: 1000 }}
    >
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t('home.weather') + ' - search city...'}
            className="w-full h-8 pl-7 pr-2 text-xs rounded-lg border border-border bg-background/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        {supported && (
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors ${
              isListening ? 'bg-destructive text-destructive-foreground border-destructive animate-pulse' : 'border-border bg-background/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Mic className="h-3.5 w-3.5" />
          </button>
        )}
        <button type="submit" className="h-8 px-3 text-xs rounded-lg bg-primary text-primary-foreground font-medium">
          Go
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      ) : weather ? (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div animate={{ rotate: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <Sun className="h-5 w-5 text-accent-foreground" />
              </motion.div>
              <span className="text-sm font-medium text-secondary-foreground">{t('home.weather')}</span>
            </div>
            <span className="text-xs text-muted-foreground">{weather.location}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                {conditionIcon()}
              </motion.div>
              <div>
                <div className="text-3xl font-bold text-secondary-foreground">{weather.current.temp}°</div>
                <div className="text-xs text-muted-foreground">{weather.current.condition}</div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Droplets className="h-3.5 w-3.5" />
                <span>{weather.current.humidity}%</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Wind className="h-3.5 w-3.5" />
                <span>{weather.current.wind} km/h</span>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </motion.div>
  );
};
