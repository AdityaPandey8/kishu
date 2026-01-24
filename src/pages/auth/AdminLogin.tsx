import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, DEMO_CREDENTIALS } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const AdminLogin = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isHindi = i18n.language === 'hi';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const adminDemo = DEMO_CREDENTIALS.find(c => c.role === 'Admin');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(isHindi ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.user?.role !== 'admin') {
        toast.error(isHindi ? 'यह एडमिन खाता नहीं है' : 'This is not an admin account');
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
    if (!adminDemo) return;
    setIsLoading(true);
    try {
      await login(adminDemo.email, adminDemo.password);
      toast.success(t('auth.loginSuccess'));
      navigate('/');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-background to-purple-50/50 dark:from-violet-950/20 dark:via-background dark:to-purple-950/20 flex flex-col">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" />
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
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-violet-600 dark:text-violet-400">
            {isHindi ? 'एडमिन लॉगिन' : 'Admin Login'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isHindi ? 'सुरक्षित प्रशासन पैनल' : 'Secure Administration Panel'}
          </p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm mx-auto mb-6"
        >
          <div className="flex items-center gap-2 p-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <AlertTriangle className="h-4 w-4 text-violet-600 flex-shrink-0" />
            <p className="text-xs text-violet-700 dark:text-violet-400">
              {isHindi 
                ? 'केवल अधिकृत कर्मचारियों के लिए। अनधिकृत पहुंच प्रतिबंधित है।'
                : 'Authorized personnel only. Unauthorized access is prohibited.'
              }
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-violet-500/20 rounded-3xl p-6 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@kishu.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 rounded-xl bg-muted/50 border-violet-500/20 focus:border-violet-500"
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
                    className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-violet-500/20 focus:border-violet-500"
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
                <Link to="/forgot-password" className="text-sm text-violet-600 hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90 text-base font-medium"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    {isHindi ? 'सुरक्षित लॉगिन' : 'Secure Login'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Demo Account */}
            {adminDemo && (
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 transition-colors"
                >
                  <span className="text-xl">{adminDemo.icon}</span>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-foreground">
                      {isHindi ? 'डेमो एडमिन खाता' : 'Demo Admin Account'}
                    </p>
                    <p className="text-xs text-muted-foreground">{adminDemo.email}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-violet-600" />
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isHindi ? 'एडमिन नहीं हैं?' : 'Not an admin?'}{' '}
                <Link to="/auth" className="text-violet-600 font-medium hover:underline">
                  {isHindi ? 'भूमिका बदलें' : 'Change role'}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
