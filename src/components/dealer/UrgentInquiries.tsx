import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MessageSquare, MapPin, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Inquiry } from '@/contexts/DataContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface UrgentInquiriesProps {
  inquiries: Inquiry[];
  onRespond: (id: string) => void;
  onCall: (id: string) => void;
  onViewAll: () => void;
  onViewDetails: (inquiry: Inquiry) => void;
}

export const UrgentInquiries = ({
  inquiries,
  onRespond,
  onCall,
  onViewAll,
  onViewDetails,
}: UrgentInquiriesProps) => {
  const urgentPending = inquiries.filter(i => i.urgent && i.status === 'pending');

  if (urgentPending.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center animate-pulse">
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Urgent Requests</h3>
            <p className="text-xs text-muted-foreground">{urgentPending.length} need immediate attention</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll} className="text-xs">
          View All <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="space-y-2">
        {urgentPending.slice(0, 2).map((inquiry, index) => (
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
                <p className="font-medium text-foreground text-sm">{inquiry.farmerName}</p>
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
              {inquiry.crop} - {inquiry.issue}
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
        ))}
      </div>
    </motion.div>
  );
};
