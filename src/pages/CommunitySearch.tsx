import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, UserPlus, UserCheck, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CommunitySearch = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { creatorProfiles, isSubscribed, subscribe, unsubscribe, getSubscriberCount } = useData();
  const isHindi = i18n.language === 'hi';
  const [query, setQuery] = useState('');

  const creators = creatorProfiles.filter(c => c.isCreator);
  const filtered = query.trim()
    ? creators.filter(c => 
        c.bio.toLowerCase().includes(query.toLowerCase()) ||
        c.userId.toLowerCase().includes(query.toLowerCase())
      )
    : creators;

  // Map creator names from seed data
  const creatorNames: Record<string, string> = {
    'creator-001': 'Kisan Vikas',
    'creator-002': 'Organic Farming India',
    'creator-003': 'Modern Kheti',
  };

  const handleFollow = (creatorId: string) => {
    if (!user) { toast.error('Please login first'); return; }
    if (isSubscribed(creatorId, user.id)) {
      unsubscribe(creatorId, user.id);
    } else {
      subscribe(creatorId, user.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button size="icon" variant="ghost" className="rounded-full h-9 w-9" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'क्रिएटर खोजें...' : 'Search creators...'}
              className="pl-9 rounded-full h-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium">
          {filtered.length} {isHindi ? 'क्रिएटर्स मिले' : 'creators found'}
        </p>

        {filtered.map((creator, index) => {
          const name = creatorNames[creator.userId] || creator.userId;
          const following = user ? isSubscribed(creator.userId, user.id) : false;
          const followers = getSubscriberCount(creator.userId);

          return (
            <motion.div
              key={creator.userId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 bg-card border border-border rounded-xl p-3"
            >
              <div 
                className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer flex-shrink-0"
                onClick={() => navigate(`/creator/${creator.userId}`)}
              >
                <span className="text-primary font-bold text-lg">{name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0" onClick={() => navigate(`/creator/${creator.userId}`)}>
                <p className="font-semibold text-foreground text-sm truncate cursor-pointer">{name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{creator.bio}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                  <Users className="h-3 w-3" /> {followers + creator.totalFollowers} {isHindi ? 'फॉलोअर्स' : 'followers'}
                </p>
              </div>
              {user?.id !== creator.userId && (
                <Button
                  size="sm"
                  variant={following ? 'outline' : 'default'}
                  className={cn('rounded-full text-xs flex-shrink-0', !following && 'gradient-kishu')}
                  onClick={() => handleFollow(creator.userId)}
                >
                  {following ? <UserCheck className="h-3.5 w-3.5 mr-1" /> : <UserPlus className="h-3.5 w-3.5 mr-1" />}
                  {following ? (isHindi ? 'फॉलोइंग' : 'Following') : (isHindi ? 'फॉलो' : 'Follow')}
                </Button>
              )}
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              {isHindi ? 'कोई क्रिएटर नहीं मिला' : 'No creators found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunitySearch;
