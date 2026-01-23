import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Award, MessageSquare, Users, Star, 
  Clock, CheckCircle2, TrendingUp, Calendar, Phone
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Mock consultation data
const consultations = [
  { id: '1', farmerName: 'Raju Singh', crop: 'Wheat', issue: 'Leaf rust spreading', status: 'pending', time: '10 mins ago' },
  { id: '2', farmerName: 'Geeta Devi', crop: 'Rice', issue: 'Nutrient deficiency', status: 'pending', time: '25 mins ago' },
  { id: '3', farmerName: 'Mohan Lal', crop: 'Cotton', issue: 'Pest attack', status: 'completed', time: '2 hours ago' },
];

const ExpertDashboard = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHindi = i18n.language === 'hi';
  
  const [isOnline, setIsOnline] = useState(true);

  if (!user?.isExpert) {
    return (
      <AppLayout>
        <div className="container px-4 py-8 text-center">
          <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">
            {isHindi ? 'एक्सेस नहीं' : 'Access Denied'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {isHindi ? 'यह पेज सिर्फ एक्सपर्ट्स के लिए है' : 'This page is only for verified experts'}
          </p>
          <Button onClick={() => navigate('/become-expert')}>
            {isHindi ? 'एक्सपर्ट बनें' : 'Become an Expert'}
          </Button>
        </div>
      </AppLayout>
    );
  }

  const stats = [
    { label: isHindi ? 'परामर्श' : 'Consultations', value: '28', icon: MessageSquare, color: 'text-blue-600 bg-blue-100' },
    { label: isHindi ? 'रेटिंग' : 'Rating', value: '4.8', icon: Star, color: 'text-yellow-600 bg-yellow-100' },
    { label: isHindi ? 'किसान मदद' : 'Farmers Helped', value: '156', icon: Users, color: 'text-green-600 bg-green-100' },
    { label: isHindi ? 'इस हफ्ते' : 'This Week', value: '+12', icon: TrendingUp, color: 'text-purple-600 bg-purple-100' },
  ];

  const handleCall = (name: string) => {
    toast.success(`${isHindi ? 'कॉल कर रहे हैं' : 'Calling'} ${name}...`);
  };

  const handleRespond = (id: string) => {
    toast.success(isHindi ? 'जवाब भेजा गया' : 'Response sent');
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-24">
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
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              {isHindi ? 'एक्सपर्ट डैशबोर्ड' : 'Expert Dashboard'}
              <Award className="h-5 w-5 text-primary" />
            </h1>
          </div>
        </motion.div>

        {/* Online Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-4 mb-6 shadow-soft"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                'h-3 w-3 rounded-full',
                isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              )} />
              <div>
                <p className="font-medium text-foreground">
                  {isOnline 
                    ? (isHindi ? 'ऑनलाइन - परामर्श के लिए उपलब्ध' : 'Online - Available for consultations')
                    : (isHindi ? 'ऑफलाइन' : 'Offline')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isHindi ? 'किसान आपसे संपर्क कर सकते हैं' : 'Farmers can reach you'}
                </p>
              </div>
            </div>
            <Switch
              checked={isOnline}
              onCheckedChange={setIsOnline}
            />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-4 shadow-soft"
              >
                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center mb-2', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Pending Consultations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {isHindi ? 'लंबित अनुरोध' : 'Pending Requests'}
          </h2>

          <div className="space-y-3">
            {consultations.filter(c => c.status === 'pending').map((consultation, index) => (
              <motion.div
                key={consultation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-card border border-border rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{consultation.farmerName}</p>
                    <p className="text-xs text-muted-foreground">{consultation.crop} • {consultation.time}</p>
                  </div>
                  <span className="text-[10px] font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    {isHindi ? 'लंबित' : 'Pending'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{consultation.issue}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-9 rounded-lg"
                    onClick={() => handleCall(consultation.farmerName)}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    {isHindi ? 'कॉल' : 'Call'}
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 h-9 rounded-lg"
                    onClick={() => handleRespond(consultation.id)}
                  >
                    <MessageSquare className="h-4 w-4 mr-1" />
                    {isHindi ? 'जवाब दें' : 'Respond'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            {isHindi ? 'हाल के पूर्ण' : 'Recently Completed'}
          </h2>

          <div className="space-y-2">
            {consultations.filter(c => c.status === 'completed').map((consultation) => (
              <div
                key={consultation.id}
                className="bg-muted/50 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{consultation.farmerName}</p>
                  <p className="text-xs text-muted-foreground">{consultation.issue}</p>
                </div>
                <span className="text-xs text-muted-foreground">{consultation.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl"
            onClick={() => toast.info(isHindi ? 'जल्द आ रहा है' : 'Coming soon')}
          >
            <Calendar className="h-5 w-5 mr-2" />
            {isHindi ? 'उपलब्धता शेड्यूल करें' : 'Schedule Availability'}
          </Button>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default ExpertDashboard;
