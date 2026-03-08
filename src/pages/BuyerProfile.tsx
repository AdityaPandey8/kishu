import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Phone, MessageSquare, MapPin, Wheat, User,
  Package, IndianRupee, Clock, CheckCircle2, AlertTriangle,
  Sprout, ShoppingBag, Loader2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const BuyerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { customers, inquiries, orders, platformUsers } = useData();
  const isHindi = i18n.language === 'hi';

  // Find buyer data from customers or platformUsers
  const customer = customers.find(c => c.farmerId === id && c.dealerId === user?.id);
  const platformUser = platformUsers.find(u => u.id === id);
  const buyerName = customer?.farmerName || platformUser?.name || (isHindi ? 'अज्ञात' : 'Unknown');
  const buyerLocation = customer?.location || platformUser?.location || '';
  const buyerPhone = customer?.phone || '';
  const buyerCrops = customer?.crops || [];

  // Filter data for this buyer
  const buyerInquiries = inquiries.filter(i => i.farmerId === id && i.dealerId === user?.id);
  const buyerOrders = orders.filter(o => o.farmerId === id && o.dealerId === user?.id);
  const totalSpent = buyerOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    { value: buyerOrders.length.toString(), label: isHindi ? 'ऑर्डर' : 'Orders', color: 'text-primary', icon: Package },
    { value: `₹${totalSpent > 0 ? (totalSpent / 1000).toFixed(1) + 'K' : '0'}`, label: isHindi ? 'खर्च' : 'Spent', color: 'text-green-600', icon: IndianRupee },
    { value: buyerInquiries.length.toString(), label: isHindi ? 'पूछताछ' : 'Inquiries', color: 'text-amber-600', icon: MessageSquare },
  ];

  // Combined timeline
  const timeline = [
    ...buyerInquiries.map(i => ({
      id: i.id,
      type: 'inquiry' as const,
      title: i.crop,
      subtitle: i.issue,
      status: i.status,
      date: i.createdAt,
      urgent: i.urgent,
    })),
    ...buyerOrders.map(o => ({
      id: o.id,
      type: 'order' as const,
      title: `${isHindi ? 'ऑर्डर' : 'Order'} #${o.id.slice(-4)}`,
      subtitle: o.items.map(i => i.productName).join(', '),
      status: o.status,
      date: o.createdAt,
      urgent: false,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { class: string; label: string }> = {
      pending: { class: 'bg-amber-500/10 text-amber-600 border-amber-500/20', label: isHindi ? 'लंबित' : 'Pending' },
      responded: { class: 'bg-primary/10 text-primary border-primary/20', label: isHindi ? 'जवाब दिया' : 'Responded' },
      resolved: { class: 'bg-green-500/10 text-green-600 border-green-500/20', label: isHindi ? 'हल किया' : 'Resolved' },
      confirmed: { class: 'bg-primary/10 text-primary border-primary/20', label: isHindi ? 'पुष्टि' : 'Confirmed' },
      shipped: { class: 'bg-blue-500/10 text-blue-600 border-blue-500/20', label: isHindi ? 'भेजा गया' : 'Shipped' },
      delivered: { class: 'bg-green-500/10 text-green-600 border-green-500/20', label: isHindi ? 'डिलीवर' : 'Delivered' },
      cancelled: { class: 'bg-destructive/10 text-destructive border-destructive/20', label: isHindi ? 'रद्द' : 'Cancelled' },
    };
    const s = map[status] || map.pending;
    return <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-5', s.class)}>{s.label}</Badge>;
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-24 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4.5 w-4.5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground">{isHindi ? 'खरीदार प्रोफ़ाइल' : 'Buyer Profile'}</h1>
          </div>
        </div>

        {/* Buyer Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-soft relative overflow-hidden"
        >
          <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-primary/5" />

          <div className="relative flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-foreground truncate">{buyerName}</h2>
              {buyerLocation && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {buyerLocation}
                </div>
              )}
              {buyerCrops.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Wheat className="h-3 w-3" />
                  {buyerCrops.join(', ')}
                </div>
              )}
              {customer?.status && (
                <Badge variant="outline" className={cn('mt-2 text-[10px]', customer.status === 'vip' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20')}>
                  {customer.status.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mt-4">
            <Button size="sm" className="flex-1 h-9 rounded-xl text-xs" onClick={() => toast.success(isHindi ? 'कॉल शुरू...' : 'Calling...')}>
              <Phone className="h-3.5 w-3.5 mr-1.5" />
              {isHindi ? 'कॉल करें' : 'Call'}
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-9 rounded-xl text-xs" onClick={() => toast.success(isHindi ? 'मैसेज भेजें...' : 'Opening chat...')}>
              <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
              {isHindi ? 'मैसेज' : 'Message'}
            </Button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-2"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-card border border-border rounded-xl p-3 text-center shadow-soft">
                <Icon className={cn('h-4 w-4 mx-auto mb-1', stat.color)} />
                <p className={cn('text-lg font-bold', stat.color)}>{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="w-full bg-muted rounded-xl p-1 h-auto">
              <TabsTrigger value="timeline" className="flex-1 text-xs rounded-lg py-2">
                {isHindi ? 'टाइमलाइन' : 'Timeline'}
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex-1 text-xs rounded-lg py-2">
                {isHindi ? 'ऑर्डर' : 'Orders'}
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="flex-1 text-xs rounded-lg py-2">
                {isHindi ? 'पूछताछ' : 'Inquiries'}
              </TabsTrigger>
            </TabsList>

            {/* Timeline */}
            <TabsContent value="timeline" className="mt-3 space-y-0">
              {timeline.length === 0 ? (
                <EmptyState text={isHindi ? 'कोई गतिविधि नहीं' : 'No activity yet'} />
              ) : (
                <div className="relative pl-6">
                  <div className="absolute left-2.5 top-2 bottom-2 w-px bg-border" />
                  {timeline.map((item, i) => (
                    <div key={item.id} className="relative pb-4 last:pb-0">
                      <div className={cn(
                        'absolute left-[-18px] top-1.5 h-5 w-5 rounded-full flex items-center justify-center border-2 border-card',
                        item.type === 'order' ? 'bg-primary' : 'bg-amber-500'
                      )}>
                        {item.type === 'order' ? <ShoppingBag className="h-2.5 w-2.5 text-primary-foreground" /> : <Sprout className="h-2.5 w-2.5 text-white" />}
                      </div>
                      <div className="bg-card border border-border rounded-xl p-3 ml-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-foreground">{item.title}</span>
                          {statusBadge(item.status)}
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">{item.subtitle}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground">{formatDate(item.date)}</span>
                          {item.urgent && (
                            <Badge variant="destructive" className="text-[8px] px-1 py-0 h-3.5 ml-1">
                              <AlertTriangle className="h-2 w-2 mr-0.5" />
                              Urgent
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders" className="mt-3 space-y-3">
              {buyerOrders.length === 0 ? (
                <EmptyState text={isHindi ? 'कोई ऑर्डर नहीं' : 'No orders yet'} />
              ) : (
                buyerOrders.map(order => (
                  <div key={order.id} className="bg-card border border-border rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">#{order.id.slice(-6).toUpperCase()}</span>
                      {statusBadge(order.status)}
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-muted-foreground">
                          <span>{item.productName} × {item.quantity}</span>
                          <span className="font-medium text-foreground">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-border">
                      <span className="text-[10px] text-muted-foreground">{formatDate(order.createdAt)}</span>
                      <span className="text-xs font-bold text-foreground">₹{order.totalAmount}</span>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            {/* Inquiries */}
            <TabsContent value="inquiries" className="mt-3 space-y-3">
              {buyerInquiries.length === 0 ? (
                <EmptyState text={isHindi ? 'कोई पूछताछ नहीं' : 'No inquiries yet'} />
              ) : (
                buyerInquiries.map(inq => (
                  <div key={inq.id} className="bg-card border border-border rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sprout className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs font-semibold text-foreground">{inq.crop}</span>
                      </div>
                      {statusBadge(inq.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">{inq.issue}</p>
                    {inq.response && (
                      <div className="bg-primary/5 border border-primary/10 rounded-lg p-2">
                        <p className="text-[10px] font-medium text-primary mb-0.5">{isHindi ? 'जवाब' : 'Response'}</p>
                        <p className="text-xs text-muted-foreground">{inq.response}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{formatDate(inq.createdAt)}</span>
                      {inq.urgent && (
                        <Badge variant="destructive" className="text-[8px] px-1 py-0 h-3.5 ml-1">Urgent</Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </AppLayout>
  );
};

const EmptyState = ({ text }: { text: string }) => (
  <div className="text-center py-10 text-muted-foreground">
    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-30" />
    <p className="text-sm">{text}</p>
  </div>
);

export default BuyerProfile;
