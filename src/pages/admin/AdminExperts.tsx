import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Award, CheckCircle2, XCircle, Clock, 
  User, MapPin, Calendar, ChevronRight, Search
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

const AdminExperts = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { expertApplications, approveExpert, rejectExpert } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  if (user?.role !== 'admin') {
    return (
      <AppLayout>
        <div className="container px-4 py-8 text-center">
          <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">Admin access required</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </AppLayout>
    );
  }

  const filteredApplications = expertApplications.filter(app => {
    const matchesTab = app.status === activeTab;
    const matchesSearch = app.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.userEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApprove = (applicationId: string) => {
    approveExpert(applicationId, user.id);
    toast.success(isHindi ? 'एक्सपर्ट स्वीकृत' : 'Expert approved');
    setSelectedApplication(null);
  };

  const handleReject = () => {
    if (selectedApplication) {
      rejectExpert(selectedApplication.id, user.id, rejectionReason);
      toast.success(isHindi ? 'आवेदन अस्वीकृत' : 'Application rejected');
      setSelectedApplication(null);
      setIsRejectDialogOpen(false);
      setRejectionReason('');
    }
  };

  const stats = {
    pending: expertApplications.filter(a => a.status === 'pending').length,
    approved: expertApplications.filter(a => a.status === 'approved').length,
    rejected: expertApplications.filter(a => a.status === 'rejected').length,
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
              {isHindi ? 'एक्सपर्ट प्रबंधन' : 'Expert Management'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isHindi ? 'आवेदन समीक्षा करें' : 'Review applications'}
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

        {/* Applications List */}
        <div className="space-y-3">
          {filteredApplications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-card border border-border rounded-xl p-4 shadow-soft"
              onClick={() => setSelectedApplication(app)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{app.userName}</p>
                    <p className="text-xs text-muted-foreground">{app.userEmail}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="mt-3 flex flex-wrap gap-1">
                {app.specialization.slice(0, 3).map((spec: string) => (
                  <span key={spec} className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                    {spec}
                  </span>
                ))}
                {app.specialization.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{app.specialization.length - 3}</span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(app.appliedAt).toLocaleDateString()}
                </span>
                <span>{app.experience}</span>
              </div>
            </motion.div>
          ))}

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                {isHindi ? 'कोई आवेदन नहीं' : 'No applications found'}
              </p>
            </div>
          )}
        </div>

        {/* Application Detail Dialog */}
        <Dialog open={!!selectedApplication && !isRejectDialogOpen} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>{isHindi ? 'आवेदन विवरण' : 'Application Details'}</DialogTitle>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{selectedApplication.userName}</p>
                    <p className="text-sm text-muted-foreground">{selectedApplication.userEmail}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-1">{isHindi ? 'विशेषज्ञता' : 'Specializations'}</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedApplication.specialization.map((spec: string) => (
                      <span key={spec} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-foreground mb-1">{isHindi ? 'अनुभव' : 'Experience'}</p>
                  <p className="text-sm text-muted-foreground">{selectedApplication.experience}</p>
                </div>

                {selectedApplication.certifications && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">{isHindi ? 'प्रमाणपत्र' : 'Certifications'}</p>
                    <p className="text-sm text-muted-foreground">{selectedApplication.certifications}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-foreground mb-1">{isHindi ? 'परिचय' : 'Bio'}</p>
                  <p className="text-sm text-muted-foreground">{selectedApplication.bio}</p>
                </div>

                {selectedApplication.status === 'pending' && (
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
                      onClick={() => handleApprove(selectedApplication.id)}
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
              <Button variant="destructive" className="flex-1" onClick={handleReject}>
                {isHindi ? 'अस्वीकार करें' : 'Reject'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AdminExperts;
