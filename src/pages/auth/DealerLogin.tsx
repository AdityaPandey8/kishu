import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Package, Users, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, DEMO_CREDENTIALS } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const features = [
  { icon: Package, text: 'Inventory Management', textHi: 'इन्वेंट्री प्रबंधन' },
  { icon: Users, text: 'Customer CRM', textHi: 'ग्राहक CRM' },
  { icon: BarChart3, text: 'Sales Analytics', textHi: 'बिक्री विश्लेषण' },
  { icon: FileText, text: 'Quote Builder', textHi: 'कोटेशन बिल्डर' },
];

const DealerLogin = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isHindi = i18n.language === 'hi';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dealerDemo = DEMO_CREDENTIALS.find(c => c.role === 'Dealer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(isHindi ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.user?.role !== 'dealer') {
        toast.error(isHindi ? 'यह डीलर खाता नहीं है' : 'This is not a dealer account');
        return;
      }
      
      // Check KYC status
      const kycStatus = result.user?.kycStatus;
      if (kycStatus === 'not_submitted') {
        toast.info(isHindi ? 'कृपया KYC सत्यापन पूरा करें' : 'Please complete KYC verification');
        navigate('/dealer/kyc');
        return;
      }
      if (kycStatus === 'pending') {
        navigate('/dealer/kyc-pending');
        return;
      }
      if (kycStatus === 'rejected') {
        navigate('/dealer/kyc-rejected');
        return;
      }
      
      toast.success(t('auth.loginSuccess'));
      navigate('/');
    } catch (error) {
      toast.error(isHindi ? 'लॉगिन विफल' : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (!dealerDemo) return;
    setIsLoading(true);
    try {
      await login(dealerDemo.email, dealerDemo.password);
      toast.success(t('auth.loginSuccess'));
      navigate('/');
    } catch (error) {
      toast.error('Login failed');
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
          onClick={() => navigate('/auth')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">{isHindi ? 'भूमिका बदलें' : 'Change role'}</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {isHindi ? 'डीलर लॉगिन' : 'Dealer Login'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isHindi ? 'अपने व्यापार खाते में लॉगिन करें' : 'Sign in to your business account'}
          </p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-6"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20"
              >
                <Icon className="h-3.5 w-3.5 text-orange-600" />
                <span className="text-xs font-medium text-orange-700 dark:text-orange-400">
                  {isHindi ? feature.textHi : feature.text}
                </span>
              </div>
            );
          })}
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-orange-500/20 rounded-3xl p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="dealer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-orange-500/20 focus:border-orange-500"
                  />
                </div>
              </div>

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
              </div>

              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-orange-600 hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:opacity-90 text-base font-medium"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {t('auth.login')}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Account */}
            {dealerDemo && (
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 transition-colors"
                >
                  <span className="text-xl">{dealerDemo.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {isHindi ? 'डेमो डीलर खाता' : 'Demo Dealer Account'}
                    </p>
                    <p className="text-xs text-muted-foreground">{dealerDemo.email}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-orange-600" />
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <Link to="/auth/dealer/signup" className="text-orange-600 font-medium hover:underline">
                  {t('auth.signup')}
                </Link>
              </p>
            </div>
          </div>

          {/* KYC Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-xs text-amber-700 dark:text-amber-400 text-center">
              {isHindi 
                ? '⚠️ नए डीलरों को बेचने से पहले KYC सत्यापन पूरा करना होगा'
                : '⚠️ New dealers must complete KYC verification before selling'
              }
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DealerLogin;
