import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Clock, Loader2, CheckCircle2, Phone, MessageSquare,
  MapPin, Sprout, AlertTriangle, User as UserIcon
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useData, Inquiry } from '@/contexts/DataContext';
import { toast } from 'sonner';

interface KanbanColumn {
  id: 'pending' | 'responded' | 'resolved';
  title: string;
  icon: React.ElementType;
  colorClass: string;
  badgeClass: string;
}

const OrderManagement = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { inquiries, updateInquiryStatus } = useData();
  const isHindi = i18n.language === 'hi';
  const [activeTab, setActiveTab] = useState<'pending' | 'responded' | 'resolved'>('pending');

  const dealerInquiries = inquiries.filter(i => i.dealerId === user?.id);

  const columns: KanbanColumn[] = [
    { id: 'pending', title: isHindi ? 'लंबित' : 'Pending', icon: Clock, colorClass: 'border-amber-500/30 bg-amber-500/5', badgeClass: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    { id: 'responded', title: isHindi ? 'प्रगति में' : 'In Progress', icon: Loader2, colorClass: 'border-primary/30 bg-primary/5', badgeClass: 'bg-primary/10 text-primary border-primary/20' },
    { id: 'resolved', title: isHindi ? 'हल किया' : 'Resolved', icon: CheckCircle2, colorClass: 'border-green-500/30 bg-green-500/5', badgeClass: 'bg-green-500/10 text-green-600 border-green-500/20' },
  ];

  const getColumnInquiries = (status: 'pending' | 'responded' | 'resolved') =>
    dealerInquiries.filter(i => i.status === status);

  const handleMoveToProgress = (id: string) => {
    updateInquiryStatus(id, 'responded', isHindi ? 'जवाब दिया गया' : 'Responded');
    toast.success(isHindi ? 'प्रगति में ले जाया गया' : 'Moved to In Progress');
  };

  const handleResolve = (id: string) => {
    updateInquiryStatus(id, 'resolved');
    toast.success(isHindi ? 'हल किया गया' : 'Marked as Resolved');
  };

  const handleCall = () => {
    toast.success(isHindi ? 'कॉल शुरू हो रहा है...' : 'Initiating call...');
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return isHindi ? 'अभी' : 'Just now';
    if (hours < 24) return `${hours}${isHindi ? ' घंटे पहले' : 'h ago'}`;
    const days = Math.floor(hours / 24);
    return `${days}${isHindi ? ' दिन पहले' : 'd ago'}`;
  };

  const InquiryCard = ({ inquiry, status }: { inquiry: Inquiry; status: string }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-card border border-border rounded-xl p-3.5 space-y-3"
    >
      {/* Buyer Details */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{inquiry.farmerName}</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {inquiry.location}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {inquiry.urgent && (
            <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">
              <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
              {isHindi ? 'अत्यावश्यक' : 'Urgent'}
            </Badge>
          )}
          <span className="text-[10px] text-muted-foreground">{timeAgo(inquiry.createdAt)}</span>
        </div>
      </div>

      {/* Issue Details */}
      <div className="bg-muted/50 rounded-lg p-2.5 space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Sprout className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium text-foreground">{inquiry.crop}</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{inquiry.issue}</p>
      </div>

      {/* Response if exists */}
      {inquiry.response && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg p-2.5">
          <p className="text-[10px] font-medium text-primary mb-0.5">{isHindi ? 'आपका जवाब' : 'Your Response'}</p>
          <p className="text-xs text-muted-foreground">{inquiry.response}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        {status === 'pending' && (
          <Button size="sm" className="flex-1 h-8 text-xs rounded-lg" onClick={() => handleMoveToProgress(inquiry.id)}>
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            {isHindi ? 'जवाब दें' : 'Respond'}
          </Button>
        )}
        {status === 'responded' && (
          <Button size="sm" className="flex-1 h-8 text-xs rounded-lg bg-green-600 hover:bg-green-700" onClick={() => handleResolve(inquiry.id)}>
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
            {isHindi ? 'हल करें' : 'Resolve'}
          </Button>
        )}
        <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-lg" onClick={handleCall}>
          <Phone className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-24 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">
              {isHindi ? 'ऑर्डर प्रबंधन' : 'Order Management'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {dealerInquiries.length} {isHindi ? 'कुल पूछताछ' : 'total inquiries'}
            </p>
          </div>
        </div>

        {/* Tab Switcher (mobile-friendly Kanban) */}
        <div className="flex bg-muted rounded-xl p-1 gap-1">
          {columns.map(col => {
            const count = getColumnInquiries(col.id).length;
            const Icon = col.icon;
            return (
              <button
                key={col.id}
                onClick={() => setActiveTab(col.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  activeTab === col.id
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {col.title}
                <Badge variant="secondary" className={`text-[9px] px-1.5 py-0 h-4 ${activeTab === col.id ? col.badgeClass : ''}`}>
                  {count}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Cards for active tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {getColumnInquiries(activeTab).length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">
                  {isHindi ? 'कोई पूछताछ नहीं' : 'No inquiries here'}
                </p>
                <p className="text-xs mt-1">
                  {isHindi ? 'यह कॉलम खाली है' : 'This column is empty'}
                </p>
              </div>
            ) : (
              getColumnInquiries(activeTab).map(inquiry => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} status={activeTab} />
              ))
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default OrderManagement;
