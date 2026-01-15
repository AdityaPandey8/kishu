import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, User, Phone, Tractor, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const roles: { id: UserRole; icon: any; label: string; labelHi: string; description: string }[] = [
  { id: 'farmer', icon: Tractor, label: 'Farmer', labelHi: 'किसान', description: 'Grow & manage crops' },
  { id: 'dealer', icon: Store, label: 'Dealer', labelHi: 'डीलर', description: 'Sell agri products' },
];

const Signup = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useAuth();
  const isHindi = i18n.language === 'hi';
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!name || !role) {
        toast.error('Please fill in all fields');
        return;
      }
      setStep(2);
      return;
    }
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup({ email, password, name, role, phone });
      toast.success(t('auth.signupSuccess'));
      navigate('/');
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-8"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-kishu shadow-kishu mb-3">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-gradient-kishu">{t('common.appName')}</h1>
        </motion.div>

        {/* Progress */}
        <div className="w-full max-w-sm mx-auto mb-6">
          <div className="flex items-center gap-2">
            <div className={cn('flex-1 h-1 rounded-full', step >= 1 ? 'bg-primary' : 'bg-muted')} />
            <div className={cn('flex-1 h-1 rounded-full', step >= 2 ? 'bg-primary' : 'bg-muted')} />
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">Step {step} of 2</p>
        </div>

        {/* Form */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('auth.signup')}</h2>
            <p className="text-sm text-muted-foreground mb-6">
              {step === 1 ? 'Tell us about yourself' : 'Create your account'}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                <>
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t('auth.selectRole')}</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((r) => {
                        const Icon = r.icon;
                        const isSelected = role === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            className={cn(
                              'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                              isSelected
                                ? 'border-primary bg-primary/10 shadow-kishu'
                                : 'border-border bg-muted/30 hover:border-primary/50'
                            )}
                          >
                            <div className={cn(
                              'h-12 w-12 rounded-xl flex items-center justify-center',
                              isSelected ? 'gradient-kishu' : 'bg-muted'
                            )}>
                              <Icon className={cn('h-6 w-6', isSelected ? 'text-primary-foreground' : 'text-muted-foreground')} />
                            </div>
                            <span className={cn('font-medium', isSelected ? 'text-primary' : 'text-foreground')}>
                              {isHindi ? r.labelHi : r.label}
                            </span>
                            <span className="text-xs text-muted-foreground">{r.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">{t('auth.name')}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={isHindi ? 'आपका नाम' : 'Your full name'}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-muted/50 border-border"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">{t('auth.phone')}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-muted/50 border-border"
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
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 rounded-xl bg-muted/50 border-border"
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
                        className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-border"
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
                </>
              )}

              <div className="flex gap-3 pt-2">
                {step === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 rounded-xl"
                  >
                    {t('common.back')}
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    'h-12 rounded-xl gradient-kishu shadow-kishu text-base font-medium',
                    step === 1 ? 'w-full' : 'flex-1'
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      {step === 1 ? t('common.next') : t('auth.signup')}
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.hasAccount')}{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
