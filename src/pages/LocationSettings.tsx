import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Navigation, Search, Check, Plus, Trash2, 
  RefreshCw, MapPinned 
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface SavedLocation {
  id: string;
  name: string;
  address: string;
  coordinates: { lat: number; lng: number };
  isDefault: boolean;
}

const LocationSettings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateLocation, updateUser } = useAuth();
  const isHindi = i18n.language === 'hi';
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([
    {
      id: '1',
      name: isHindi ? 'घर' : 'Home',
      address: user?.location || 'Jaipur, Rajasthan',
      coordinates: user?.coordinates || { lat: 26.9124, lng: 75.7873 },
      isDefault: true,
    },
  ]);

  // Mock cities for search
  const cities = [
    { name: 'Jaipur, Rajasthan', coordinates: { lat: 26.9124, lng: 75.7873 } },
    { name: 'Delhi', coordinates: { lat: 28.7041, lng: 77.1025 } },
    { name: 'Mumbai, Maharashtra', coordinates: { lat: 19.0760, lng: 72.8777 } },
    { name: 'Lucknow, Uttar Pradesh', coordinates: { lat: 26.8467, lng: 80.9462 } },
    { name: 'Bhopal, Madhya Pradesh', coordinates: { lat: 23.2599, lng: 77.4126 } },
    { name: 'Ahmedabad, Gujarat', coordinates: { lat: 23.0225, lng: 72.5714 } },
    { name: 'Patna, Bihar', coordinates: { lat: 25.5941, lng: 85.1376 } },
    { name: 'Chandigarh, Punjab', coordinates: { lat: 30.7333, lng: 76.7794 } },
  ];

  const filteredCities = searchQuery.length > 1 
    ? cities.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    
    if (!navigator.geolocation) {
      toast.error(isHindi ? 'आपका ब्राउज़र लोकेशन सपोर्ट नहीं करता' : 'Geolocation not supported');
      setIsDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateLocation({ lat: latitude, lng: longitude }, false);
        toast.success(isHindi ? 'लोकेशन अपडेट हो गई' : 'Location updated');
        setIsDetecting(false);
      },
      (error) => {
        console.error(error);
        toast.error(isHindi ? 'लोकेशन नहीं मिली' : 'Failed to get location');
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectCity = (city: typeof cities[0]) => {
    updateLocation(city.coordinates, true);
    updateUser({ location: city.name });
    setSearchQuery('');
    toast.success(isHindi ? 'लोकेशन सेट हो गई' : 'Location set');
  };

  const handleSetAsDefault = (id: string) => {
    setSavedLocations(prev => prev.map(loc => ({
      ...loc,
      isDefault: loc.id === id,
    })));
    const location = savedLocations.find(l => l.id === id);
    if (location) {
      updateLocation(location.coordinates, true);
      updateUser({ location: location.address });
    }
    toast.success(isHindi ? 'डिफ़ॉल्ट लोकेशन सेट' : 'Default location set');
  };

  const handleDeleteLocation = (id: string) => {
    setSavedLocations(prev => prev.filter(loc => loc.id !== id));
    toast.success(isHindi ? 'लोकेशन हटाई गई' : 'Location removed');
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {isHindi ? 'लोकेशन सेटिंग्स' : 'Location Settings'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isHindi ? 'मौसम और मंडी भाव के लिए' : 'For weather & market prices'}
            </p>
          </div>
        </motion.div>

        <div className="space-y-6">
          {/* Current Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-2xl p-4 shadow-soft"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {isHindi ? 'वर्तमान लोकेशन' : 'Current Location'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.location || (isHindi ? 'सेट नहीं' : 'Not set')}
                </p>
              </div>
              {user?.coordinates && (
                <div className="text-xs text-muted-foreground text-right">
                  <p>{user.coordinates.lat.toFixed(4)}°N</p>
                  <p>{user.coordinates.lng.toFixed(4)}°E</p>
                </div>
              )}
            </div>

            <Button
              className="w-full h-12 rounded-xl"
              onClick={handleDetectLocation}
              disabled={isDetecting}
            >
              {isDetecting ? (
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
              ) : (
                <Navigation className="h-5 w-5 mr-2" />
              )}
              {isHindi ? 'ऑटो डिटेक्ट करें' : 'Auto Detect Location'}
            </Button>
          </motion.div>

          {/* Search Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-sm font-semibold text-foreground mb-3">
              {isHindi ? 'लोकेशन खोजें' : 'Search Location'}
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={isHindi ? 'शहर या जिला खोजें...' : 'Search city or district...'}
                className="h-12 pl-10 rounded-xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {filteredCities.length > 0 && (
              <div className="mt-2 bg-card border border-border rounded-xl overflow-hidden shadow-soft">
                {filteredCities.map((city, index) => (
                  <button
                    key={city.name}
                    onClick={() => handleSelectCity(city)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 text-left hover:bg-muted/50 transition-colors',
                      index > 0 && 'border-t border-border'
                    )}
                  >
                    <MapPinned className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-foreground">{city.name}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Saved Locations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">
                {isHindi ? 'सहेजी गई लोकेशन' : 'Saved Locations'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-primary"
                onClick={() => toast.info(isHindi ? 'जल्द आ रहा है' : 'Coming soon')}
              >
                <Plus className="h-4 w-4 mr-1" />
                {isHindi ? 'जोड़ें' : 'Add'}
              </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft">
              {savedLocations.map((location, index) => (
                <div
                  key={location.id}
                  className={cn(
                    'flex items-center gap-3 p-4',
                    index > 0 && 'border-t border-border'
                  )}
                >
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{location.name}</p>
                      {location.isDefault && (
                        <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {isHindi ? 'डिफ़ॉल्ट' : 'Default'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{location.address}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    {!location.isDefault && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSetAsDefault(location.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteLocation(location.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Map Preview Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-muted/50 border border-border h-48 flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {isHindi ? 'मैप प्रीव्यू' : 'Map Preview'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'जल्द आ रहा है' : 'Coming soon'}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default LocationSettings;
