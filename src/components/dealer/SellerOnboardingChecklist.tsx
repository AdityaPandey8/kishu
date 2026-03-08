import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Circle, ShieldCheck, Image, Package, MessageSquare,
  Landmark, Boxes, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChecklistItem {
  id: string;
  label: string;
  icon: React.ElementType;
  done: boolean;
  route: string;
}

interface SellerOnboardingChecklistProps {
  title: string;
  items: ChecklistItem[];
}

export const SellerOnboardingChecklist = ({ title, items }: SellerOnboardingChecklistProps) => {
  const navigate = useNavigate();
  const completed = items.filter(i => i.done).length;
  const total = items.length;
  const percentage = Math.round((completed / total) * 100);

  if (percentage >= 100) return null;

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-center gap-3">
        {/* Progress Ring */}
        <div className="relative w-16 h-16 shrink-0">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r={radius} fill="none" className="stroke-muted" strokeWidth="5" />
            <motion.circle
              cx="34" cy="34" r={radius} fill="none"
              className="stroke-primary"
              strokeWidth="5" strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
            {percentage}%
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completed}/{total} completed
          </p>
          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
            <motion.div
              className="bg-primary h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => !item.done && navigate(item.route)}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition-colors ${
                item.done
                  ? 'opacity-60'
                  : 'cursor-pointer hover:bg-muted/50'
              }`}
            >
              {item.done ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className={`flex-1 text-xs font-medium ${item.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {item.label}
              </span>
              {!item.done && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export { type ChecklistItem };
export const getDefaultChecklistItems = (
  isHindi: boolean,
  kycApproved: boolean,
  hasAvatar: boolean,
  productCount: number,
  respondedCount: number,
  hasBankDetails: boolean,
): ChecklistItem[] => [
  { id: 'kyc', label: isHindi ? 'KYC पूरा करें' : 'Complete KYC Verification', icon: ShieldCheck, done: kycApproved, route: '/dealer/kyc' },
  { id: 'avatar', label: isHindi ? 'बिज़नेस लोगो जोड़ें' : 'Add Business Logo', icon: Image, done: hasAvatar, route: '/profile' },
  { id: 'first-product', label: isHindi ? 'पहला उत्पाद जोड़ें' : 'Add First Product', icon: Package, done: productCount > 0, route: '/products' },
  { id: 'first-response', label: isHindi ? 'पहली पूछताछ का जवाब दें' : 'Respond to First Inquiry', icon: MessageSquare, done: respondedCount > 0, route: '/dealer/orders' },
  { id: 'bank', label: isHindi ? 'बैंक विवरण जोड़ें' : 'Add Bank Details', icon: Landmark, done: hasBankDetails, route: '/dealer/kyc' },
  { id: 'five-products', label: isHindi ? '5+ उत्पाद जोड़ें' : 'Add 5+ Products', icon: Boxes, done: productCount >= 5, route: '/products' },
];
