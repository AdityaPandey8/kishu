import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  CloudRain, AlertTriangle, Thermometer, Wind, 
  Droplets, Sun, CloudSun, X, Bell
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';

const mockAlerts = [
  {
    id: '1',
    type: 'rain',
    severity: 'warning',
    title: 'Heavy Rain Expected',
    titleHi: 'भारी बारिश की संभावना',
    description: 'Expected rainfall of 50-80mm in next 48 hours. Protect your crops.',
    descriptionHi: 'अगले 48 घंटों में 50-80mm बारिश की संभावना। अपनी फसलों को सुरक्षित करें।',
    time: '2h ago',
    icon: CloudRain,
  },
  {
    id: '2',
    type: 'heat',
    severity: 'alert',
    title: 'Heat Wave Warning',
    titleHi: 'लू की चेतावनी',
    description: 'Temperature may rise above 42°C. Increase irrigation frequency.',
    descriptionHi: 'तापमान 42°C से ऊपर जा सकता है। सिंचाई की आवृत्ति बढ़ाएं।',
    time: '1d ago',
    icon: Thermometer,
  },
  {
    id: '3',
    type: 'pest',
    severity: 'info',
    title: 'Pest Alert - Aphids',
    titleHi: 'कीट चेतावनी - एफिड्स',
    description: 'Aphid infestation reported in nearby areas. Monitor your crops.',
    descriptionHi: 'आस-पास के क्षेत्रों में एफिड्स की सूचना। अपनी फसलों की निगरानी करें।',
    time: '2d ago',
    icon: AlertTriangle,
  },
];

const forecast = [
  { day: 'Today', dayHi: 'आज', icon: Sun, high: 32, low: 18, rain: 0 },
  { day: 'Tomorrow', dayHi: 'कल', icon: CloudSun, high: 30, low: 17, rain: 20 },
  { day: 'Wed', dayHi: 'बुध', icon: CloudRain, high: 28, low: 16, rain: 80 },
  { day: 'Thu', dayHi: 'गुरु', icon: CloudRain, high: 26, low: 15, rain: 60 },
  { day: 'Fri', dayHi: 'शुक्र', icon: CloudSun, high: 29, low: 16, rain: 10 },
];

const severityColors = {
  info: 'bg-blue-100 text-blue-700 border-blue-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  alert: 'bg-red-100 text-red-700 border-red-200',
};

const WeatherAlerts = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const visibleAlerts = mockAlerts.filter(a => !dismissedAlerts.includes(a.id));

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            {isHindi ? 'मौसम अलर्ट' : 'Weather Alerts'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isHindi ? 'महत्वपूर्ण मौसम सूचनाएं' : 'Important weather notifications'}
          </p>
        </motion.div>

        {/* 5-Day Forecast */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-4 shadow-soft mb-6"
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            {isHindi ? '5-दिन का पूर्वानुमान' : '5-Day Forecast'}
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map((day, index) => {
              const Icon = day.icon;
              return (
                <div key={index} className="text-center p-2 rounded-xl bg-muted/50">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {isHindi ? day.dayHi : day.day}
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

        {/* Active Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            {isHindi ? 'सक्रिय अलर्ट' : 'Active Alerts'}
            {visibleAlerts.length > 0 && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                {visibleAlerts.length}
              </span>
            )}
          </h2>
          
          {visibleAlerts.length === 0 ? (
            <div className="text-center py-12 bg-card border border-border rounded-2xl">
              <Sun className="h-12 w-12 mx-auto text-amber-400 mb-3" />
              <p className="text-muted-foreground">
                {isHindi ? 'कोई सक्रिय अलर्ट नहीं' : 'No active alerts'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleAlerts.map((alert, index) => {
                const Icon = alert.icon;
                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    className={`relative border rounded-2xl p-4 ${severityColors[alert.severity as keyof typeof severityColors]}`}
                  >
                    <button
                      onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                      className="absolute top-3 right-3 h-6 w-6 rounded-full bg-white/50 flex items-center justify-center hover:bg-white/80 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                    
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/50 flex items-center justify-center">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 pr-6">
                        <h3 className="font-semibold mb-1">
                          {isHindi ? alert.titleHi : alert.title}
                        </h3>
                        <p className="text-sm opacity-80">
                          {isHindi ? alert.descriptionHi : alert.description}
                        </p>
                        <p className="text-xs opacity-60 mt-2">{alert.time}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default WeatherAlerts;
