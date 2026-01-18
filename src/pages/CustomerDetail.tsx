import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Star, Phone, Mail, MapPin, MessageSquare, Calendar,
  Plus, Edit2, Trash2, Clock, CheckCircle, AlertCircle, FileText,
  Package, Bell
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { formatDistanceToNow, format } from 'date-fns';

const noteTypeIcons = {
  general: FileText,
  followup: Bell,
  issue: AlertCircle,
  purchase: Package,
};

const noteTypeColors = {
  general: 'bg-gray-100 text-gray-600',
  followup: 'bg-blue-100 text-blue-600',
  issue: 'bg-red-100 text-red-600',
  purchase: 'bg-green-100 text-green-600',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    customers, toggleFavoriteCustomer, updateCustomer,
    customerNotes, addCustomerNote, deleteCustomerNote, getNotesForCustomer,
    followUpReminders, addFollowUpReminder, completeFollowUp, deleteFollowUp,
    inquiries
  } = useData();
  const isHindi = i18n.language === 'hi';

  const customer = customers.find(c => c.id === id);
  const notes = getNotesForCustomer(id || '');
  const reminders = followUpReminders.filter(r => r.customerId === id);
  const customerInquiries = inquiries.filter(i => i.farmerId === customer?.farmerId);

  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'reminders' | 'history'>('overview');
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);

  const [newNote, setNewNote] = useState({ content: '', type: 'general' as const });
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
  });

  if (!customer) {
    return (
      <AppLayout>
        <div className="container px-4 py-8 text-center">
          <p className="text-muted-foreground">{isHindi ? 'ग्राहक नहीं मिला' : 'Customer not found'}</p>
          <Button onClick={() => navigate('/customers')} className="mt-4">
            {isHindi ? 'वापस जाएं' : 'Go Back'}
          </Button>
        </div>
      </AppLayout>
    );
  }

  const handleAddNote = () => {
    if (!newNote.content.trim()) {
      toast.error(isHindi ? 'कृपया नोट दर्ज करें' : 'Please enter a note');
      return;
    }
    addCustomerNote({
      customerId: customer.id,
      dealerId: user?.id || '',
      content: newNote.content,
      type: newNote.type,
    });
    toast.success(isHindi ? 'नोट जोड़ा गया' : 'Note added');
    setIsAddNoteOpen(false);
    setNewNote({ content: '', type: 'general' });
  };

  const handleAddReminder = () => {
    if (!newReminder.title.trim() || !newReminder.dueDate) {
      toast.error(isHindi ? 'कृपया शीर्षक और तारीख दर्ज करें' : 'Please enter title and date');
      return;
    }
    addFollowUpReminder({
      customerId: customer.id,
      dealerId: user?.id || '',
      customerName: customer.farmerName,
      title: newReminder.title,
      description: newReminder.description,
      dueDate: newReminder.dueDate,
      priority: newReminder.priority,
    });
    toast.success(isHindi ? 'रिमाइंडर जोड़ा गया' : 'Reminder added');
    setIsAddReminderOpen(false);
    setNewReminder({ title: '', description: '', dueDate: '', priority: 'medium' });
  };

  const tabs = [
    { id: 'overview', label: isHindi ? 'सारांश' : 'Overview' },
    { id: 'notes', label: isHindi ? 'नोट्स' : 'Notes', count: notes.length },
    { id: 'reminders', label: isHindi ? 'रिमाइंडर' : 'Reminders', count: reminders.filter(r => !r.completed).length },
    { id: 'history', label: isHindi ? 'इतिहास' : 'History', count: customerInquiries.length },
  ];

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
            onClick={() => navigate('/customers')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            {isHindi ? 'ग्राहक विवरण' : 'Customer Details'}
          </h1>
        </motion.div>

        {/* Customer Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border border-primary/20 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {customer.farmerName.charAt(0)}
              </div>
              <span className={cn(
                'absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium uppercase',
                customer.status === 'vip' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
              )}>
                {customer.status}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{customer.farmerName}</h2>
                <button onClick={() => toggleFavoriteCustomer(customer.id)}>
                  <Star className={cn(
                    'h-5 w-5',
                    customer.isFavorite ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                  )} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" /> {customer.location}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <a href={`tel:${customer.phone}`} className="flex items-center gap-1 text-xs text-primary">
                  <Phone className="h-3 w-3" /> {customer.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/50">
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{customer.totalInquiries}</p>
              <p className="text-xs text-muted-foreground">{isHindi ? 'पूछताछ' : 'Inquiries'}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{customer.totalPurchases}</p>
              <p className="text-xs text-muted-foreground">{isHindi ? 'खरीद' : 'Purchases'}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-foreground">{customer.crops.length}</p>
              <p className="text-xs text-muted-foreground">{isHindi ? 'फसलें' : 'Crops'}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Button
              size="sm"
              className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
              onClick={() => window.location.href = `tel:${customer.phone}`}
            >
              <Phone className="h-4 w-4 mr-1" /> {isHindi ? 'कॉल करें' : 'Call'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => navigate('/quotes/new')}
            >
              <MessageSquare className="h-4 w-4 mr-1" /> {isHindi ? 'कोट भेजें' : 'Send Quote'}
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={cn(
                  'px-1.5 py-0.5 rounded-full text-[10px]',
                  activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-foreground/10'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Contact Info */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
              <h3 className="font-medium text-foreground mb-3">{isHindi ? 'संपर्क जानकारी' : 'Contact Info'}</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" /> {customer.phone}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" /> {customer.email || 'Not provided'}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {customer.location}
                </p>
              </div>
            </div>

            {/* Crops */}
            {customer.crops.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
                <h3 className="font-medium text-foreground mb-3">{isHindi ? 'फसलें' : 'Crops'}</h3>
                <div className="flex flex-wrap gap-2">
                  {customer.crops.map((crop, idx) => (
                    <span key={idx} className="px-3 py-1 bg-muted rounded-full text-sm text-foreground">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
              <h3 className="font-medium text-foreground mb-3">{isHindi ? 'समयरेखा' : 'Timeline'}</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center justify-between text-muted-foreground">
                  <span>{isHindi ? 'पहला संपर्क' : 'First Contact'}</span>
                  <span className="font-medium text-foreground">{format(new Date(customer.firstContact), 'MMM d, yyyy')}</span>
                </p>
                <p className="flex items-center justify-between text-muted-foreground">
                  <span>{isHindi ? 'अंतिम संपर्क' : 'Last Contact'}</span>
                  <span className="font-medium text-foreground">{format(new Date(customer.lastContact), 'MMM d, yyyy')}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notes' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Button
              variant="outline"
              className="w-full rounded-xl border-dashed"
              onClick={() => setIsAddNoteOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> {isHindi ? 'नोट जोड़ें' : 'Add Note'}
            </Button>

            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-40" />
                <p>{isHindi ? 'कोई नोट नहीं' : 'No notes yet'}</p>
              </div>
            ) : (
              notes.map((note) => {
                const Icon = noteTypeIcons[note.type];
                return (
                  <div key={note.id} className="bg-card border border-border rounded-xl p-4 shadow-soft">
                    <div className="flex items-start justify-between mb-2">
                      <div className={cn('px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1', noteTypeColors[note.type])}>
                        <Icon className="h-3 w-3" />
                        {note.type}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive"
                        onClick={() => deleteCustomerNote(note.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                );
              })
            )}
          </motion.div>
        )}

        {activeTab === 'reminders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <Button
              variant="outline"
              className="w-full rounded-xl border-dashed"
              onClick={() => setIsAddReminderOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> {isHindi ? 'रिमाइंडर जोड़ें' : 'Add Reminder'}
            </Button>

            {reminders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-40" />
                <p>{isHindi ? 'कोई रिमाइंडर नहीं' : 'No reminders'}</p>
              </div>
            ) : (
              reminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={cn(
                    'bg-card border border-border rounded-xl p-4 shadow-soft',
                    reminder.completed && 'opacity-60'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium uppercase', priorityColors[reminder.priority])}>
                        {reminder.priority}
                      </span>
                      {reminder.completed && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Done
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {!reminder.completed && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-green-600"
                          onClick={() => completeFollowUp(reminder.id)}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive"
                        onClick={() => deleteFollowUp(reminder.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <h4 className={cn('font-medium text-foreground', reminder.completed && 'line-through')}>
                    {reminder.title}
                  </h4>
                  {reminder.description && (
                    <p className="text-sm text-muted-foreground mt-1">{reminder.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Due: {format(new Date(reminder.dueDate), 'MMM d, yyyy')}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {customerInquiries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-2 opacity-40" />
                <p>{isHindi ? 'कोई इतिहास नहीं' : 'No history'}</p>
              </div>
            ) : (
              customerInquiries.map((inquiry) => (
                <div key={inquiry.id} className="bg-card border border-border rounded-xl p-4 shadow-soft">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-[10px] font-medium uppercase',
                      inquiry.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      inquiry.status === 'responded' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    )}>
                      {inquiry.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground text-sm">{inquiry.crop}</h4>
                  <p className="text-sm text-muted-foreground">{inquiry.issue}</p>
                </div>
              ))
            )}
          </motion.div>
        )}

        {/* Add Note Dialog */}
        <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isHindi ? 'नोट जोड़ें' : 'Add Note'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Select 
                value={newNote.type} 
                onValueChange={(value: typeof newNote.type) => setNewNote(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder={isHindi ? 'नोट लिखें...' : 'Write your note...'}
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[100px] rounded-xl"
              />
              <Button className="w-full rounded-xl gradient-kishu" onClick={handleAddNote}>
                {isHindi ? 'नोट जोड़ें' : 'Add Note'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Reminder Dialog */}
        <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{isHindi ? 'रिमाइंडर जोड़ें' : 'Add Reminder'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                placeholder={isHindi ? 'शीर्षक *' : 'Title *'}
                value={newReminder.title}
                onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                className="rounded-xl"
              />
              <Textarea
                placeholder={isHindi ? 'विवरण (वैकल्पिक)' : 'Description (optional)'}
                value={newReminder.description}
                onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                className="rounded-xl"
              />
              <Input
                type="date"
                value={newReminder.dueDate}
                onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                className="rounded-xl"
              />
              <Select 
                value={newReminder.priority} 
                onValueChange={(value: typeof newReminder.priority) => setNewReminder(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full rounded-xl gradient-kishu" onClick={handleAddReminder}>
                {isHindi ? 'रिमाइंडर जोड़ें' : 'Add Reminder'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default CustomerDetail;
