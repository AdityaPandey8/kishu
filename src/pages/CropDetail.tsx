import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Droplets, Sun, ThermometerSun, Calendar, Bug, Leaf, Shield, Sprout } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';

const cropData: Record<string, any> = {
  wheat: {
    name: 'Wheat', nameHi: 'गेहूं', emoji: '🌾',
    description: 'Wheat is a major cereal grain grown worldwide. It is a staple food for billions.',
    descriptionHi: 'गेहूं दुनिया भर में उगाया जाने वाला प्रमुख अनाज है। यह अरबों लोगों का मुख्य भोजन है।',
    season: 'Rabi (Oct-Mar)', water: 'Medium - 4-6 irrigations', temp: '15-25°C',
    diseases: ['Leaf Rust', 'Yellow Rust', 'Powdery Mildew'],
    diseasesHi: ['पत्ती रतुआ', 'पीला रतुआ', 'चूर्णिल आसिता'],
    care: ['Sow seeds 5cm deep', 'First irrigation after 21 days', 'Apply nitrogen in 3 splits'],
    careHi: ['बीज 5cm गहरा बोएं', '21 दिन बाद पहली सिंचाई', 'नाइट्रोजन 3 भागों में दें'],
  },
  rice: {
    name: 'Rice', nameHi: 'चावल', emoji: '🍚',
    description: 'Rice is the primary food source for half of the world population.',
    descriptionHi: 'चावल दुनिया की आधी आबादी का प्राथमिक भोजन स्रोत है।',
    season: 'Kharif (Jun-Nov)', water: 'High - Continuous flooding', temp: '20-35°C',
    diseases: ['Blast', 'Bacterial Leaf Blight', 'Brown Spot'],
    diseasesHi: ['ब्लास्ट', 'जीवाणु पत्ती झुलसा', 'भूरा धब्बा'],
    care: ['Transplant 25-day old seedlings', 'Maintain 5cm water level', 'Drain field before harvest'],
    careHi: ['25 दिन की पौध रोपें', '5cm पानी का स्तर बनाए रखें', 'कटाई से पहले खेत सुखाएं'],
  },
  tomato: {
    name: 'Tomato', nameHi: 'टमाटर', emoji: '🍅',
    description: 'Tomato is a widely cultivated vegetable crop rich in vitamins.',
    descriptionHi: 'टमाटर विटामिन से भरपूर व्यापक रूप से उगाई जाने वाली सब्जी है।',
    season: 'All Year', water: 'Medium - Regular watering', temp: '18-27°C',
    diseases: ['Early Blight', 'Late Blight', 'Bacterial Wilt'],
    diseasesHi: ['अर्ली ब्लाइट', 'लेट ब्लाइट', 'जीवाणु मुरझान'],
    care: ['Stake plants for support', 'Remove suckers regularly', 'Mulch to retain moisture'],
    careHi: ['पौधों को सहारा दें', 'नियमित रूप से सकर्स हटाएं', 'नमी बनाए रखने के लिए मल्च करें'],
  },
};

const CropDetail = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';
  
  const crop = cropData[id || 'wheat'] || cropData.wheat;

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
          <span className="text-4xl">{crop.emoji}</span>
          <h1 className="text-2xl font-bold text-foreground">
            {isHindi ? crop.nameHi : crop.name}
          </h1>
        </motion.div>

        <div className="space-y-4">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-soft"
          >
            <p className="text-muted-foreground leading-relaxed">
              {isHindi ? crop.descriptionHi : crop.description}
            </p>
          </motion.div>

          {/* Quick Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-3 gap-3"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
              <Calendar className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <p className="text-xs text-blue-600 font-medium">{isHindi ? 'मौसम' : 'Season'}</p>
              <p className="text-xs text-blue-800 mt-1">{crop.season}</p>
            </div>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 text-center">
              <Droplets className="h-5 w-5 text-cyan-600 mx-auto mb-1" />
              <p className="text-xs text-cyan-600 font-medium">{isHindi ? 'पानी' : 'Water'}</p>
              <p className="text-xs text-cyan-800 mt-1">{crop.water.split(' - ')[0]}</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-center">
              <ThermometerSun className="h-5 w-5 text-orange-600 mx-auto mb-1" />
              <p className="text-xs text-orange-600 font-medium">{isHindi ? 'तापमान' : 'Temp'}</p>
              <p className="text-xs text-orange-800 mt-1">{crop.temp}</p>
            </div>
          </motion.div>

          {/* Care Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center">
                <Sprout className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-foreground">{isHindi ? 'देखभाल के टिप्स' : 'Care Tips'}</h3>
            </div>
            <ul className="space-y-2">
              {(isHindi ? crop.careHi : crop.care).map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Common Diseases */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-5 shadow-soft"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center">
                <Bug className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-foreground">{isHindi ? 'सामान्य रोग' : 'Common Diseases'}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(isHindi ? crop.diseasesHi : crop.diseases).map((disease: string, index: number) => (
                <span 
                  key={index} 
                  className="px-3 py-1.5 bg-red-50 text-red-700 text-sm rounded-full border border-red-200"
                >
                  {disease}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Scan CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              onClick={() => navigate('/scan')}
              className="w-full h-14 rounded-xl gradient-kishu shadow-kishu text-lg font-medium"
            >
              <Leaf className="h-5 w-5 mr-2" />
              {isHindi ? 'इस फसल को स्कैन करें' : 'Scan This Crop'}
            </Button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CropDetail;
