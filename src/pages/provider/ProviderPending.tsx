import { motion } from 'framer-motion';
import { Clock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ProviderPending = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
          <Clock className="h-10 w-10 text-amber-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Application Under Review</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Your service provider application is being reviewed by our admin team. You'll be notified once approved.
          </p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <p className="text-xs text-amber-700 dark:text-amber-300">This usually takes 1-2 business days. Please check back later.</p>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </motion.div>
    </div>
  );
};

export default ProviderPending;
