import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Video, Users, Heart, TrendingUp, Check, ArrowRight, 
  Sparkles, Camera, Star, ChevronRight 
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BecomeCreator = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { becomeCreator, getCreatorProfile } = useData();
  const isHindi = i18n.language === 'hi';

  const [step, setStep] = useState(1);
  const [bio, setBio] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const existingProfile = user ? getCreatorProfile(user.id) : undefined;

  if (existingProfile?.isCreator) {
    navigate('/creator-studio');
    return null;
  }

  const benefits = [
    {
      icon: Video,
      title: isHindi ? 'वीडियो साझा करें' : 'Share Videos',
      description: isHindi ? 'अपनी कृषि तकनीकें साझा करें' : 'Share your farming techniques'
    },
    {
      icon: Users,
      title: isHindi ? 'समुदाय बनाएं' : 'Build Community',
      description: isHindi ? 'किसानों का नेटवर्क बनाएं' : 'Connect with fellow farmers'
    },
    {
      icon: Heart,
      title: isHindi ? 'प्रभाव डालें' : 'Make Impact',
      description: isHindi ? 'हजारों किसानों की मदद करें' : 'Help thousands of farmers'
    },
    {
      icon: TrendingUp,
      title: isHindi ? 'बढ़ें' : 'Grow',
      description: isHindi ? 'अपनी पहुंच बढ़ाएं' : 'Expand your reach'
    }
  ];

  const handleSubmit = () => {
    if (!user) {
      toast.error(isHindi ? 'कृपया पहले लॉगिन करें' : 'Please login first');
      navigate('/login');
      return;
    }

    if (!bio.trim()) {
      toast.error(isHindi ? 'कृपया अपना परिचय लिखें' : 'Please write your bio');
      return;
    }

    if (!acceptedTerms) {
      toast.error(isHindi ? 'कृपया नियम स्वीकार करें' : 'Please accept the terms');
      return;
    }

    becomeCreator(user.id, bio);
    toast.success(isHindi ? 'बधाई! आप अब क्रिएटर हैं!' : 'Congratulations! You are now a creator!');
    navigate('/creator-studio');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-background to-background" />
            
            <div className="relative px-4 py-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 mb-4"
                >
                  <Sparkles className="h-10 w-10 text-primary-foreground" />
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {isHindi ? 'क्रिएटर बनें' : 'Become a Creator'}
                </h1>
                <p className="text-muted-foreground">
                  {isHindi 
                    ? 'अपने ज्ञान से लाखों किसानों की मदद करें'
                    : 'Help millions of farmers with your knowledge'}
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border rounded-xl p-4 text-center"
                    >
                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-medium text-foreground text-sm">{benefit.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{benefit.description}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="bg-card border border-border rounded-2xl p-4 mb-8">
                <div className="grid grid-cols-3 divide-x divide-border">
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-primary">50K+</p>
                    <p className="text-xs text-muted-foreground">
                      {isHindi ? 'क्रिएटर्स' : 'Creators'}
                    </p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-primary">1M+</p>
                    <p className="text-xs text-muted-foreground">
                      {isHindi ? 'दर्शक' : 'Viewers'}
                    </p>
                  </div>
                  <div className="text-center px-2">
                    <p className="text-2xl font-bold text-primary">10M+</p>
                    <p className="text-xs text-muted-foreground">
                      {isHindi ? 'व्यूज' : 'Views'}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                onClick={() => setStep(2)}
                className="w-full h-14 rounded-xl text-lg gradient-kishu shadow-kishu"
              >
                {isHindi ? 'शुरू करें' : 'Get Started'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Setup Profile Step */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 space-y-6"
          >
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-foreground mb-2">
                {isHindi ? 'अपना प्रोफाइल सेट करें' : 'Set Up Your Profile'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isHindi ? 'आपके दर्शक आपके बारे में जानना चाहेंगे' : 'Your viewers will want to know about you'}
              </p>
            </div>

            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Camera className="h-10 w-10 text-primary-foreground" />
                </div>
                <button className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-card border border-border shadow-md flex items-center justify-center">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {isHindi ? 'अपने बारे में बताएं' : 'Tell us about yourself'}
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder={isHindi 
                  ? 'मैं एक किसान हूं और खेती की नई तकनीकें साझा करता हूं...'
                  : 'I am a farmer sharing modern farming techniques...'}
                className="min-h-[120px] rounded-xl"
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground text-right">
                {bio.length}/200
              </p>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                {isHindi ? 'आप किस बारे में बात करेंगे?' : 'What will you talk about?'}
              </label>
              <div className="flex flex-wrap gap-2">
                {['🌾 Crops', '🚜 Equipment', '🌱 Organic', '💡 Tips', '🔧 Techniques'].map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="px-3 py-2 rounded-full cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                {isHindi 
                  ? 'मैं क्रिएटर नियम और शर्तों से सहमत हूं। मैं समझता हूं कि मेरी सामग्री समुदाय दिशानिर्देशों के अनुरूप होनी चाहिए।'
                  : 'I agree to the Creator Terms and Conditions. I understand that my content must comply with community guidelines.'}
              </label>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 h-12 rounded-xl"
              >
                {isHindi ? 'वापस' : 'Back'}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!bio.trim() || !acceptedTerms}
                className="flex-1 h-12 rounded-xl gradient-kishu shadow-kishu"
              >
                {isHindi ? 'क्रिएटर बनें' : 'Become Creator'}
                <Check className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

// Badge component inline for simplicity
const Badge = ({ children, variant, className, ...props }: any) => (
  <span
    className={cn(
      'inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full',
      variant === 'outline' ? 'border border-border bg-background' : 'bg-primary/10 text-primary',
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export default BecomeCreator;
