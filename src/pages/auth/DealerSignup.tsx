import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, User, Phone, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const DealerSignup = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const isHindi = i18n.language === 'hi';
  
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!businessName || !name) {
        toast.error(isHindi ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : 'Please fill in all required fields');
        return;
      }
      setStep(2);
      return;
    }
    
    if (!email || !password) {
      toast.error(isHindi ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      toast.error(isHindi ? 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए' : 'Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup({ 
        email, 
        password, 
        name, 
        role: 'dealer', 
        phone,
        businessName 
      });
      toast.success(isHindi ? 'खाता बनाया गया! अब KYC पूरा करें' : 'Account created! Now complete KYC');
      navigate('/dealer/kyc');
    } catch (error) {
      toast.error(isHindi ? 'साइनअप विफल' : 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-amber-50/50 dark:from-orange-950/20 dark:via-background dark:to-amber-950/20 flex flex-col">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col px-6 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => step === 1 ? navigate('/auth') : setStep(1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">{step === 1 ? (isHindi ? 'भूमिका बदलें' : 'Change role') : t('common.back')}</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {isHindi ? 'डीलर खाता बनाएं' : 'Create Dealer Account'}
          </h1>
        </motion.div>

        {/* Progress */}
        <div className="w-full max-w-sm mx-auto mb-6">
          <div className="flex items-center gap-2">
            <div className={cn('flex-1 h-1.5 rounded-full', step >= 1 ? 'bg-orange-500' : 'bg-muted')} />
            <div className={cn('flex-1 h-1.5 rounded-full', step >= 2 ? 'bg-orange-500' : 'bg-muted')} />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {isHindi ? `चरण ${step}/2` : `Step ${step} of 2`}
          </p>
        </div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              {step === 1 
                ? (isHindi ? 'व्यापार विवरण' : 'Business Details')
                : (isHindi ? 'लॉगिन विवरण' : 'Login Details')
              }
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              {step === 1 
                ? (isHindi ? 'अपने व्यापार के बारे में बताएं' : 'Tell us about your business')
                : (isHindi ? 'अपना ईमेल और पासवर्ड सेट करें' : 'Set your email and password')
              }
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  {/* Business Name */}
                  <div className="space-y-2">
                    <Label htmlFor="businessName" className="text-sm font-medium">
                      {isHindi ? 'व्यापार/दुकान का नाम' : 'Business/Shop Name'} *
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessName"
                        type="text"
                        placeholder={isHindi ? 'आपकी दुकान का नाम' : 'Your shop name'}
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-muted/50 border-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {isHindi ? 'मालिक का नाम' : 'Owner Name'} *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={isHindi ? 'आपका पूरा नाम' : 'Your full name'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-muted/50 border-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {t('auth.phone')} <span className="text-muted-foreground">({isHindi ? 'वैकल्पिक' : 'optional'})</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-muted/50 border-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">{t('auth.email')}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="business@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-muted/50 border-orange-500/20 focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">{t('auth.password')}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-orange-500/20 focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isHindi ? 'कम से कम 6 अक्षर' : 'At least 6 characters'}
                    </p>
                  </div>
                </>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 text-base font-medium mt-2"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {step === 1 ? t('common.next') : (isHindi ? 'खाता बनाएं और KYC शुरू करें' : 'Create & Start KYC')}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.hasAccount')}{' '}
                <Link to="/auth/dealer/login" className="text-orange-600 font-medium hover:underline">
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </div>

          {/* KYC Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-xs text-amber-700 dark:text-amber-400 text-center">
              {isHindi 
                ? '📋 साइनअप के बाद, आपको अपने दस्तावेज़ों के साथ KYC सत्यापन पूरा करना होगा'
                : '📋 After signup, you\'ll need to complete KYC verification with your documents'
              }
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DealerSignup;
