import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, RefreshCw, MessageSquare, FileText } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const KYCPending = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const isHindi = i18n.language === 'hi';

  const handleRefresh = () => {
    // Simulate checking status - in real app, this would be an API call
    toast.info(isHindi ? 'स्थिति जांच रहे हैं...' : 'Checking status...');
    setTimeout(() => {
      toast.info(isHindi ? 'अभी भी समीक्षाधीन है' : 'Still under review');
    }, 1000);
  };

  const handleContactSupport = () => {
    toast.info(isHindi ? 'सहायता से संपर्क करें: support@kishu.app' : 'Contact support: support@kishu.app');
  };

  const handleLogout = () => {
    updateUser({});
    localStorage.removeItem('kishu-user');
    navigate('/login');
  };

  return (
    <AppLayout hideNav>
      <div className="container px-4 py-8 max-w-md mx-auto min-h-screen flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6"
          >
            <Clock className="h-12 w-12 text-amber-600" />
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isHindi ? 'KYC समीक्षाधीन' : 'KYC Under Review'}
          </h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            {isHindi 
              ? 'आपका आवेदन हमारी टीम द्वारा समीक्षाधीन है। इसमें 24-48 घंटे लग सकते हैं।'
              : 'Your application is being reviewed by our team. This usually takes 24-48 hours.'}
          </p>

          {/* Timeline */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-4">
              {isHindi ? 'प्रक्रिया स्थिति' : 'Process Status'}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isHindi ? 'आवेदन प्राप्त' : 'Application Received'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.kycSubmittedAt 
                      ? new Date(user.kycSubmittedAt).toLocaleDateString() 
                      : 'Just now'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center animate-pulse">
                  <FileText className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {isHindi ? 'दस्तावेज़ सत्यापन' : 'Document Verification'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isHindi ? 'प्रगति पर' : 'In progress'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 opacity-50">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {isHindi ? 'स्वीकृति' : 'Approval'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isHindi ? 'लंबित' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 rounded-xl"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              {isHindi ? 'स्थिति जांचें' : 'Check Status'}
            </Button>
            
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl"
              onClick={handleContactSupport}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              {isHindi ? 'सहायता से संपर्क करें' : 'Contact Support'}
            </Button>

            <Button
              variant="ghost"
              className="w-full h-10"
              onClick={handleLogout}
            >
              {isHindi ? 'लॉग आउट' : 'Log Out'}
            </Button>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default KYCPending;
