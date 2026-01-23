import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Building2, MapPin, CreditCard, FileText, 
  Check, ChevronRight, Upload, AlertCircle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const steps = [
  { id: 1, title: 'Business Details', titleHi: 'व्यापार विवरण', icon: Building2 },
  { id: 2, title: 'Address', titleHi: 'पता', icon: MapPin },
  { id: 3, title: 'Bank Details', titleHi: 'बैंक विवरण', icon: CreditCard },
  { id: 4, title: 'Documents', titleHi: 'दस्तावेज़', icon: FileText },
];

const businessTypes = [
  { value: 'retail', label: 'Retail Store', labelHi: 'खुदरा दुकान' },
  { value: 'wholesale', label: 'Wholesale', labelHi: 'थोक विक्रेता' },
  { value: 'distributor', label: 'Distributor', labelHi: 'वितरक' },
  { value: 'manufacturer', label: 'Manufacturer', labelHi: 'निर्माता' },
];

const states = [
  'Andhra Pradesh', 'Bihar', 'Delhi', 'Gujarat', 'Haryana', 
  'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 
  'Rajasthan', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
];

const DealerKYC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { submitDealerKYC } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '' as 'retail' | 'wholesale' | 'manufacturer' | 'distributor',
    gstNumber: '',
    panNumber: '',
    businessAddress: '',
    city: '',
    state: '',
    pincode: '',
    contactNumber: user?.phone || '',
    accountName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.businessName && formData.businessType && formData.gstNumber && formData.panNumber);
      case 2:
        return !!(formData.businessAddress && formData.city && formData.state && formData.pincode && formData.contactNumber);
      case 3:
        return !!(formData.accountName && formData.accountNumber && formData.ifscCode && formData.bankName);
      case 4:
        return termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error(isHindi ? 'कृपया सभी फील्ड भरें' : 'Please fill all required fields');
      return;
    }
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      
      submitDealerKYC({
        dealerId: user.id,
        dealerName: user.name,
        dealerEmail: user.email,
        businessName: formData.businessName,
        businessType: formData.businessType,
        gstNumber: formData.gstNumber,
        panNumber: formData.panNumber,
        businessAddress: formData.businessAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        contactNumber: formData.contactNumber,
        bankDetails: {
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode,
          bankName: formData.bankName,
        },
      });

      updateUser({ kycStatus: 'pending', kycSubmittedAt: new Date().toISOString() });
      
      toast.success(isHindi ? 'KYC सबमिट हो गया!' : 'KYC submitted successfully!');
      navigate('/dealer/kyc-pending');
    } catch {
      toast.error(isHindi ? 'कुछ गलत हुआ' : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user || user.role !== 'dealer') {
    navigate('/');
    return null;
  }

  return (
    <AppLayout hideNav>
      <div className="container px-4 py-4 pb-8 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl font-bold text-foreground text-center">
            {isHindi ? 'KYC सत्यापन' : 'KYC Verification'}
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            {isHindi ? 'बेचना शुरू करने के लिए आवश्यक' : 'Required to start selling'}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'h-10 w-10 rounded-full flex items-center justify-center transition-colors',
                    isCompleted ? 'bg-green-500 text-white' :
                    isCurrent ? 'bg-primary text-primary-foreground' :
                    'bg-muted text-muted-foreground'
                  )}>
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 text-center max-w-16">
                    {isHindi ? step.titleHi : step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'h-0.5 w-8 mx-1 mt-[-16px]',
                    isCompleted ? 'bg-green-500' : 'bg-muted'
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Steps */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-soft"
        >
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {isHindi ? 'व्यापार विवरण' : 'Business Details'}
              </h2>
              
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {isHindi ? 'व्यापार/दुकान का नाम' : 'Business/Shop Name'} *
                </label>
                <Input
                  placeholder={isHindi ? 'जैसे: श्री कृष्ण एग्रो सप्लाइज' : 'e.g., Shri Krishna Agro Supplies'}
                  className="h-12 rounded-xl"
                  value={formData.businessName}
                  onChange={(e) => updateField('businessName', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {isHindi ? 'व्यापार का प्रकार' : 'Business Type'} *
                </label>
                <Select value={formData.businessType} onValueChange={(v) => updateField('businessType', v)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder={isHindi ? 'चुनें' : 'Select'} />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {isHindi ? type.labelHi : type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  GST Number *
                </label>
                <Input
                  placeholder="22AAAAA0000A1Z5"
                  className="h-12 rounded-xl uppercase"
                  value={formData.gstNumber}
                  onChange={(e) => updateField('gstNumber', e.target.value.toUpperCase())}
                  maxLength={15}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  PAN Number *
                </label>
                <Input
                  placeholder="ABCDE1234F"
                  className="h-12 rounded-xl uppercase"
                  value={formData.panNumber}
                  onChange={(e) => updateField('panNumber', e.target.value.toUpperCase())}
                  maxLength={10}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {isHindi ? 'व्यापार का पता' : 'Business Address'}
              </h2>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {isHindi ? 'पूरा पता' : 'Full Address'} *
                </label>
                <Input
                  placeholder={isHindi ? 'दुकान नंबर, गली, क्षेत्र' : 'Shop No., Street, Area'}
                  className="h-12 rounded-xl"
                  value={formData.businessAddress}
                  onChange={(e) => updateField('businessAddress', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {isHindi ? 'शहर' : 'City'} *
                  </label>
                  <Input
                    placeholder={isHindi ? 'शहर' : 'City'}
                    className="h-12 rounded-xl"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {isHindi ? 'पिनकोड' : 'Pincode'} *
                  </label>
                  <Input
                    placeholder="110001"
                    className="h-12 rounded-xl"
                    value={formData.pincode}
                    onChange={(e) => updateField('pincode', e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {isHindi ? 'राज्य' : 'State'} *
                </label>
                <Select value={formData.state} onValueChange={(v) => updateField('state', v)}>
                  <SelectTrigger className="h-12 rounded-xl">
                    <SelectValue placeholder={isHindi ? 'राज्य चुनें' : 'Select State'} />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {isHindi ? 'संपर्क नंबर' : 'Contact Number'} *
                </label>
                <Input
                  placeholder="+91 98765 43210"
                  className="h-12 rounded-xl"
                  value={formData.contactNumber}
                  onChange={(e) => updateField('contactNumber', e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {isHindi ? 'बैंक विवरण' : 'Bank Details'}
              </h2>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {isHindi ? 'खाताधारक का नाम' : 'Account Holder Name'} *
                </label>
                <Input
                  placeholder={isHindi ? 'जैसा बैंक में है' : 'As per bank records'}
                  className="h-12 rounded-xl"
                  value={formData.accountName}
                  onChange={(e) => updateField('accountName', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {isHindi ? 'खाता नंबर' : 'Account Number'} *
                </label>
                <Input
                  placeholder="1234567890123456"
                  className="h-12 rounded-xl"
                  value={formData.accountNumber}
                  onChange={(e) => updateField('accountNumber', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  IFSC Code *
                </label>
                <Input
                  placeholder="SBIN0001234"
                  className="h-12 rounded-xl uppercase"
                  value={formData.ifscCode}
                  onChange={(e) => updateField('ifscCode', e.target.value.toUpperCase())}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">
                  {isHindi ? 'बैंक का नाम' : 'Bank Name'} *
                </label>
                <Input
                  placeholder={isHindi ? 'जैसे: State Bank of India' : 'e.g., State Bank of India'}
                  className="h-12 rounded-xl"
                  value={formData.bankName}
                  onChange={(e) => updateField('bankName', e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {isHindi ? 'दस्तावेज़ अपलोड करें' : 'Upload Documents'}
              </h2>

              <div className="space-y-3">
                {['GST Certificate', 'PAN Card', 'Shop License', 'Address Proof'].map((doc) => (
                  <div
                    key={doc}
                    className="border-2 border-dashed border-border rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{doc}</span>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-lg">
                      <Upload className="h-4 w-4 mr-1" />
                      {isHindi ? 'अपलोड' : 'Upload'}
                    </Button>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-700">
                  {isHindi 
                    ? 'दस्तावेज़ अपलोड वैकल्पिक है। आप बाद में भी अपलोड कर सकते हैं।'
                    : 'Document upload is optional. You can upload them later as well.'}
                </p>
              </div>

              <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl mt-4">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  {isHindi 
                    ? 'मैं KISHU के नियमों और शर्तों से सहमत हूं और पुष्टि करता हूं कि दी गई जानकारी सही है।'
                    : 'I agree to KISHU terms and conditions and confirm that the information provided is accurate.'}
                </label>
              </div>
            </div>
          )}
        </motion.div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              {isHindi ? 'पीछे' : 'Back'}
            </Button>
          )}
          <Button
            className="flex-1 h-12 rounded-xl"
            onClick={handleNext}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              isHindi ? 'सबमिट हो रहा है...' : 'Submitting...'
            ) : currentStep === 4 ? (
              isHindi ? 'सबमिट करें' : 'Submit KYC'
            ) : (
              <>
                {isHindi ? 'आगे' : 'Next'}
                <ChevronRight className="h-5 w-5 ml-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default DealerKYC;
