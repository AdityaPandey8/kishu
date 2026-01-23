import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Award, Users, MessageSquare, TrendingUp, 
  CheckCircle2, Clock, Star, ChevronRight
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const specializations = [
  { id: 'wheat', label: 'Wheat', labelHi: 'गेहूं' },
  { id: 'rice', label: 'Rice', labelHi: 'चावल' },
  { id: 'cotton', label: 'Cotton', labelHi: 'कपास' },
  { id: 'vegetables', label: 'Vegetables', labelHi: 'सब्जियां' },
  { id: 'fruits', label: 'Fruits', labelHi: 'फल' },
  { id: 'organic', label: 'Organic Farming', labelHi: 'जैविक खेती' },
  { id: 'dairy', label: 'Dairy', labelHi: 'डेयरी' },
  { id: 'poultry', label: 'Poultry', labelHi: 'मुर्गी पालन' },
];

const benefits = [
  { icon: Award, title: 'Expert Badge', titleHi: 'एक्सपर्ट बैज', desc: 'Get verified badge on your profile', descHi: 'प्रोफाइल पर वेरिफाइड बैज' },
  { icon: Users, title: 'Help Farmers', titleHi: 'किसानों की मदद', desc: 'Answer queries from farmers', descHi: 'किसानों के सवालों का जवाब दें' },
  { icon: MessageSquare, title: 'Consultations', titleHi: 'परामर्श', desc: 'Provide paid consultations', descHi: 'पेड परामर्श प्रदान करें' },
  { icon: TrendingUp, title: 'Grow Network', titleHi: 'नेटवर्क बढ़ाएं', desc: 'Build your farming network', descHi: 'खेती नेटवर्क बनाएं' },
];

const BecomeExpert = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { applyForExpert, getExpertApplication } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [step, setStep] = useState(1);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [experience, setExperience] = useState('');
  const [certifications, setCertifications] = useState('');
  const [bio, setBio] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if already applied
  const existingApplication = user ? getExpertApplication(user.id) : null;

  if (!user) {
    return (
      <AppLayout>
        <div className="container px-4 py-8 text-center">
          <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">
            {isHindi ? 'लॉगिन आवश्यक' : 'Login Required'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {isHindi ? 'एक्सपर्ट बनने के लिए लॉगिन करें' : 'Please login to become an expert'}
          </p>
          <Button onClick={() => navigate('/login')}>
            {isHindi ? 'लॉगिन करें' : 'Login'}
          </Button>
        </div>
      </AppLayout>
    );
  }

  if (user.isExpert) {
    navigate('/expert-dashboard');
    return null;
  }

  if (existingApplication) {
    return (
      <AppLayout>
        <div className="container px-4 py-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            {existingApplication.status === 'pending' ? (
              <>
                <div className="h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10 text-amber-600" />
                </div>
                <h1 className="text-xl font-bold mb-2">
                  {isHindi ? 'आवेदन समीक्षाधीन' : 'Application Under Review'}
                </h1>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  {isHindi 
                    ? 'आपका आवेदन हमारी टीम द्वारा समीक्षाधीन है। 24-48 घंटों में जवाब मिलेगा।'
                    : 'Your application is being reviewed by our team. You will receive a response within 24-48 hours.'}
                </p>
              </>
            ) : existingApplication.status === 'rejected' ? (
              <>
                <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-xl font-bold mb-2">
                  {isHindi ? 'आवेदन अस्वीकृत' : 'Application Rejected'}
                </h1>
                <p className="text-muted-foreground mb-2">
                  {existingApplication.rejectionReason || (isHindi ? 'कृपया बाद में पुनः प्रयास करें' : 'Please try again later')}
                </p>
              </>
            ) : null}

            <Button variant="outline" onClick={() => navigate('/profile')}>
              {isHindi ? 'प्रोफाइल पर जाएं' : 'Go to Profile'}
            </Button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  const toggleSpec = (id: string) => {
    setSelectedSpecs(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      toast.error(isHindi ? 'कृपया नियम स्वीकार करें' : 'Please accept terms');
      return;
    }
    if (selectedSpecs.length === 0) {
      toast.error(isHindi ? 'कम से कम एक विशेषज्ञता चुनें' : 'Select at least one specialization');
      return;
    }
    if (!experience || !bio) {
      toast.error(isHindi ? 'सभी फील्ड भरें' : 'Fill all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1000));
      
      applyForExpert({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        specialization: selectedSpecs,
        experience,
        certifications,
        bio,
      });

      updateUser({ expertStatus: 'pending' });
      
      toast.success(isHindi ? 'आवेदन सबमिट हो गया!' : 'Application submitted!');
      navigate('/profile');
    } catch (error) {
      toast.error(isHindi ? 'कुछ गलत हुआ' : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {isHindi ? 'एक्सपर्ट बनें' : 'Become an Expert'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isHindi ? `चरण ${step}/3` : `Step ${step}/3`}
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: '33%' }}
            animate={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Benefits */}
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-card border border-border rounded-xl p-4"
                  >
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm text-foreground">
                      {isHindi ? benefit.titleHi : benefit.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isHindi ? benefit.descHi : benefit.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            <Button 
              className="w-full h-12 rounded-xl"
              onClick={() => setStep(2)}
            >
              {isHindi ? 'आगे बढ़ें' : 'Continue'}
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Specializations */}
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                {isHindi ? 'विशेषज्ञता चुनें' : 'Select Specializations'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <button
                    key={spec.id}
                    onClick={() => toggleSpec(spec.id)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      selectedSpecs.includes(spec.id)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    )}
                  >
                    {isHindi ? spec.labelHi : spec.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                {isHindi ? 'अनुभव (वर्षों में)' : 'Experience (in years)'}
              </label>
              <Input
                placeholder={isHindi ? 'जैसे: 5 साल' : 'e.g., 5 years'}
                className="h-12 rounded-xl"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
            </div>

            {/* Certifications */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                {isHindi ? 'प्रमाणपत्र (वैकल्पिक)' : 'Certifications (optional)'}
              </label>
              <Input
                placeholder={isHindi ? 'जैसे: कृषि डिप्लोमा' : 'e.g., Agriculture Diploma'}
                className="h-12 rounded-xl"
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
              />
            </div>

            <Button 
              className="w-full h-12 rounded-xl"
              onClick={() => setStep(3)}
              disabled={selectedSpecs.length === 0 || !experience}
            >
              {isHindi ? 'आगे बढ़ें' : 'Continue'}
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Bio */}
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                {isHindi ? 'अपने बारे में बताएं' : 'Tell us about yourself'}
              </label>
              <Textarea
                placeholder={isHindi 
                  ? 'अपने खेती के अनुभव और विशेषज्ञता के बारे में लिखें...'
                  : 'Share your farming experience and expertise...'}
                className="min-h-32 rounded-xl"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                {isHindi 
                  ? 'मैं एक्सपर्ट दिशानिर्देशों और नियमों से सहमत हूं'
                  : 'I agree to the Expert guidelines and terms of service'}
              </label>
            </div>

            <Button 
              className="w-full h-12 rounded-xl"
              onClick={handleSubmit}
              disabled={isSubmitting || !bio || !termsAccepted}
            >
              {isSubmitting ? (
                isHindi ? 'सबमिट हो रहा है...' : 'Submitting...'
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  {isHindi ? 'आवेदन जमा करें' : 'Submit Application'}
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default BecomeExpert;
