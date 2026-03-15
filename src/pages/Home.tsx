import { motion } from 'framer-motion';
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
  CheckCircle2, ChevronDown, Moon, Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  { icon: ScanLine, title: 'Crop Disease Detection', desc: 'AI-powered instant diagnosis from a photo of your crop', color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  { icon: CloudSun, title: 'Weather Alerts', desc: 'Hyperlocal forecasts & alerts to protect your harvest', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  { icon: Users, title: 'Expert Consultation', desc: 'Connect with verified agricultural experts in your language', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
  { icon: Wrench, title: 'Agri Services', desc: 'Book equipment, spraying, soil testing & harvesting on-demand', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  { icon: ShoppingBag, title: 'Smart Shop', desc: 'Buy seeds, fertilizers & pesticides directly from verified dealers', color: 'text-rose-600', bg: 'bg-rose-100 dark:bg-rose-900/30' },
  { icon: Play, title: 'Community & Reels', desc: 'Learn from short farming videos & connect with fellow farmers', color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/30' },
];

const steps = [
  { step: '01', title: 'Register', desc: 'Sign up as a Farmer, Dealer, or Expert in seconds' },
  { step: '02', title: 'Select Your Role', desc: 'Get a personalized dashboard tailored to your needs' },
  { step: '03', title: 'Access Smart Tools', desc: 'Diagnose crops, book services, shop, and grow your business' },
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
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <motion.div
          className="relative z-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="h-10 w-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              <span className="text-primary">Kishu</span>
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto">
            AI - Driven Smart Agriculture Ecosystem
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" className="rounded-full px-8 text-base" onClick={() => navigate('/auth')}>
              Get Started <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8 text-base" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-3">Everything a Modern Farmer Needs</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">From crop diagnosis to booking tractors — all in one app, in your language.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${f.bg}`}>
                    <Icon className={`h-6 w-6 ${f.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-primary/5">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-3xl font-extrabold text-primary">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Kishu */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">About Kishu</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Kishu is built with a single mission — to empower every Indian farmer with AI-powered tools,
              on-demand agricultural services, and a thriving community. Available in 11+ regional languages,
              Kishu bridges the gap between modern technology and grassroots farming.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl">
                <Globe className="h-6 w-6 text-primary" />
                <p className="font-medium text-sm">Multilingual</p>
                <p className="text-xs text-muted-foreground">Hindi, Tamil, Telugu & more</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl">
                <Smartphone className="h-6 w-6 text-primary" />
                <p className="font-medium text-sm">Mobile-First</p>
                <p className="text-xs text-muted-foreground">Works on any smartphone</p>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-card border border-border rounded-xl">
                <Shield className="h-6 w-6 text-primary" />
                <p className="font-medium text-sm">Verified Dealers</p>
                <p className="text-xs text-muted-foreground">KYC-verified supply chain</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <div className="space-y-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex items-start gap-4 bg-card border border-border rounded-2xl p-5"
              >
                <span className="text-2xl font-extrabold text-primary/30">{s.step}</span>
                <div>
                  <h3 className="font-semibold text-lg">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Ready to grow smarter?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of farmers already using Kishu.</p>
          <Button size="lg" className="rounded-full px-10 text-base" onClick={() => navigate('/auth')}>
            Login / Sign Up <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Kishu</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer">Terms</span>
            <span className="hover:text-foreground cursor-pointer">Privacy</span>
            <span className="hover:text-foreground cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
