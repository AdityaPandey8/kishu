import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, MessageSquare, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const KYCRejected = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const isHindi = i18n.language === 'hi';

  const handleResubmit = () => {
    // Reset KYC status to allow resubmission
    updateUser({ kycStatus: 'not_submitted', kycRejectionReason: undefined });
    navigate('/dealer/kyc');
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
            className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6"
          >
            <XCircle className="h-12 w-12 text-red-600" />
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isHindi ? 'KYC अस्वीकृत' : 'KYC Rejected'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isHindi 
              ? 'दुर्भाग्य से, आपका KYC आवेदन अस्वीकृत कर दिया गया है।'
              : 'Unfortunately, your KYC application has been rejected.'}
          </p>

          {/* Rejection Reason */}
          {user?.kycRejectionReason && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 mb-1">
                    {isHindi ? 'अस्वीकृति का कारण:' : 'Rejection Reason:'}
                  </p>
                  <p className="text-sm text-red-700">
                    {user.kycRejectionReason}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* What to do next */}
          <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-3">
              {isHindi ? 'आगे क्या करें?' : 'What to do next?'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {isHindi 
                  ? 'अस्वीकृति कारण की समीक्षा करें'
                  : 'Review the rejection reason carefully'}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {isHindi 
                  ? 'सही दस्तावेज़ तैयार करें'
                  : 'Prepare correct documents'}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                {isHindi 
                  ? 'KYC पुनः सबमिट करें'
                  : 'Resubmit your KYC'}
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 rounded-xl"
              onClick={handleResubmit}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              {isHindi ? 'KYC पुनः सबमिट करें' : 'Resubmit KYC'}
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

export default KYCRejected;
