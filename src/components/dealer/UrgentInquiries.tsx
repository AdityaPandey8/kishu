import { motion } from 'framer-motion';
import { MessageSquare, Phone, MapPin, ChevronRight, Clock, Package, Truck, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Inquiry } from '@/contexts/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface PendingInquiriesProps {
  inquiries: Inquiry[];
  onRespond: (id: string) => void;
  onCall: (id: string) => void;
  onViewAll: () => void;
  onViewDetails: (inquiry: Inquiry) => void;
}

const typeConfig = {
  stock: { label: 'Stock', icon: Package, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  delivery: { label: 'Delivery', icon: Truck, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  general: { label: 'General', icon: HelpCircle, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
};

export const UrgentInquiries = ({
  inquiries,
  onRespond,
  onCall,
  onViewAll,
  onViewDetails,
}: PendingInquiriesProps) => {
  const pending = inquiries.filter(i => i.status === 'pending');

  if (pending.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Pending Inquiries</h3>
            <p className="text-xs text-muted-foreground">{pending.length} need your response</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-xs">
          View All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-2">
        {pending.slice(0, 2).map((inquiry, index) => {
          const config = typeConfig[inquiry.type];
          const TypeIcon = config.icon;
          return (
            <motion.div
              key={inquiry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background/80 rounded-xl p-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div 
                  className="flex-1 cursor-pointer"
                  onClick={() => onViewDetails(inquiry)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-foreground text-sm">{inquiry.farmerName}</p>
                    <Badge variant="outline" className={cn('text-[10px] px-1.5 py-0 h-4', config.color)}>
                      <TypeIcon className="h-2.5 w-2.5 mr-0.5" />
                      {config.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {inquiry.location}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm text-foreground mb-2 line-clamp-2">
                {inquiry.subject}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs flex-1 rounded-lg"
                  onClick={() => onCall(inquiry.id)}
                >
                  <Phone className="h-3 w-3 mr-1" /> Call
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs flex-1 rounded-lg gradient-kishu"
                  onClick={() => onRespond(inquiry.id)}
                >
                  <MessageSquare className="h-3 w-3 mr-1" /> Respond
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
