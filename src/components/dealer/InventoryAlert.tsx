import { motion } from 'framer-motion';
import { AlertTriangle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  threshold: number;
  category: string;
}

interface InventoryAlertProps {
  items: InventoryItem[];
  onViewProduct?: (id: string) => void;
  onReorder?: (id: string) => void;
}

export const InventoryAlert = ({ items, onViewProduct, onReorder }: InventoryAlertProps) => {
  const lowStockItems = items.filter(item => item.stock <= item.threshold);

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Low Stock Alert</h3>
          <p className="text-xs text-muted-foreground">{lowStockItems.length} items need attention</p>
        </div>
      </div>

      <div className="space-y-3">
        {lowStockItems.slice(0, 3).map((item, index) => {
          const percentage = (item.stock / item.threshold) * 100;
          const isOutOfStock = item.stock === 0;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-background/80 rounded-xl p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                </div>
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                )}>
                  {isOutOfStock ? 'Out of Stock' : `${item.stock} left`}
                </span>
              </div>
              <Progress 
                value={Math.min(percentage, 100)} 
                className={cn('h-1.5', isOutOfStock ? '[&>div]:bg-red-500' : '[&>div]:bg-amber-500')}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-muted-foreground">{item.category}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs text-primary"
                  onClick={() => onReorder?.(item.id)}
                >
                  Reorder <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
