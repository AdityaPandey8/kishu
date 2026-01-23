import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Shield, CheckCircle2, XCircle, Clock, 
  User, MapPin, Building2, Search, ChevronRight, Phone, Mail
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const AdminKYC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dealerKYCs, approveDealerKYC, rejectDealerKYC } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKYC, setSelectedKYC] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  if (user?.role !== 'admin') {
    return (
      <AppLayout>
        <div className="container px-4 py-8 text-center">
          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Admin access required</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </AppLayout>
    );
  }

  const filteredKYCs = dealerKYCs.filter(kyc => {
    const matchesTab = kyc.status === activeTab;
    const matchesSearch = kyc.dealerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          kyc.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          kyc.dealerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = (kycId: string, dealerId: string) => {
    approveDealerKYC(kycId, dealerId, user.id);
    toast.success(isHindi ? 'KYC स्वीकृत' : 'KYC approved');
    setSelectedKYC(null);
  };

  const handleReject = () => {
    if (selectedKYC && rejectionReason) {
      rejectDealerKYC(selectedKYC.id, selectedKYC.dealerId, user.id, rejectionReason);
      toast.success(isHindi ? 'KYC अस्वीकृत' : 'KYC rejected');
      setSelectedKYC(null);
      setIsRejectDialogOpen(false);
      setRejectionReason('');
    }
  };

  const stats = {
    pending: dealerKYCs.filter(k => k.status === 'pending').length,
    approved: dealerKYCs.filter(k => k.status === 'approved').length,
    rejected: dealerKYCs.filter(k => k.status === 'rejected').length,
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-24">
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
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {isHindi ? 'KYC प्रबंधन' : 'KYC Management'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isHindi ? 'डीलर सत्यापन' : 'Dealer verification'}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center"
          >
            <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-amber-700">{stats.pending}</p>
            <p className="text-xs text-amber-600">{isHindi ? 'लंबित' : 'Pending'}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-green-50 border border-green-200 rounded-xl p-3 text-center"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-green-700">{stats.approved}</p>
            <p className="text-xs text-green-600">{isHindi ? 'स्वीकृत' : 'Approved'}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-red-50 border border-red-200 rounded-xl p-3 text-center"
          >
            <XCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <p className="text-xl font-bold text-red-700">{stats.rejected}</p>
            <p className="text-xs text-red-600">{isHindi ? 'अस्वीकृत' : 'Rejected'}</p>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['pending', 'approved', 'rejected'] as const).map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              className="rounded-full capitalize"
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'pending' ? (isHindi ? 'लंबित' : 'Pending') :
               tab === 'approved' ? (isHindi ? 'स्वीकृत' : 'Approved') :
               (isHindi ? 'अस्वीकृत' : 'Rejected')}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={isHindi ? 'नाम या ईमेल से खोजें...' : 'Search by name or email...'}
            className="h-11 pl-10 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* KYC List */}
        <div className="space-y-3">
          {filteredKYCs.map((kyc, index) => (
            <motion.div
              key={kyc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 shadow-soft"
              onClick={() => setSelectedKYC(kyc)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{kyc.businessName}</p>
                    <p className="text-xs text-muted-foreground">{kyc.dealerName}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {kyc.city}, {kyc.state}
                </span>
                <span>{kyc.businessType}</span>
              </div>
            </motion.div>
          ))}

          {filteredKYCs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isHindi ? 'कोई KYC नहीं मिला' : 'No KYC applications found'}
              </p>
            </div>
          )}
        </div>

        {/* KYC Detail Dialog */}
        <Dialog open={!!selectedKYC && !isRejectDialogOpen} onOpenChange={() => setSelectedKYC(null)}>
          <DialogContent className="max-w-md mx-4 max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isHindi ? 'KYC विवरण' : 'KYC Details'}</DialogTitle>
            </DialogHeader>

            {selectedKYC && (
              <div className="space-y-4">
                {/* Business Info */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {isHindi ? 'व्यापार विवरण' : 'Business Details'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedKYC.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium capitalize">{selectedKYC.businessType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST:</span>
                      <span className="font-medium">{selectedKYC.gstNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PAN:</span>
                      <span className="font-medium">{selectedKYC.panNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {isHindi ? 'संपर्क' : 'Contact'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedKYC.contactNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedKYC.dealerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedKYC.businessAddress}, {selectedKYC.city}</span>
                    </div>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="bg-muted/50 rounded-xl p-4">
                  <h4 className="font-semibold text-foreground mb-2">
                    {isHindi ? 'बैंक विवरण' : 'Bank Details'}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-medium">{selectedKYC.bankDetails?.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">A/C:</span>
                      <span className="font-medium">****{selectedKYC.bankDetails?.accountNumber?.slice(-4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">IFSC:</span>
                      <span className="font-medium">{selectedKYC.bankDetails?.ifscCode}</span>
                    </div>
                  </div>
                </div>

                {selectedKYC.status === 'pending' && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsRejectDialogOpen(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {isHindi ? 'अस्वीकार' : 'Reject'}
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handleApprove(selectedKYC.id, selectedKYC.dealerId)}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      {isHindi ? 'स्वीकार' : 'Approve'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>{isHindi ? 'अस्वीकृति कारण' : 'Rejection Reason'}</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder={isHindi ? 'कारण लिखें...' : 'Enter reason...'}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-24"
            />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setIsRejectDialogOpen(false)}>
                {isHindi ? 'रद्द' : 'Cancel'}
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleReject} disabled={!rejectionReason}>
                {isHindi ? 'अस्वीकार करें' : 'Reject'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AdminKYC;
