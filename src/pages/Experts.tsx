import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  ArrowLeft, Search, Star, Phone, Video, MessageCircle,
  Clock, Award, ChevronRight, X, CalendarIcon, CheckCircle, Sparkles
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface Expert {
  id: string;
  name: string;
  nameHi: string;
  avatar: string;
  specializations: string[];
  experience: number;
  rating: number;
  consultations: number;
  bio: string;
  bioHi: string;
  online: boolean;
  availableSlots: string[];
}

const mockExperts: Expert[] = [
  {
    id: 'e1', name: 'Dr. Arvind Sharma', nameHi: 'डॉ. अरविंद शर्मा',
    avatar: '👨‍🌾', specializations: ['Crop Disease', 'Wheat', 'Rice'],
    experience: 18, rating: 4.9, consultations: 1240,
    bio: 'Senior agronomist with 18 years of experience in crop disease management across North India.',
    bioHi: 'उत्तर भारत में फसल रोग प्रबंधन में 18 वर्षों के अनुभव के साथ वरिष्ठ कृषि विज्ञानी।',
    online: true, availableSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
  },
  {
    id: 'e2', name: 'Prof. Sunita Patel', nameHi: 'प्रो. सुनीता पटेल',
    avatar: '👩‍🔬', specializations: ['Organic Farming', 'Soil Health'],
    experience: 15, rating: 4.8, consultations: 980,
    bio: 'Expert in organic farming practices and soil health management. Published 30+ research papers.',
    bioHi: 'जैविक खेती और मिट्टी स्वास्थ्य प्रबंधन में विशेषज्ञ। 30+ शोध पत्र प्रकाशित।',
    online: true, availableSlots: ['10:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'],
  },
  {
    id: 'e3', name: 'Dr. Rajesh Kumar', nameHi: 'डॉ. राजेश कुमार',
    avatar: '👨‍⚕️', specializations: ['Dairy', 'Animal Husbandry'],
    experience: 12, rating: 4.7, consultations: 756,
    bio: 'Veterinary specialist with expertise in dairy farming and livestock management.',
    bioHi: 'डेयरी फार्मिंग और पशुधन प्रबंधन में विशेषज्ञता के साथ पशु चिकित्सा विशेषज्ञ।',
    online: false, availableSlots: ['9:00 AM', '11:00 AM', '2:00 PM'],
  },
  {
    id: 'e4', name: 'Dr. Meena Devi', nameHi: 'डॉ. मीना देवी',
    avatar: '👩‍🌾', specializations: ['Horticulture', 'Fruit Crops'],
    experience: 20, rating: 4.9, consultations: 1580,
    bio: 'Horticulture expert specializing in fruit crop cultivation and post-harvest management.',
    bioHi: 'फल फसल खेती और कटाई के बाद प्रबंधन में विशेषज्ञता रखने वाली बागवानी विशेषज्ञ।',
    online: true, availableSlots: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'],
  },
  {
    id: 'e5', name: 'Mr. Vikram Singh', nameHi: 'श्री विक्रम सिंह',
    avatar: '👨‍💼', specializations: ['Irrigation', 'Water Management'],
    experience: 10, rating: 4.6, consultations: 520,
    bio: 'Irrigation engineer with expertise in drip irrigation and water conservation techniques.',
    bioHi: 'ड्रिप सिंचाई और जल संरक्षण तकनीकों में विशेषज्ञता वाले सिंचाई इंजीनियर।',
    online: false, availableSlots: ['9:00 AM', '10:00 AM', '1:00 PM'],
  },
  {
    id: 'e6', name: 'Dr. Priya Verma', nameHi: 'डॉ. प्रिया वर्मा',
    avatar: '👩‍💻', specializations: ['Crop Disease', 'Pesticides'],
    experience: 14, rating: 4.8, consultations: 890,
    bio: 'Plant pathologist specializing in integrated pest management for sustainable agriculture.',
    bioHi: 'टिकाऊ कृषि के लिए एकीकृत कीट प्रबंधन में विशेषज्ञ पादप रोग विज्ञानी।',
    online: true, availableSlots: ['11:00 AM', '1:00 PM', '3:00 PM', '4:00 PM'],
  },
  {
    id: 'e7', name: 'Mr. Anil Yadav', nameHi: 'श्री अनिल यादव',
    avatar: '🧑‍🌾', specializations: ['Organic Farming', 'Vermicompost'],
    experience: 8, rating: 4.5, consultations: 340,
    bio: 'Organic farming practitioner with hands-on experience in vermicomposting and natural fertilizers.',
    bioHi: 'वर्मीकम्पोस्टिंग और प्राकृतिक उर्वरकों में व्यावहारिक अनुभव वाले जैविक किसान।',
    online: true, availableSlots: ['9:00 AM', '10:00 AM', '2:00 PM', '4:00 PM', '5:00 PM'],
  },
];

const categories = ['All', 'Crop Disease', 'Organic Farming', 'Dairy', 'Horticulture', 'Irrigation'];

