import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, Cloud, AlertTriangle, MessageSquare, Settings, 
  Check, Trash2, ArrowLeft, CheckCheck, Users
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const notificationIcons = {
  weather: Cloud,
  disease: AlertTriangle,
  inquiry: MessageSquare,
  system: Settings,
  community: Users,
};

const notificationColors = {
  weather: 'bg-blue-100 text-blue-600',
  disease: 'bg-red-100 text-red-600',
  inquiry: 'bg-purple-100 text-purple-600',
  system: 'bg-gray-100 text-gray-600',
  community: 'bg-green-100 text-green-600',
};

const Notifications = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useData();
  const isHindi = i18n.language === 'hi';

  const userNotifications = notifications.filter(n => n.userId === user?.id);
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <div className="container px-4 py-4">
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
                <Bell className="h-5 w-5 text-primary" />
                {isHindi ? 'सूचनाएं' : 'Notifications'}
              </h1>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {unreadCount} {isHindi ? 'अपठित' : 'unread'}
                </p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              {isHindi ? 'सभी पढ़ें' : 'Mark all read'}
            </Button>
          )}
        </motion.div>

        {/* Notifications List */}
        {userNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Bell className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">
              {isHindi ? 'कोई सूचना नहीं' : 'No notifications yet'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {userNotifications.map((notification, index) => {
                const Icon = notificationIcons[notification.type];
                const colorClass = notificationColors[notification.type];

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      'relative bg-card border border-border rounded-xl p-4 shadow-soft',
                      !notification.read && 'border-l-4 border-l-primary bg-primary/5'
                    )}
                    onClick={() => !notification.read && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', colorClass)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="font-medium text-foreground text-sm">
                            {notification.title}
                          </h3>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-3">
                      {!notification.read && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {isHindi ? 'पढ़ा' : 'Mark read'}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 text-xs text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Notifications;
