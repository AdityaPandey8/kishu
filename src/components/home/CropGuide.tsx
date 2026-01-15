import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronRight } from 'lucide-react';

const crops = [
  { id: 'wheat', name: 'Wheat', nameHi: 'गेहूं', emoji: '🌾', color: 'bg-amber-100' },
  { id: 'rice', name: 'Rice', nameHi: 'चावल', emoji: '🍚', color: 'bg-green-100' },
  { id: 'tomato', name: 'Tomato', nameHi: 'टमाटर', emoji: '🍅', color: 'bg-red-100' },
  { id: 'cotton', name: 'Cotton', nameHi: 'कपास', emoji: '☁️', color: 'bg-blue-100' },
];

export const CropGuide = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          {isHindi ? 'फसल गाइड' : 'Crop Guide'}
        </h3>
        <button 
          onClick={() => navigate('/crops')}
          className="text-xs text-primary flex items-center gap-1 hover:underline"
        >
          {isHindi ? 'सभी देखें' : 'View All'}
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {crops.map((crop, index) => (
          <motion.button
            key={crop.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 + index * 0.05 }}
            onClick={() => navigate(`/crops/${crop.id}`)}
            className={`${crop.color} rounded-xl p-3 flex flex-col items-center gap-1 hover:shadow-md transition-shadow`}
          >
            <span className="text-2xl">{crop.emoji}</span>
            <span className="text-xs font-medium text-foreground">
              {isHindi ? crop.nameHi : crop.name}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
