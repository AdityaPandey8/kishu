import { motion } from 'framer-motion';
import { XCircle, LogOut, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const ProviderRejected = () => {
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm text-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Application Rejected</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Unfortunately, your service provider application was not approved.
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-xs text-red-700 dark:text-red-300">
            Please contact support for more details or to reapply.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
          <Button className="flex-1 rounded-xl" onClick={() => window.open('mailto:support@kishu.com')}>
            <Mail className="h-4 w-4 mr-2" /> Contact
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProviderRejected;
