import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Clock, Store, X } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface EditStoreProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditStoreProfileDialog = ({ open, onOpenChange }: EditStoreProfileDialogProps) => {
  const { i18n } = useTranslation();
  const { user, updateUser } = useAuth();
  const isHindi = i18n.language === 'hi';
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [description, setDescription] = useState(user?.storeDescription || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [logo, setLogo] = useState(user?.storeLogo || '');
  const [openTime, setOpenTime] = useState(user?.operatingHours?.open || '09:00');
  const [closeTime, setCloseTime] = useState(user?.operatingHours?.close || '18:00');
  const [selectedDays, setSelectedDays] = useState<string[]>(
    user?.operatingHours?.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  );
  const [sameForAll, setSameForAll] = useState(true);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      toast.error(isHindi ? 'फ़ाइल 500KB से छोटी होनी चाहिए' : 'File must be under 500KB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error(isHindi ? 'व्यवसाय का नाम आवश्यक है' : 'Business name is required');
      return;
    }
    updateUser({
      name: name.trim(),
      storeDescription: description.trim(),
      storeLogo: logo,
      phone: phone.trim(),
      location: location.trim(),
      operatingHours: { open: openTime, close: closeTime, days: selectedDays },
    });
    toast.success(isHindi ? 'प्रोफ़ाइल अपडेट हो गई' : 'Profile updated successfully');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            {isHindi ? 'स्टोर प्रोफ़ाइल संपादित करें' : 'Edit Store Profile'}
          </DialogTitle>
          <DialogDescription>
            {isHindi ? 'अपने स्टोर की जानकारी अपडेट करें' : 'Update your store information'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Logo Upload */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="relative h-24 w-24 rounded-2xl bg-muted border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center overflow-hidden group"
            >
              {logo ? (
                <>
                  <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1 text-muted-foreground">
                  <Camera className="h-6 w-6" />
                  <span className="text-[10px]">{isHindi ? 'लोगो अपलोड' : 'Upload Logo'}</span>
                </div>
              )}
            </button>
            {logo && (
              <button onClick={() => setLogo('')} className="text-xs text-destructive hover:underline">
                {isHindi ? 'लोगो हटाएं' : 'Remove logo'}
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </div>

          {/* Business Name */}
          <div className="space-y-1.5">
            <Label className="text-xs">{isHindi ? 'व्यवसाय का नाम' : 'Business Name'} *</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sunil Agro Supplies" className="rounded-xl" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs">{isHindi ? 'विवरण' : 'Description'}</Label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={isHindi ? 'अपने स्टोर के बारे में बताएं...' : 'Tell customers about your store...'}
              className="rounded-xl min-h-[80px] resize-none"
              maxLength={300}
            />
            <p className="text-[10px] text-muted-foreground text-right">{description.length}/300</p>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs">{isHindi ? 'फोन' : 'Phone'}</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" className="rounded-xl" />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label className="text-xs">{isHindi ? 'स्थान' : 'Location'}</Label>
            <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="Delhi, India" className="rounded-xl" />
          </div>

          {/* Operating Hours */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {isHindi ? 'कार्य समय' : 'Operating Hours'}
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{isHindi ? 'सभी दिन समान' : 'Same for all'}</span>
                <Switch checked={sameForAll} onCheckedChange={setSameForAll} />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Input type="time" value={openTime} onChange={e => setOpenTime(e.target.value)} className="rounded-xl text-xs flex-1" />
              <span className="text-xs text-muted-foreground">—</span>
              <Input type="time" value={closeTime} onChange={e => setCloseTime(e.target.value)} className="rounded-xl text-xs flex-1" />
            </div>

            {/* Day selector */}
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-colors',
                    selectedDays.includes(day)
                      ? 'bg-primary/10 text-primary border-primary/20'
                      : 'bg-muted text-muted-foreground border-border'
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-xl">{isHindi ? 'रद्द करें' : 'Cancel'}</Button>
          </DialogClose>
          <Button onClick={handleSave} className="rounded-xl">
            {isHindi ? 'सहेजें' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditStoreProfileDialog;
