import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MessageSquare, Phone, MapPin, Clock, 
  CheckCircle, Filter, Users, Package, Truck, HelpCircle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

const statusConfig = {
  pending: { label: 'Pending', labelHi: 'लंबित', color: 'bg-amber-100 text-amber-700', icon: Clock },
  responded: { label: 'Responded', labelHi: 'उत्तर दिया', color: 'bg-blue-100 text-blue-700', icon: MessageSquare },
  resolved: { label: 'Resolved', labelHi: 'हल किया', color: 'bg-green-100 text-green-700', icon: CheckCircle },
};

const typeConfig = {
  stock: { label: 'Stock', icon: Package, color: 'bg-blue-100 text-blue-700' },
  delivery: { label: 'Delivery', icon: Truck, color: 'bg-orange-100 text-orange-700' },
  general: { label: 'General', icon: HelpCircle, color: 'bg-purple-100 text-purple-700' },
};

const Inquiries = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { inquiries, updateInquiryStatus } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'stock' | 'delivery' | 'general'>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'pending' | 'responded' | 'resolved'>('all');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const dealerInquiries = inquiries.filter(i => i.dealerId === user?.id);
  
  const filteredInquiries = dealerInquiries.filter(i => {
    if (activeTypeFilter !== 'all' && i.type !== activeTypeFilter) return false;
    if (activeStatusFilter !== 'all' && i.status !== activeStatusFilter) return false;
    return true;
  });

  const pendingCount = dealerInquiries.filter(i => i.status === 'pending').length;

  const handleRespond = () => {
    if (!responseText.trim()) {
      toast.error(isHindi ? 'कृपया उत्तर दर्ज करें' : 'Please enter a response');
      return;
    }
    updateInquiryStatus(respondingTo!, 'responded', responseText);
    toast.success(isHindi ? 'उत्तर भेजा गया' : 'Response sent');
    setRespondingTo(null);
    setResponseText('');
  };

  const handleResolve = (id: string) => {
    updateInquiryStatus(id, 'resolved');
    toast.success(isHindi ? 'पूछताछ हल की गई' : 'Inquiry resolved');
  };

  const typeFilters = [
    { id: 'all', label: isHindi ? 'सभी' : 'All' },
    { id: 'stock', label: isHindi ? 'स्टॉक' : 'Stock' },
    { id: 'delivery', label: isHindi ? 'डिलीवरी' : 'Delivery' },
    { id: 'general', label: isHindi ? 'सामान्य' : 'General' },
  ];

  const statusFilters = [
    { id: 'all', label: isHindi ? 'सभी' : 'All' },
    { id: 'pending', label: isHindi ? 'लंबित' : 'Pending' },
    { id: 'responded', label: isHindi ? 'उत्तर दिया' : 'Responded' },
    { id: 'resolved', label: isHindi ? 'हल किया' : 'Resolved' },
  ];

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {isHindi ? 'पूछताछ' : 'Inquiries'}
              </h1>
              {pendingCount > 0 && (
                <p className="text-xs text-amber-600">
                  {pendingCount} {isHindi ? 'लंबित' : 'pending'}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Type Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-3 overflow-x-auto pb-2 -mx-4 px-4"
        >
          {typeFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveTypeFilter(filter.id as typeof activeTypeFilter)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activeTypeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Status Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4"
        >
          {statusFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveStatusFilter(filter.id as typeof activeStatusFilter)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border',
                activeStatusFilter === filter.id
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-border text-muted-foreground hover:bg-muted/80'
              )}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <MessageSquare className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">
              {isHindi ? 'कोई पूछताछ नहीं' : 'No inquiries found'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredInquiries.map((inquiry, index) => {
              const status = statusConfig[inquiry.status];
              const type = typeConfig[inquiry.type];
              const StatusIcon = status.icon;
              const TypeIcon = type.icon;

              return (
                <motion.div
                  key={inquiry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-soft"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{inquiry.farmerName}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {inquiry.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-4', type.color)}>
                        <TypeIcon className="h-2.5 w-2.5 mr-0.5" />
                        {type.label}
                      </Badge>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1', status.color)}>
                        <StatusIcon className="h-3 w-3" />
                        {isHindi ? status.labelHi : status.label}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground">{inquiry.subject}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.message}</p>
                    {inquiry.productName && (
                      <p className="text-xs text-primary mt-1 flex items-center gap-1">
                        <Package className="h-3 w-3" /> {inquiry.productName}
                      </p>
                    )}
                    {inquiry.orderId && (
                      <p className="text-xs text-primary mt-1 flex items-center gap-1">
                        <Truck className="h-3 w-3" /> Order #{inquiry.orderId}
                      </p>
                    )}
                  </div>

                  {inquiry.response && (
                    <div className="bg-muted/50 rounded-lg p-2 mb-3">
                      <p className="text-xs text-muted-foreground">{isHindi ? 'आपका उत्तर:' : 'Your response:'}</p>
                      <p className="text-sm text-foreground">{inquiry.response}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg">
                        <Phone className="h-3 w-3 mr-1" /> Call
                      </Button>
                      {inquiry.status === 'pending' && (
                        <Button 
                          size="sm" 
                          className="h-8 text-xs rounded-lg gradient-kishu"
                          onClick={() => setRespondingTo(inquiry.id)}
                        >
                          Respond
                        </Button>
                      )}
                      {inquiry.status === 'responded' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 text-xs rounded-lg text-green-600 border-green-200"
                          onClick={() => handleResolve(inquiry.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Response Dialog */}
        <Dialog open={!!respondingTo} onOpenChange={() => {
          setRespondingTo(null);
          setResponseText('');
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isHindi ? 'पूछताछ का उत्तर दें' : 'Respond to Inquiry'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Textarea
                placeholder={isHindi ? 'अपना उत्तर लिखें...' : 'Write your response...'}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-[120px] rounded-xl"
              />
              <Button 
                className="w-full rounded-xl gradient-kishu shadow-kishu"
                onClick={handleRespond}
              >
                {isHindi ? 'उत्तर भेजें' : 'Send Response'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Inquiries;
