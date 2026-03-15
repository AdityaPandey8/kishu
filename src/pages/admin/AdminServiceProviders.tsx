import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Wrench, CheckCircle, XCircle, Clock, Search } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const AdminServiceProviders = () => {
  const navigate = useNavigate();
  const { platformUsers, updateUserStatus } = useData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');

  const providers = platformUsers.filter(u => u.role === 'service_provider');
  const filtered = providers.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleApprove = (id: string) => { updateUserStatus(id, 'active'); toast.success('Provider approved'); };
  const handleReject = (id: string) => { updateUserStatus(id, 'suspended'); toast.success('Provider rejected'); };

  const statusConfig: Record<string, { color: string; icon: typeof CheckCircle }> = {
    active: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30', icon: CheckCircle },
    pending: { color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30', icon: Clock },
    suspended: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30', icon: XCircle },
  };

  return (
    <AppLayout hideNav>
      <motion.div className="container px-4 py-6 space-y-4 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2"><Wrench className="h-5 w-5 text-teal-600" /> Service Providers</h1>
            <p className="text-xs text-muted-foreground">{providers.length} providers</p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search providers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'pending', 'active', 'suspended'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap', filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              {f === 'all' ? `All (${providers.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${providers.filter(p => p.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No providers found</p>}
          {filtered.map((p, i) => {
            const sc = statusConfig[p.status] || statusConfig.pending;
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className={cn('bg-card border border-border rounded-2xl p-4 shadow-sm cursor-pointer', p.status === 'pending' && 'border-l-4 border-l-amber-500')}
                onClick={() => navigate(`/admin/users/${p.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm text-foreground">{p.name}</p>
                    <p className="text-[10px] text-muted-foreground">{p.email}</p>
                    <p className="text-[10px] text-muted-foreground">{p.location} • Joined: {p.createdAt}</p>
                  </div>
                  <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full capitalize', sc.color)}>{p.status}</span>
                </div>
                {p.status === 'pending' && (
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border" onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="outline" className="flex-1 h-8 text-xs rounded-lg text-red-600 border-red-200" onClick={() => handleReject(p.id)}>
                      <XCircle className="h-3 w-3 mr-1" /> Reject
                    </Button>
                    <Button size="sm" className="flex-1 h-8 text-xs rounded-lg bg-teal-600 text-white" onClick={() => handleApprove(p.id)}>
                      <CheckCircle className="h-3 w-3 mr-1" /> Approve
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default AdminServiceProviders;
