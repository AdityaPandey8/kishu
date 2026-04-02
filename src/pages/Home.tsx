import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Leaf, CloudSun, Users, Wrench, ShoppingBag, Play,
  ScanLine, ArrowRight, Globe, Smartphone, Shield,
  ChevronDown, Moon, Sun, Sparkles, Zap, TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', label: 'മലയാളം', flag: '🇮🇳' },
  { code: 'bn', label: 'বাংলা', flag: '🇮🇳' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', label: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
];

const features = [
  { icon: ScanLine, title: 'Crop Disease Detection', desc: 'AI-powered instant diagnosis from a photo of your crop', gradient: 'from-emerald-500 to-green-600' },
  { icon: CloudSun, title: 'Weather Alerts', desc: 'Hyperlocal forecasts & alerts to protect your harvest', gradient: 'from-blue-500 to-cyan-600' },
  { icon: Users, title: 'Expert Consultation', desc: 'Connect with verified agricultural experts in your language', gradient: 'from-violet-500 to-purple-600' },
  { icon: Wrench, title: 'Agri Services', desc: 'Book equipment, spraying, soil testing & harvesting on-demand', gradient: 'from-amber-500 to-orange-600' },
  { icon: ShoppingBag, title: 'Smart Shop', desc: 'Buy seeds, fertilizers & pesticides directly from verified dealers', gradient: 'from-rose-500 to-pink-600' },
  { icon: Play, title: 'Community & Reels', desc: 'Learn from short farming videos & connect with fellow farmers', gradient: 'from-teal-500 to-emerald-600' },
];

const steps = [
  { step: '01', title: 'Register', desc: 'Sign up as a Farmer, Dealer, or Expert in seconds', icon: Sparkles },
  { step: '02', title: 'Select Your Role', desc: 'Get a personalized dashboard tailored to your needs', icon: Zap },
  { step: '03', title: 'Access Smart Tools', desc: 'Diagnose crops, book services, shop, and grow your business', icon: TrendingUp },
];

const stats = [
  { value: '11+', label: 'Languages Supported' },
  { value: '100%', label: 'Farmer-First Design' },
  { value: 'AI', label: 'Powered Intelligence' },
  { value: '24/7', label: 'Expert Support' },
];

const Home = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { settings, toggleDarkMode } = useSettings();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute -bottom-40 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px]" />
      </div>

      {/* Top Bar */}
      <div className="sticky top-0 z-50 glass">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl gradient-premium flex items-center justify-center shadow-lg">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">KISHU</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={toggleDarkMode}>
              {settings.darkMode ? <Sun className="h-4 w-4 text-amber-500" /> : <Moon className="h-4 w-4 text-muted-foreground" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-2.5 rounded-xl">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium uppercase">{i18n.language}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[160px] rounded-xl max-h-[320px] overflow-y-auto">
                {languages.map(lang => (
                  <DropdownMenuItem key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); localStorage.setItem('kishu-language', lang.code); }}
                    className={cn('rounded-lg cursor-pointer', i18n.language === lang.code && 'bg-primary/10 text-primary')}>
                    {lang.flag} {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="h-9 rounded-xl gradient-premium text-primary-foreground border-0 shadow-lg hover:opacity-90 transition-opacity" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          className="relative z-10 max-w-4xl mx-auto"
          style={{ y: heroY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            className="mb-6"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">AI-Driven Smart Agriculture</span>
            </motion.div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            <span className="text-gradient-premium">KISHU</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Empowering every farmer with AI-powered tools, on-demand services, and a thriving community — in 11+ languages.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button size="lg" className="rounded-full px-10 h-13 text-base gradient-premium text-primary-foreground border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300" onClick={() => navigate('/auth')}>
              Start Free <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-10 h-13 text-base glass hover:bg-primary/5 transition-all duration-300" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Explore Features <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-1/4 left-[10%] w-16 h-16 rounded-2xl gradient-kishu opacity-20 blur-sm"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/3 right-[12%] w-12 h-12 rounded-full bg-accent/30 blur-sm"
          animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute top-1/3 right-[20%] w-8 h-8 rounded-lg bg-primary/20 blur-sm"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Everything a Modern Farmer Needs</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">From crop diagnosis to booking tractors — all in one app, in your language.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative bg-card border border-border/60 rounded-2xl p-7 shadow-sm hover:shadow-premium transition-all duration-300 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300`} />
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-3xl p-10 glow-primary">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-4xl sm:text-5xl font-extrabold text-gradient-premium">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Kishu */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">About</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-5">About KISHU</h2>
            <p className="text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto">
              KISHU is built with a single mission — to empower every Indian farmer with AI-powered tools,
              on-demand agricultural services, and a thriving community. Available in 11+ regional languages,
              KISHU bridges the gap between modern technology and grassroots farming.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: Globe, title: 'Multilingual', desc: 'Hindi, Tamil, Telugu & more', gradient: 'from-blue-500 to-cyan-500' },
              { icon: Smartphone, title: 'Mobile-First', desc: 'Works on any smartphone', gradient: 'from-violet-500 to-purple-500' },
              { icon: Shield, title: 'Verified Dealers', desc: 'KYC-verified supply chain', gradient: 'from-emerald-500 to-green-500' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="flex flex-col items-center gap-3 p-6 bg-card border border-border/60 rounded-2xl shadow-sm hover:shadow-premium transition-all duration-300"
                >
                  <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}>
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-muted/20">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-3 block">Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How It Works</h2>
          </motion.div>
          <div className="space-y-5 relative">
            {/* Connecting line */}
            <div className="absolute left-[39px] top-8 bottom-8 w-px bg-gradient-to-b from-primary/40 via-accent/40 to-primary/40 hidden sm:block" />
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ x: 8 }}
                  className="flex items-start gap-5 bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-premium transition-all duration-300 relative"
                >
                  <div className="h-14 w-14 rounded-xl gradient-premium flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary/50 uppercase tracking-widest">Step {s.step}</span>
                    <h3 className="font-semibold text-lg tracking-tight mt-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass rounded-3xl p-12 glow-primary relative overflow-hidden">
            <div className="absolute inset-0 gradient-premium opacity-5" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Ready to grow smarter?</h2>
              <p className="text-muted-foreground mb-8 text-lg">Join thousands of farmers already using KISHU to transform their farming.</p>
              <Button size="lg" className="rounded-full px-12 h-13 text-base gradient-premium text-primary-foreground border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300" onClick={() => navigate('/auth')}>
                Login / Sign Up <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg gradient-premium flex items-center justify-center">
              <Leaf className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">KISHU</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
