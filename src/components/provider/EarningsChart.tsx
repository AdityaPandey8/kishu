import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const earningsData = [
  { month: 'Oct', earnings: 12400 },
  { month: 'Nov', earnings: 18200 },
  { month: 'Dec', earnings: 15800 },
  { month: 'Jan', earnings: 22600 },
  { month: 'Feb', earnings: 19400 },
  { month: 'Mar', earnings: 28500 },
];

export const EarningsChart = ({ totalRevenue }: { totalRevenue: number }) => {
  const growth = 22.4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Total Earnings</p>
          <p className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-2 py-1 rounded-full">
          <TrendingUp className="h-3 w-3" />
          +{growth}%
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={earningsData}>
            <defs>
              <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Earnings']}
            />
            <Area type="monotone" dataKey="earnings" stroke="hsl(142, 76%, 36%)" strokeWidth={2} fill="url(#earningsGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