const Experts = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isHindi = i18n.language === 'hi';

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const filtered = mockExperts.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.specializations.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'All' || e.specializations.some(s => s.toLowerCase().includes(activeCategory.toLowerCase()));
    return matchSearch && matchCat;
  });

  const handleBook = (type: 'call' | 'video' | 'message') => {
    if (!selectedExpert || !selectedSlot || !selectedDate) return;
    const label = type === 'call' ? (isHindi ? 'कॉल' : 'Call') : type === 'video' ? (isHindi ? 'वीडियो कॉल' : 'Video Call') : (isHindi ? 'मैसेज' : 'Message');
    toast({
      title: isHindi ? '✅ स्लॉट बुक हो गया!' : '✅ Slot Booked!',
      description: `${label} with ${selectedExpert.name} on ${format(selectedDate, 'PPP')} at ${selectedSlot}`,
    });
    setSelectedExpert(null);
    setSelectedSlot(null);
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 space-y-4 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            {isHindi ? 'हमारे विशेषज्ञ' : 'Our Experts'}
          </h1>
        </div>

        {/* Become Expert Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">
                {isHindi ? 'विशेषज्ञ बनें' : 'Become an Expert'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'किसानों की मदद करें और कमाएं' : 'Help farmers & earn'}
              </p>
            </div>
          </div>
          <Button size="sm" className="rounded-xl" onClick={() => navigate('/become-expert')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={isHindi ? 'विशेषज्ञ खोजें...' : 'Search experts...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-border"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={activeCategory === cat ? 'default' : 'outline'}
              className="rounded-full text-xs whitespace-nowrap shrink-0"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Expert Cards */}
        <div className="space-y-3">
          {filtered.map((expert, idx) => (
            <motion.div
              key={expert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => { setSelectedExpert(expert); setSelectedSlot(null); }}
              className="bg-card border border-border rounded-2xl p-4 shadow-soft cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{expert.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {isHindi ? expert.nameHi : expert.name}
                    </h3>
                    {expert.online && (
                      <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {expert.specializations.map(s => (
                      <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {expert.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {expert.experience} {isHindi ? 'वर्ष' : 'yrs'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="h-3 w-3" /> {expert.consultations}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
              </div>
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              {isHindi ? 'कोई विशेषज्ञ नहीं मिला' : 'No experts found'}
            </p>
          )}
        </div>
      </div>

      {/* Expert Detail / Booking Modal */}
      <AnimatePresence>
        {selectedExpert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setSelectedExpert(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card border border-border rounded-t-3xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 space-y-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{selectedExpert.avatar}</div>
                  <div>
                    <h2 className="font-bold text-foreground">
                      {isHindi ? selectedExpert.nameHi : selectedExpert.name}
                    </h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {selectedExpert.rating}
                      <span>•</span>
                      {selectedExpert.experience} {isHindi ? 'वर्ष अनुभव' : 'yrs exp'}
                      <span>•</span>
                      {selectedExpert.consultations} {isHindi ? 'परामर्श' : 'consults'}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setSelectedExpert(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Online Status */}
              <div className="flex items-center gap-2">
                <span className={cn('h-2.5 w-2.5 rounded-full', selectedExpert.online ? 'bg-green-500' : 'bg-muted-foreground')} />
                <span className="text-xs text-muted-foreground">
                  {selectedExpert.online ? (isHindi ? 'ऑनलाइन' : 'Online') : (isHindi ? 'ऑफलाइन' : 'Offline')}
                </span>
              </div>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1.5">
                {selectedExpert.specializations.map(s => (
                  <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                ))}
              </div>

              {/* Bio */}
              <p className="text-sm text-muted-foreground">
                {isHindi ? selectedExpert.bioHi : selectedExpert.bio}
              </p>

              {/* Date Picker */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">
                  {isHindi ? 'तारीख चुनें' : 'Select Date'}
                </p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn('w-full justify-start text-left rounded-xl', !selectedDate && 'text-muted-foreground')}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : (isHindi ? 'तारीख चुनें' : 'Pick a date')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      className={cn('p-3 pointer-events-auto')}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Slots */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">
                  {isHindi ? 'समय स्लॉट चुनें' : 'Select Time Slot'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedExpert.availableSlots.map(slot => (
                    <Button
                      key={slot}
                      size="sm"
                      variant={selectedSlot === slot ? 'default' : 'outline'}
                      className="rounded-full text-xs"
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Booking Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  className="flex-1 rounded-xl"
                  variant="outline"
                  disabled={!selectedSlot}
                  onClick={() => handleBook('call')}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  {isHindi ? 'कॉल' : 'Call'}
                </Button>
                <Button
                  className="flex-1 rounded-xl"
                  variant="outline"
                  disabled={!selectedSlot}
                  onClick={() => handleBook('video')}
                >
                  <Video className="h-4 w-4 mr-1" />
                  {isHindi ? 'वीडियो' : 'Video'}
                </Button>
                <Button
                  className="flex-1 rounded-xl"
                  disabled={!selectedSlot}
                  onClick={() => handleBook('message')}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {isHindi ? 'मैसेज' : 'Message'}
                </Button>
              </div>

              {selectedSlot && selectedDate && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1"
                >
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  {format(selectedDate, 'MMM d')} at {selectedSlot}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default Experts;
