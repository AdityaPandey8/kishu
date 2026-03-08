import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  CloudRain, AlertTriangle, Wind, 
  Droplets, Sun, CloudSun, Bell, Search, Loader2, Cloud, Mic, MapPin
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useVoiceSearch } from '@/hooks/useVoiceSearch';

interface ForecastDay {
  date: string;
  high: number;
  low: number;
  condition: string;
  rain: number;
}

interface WeatherData {
  location: string;
  region: string;
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
  };
  forecast: ForecastDay[];
}

const getWeatherIcon = (condition: string) => {
  const c = condition.toLowerCase();
  if (c.includes('rain') || c.includes('drizzle')) return CloudRain;
  if (c.includes('cloud') || c.includes('overcast')) return Cloud;
  if (c.includes('partly') || c.includes('mist')) return CloudSun;
  return Sun;
};

const getDayLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return { en: 'Today', hi: 'आज' };
  if (date.toDateString() === tomorrow.toDateString()) return { en: 'Tomorrow', hi: 'कल' };
  return { en: date.toLocaleDateString('en', { weekday: 'short' }), hi: date.toLocaleDateString('hi', { weekday: 'short' }) };
};

const WeatherAlerts = () => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const [location, setLocation] = useState(() => localStorage.getItem('kishu_weather_location') || '');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);

  const fetchWeather = useCallback(async (loc?: string, coords?: { lat: number; lng: number }) => {
    setLoading(true);
    setError('');
    try {
      const body: any = {};
      if (coords) {
        body.lat = coords.lat;
        body.lng = coords.lng;
      } else if (loc) {
        body.location = loc;
      }
      const { data, error: fnError } = await supabase.functions.invoke('search-weather', { body });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setWeather(data);
      if (data?.location) {
        setLocation(data.location);
        localStorage.setItem('kishu_weather_location', data.location);
      }
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

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetectingLocation(false);
        fetchWeather(undefined, { lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => setDetectingLocation(false),
      { timeout: 8000 }
    );
  }, [fetchWeather]);

  useEffect(() => {
    if (location) {
      fetchWeather(location);
    } else {
      useMyLocation();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchWeather(searchInput.trim());
      setSearchInput('');
    }
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            {t('home.weather')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {weather ? `${weather.location}${weather.region ? ', ' + weather.region : ''}` : t('common.search')}
          </p>
        </motion.div>

        {/* Search + Location */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          onSubmit={handleSearch}
          className="flex gap-2 mb-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'शहर का नाम...' : 'City name...'}
              className="h-11 pl-9 rounded-xl"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          {supported && (
            <Button
              type="button"
              variant={isListening ? 'destructive' : 'outline'}
              size="icon"
              className={`h-11 w-11 rounded-xl ${isListening ? 'animate-pulse' : ''}`}
              onClick={isListening ? stopListening : startListening}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
          <Button type="submit" className="h-11 rounded-xl px-5" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('common.search')}
          </Button>
        </motion.form>

        <Button
          variant="outline"
          size="sm"
          className="mb-6 rounded-xl"
          onClick={useMyLocation}
          disabled={detectingLocation}
        >
          {detectingLocation ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <MapPin className="h-3.5 w-3.5 mr-1.5" />}
          {isHindi ? 'मेरा स्थान उपयोग करें' : 'Use my location'}
        </Button>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-12 bg-card border border-border rounded-2xl">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-3" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {weather && !loading && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-2xl p-5 shadow-soft mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold text-foreground">{weather.current.temp}°C</p>
                  <p className="text-sm text-muted-foreground mt-1">{weather.current.condition}</p>
                </div>
                <div className="flex flex-col gap-2 text-right">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-end">
                    <Droplets className="h-4 w-4" />
                    <span>{weather.current.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground justify-end">
                    <Wind className="h-4 w-4" />
                    <span>{weather.current.wind} km/h</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {weather.forecast.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-soft"
              >
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  {isHindi ? 'पूर्वानुमान' : 'Forecast'}
                </h2>
                <div className="grid grid-cols-3 gap-2">
                  {weather.forecast.map((day, index) => {
                    const Icon = getWeatherIcon(day.condition);
                    const label = getDayLabel(day.date);
                    return (
                      <div key={index} className="text-center p-3 rounded-xl bg-muted/50">
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          {isHindi ? label.hi : label.en}
                        </p>
                        <Icon className="h-6 w-6 mx-auto text-primary mb-1" />
                        <p className="text-sm font-bold text-foreground">{day.high}°</p>
                        <p className="text-xs text-muted-foreground">{day.low}°</p>
                        {day.rain > 0 && (
                          <p className="text-xs text-blue-600 flex items-center justify-center gap-0.5 mt-1">
                            <Droplets className="h-3 w-3" />
                            {day.rain}%
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default WeatherAlerts;
