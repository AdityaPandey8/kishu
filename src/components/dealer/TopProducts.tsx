import { motion } from 'framer-motion';
import { Package, TrendingUp, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Product } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

interface TopProductsProps {
  products: Product[];
  title?: string;
  onViewAll?: () => void;
  onViewProduct?: (id: string) => void;
}

export const TopProducts = ({ 
  products, 
  title = 'Top Selling Products',
  onViewAll,
  onViewProduct 
}: TopProductsProps) => {
  const maxSales = Math.max(...products.map(p => p.sales), 1);

  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          {title}
        </h3>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="text-xs text-primary">
            View All <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {products.slice(0, 5).map((product, index) => {
          const percentage = (product.sales / maxSales) * 100;

          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onViewProduct?.(product.id)}
              className={cn(
                'flex items-center gap-3 p-2 rounded-xl transition-colors',
                onViewProduct && 'cursor-pointer hover:bg-muted/50'
              )}
            >
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <span className="text-xs font-semibold text-primary">{product.sales} sold</span>
                </div>
                <Progress value={percentage} className="h-1.5 [&>div]:bg-primary" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
