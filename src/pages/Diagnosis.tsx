import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertTriangle, Leaf, Beaker, Shield, MapPin, Save } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Mock diagnosis data
const mockDiagnosis = {
  id: '1',
  crop: 'Tomato',
  disease: 'Early Blight',
  diseaseHi: 'अर्ली ब्लाइट',
  confidence: 87,
  severity: 'medium',
  imageUrl: null,
  organic: [
    'Spray neem oil solution (2ml per liter of water)',
    'Apply baking soda spray (1 tbsp per gallon)',
    'Remove and destroy infected leaves',
  ],
  organicHi: [
    'नीम तेल का घोल (2ml प्रति लीटर पानी) छिड़कें',
    'बेकिंग सोडा स्प्रे (1 बड़ा चम्मच प्रति गैलन) लगाएं',
    'संक्रमित पत्तियों को हटाकर नष्ट करें',
  ],
  chemical: {
    name: 'Mancozeb 75% WP',
    dosage: '2g per liter of water',
    application: 'Spray on leaves every 7-10 days',
  },
  chemicalHi: {
    name: 'मैंकोज़ेब 75% WP',
    dosage: '2 ग्राम प्रति लीटर पानी',
    application: 'हर 7-10 दिन पत्तियों पर छिड़काव करें',
  },
  prevention: [
    'Use disease-resistant varieties',
    'Maintain proper plant spacing',
    'Water at the base, not on leaves',
    'Rotate crops annually',
  ],
  preventionHi: [
    'रोग-प्रतिरोधी किस्मों का उपयोग करें',
    'उचित पौधे की दूरी बनाए रखें',
    'पत्तियों पर नहीं, जड़ में पानी दें',
    'हर साल फसल बदलें',
  ],
};

const severityConfig = {
  low: { color: 'text-yellow-600', bg: 'bg-yellow-100', progress: 25 },
  medium: { color: 'text-orange-600', bg: 'bg-orange-100', progress: 50 },
  high: { color: 'text-red-600', bg: 'bg-red-100', progress: 75 },
  severe: { color: 'text-red-700', bg: 'bg-red-200', progress: 100 },
};

const Diagnosis = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';

  const severity = severityConfig[mockDiagnosis.severity as keyof typeof severityConfig];
  const organic = isHindi ? mockDiagnosis.organicHi : mockDiagnosis.organic;
  const chemical = isHindi ? mockDiagnosis.chemicalHi : mockDiagnosis.chemical;
  const prevention = isHindi ? mockDiagnosis.preventionHi : mockDiagnosis.prevention;

  return (
    <AppLayout hideNav>
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
          <h1 className="text-xl font-bold text-foreground">{t('diagnosis.result')}</h1>
        </motion.div>

        <div className="space-y-4">
          {/* Disease Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={cn('h-14 w-14 rounded-xl flex items-center justify-center', severity.bg)}>
                <AlertTriangle className={cn('h-7 w-7', severity.color)} />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t('diagnosis.disease')}</p>
                <h2 className="text-xl font-bold text-foreground">
                  {isHindi ? mockDiagnosis.diseaseHi : mockDiagnosis.disease}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t('diagnosis.crop')}: {mockDiagnosis.crop}
                </p>
              </div>
            </div>

            {/* Confidence & Severity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">{t('diagnosis.confidence')}</p>
                <div className="flex items-center gap-2">
                  <Progress value={mockDiagnosis.confidence} className="h-2 flex-1" />
                  <span className="text-sm font-semibold text-foreground">{mockDiagnosis.confidence}%</span>
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground mb-1">{t('diagnosis.severity')}</p>
                <div className="flex items-center gap-2">
                  <Progress value={severity.progress} className={cn('h-2 flex-1', severity.color)} />
                  <span className={cn('text-sm font-semibold capitalize', severity.color)}>
                    {t(`diagnosis.${mockDiagnosis.severity}`)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Organic Treatment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">{t('diagnosis.organic')}</h3>
            </div>
            <ul className="space-y-2">
              {organic.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Chemical Treatment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <Beaker className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-foreground">{t('diagnosis.chemical')}</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{t('diagnosis.treatment')}</p>
                <p className="text-sm font-medium text-foreground">{chemical.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('diagnosis.dosage')}</p>
                <p className="text-sm text-foreground">{chemical.dosage}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('diagnosis.application')}</p>
                <p className="text-sm text-foreground">{chemical.application}</p>
              </div>
            </div>
          </motion.div>

          {/* Prevention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-foreground">{t('diagnosis.prevention')}</h3>
            </div>
            <ul className="space-y-2">
              {prevention.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-3 pt-2"
          >
            <Button variant="outline" className="h-12 rounded-xl">
              <Save className="h-5 w-5 mr-2" />
              {t('diagnosis.saveToHistory')}
            </Button>
            <Button className="h-12 rounded-xl gradient-kishu shadow-kishu">
              <MapPin className="h-5 w-5 mr-2" />
              {t('diagnosis.findDealer')}
            </Button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Diagnosis;
