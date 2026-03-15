import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users as UsersIcon, Shield, Store, Leaf, 
  Search, Filter, CheckCircle, XCircle, Clock, MoreVertical
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const roleConfig: Record<string, { icon: typeof Leaf; label: string; labelHi: string; color: string }> = {
  farmer: { icon: Leaf, label: 'Farmer', labelHi: 'किसान', color: 'bg-green-100 text-green-700' },
  dealer: { icon: Store, label: 'Dealer', labelHi: 'डीलर', color: 'bg-purple-100 text-purple-700' },
  admin: { icon: Shield, label: 'Admin', labelHi: 'एडमिन', color: 'bg-blue-100 text-blue-700' },
  service_provider: { icon: Leaf, label: 'Provider', labelHi: 'सेवा प्रदाता', color: 'bg-teal-100 text-teal-700' },
};

const statusConfig = {
  active: { label: 'Active', labelHi: 'सक्रिय', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  suspended: { label: 'Suspended', labelHi: 'निलंबित', color: 'bg-red-100 text-red-700', icon: XCircle },
  pending: { label: 'Pending', labelHi: 'लंबित', color: 'bg-amber-100 text-amber-700', icon: Clock },
};

const Users = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { platformUsers, updateUserStatus, updateUserRole } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState<'all' | 'farmer' | 'dealer' | 'admin' | 'service_provider'>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');

  const filteredUsers = platformUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = activeRoleFilter === 'all' || u.role === activeRoleFilter;
    const matchesStatus = activeStatusFilter === 'all' || u.status === activeStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = {
    total: platformUsers.length,
    farmers: platformUsers.filter(u => u.role === 'farmer').length,
    dealers: platformUsers.filter(u => u.role === 'dealer').length,
    pending: platformUsers.filter(u => u.status === 'pending').length,
  };

  const handleStatusChange = (userId: string, status: 'active' | 'suspended') => {
    updateUserStatus(userId, status);
    toast.success(isHindi ? 'स्थिति अपडेट की गई' : 'Status updated');
  };

  const handleApprove = (userId: string) => {
    updateUserStatus(userId, 'active');
    toast.success(isHindi ? 'उपयोगकर्ता स्वीकृत' : 'User approved');
  };

  const handlePromoteToDealer = (userId: string) => {
    updateUserRole(userId, 'dealer');
    toast.success(isHindi ? 'डीलर के रूप में प्रमोट किया' : 'Promoted to dealer');
  };

  return (
    <AppLayout hideNav>
      <div className="container px-4 py-4 pb-8">
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
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-primary" />
              {isHindi ? 'उपयोगकर्ता प्रबंधन' : 'User Management'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {stats.total} {isHindi ? 'कुल उपयोगकर्ता' : 'total users'}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-2 mb-6"
        >
          <div className="bg-card border border-border rounded-xl p-3 text-center shadow-soft">
            <p className="text-lg font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">{isHindi ? 'कुल' : 'Total'}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center shadow-soft">
            <p className="text-lg font-bold text-green-600">{stats.farmers}</p>
            <p className="text-xs text-muted-foreground">{isHindi ? 'किसान' : 'Farmers'}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center shadow-soft">
            <p className="text-lg font-bold text-purple-600">{stats.dealers}</p>
            <p className="text-xs text-muted-foreground">{isHindi ? 'डीलर' : 'Dealers'}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-3 text-center shadow-soft">
            <p className="text-lg font-bold text-amber-600">{stats.pending}</p>
            <p className="text-xs text-muted-foreground">{isHindi ? 'लंबित' : 'Pending'}</p>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'उपयोगकर्ता खोजें...' : 'Search users...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setActiveRoleFilter('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                activeRoleFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {isHindi ? 'सभी' : 'All'}
            </button>
            {Object.entries(roleConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveRoleFilter(key as typeof activeRoleFilter)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                  activeRoleFilter === key ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {isHindi ? config.labelHi : config.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <UsersIcon className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">
              {isHindi ? 'कोई उपयोगकर्ता नहीं मिला' : 'No users found'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((user, index) => {
              const role = roleConfig[user.role];
              const status = statusConfig[user.status];
              const RoleIcon = role.icon;
              const StatusIcon = status.icon;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                  className={cn(
                    'bg-card border border-border rounded-xl p-4 shadow-soft',
                    user.status === 'pending' && 'border-l-4 border-l-amber-500'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', role.color)}>
                      <RoleIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground text-sm truncate">{user.name}</h3>
                        <span className={cn('text-xs px-2 py-0.5 rounded-full', status.color)}>
                          {isHindi ? status.labelHi : status.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <span>{user.location}</span>
                        <span>•</span>
                        <span>Active: {user.lastActive}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {user.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              {isHindi ? 'स्वीकार करें' : 'Approve'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {user.role === 'farmer' && user.status === 'active' && (
                          <DropdownMenuItem onClick={() => handlePromoteToDealer(user.id)}>
                            <Store className="h-4 w-4 mr-2 text-purple-600" />
                            {isHindi ? 'डीलर बनाएं' : 'Promote to Dealer'}
                          </DropdownMenuItem>
                        )}
                        {user.status === 'active' ? (
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(user.id, 'suspended')}
                            className="text-red-600"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            {isHindi ? 'निलंबित करें' : 'Suspend'}
                          </DropdownMenuItem>
                        ) : user.status === 'suspended' && (
                          <DropdownMenuItem onClick={() => handleStatusChange(user.id, 'active')}>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            {isHindi ? 'सक्रिय करें' : 'Activate'}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {user.status === 'pending' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1 h-8 text-xs rounded-lg text-red-600 border-red-200"
                        onClick={() => handleStatusChange(user.id, 'suspended')}
                      >
                        <XCircle className="h-3 w-3 mr-1" /> {isHindi ? 'अस्वीकार' : 'Reject'}
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 h-8 text-xs rounded-lg gradient-kishu"
                        onClick={() => handleApprove(user.id)}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" /> {isHindi ? 'स्वीकार' : 'Approve'}
                      </Button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Users;
