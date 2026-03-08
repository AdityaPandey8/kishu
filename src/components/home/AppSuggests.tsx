import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sprout, ShoppingCart, ChevronRight, Loader2, Leaf, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  requiredTools: CropTool[];
  bestMonths: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

function getSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 5) return 'Kharif (Summer/Monsoon)';
  if (month >= 6 && month <= 9) return 'Rabi (Winter)';
  return 'Zaid (Spring)';
}

const CACHE_KEY = 'kishu_crop_suggestions';

function getCached(): { crops: CropSuggestion[]; date: string } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.date === new Date().toDateString()) return parsed;
    return null;
  } catch { return null; }
}

const difficultyColor: Record<string, string> = {
  Easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

export const AppSuggests = () => {
  const { t, i18n } = useTranslation();
  const [crops, setCrops] = useState<CropSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const cached = getCached();
    if (cached) {
      setCrops(cached.crops);
      setLoading(false);
      return;
    }

    const location = localStorage.getItem('kishu_user_city') || 'India';
    const season = getSeason();
    const langMap: Record<string, string> = {
      en: 'English', hi: 'Hindi', ta: 'Tamil', te: 'Telugu', kn: 'Kannada',
      ml: 'Malayalam', bn: 'Bengali', mr: 'Marathi', gu: 'Gujarati', pa: 'Punjabi', or: 'Odia',
    };

    supabase.functions.invoke('crop-suggestions', {
      body: { season, location, language: langMap[i18n.language] || 'English' },
    }).then(({ data, error: fnErr }) => {
      if (fnErr || !data?.crops) {
        setError('Could not load suggestions');
        setLoading(false);
        return;
      }
      setCrops(data.crops);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ crops: data.crops, date: new Date().toDateString() }));
      setLoading(false);
    });
  }, [i18n.language]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error || crops.length === 0) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-muted-foreground text-sm">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
          {error || 'No suggestions available'}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Sprout className="h-5 w-5 text-primary" />
          {t('home.appSuggests', 'Recommended for You')}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{getSeason()} season picks for your area</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {crops.map((crop, idx) => (
          <div
            key={idx}
            className="border rounded-xl p-3 space-y-2 transition-colors hover:bg-accent/30 cursor-pointer"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{crop.name}</p>
                  <p className="text-xs text-muted-foreground">{crop.nameLocal}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${difficultyColor[crop.difficulty] || ''}`}>
                {crop.difficulty}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">{crop.description}</p>
            <p className="text-[11px] text-muted-foreground">📅 {crop.bestMonths}</p>

            {expanded === idx && (
              <div className="pt-2 space-y-3 border-t">
                <div>
                  <p className="text-xs font-medium mb-1">How to Plant:</p>
                  <p className="text-xs text-muted-foreground whitespace-pre-line">{crop.plantingMethod}</p>
                </div>
                <div>
                  <p className="text-xs font-medium mb-1.5">What You Need:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {crop.requiredTools.map((tool, ti) => (
                      <Link key={ti} to={`/shop?search=${encodeURIComponent(tool.shopSearchQuery)}`}>
                        <Badge variant="secondary" className="text-[10px] gap-1 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                          <ShoppingCart className="h-2.5 w-2.5" />
                          {tool.name}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${expanded === idx ? 'rotate-90' : ''}`} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
