import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, HelpCircle, ChevronDown, MessageSquare, 
  Phone, Mail, Leaf, Camera, History, Users, Shield
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const faqs = [
  {
    question: 'How do I scan a crop for disease?',
    questionHi: 'मैं फसल की बीमारी के लिए स्कैन कैसे करूं?',
    answer: 'Go to the Scan tab, take a clear photo of the affected plant part (leaf, stem, or fruit), and our AI will analyze it to detect any diseases.',
    answerHi: 'स्कैन टैब पर जाएं, प्रभावित पौधे के हिस्से (पत्ती, तना, या फल) की स्पष्ट फोटो लें, और हमारा AI किसी भी बीमारी का पता लगाने के लिए इसका विश्लेषण करेगा।',
    icon: Camera,
  },
  {
    question: 'Where can I see my scan history?',
    questionHi: 'मैं अपना स्कैन इतिहास कहां देख सकता हूं?',
    answer: 'All your past scans are saved in the History tab. You can view details, bookmark important ones, and track your crop health over time.',
    answerHi: 'आपके सभी पिछले स्कैन इतिहास टैब में सहेजे गए हैं। आप विवरण देख सकते हैं, महत्वपूर्ण को बुकमार्क कर सकते हैं।',
    icon: History,
  },
  {
    question: 'How do I contact a dealer for products?',
    questionHi: 'उत्पादों के लिए डीलर से कैसे संपर्क करूं?',
    answer: 'When viewing a diagnosis, tap "Find Treatment" to see recommended products and nearby dealers. You can call or send an inquiry directly.',
    answerHi: 'निदान देखते समय, "उपचार खोजें" पर टैप करें और अनुशंसित उत्पाद और नजदीकी डीलर देखें।',
    icon: Users,
  },
  {
    question: 'Is my data secure?',
    questionHi: 'क्या मेरा डेटा सुरक्षित है?',
    answer: 'Yes! Your data is stored securely and we never share your personal information with third parties without your consent.',
    answerHi: 'हां! आपका डेटा सुरक्षित रूप से संग्रहीत है और हम आपकी सहमति के बिना आपकी व्यक्तिगत जानकारी तीसरे पक्ष के साथ साझा नहीं करते।',
    icon: Shield,
  },
  {
    question: 'Can I use the app offline?',
    questionHi: 'क्या मैं ऐप को ऑफलाइन उपयोग कर सकता हूं?',
    answer: 'Basic features like viewing history work offline. However, scanning and community features require an internet connection.',
    answerHi: 'इतिहास देखने जैसी बुनियादी सुविधाएं ऑफ़लाइन काम करती हैं। हालांकि, स्कैनिंग के लिए इंटरनेट कनेक्शन आवश्यक है।',
    icon: Leaf,
  },
];

const quickTips = [
  { title: 'Best Scan Quality', titleHi: 'सर्वश्रेष्ठ स्कैन गुणवत्ता', tip: 'Take photos in good lighting, focus on the affected area', tipHi: 'अच्छी रोशनी में फोटो लें, प्रभावित क्षेत्र पर फोकस करें' },
  { title: 'Multiple Angles', titleHi: 'कई कोण', tip: 'Scan from different angles for better accuracy', tipHi: 'बेहतर सटीकता के लिए विभिन्न कोणों से स्कैन करें' },
  { title: 'Regular Monitoring', titleHi: 'नियमित निगरानी', tip: 'Scan your crops weekly to catch issues early', tipHi: 'समस्याओं को जल्दी पकड़ने के लिए साप्ताहिक स्कैन करें' },
];

const Help = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const handleSubmitFeedback = () => {
    if (!feedbackMessage.trim()) {
      toast.error(isHindi ? 'कृपया संदेश दर्ज करें' : 'Please enter a message');
      return;
    }
    toast.success(isHindi ? 'प्रतिक्रिया भेजी गई!' : 'Feedback submitted!');
    setFeedbackName('');
    setFeedbackMessage('');
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
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            {isHindi ? 'सहायता केंद्र' : 'Help Center'}
          </h1>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">
            {isHindi ? 'त्वरित सुझाव' : 'Quick Tips'}
          </h2>
          <div className="grid grid-cols-1 gap-2">
            {quickTips.map((tip, index) => (
              <div 
                key={index}
                className="bg-primary/5 border border-primary/20 rounded-xl p-3"
              >
                <p className="font-medium text-sm text-foreground">
                  💡 {isHindi ? tip.titleHi : tip.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isHindi ? tip.tipHi : tip.tip}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">
            {isHindi ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, index) => {
              const Icon = faq.icon;
              const isExpanded = expandedFaq === index;
              
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl overflow-hidden shadow-soft"
                >
                  <button
                    className="w-full flex items-center gap-3 p-4 text-left"
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  >
                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="flex-1 text-sm font-medium text-foreground">
                      {isHindi ? faq.questionHi : faq.question}
                    </span>
                    <ChevronDown className={cn(
                      'h-5 w-5 text-muted-foreground transition-transform',
                      isExpanded && 'rotate-180'
                    )} />
                  </button>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-sm text-muted-foreground pl-11">
                        {isHindi ? faq.answerHi : faq.answer}
                      </p>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">
            {isHindi ? 'संपर्क करें' : 'Contact Us'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <a 
              href="tel:+911234567890"
              className="bg-card border border-border rounded-xl p-4 shadow-soft flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{isHindi ? 'कॉल करें' : 'Call Us'}</p>
                <p className="text-sm font-medium text-foreground">1800-XXX-XXXX</p>
              </div>
            </a>
            <a 
              href="mailto:support@kishu.app"
              className="bg-card border border-border rounded-xl p-4 shadow-soft flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{isHindi ? 'ईमेल करें' : 'Email Us'}</p>
                <p className="text-sm font-medium text-foreground truncate">support@kishu.app</p>
              </div>
            </a>
          </div>
        </motion.div>

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            {isHindi ? 'प्रतिक्रिया भेजें' : 'Send Feedback'}
          </h2>
          <div className="bg-card border border-border rounded-xl p-4 shadow-soft space-y-3">
            <Input
              placeholder={isHindi ? 'आपका नाम (वैकल्पिक)' : 'Your name (optional)'}
              value={feedbackName}
              onChange={(e) => setFeedbackName(e.target.value)}
              className="rounded-xl"
            />
            <Textarea
              placeholder={isHindi ? 'आपकी प्रतिक्रिया...' : 'Your feedback...'}
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
              className="rounded-xl min-h-[100px]"
            />
            <Button 
              className="w-full rounded-xl gradient-kishu shadow-kishu"
              onClick={handleSubmitFeedback}
            >
              {isHindi ? 'प्रतिक्रिया भेजें' : 'Submit Feedback'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Help;
