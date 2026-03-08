import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Sprout, Leaf, ShoppingCart, ChevronDown, Loader2, AlertCircle, Search, Droplets } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface CropTool {
  name: string;
  shopSearchQuery: string;
}

interface CropSuggestion {
  name: string;
  nameLocal: string;
  description: string;
  plantingMethod: string;
  careTips: string;
  requiredTools: CropTool[];
  bestMonths: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const seasons = [
  { id: 'kharif', label: 'Kharif', desc: 'Jun–Oct (Monsoon)', emoji: '🌧️' },
  { id: 'rabi', label: 'Rabi', desc: 'Nov–Mar (Winter)', emoji: '❄️' },
  { id: 'zaid', label: 'Zaid', desc: 'Mar–Jun (Summer)', emoji: '☀️' },
];

function detectSeason(): string {
  const m = new Date().getMonth();
  if (m >= 5 && m <= 9) return 'kharif';
  if (m >= 10 || m <= 2) return 'rabi';
  return 'zaid';
}

const diffColors: Record<string, string> = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const CACHE_PREFIX = 'kishu_crop_rec_';

const CropRecommendations = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [location, setLocation] = useState(localStorage.getItem('kishu_user_city') || '');
  const [season, setSeason] = useState(detectSeason);
  const [crops, setCrops] = useState<CropSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);
  const [searched, setSearched] = useState(false);

  const langMap: Record<string, string> = {
    en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada',
    ml: 'Malayalam', bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', pa: 'Punjabi', or: 'Odia',
  };

  const seasonLabel = seasons.find(s => s.id === season)?.label || season;

  const fetchSuggestions = async () => {
    const loc = location.trim() || 'India';
    const cacheKey = `${CACHE_PREFIX}${loc}_${season}_${new Date().toDateString()}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.crops?.length) {
          setCrops(parsed.crops);
          setSearched(true);
          return;
        }
      } catch {}
    }

    setLoading(true);
    setError('');
    setExpanded(null);
    setCrops([]);

    const seasonFull = season === 'kharif' ? 'Kharif (Summer/Monsoon)' : season === 'rabi' ? 'Rabi (Winter)' : 'Zaid (Spring)';

    const { data, error: fnErr } = await supabase.functions.invoke('crop-suggestions', {
      body: { season: seasonFull, location: loc, language: langMap[i18n.language] || 'English' },
    });

    if (fnErr || !data?.crops) {
      setError('Could not load crop suggestions. Please try again.');
      setLoading(false);
      setSearched(true);
      return;
    }

    setCrops(data.crops);
    localStorage.setItem(cacheKey, JSON.stringify({ crops: data.crops }));
    setLoading(false);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="container flex items-center gap-3 px-4 py-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-accent transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              Crop Recommendations
            </h1>
            <p className="text-xs text-muted-foreground">Find the best crops for your area & season</p>
          </div>
        </div>
      </div>

      <div className="container px-4 py-5 space-y-5">
        {/* Controls */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                Your Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter city or region (e.g. Pune, Punjab)"
                className="h-10"
              />
            </div>

            {/* Season */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Season</label>
              <div className="grid grid-cols-3 gap-2">
                {seasons.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSeason(s.id)}
                    className={`rounded-xl p-2.5 text-center border-2 transition-all ${
                      season === s.id
                        ? 'border-primary bg-primary/10 shadow-sm'
                        : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <span className="text-lg">{s.emoji}</span>
                    <p className="text-xs font-semibold mt-0.5">{s.label}</p>
                    <p className="text-[10px] text-muted-foreground">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={fetchSuggestions} disabled={loading} className="w-full gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Get Crop Suggestions
            </Button>
          </CardContent>
        </Card>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <Card>
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-10 w-10 mx-auto mb-3 text-destructive/60" />
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button variant="outline" size="sm" onClick={fetchSuggestions} className="mt-3">
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && !error && crops.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              {crops.length} crops recommended for <span className="text-foreground font-semibold">{seasonLabel}</span> in <span className="text-foreground font-semibold">{location.trim() || 'India'}</span>
            </p>

            {crops.map((crop, idx) => (
              <Card
                key={idx}
                className={`overflow-hidden transition-shadow ${expanded === idx ? 'shadow-md ring-1 ring-primary/20' : ''}`}
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <button
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Leaf className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{crop.name}</p>
                        <p className="text-xs text-muted-foreground">{crop.nameLocal}</p>
                        <p className="text-xs text-muted-foreground mt-1">{crop.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${diffColors[crop.difficulty] || ''}`}>
                            {crop.difficulty}
                          </span>
                          <span className="text-[10px] text-muted-foreground">📅 {crop.bestMonths}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 mt-1 transition-transform ${expanded === idx ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expanded Details */}
                  {expanded === idx && (
                    <div className="px-4 pb-4 space-y-4 border-t">
                      {/* Planting Guide */}
                      <div className="pt-3">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                          <Sprout className="h-3.5 w-3.5 text-primary" />
                          How to Plant
                        </h4>
                        <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{crop.plantingMethod}</p>
                      </div>

                      {/* Care Tips */}
                      {crop.careTips && (
                        <div>
                          <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                            <Droplets className="h-3.5 w-3.5 text-primary" />
                            Care After Planting
                          </h4>
                          <p className="text-xs text-muted-foreground whitespace-pre-line leading-relaxed">{crop.careTips}</p>
                        </div>
                      )}

                      {/* Required Tools/Products */}
                      <div>
                        <h4 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
                          <ShoppingCart className="h-3.5 w-3.5 text-primary" />
                          What You Need
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {crop.requiredTools.map((tool, ti) => (
                            <button
                              key={ti}
                              onClick={() => navigate(`/shop?search=${encodeURIComponent(tool.shopSearchQuery)}`)}
                              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <ShoppingCart className="h-3 w-3" />
                              {tool.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty state after search */}
        {!loading && !error && searched && crops.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center">
              <Sprout className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No suggestions found. Try a different location or season.</p>
            </CardContent>
          </Card>
        )}

        {/* Initial state */}
        {!loading && !error && !searched && (
          <Card>
            <CardContent className="py-10 text-center">
              <Sprout className="h-12 w-12 mx-auto mb-3 text-primary/30" />
              <p className="text-sm text-muted-foreground">Set your location and season above, then tap <span className="font-medium text-foreground">"Get Crop Suggestions"</span></p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CropRecommendations;
