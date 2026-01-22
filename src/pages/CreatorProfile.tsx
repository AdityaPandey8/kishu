import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, User, Play, Heart, Eye, Share2, 
  Check, UserPlus, Grid, Video
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CreatorProfile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { 
    reels, 
    getCreatorProfile, 
    getSubscriberCount, 
    isSubscribed, 
    subscribe, 
    unsubscribe 
  } = useData();
  const isHindi = i18n.language === 'hi';

  const creatorProfile = id ? getCreatorProfile(id) : undefined;
  const creatorReels = reels.filter(reel => reel.creatorId === id);
  const subscriberCount = id ? getSubscriberCount(id) : 0;
  const isFollowing = user && id ? isSubscribed(id, user.id) : false;
  const isOwnProfile = user?.id === id;

  const totalViews = creatorReels.reduce((sum, reel) => sum + reel.views, 0);
  const totalLikes = creatorReels.reduce((sum, reel) => sum + reel.likes.length, 0);

  const handleFollow = () => {
    if (!user) {
      toast.error(isHindi ? 'कृपया पहले लॉगिन करें' : 'Please login first');
      navigate('/login');
      return;
    }

    if (!id) return;

    if (isFollowing) {
      unsubscribe(id, user.id);
      toast.success(isHindi ? 'अनफॉलो किया' : 'Unfollowed');
    } else {
      subscribe(id, user.id);
      toast.success(isHindi ? 'फॉलो किया' : 'Following');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: creatorProfile?.bio || 'Creator Profile',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(isHindi ? 'लिंक कॉपी हो गया' : 'Link copied');
    }
  };

  if (!creatorProfile) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isHindi ? 'क्रिएटर नहीं मिला' : 'Creator not found'}
            </p>
            <Button
              onClick={() => navigate('/reels')}
              variant="outline"
              className="mt-4 rounded-xl"
            >
              {isHindi ? 'वापस जाएं' : 'Go Back'}
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header with Cover */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-br from-primary via-primary/80 to-primary/60" />
          
          {/* Back Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="absolute top-3 left-3 bg-black/20 hover:bg-black/40 text-white rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {/* Share Button */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleShare}
            className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full"
          >
            <Share2 className="h-5 w-5" />
          </Button>

          {/* Avatar */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="h-24 w-24 rounded-full border-4 border-background bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <User className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 px-4 text-center">
          <h1 className="text-xl font-bold text-foreground">
            {creatorProfile.bio?.split(' ').slice(0, 3).join(' ') || 'Creator'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {creatorProfile.bio}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-4">
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{subscriberCount}</p>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'फॉलोअर्स' : 'Followers'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{totalLikes}</p>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'लाइक्स' : 'Likes'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">{creatorReels.length}</p>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'वीडियो' : 'Videos'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 max-w-xs mx-auto">
            {isOwnProfile ? (
              <Button
                onClick={() => navigate('/creator-studio')}
                className="flex-1 rounded-xl"
              >
                {isHindi ? 'स्टूडियो' : 'Studio'}
              </Button>
            ) : (
              <Button
                onClick={handleFollow}
                className={cn(
                  'flex-1 rounded-xl',
                  isFollowing 
                    ? 'bg-muted text-foreground hover:bg-muted/80' 
                    : 'gradient-kishu shadow-kishu'
                )}
              >
                {isFollowing ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {isHindi ? 'फॉलोइंग' : 'Following'}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isHindi ? 'फॉलो करें' : 'Follow'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="videos" className="mt-6 px-4">
          <TabsList className="w-full bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="videos" className="flex-1 rounded-lg">
              <Grid className="h-4 w-4 mr-2" />
              {isHindi ? 'वीडियो' : 'Videos'}
            </TabsTrigger>
            <TabsTrigger value="liked" className="flex-1 rounded-lg">
              <Heart className="h-4 w-4 mr-2" />
              {isHindi ? 'लाइक्ड' : 'Liked'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-4">
            {creatorReels.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {isHindi ? 'अभी तक कोई वीडियो नहीं' : 'No videos yet'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {creatorReels.map((reel, index) => (
                  <motion.div
                    key={reel.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className="relative aspect-[9/16] rounded-lg overflow-hidden bg-muted cursor-pointer group"
                    onClick={() => navigate('/reels', { state: { startReelId: reel.id } })}
                  >
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                    <div className="absolute bottom-1 left-1 flex items-center gap-1 text-white text-xs">
                      <Play className="h-3 w-3 fill-white" />
                      {reel.views}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="liked" className="mt-4">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isHindi ? 'लाइक्ड वीडियो छिपे हैं' : 'Liked videos are hidden'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default CreatorProfile;
