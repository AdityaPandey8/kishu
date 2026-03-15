import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Leaf, Tractor, Store, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const roles = [
  {
    id: 'farmer', icon: Tractor, label: 'Farmer', labelHi: 'किसान',
    description: 'Detect crop diseases, get weather alerts & expert help',
    descriptionHi: 'फसल रोग पहचान, मौसम अलर्ट और विशेषज्ञ सहायता',
    color: 'from-green-500 to-emerald-600', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', textColor: 'text-green-600',
    path: '/auth/farmer',
  },
  {
    id: 'dealer', icon: Store, label: 'Dealer', labelHi: 'डीलर',
    description: 'Manage inventory, track sales & grow your business',
    descriptionHi: 'इन्वेंट्री प्रबंधन, बिक्री ट्रैकिंग और व्यापार वृद्धि',
    color: 'from-orange-500 to-amber-600', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', textColor: 'text-orange-600',
    path: '/auth/dealer',
  },
  {
    id: 'provider', icon: Wrench, label: 'Service Provider', labelHi: 'सेवा प्रदाता',
    description: 'Offer agri services & manage bookings on-demand',
    descriptionHi: 'कृषि सेवाएं प्रदान करें और बुकिंग प्रबंधित करें',
    color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-500/10', borderColor: 'border-teal-500/30', textColor: 'text-teal-600',
    path: '/auth/provider',
  },
  {
    id: 'admin', icon: Shield, label: 'Admin', labelHi: 'एडमिन',
    description: 'Manage users, verify dealers & moderate platform',
    descriptionHi: 'उपयोगकर्ता प्रबंधन, डीलर सत्यापन और प्लेटफ़ॉर्म मॉडरेशन',
    color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/30', textColor: 'text-violet-600',
    path: '/auth/admin', loginOnly: true,
  },
];

const AuthLanding = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Parallax decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          style={{ y: blob1Y }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-accent/20 blur-3xl"
          style={{ y: blob2Y }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-green-500/5 via-orange-500/5 to-violet-500/5 blur-3xl"
          animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-6 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="flex flex-col items-center mb-10"
        >
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-kishu shadow-kishu mb-4"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Leaf className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gradient-kishu">{t('common.appName')}</h1>
          <p className="text-muted-foreground mt-2">{t('common.tagline')}</p>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-xl font-semibold text-foreground">
            {isHindi ? 'आप कौन हैं?' : 'Who are you?'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isHindi ? 'जारी रखने के लिए अपनी भूमिका चुनें' : 'Select your role to continue'}
          </p>
        </motion.div>

        {/* Role Cards with 3D tilt */}
        <div className="w-full max-w-md mx-auto space-y-4">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, damping: 18, delay: 0.1 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -6, rotateX: 3, rotateY: -2 }}
                className={`${role.bgColor} ${role.borderColor} border-2 rounded-2xl p-5 backdrop-blur-sm`}
                style={{ transformPerspective: 1000 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    className={`h-14 w-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${role.textColor}`}>
                      {isHindi ? role.labelHi : role.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {isHindi ? role.descriptionHi : role.description}
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Button
                        onClick={() => navigate(`${role.path}/login`)}
                        className={`flex-1 h-10 rounded-xl bg-gradient-to-r ${role.color} text-white hover:opacity-90`}
                      >
                        {t('auth.login')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                      {!role.loginOnly && (
                        <Button
                          onClick={() => navigate(`${role.path}/signup`)}
                          variant="outline"
                          className={`flex-1 h-10 rounded-xl ${role.borderColor} ${role.textColor} hover:${role.bgColor}`}
                        >
                          {t('auth.signup')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          {isHindi 
            ? 'जारी रखकर, आप हमारी सेवा की शर्तों और गोपनीयता नीति से सहमत होते हैं'
            : 'By continuing, you agree to our Terms of Service and Privacy Policy'
          }
        </motion.p>
      </div>
    </div>
  );
};

export default AuthLanding;
