import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '@/components/layout/AppLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, MessageSquare, Package, Truck, HelpCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';

const typeConfig: Record<string, { icon: any; color: string }> = {
  stock: { icon: Package, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' },
  delivery: { icon: Truck, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' },
  general: { icon: HelpCircle, color: 'bg-muted text-muted-foreground' },
};

const AdminInquiries = () => {
  const { i18n } = useTranslation();
  const { inquiries } = useData();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = inquiries
    .filter(inq => typeFilter === 'all' || inq.type === typeFilter)
    .filter(inq => statusFilter === 'all' || inq.status === statusFilter)
    .filter(inq => !search || inq.subject.toLowerCase().includes(search.toLowerCase()) || inq.farmerName.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <motion.div className="container px-4 py-6 space-y-4 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold text-foreground">{isHindi ? 'सभी पूछताछ' : 'All Inquiries'}</h1>
          <span className="ml-auto text-sm text-muted-foreground">{filtered.length}</span>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'stock', 'delivery', 'general'].map(f => (
            <Button key={f} variant={typeFilter === f ? 'default' : 'outline'} size="sm" className="rounded-full capitalize text-xs flex-shrink-0" onClick={() => setTypeFilter(f)}>
              {f}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['all', 'pending', 'responded', 'resolved'].map(f => (
            <Button key={f} variant={statusFilter === f ? 'default' : 'outline'} size="sm" className="rounded-full capitalize text-xs flex-shrink-0" onClick={() => setStatusFilter(f)}>
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No inquiries found</p>
            </div>
          )}
          {filtered.map((inq, i) => {
            const tc = typeConfig[inq.type] || typeConfig.general;
            const TypeIcon = tc.icon;
            const statusColor = inq.status === 'pending' ? 'text-amber-600' : inq.status === 'responded' ? 'text-blue-600' : 'text-green-600';
            return (
              <motion.div
                key={inq.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', tc.color)}>
                      <TypeIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{inq.subject}</p>
                      <p className="text-[10px] text-muted-foreground">{inq.farmerName} • {inq.location}</p>
                    </div>
                  </div>
                  <span className={cn('text-[10px] font-medium capitalize', statusColor)}>{inq.status}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{inq.message}</p>
                {inq.productName && <p className="text-[10px] text-muted-foreground">Product: {inq.productName}</p>}
                {inq.orderId && <p className="text-[10px] text-muted-foreground">Order: {inq.orderId}</p>}
                {inq.response && (
                  <div className="bg-muted/50 rounded-lg p-2 mt-1">
                    <p className="text-[10px] text-muted-foreground font-medium">Response:</p>
                    <p className="text-xs text-foreground">{inq.response}</p>
                  </div>
                )}
                <p className="text-[10px] text-muted-foreground">{inq.createdAt}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default AdminInquiries;
