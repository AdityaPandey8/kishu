import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const AppSuggests = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate('/crop-recommendations')}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sprout className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-sm">{t('home.appSuggests', 'Recommended for You')}</p>
            <p className="text-xs text-muted-foreground">Season & location-based crop suggestions</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardContent>
    </Card>
  );
};
