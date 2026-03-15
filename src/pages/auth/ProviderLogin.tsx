import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wrench, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProviderLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.user.role === 'service_provider') {
        toast.success('Welcome back!');
        navigate('/');
      } else {
        toast.error('Not a service provider account');
      }
    } catch { toast.error('Login failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-teal-500/5 flex flex-col">
      <div className="relative flex-1 flex flex-col justify-center px-6 py-12">
        <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => navigate('/auth')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto w-full space-y-6">
          <div className="text-center">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Wrench className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Service Provider Login</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your agricultural services</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="provider@kishu.com" value={email} onChange={e => setEmail(e.target.value)} className="rounded-xl mt-1" />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} className="rounded-xl mt-1" />
            </div>
            <Button className="w-full rounded-xl h-11 bg-gradient-to-r from-teal-500 to-teal-600 text-white" onClick={handleLogin} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>

          <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-3">
            <p className="text-xs font-medium text-teal-700 dark:text-teal-300 mb-1">Demo Account:</p>
            <p className="text-xs text-teal-600 dark:text-teal-400">provider@kishu.com / demo123</p>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            New provider?{' '}
            <button className="text-teal-600 font-medium" onClick={() => navigate('/auth/provider/signup')}>Sign Up</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderLogin;
