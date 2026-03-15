import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProviderSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', businessName: '', category: '', experience: '', description: '', location: '' });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSignup = async () => {
    if (!form.name || !form.email || !form.password || !form.businessName || !form.category) {
      toast.error('Please fill required fields');
      return;
    }
    setLoading(true);
    try {
      await signup({ email: form.email, password: form.password, name: form.name, role: 'service_provider', phone: form.phone, businessName: form.businessName });
      toast.success('Account created! Awaiting admin approval.');
      navigate('/');
    } catch { toast.error('Signup failed'); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-teal-500/5 flex flex-col">
      <div className="relative flex-1 px-6 py-8">
        <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => navigate('/auth')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto w-full space-y-5 pt-12">
          <div className="text-center">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Become a Service Provider</h1>
            <p className="text-xs text-muted-foreground mt-1">Fill your details to register</p>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Full Name *</Label>
                <Input placeholder="Your name" value={form.name} onChange={e => update('name', e.target.value)} className="rounded-xl mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input placeholder="+91 98765..." value={form.phone} onChange={e => update('phone', e.target.value)} className="rounded-xl mt-1 h-9 text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Email *</Label>
              <Input type="email" placeholder="you@email.com" value={form.email} onChange={e => update('email', e.target.value)} className="rounded-xl mt-1 h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Password *</Label>
              <Input type="password" placeholder="Min 6 characters" value={form.password} onChange={e => update('password', e.target.value)} className="rounded-xl mt-1 h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Business Name *</Label>
              <Input placeholder="Your business name" value={form.businessName} onChange={e => update('businessName', e.target.value)} className="rounded-xl mt-1 h-9 text-sm" />
            </div>
            <div>
              <Label className="text-xs">Service Category *</Label>
              <Select value={form.category} onValueChange={v => update('category', v)}>
                <SelectTrigger className="rounded-xl mt-1 h-9 text-sm"><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment-rental">Farm Equipment Rental</SelectItem>
                  <SelectItem value="soil-testing">Soil Testing & Lab</SelectItem>
                  <SelectItem value="spraying">Spraying & Pest Control</SelectItem>
                  <SelectItem value="harvesting">Harvesting & Labor</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Experience</Label>
                <Input placeholder="e.g. 5 years" value={form.experience} onChange={e => update('experience', e.target.value)} className="rounded-xl mt-1 h-9 text-sm" />
              </div>
              <div>
                <Label className="text-xs">Location</Label>
                <Input placeholder="City, State" value={form.location} onChange={e => update('location', e.target.value)} className="rounded-xl mt-1 h-9 text-sm" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Description</Label>
              <Textarea placeholder="Describe your services..." value={form.description} onChange={e => update('description', e.target.value)} className="rounded-xl mt-1 text-sm min-h-[60px]" />
            </div>
            <Button className="w-full rounded-xl h-10 bg-gradient-to-r from-teal-500 to-teal-600 text-white" onClick={handleSignup} disabled={loading}>
              {loading ? 'Submitting...' : 'Register as Provider'}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Already registered? <button className="text-teal-600 font-medium" onClick={() => navigate('/auth/provider/login')}>Login</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ProviderSignup;
