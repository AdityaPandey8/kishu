import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, ChevronRight, Leaf, Droplets, Sun, ThermometerSun } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const allCrops = [
  { id: 'wheat', name: 'Wheat', nameHi: 'गेहूं', emoji: '🌾', color: 'bg-amber-50 border-amber-200', season: 'Rabi', water: 'Medium', temp: '15-25°C' },
  { id: 'rice', name: 'Rice', nameHi: 'चावल', emoji: '🍚', color: 'bg-green-50 border-green-200', season: 'Kharif', water: 'High', temp: '20-35°C' },
  { id: 'tomato', name: 'Tomato', nameHi: 'टमाटर', emoji: '🍅', color: 'bg-red-50 border-red-200', season: 'All Year', water: 'Medium', temp: '18-27°C' },
  { id: 'cotton', name: 'Cotton', nameHi: 'कपास', emoji: '☁️', color: 'bg-blue-50 border-blue-200', season: 'Kharif', water: 'Medium', temp: '21-30°C' },
  { id: 'sugarcane', name: 'Sugarcane', nameHi: 'गन्ना', emoji: '🎋', color: 'bg-emerald-50 border-emerald-200', season: 'All Year', water: 'High', temp: '20-35°C' },
  { id: 'potato', name: 'Potato', nameHi: 'आलू', emoji: '🥔', color: 'bg-yellow-50 border-yellow-200', season: 'Rabi', water: 'Medium', temp: '15-20°C' },
  { id: 'onion', name: 'Onion', nameHi: 'प्याज', emoji: '🧅', color: 'bg-purple-50 border-purple-200', season: 'Rabi', water: 'Low', temp: '13-24°C' },
  { id: 'maize', name: 'Maize', nameHi: 'मक्का', emoji: '🌽', color: 'bg-orange-50 border-orange-200', season: 'Kharif', water: 'Medium', temp: '21-27°C' },
];

const Crops = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';
  const [search, setSearch] = useState('');

  const filteredCrops = allCrops.filter(crop => 
    crop.name.toLowerCase().includes(search.toLowerCase()) ||
    crop.nameHi.includes(search)
  );

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            {isHindi ? 'फसल गाइड' : 'Crop Guide'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isHindi ? 'सभी फसलों की जानकारी और देखभाल' : 'Information and care for all crops'}
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative mb-6"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isHindi ? 'फसल खोजें...' : 'Search crops...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-muted/50 border-border"
          />
        </motion.div>

        {/* Crops Grid */}
        <div className="space-y-3">
          {filteredCrops.map((crop, index) => (
            <motion.button
              key={crop.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.03 }}
              onClick={() => navigate(`/crops/${crop.id}`)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border ${crop.color} shadow-soft hover:shadow-md transition-all text-left`}
            >
              <span className="text-4xl">{crop.emoji}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-lg">
                  {isHindi ? crop.nameHi : crop.name}
                </h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-xs bg-white/80 px-2 py-0.5 rounded-full text-muted-foreground">
                    <Sun className="h-3 w-3" /> {crop.season}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-white/80 px-2 py-0.5 rounded-full text-muted-foreground">
                    <Droplets className="h-3 w-3" /> {crop.water}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs bg-white/80 px-2 py-0.5 rounded-full text-muted-foreground">
                    <ThermometerSun className="h-3 w-3" /> {crop.temp}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Crops;
