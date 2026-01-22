import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Play, Heart, Eye, Users, TrendingUp, 
  Video, Settings, MoreVertical, Trash2, Edit, BarChart3
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CreatorStudio = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reels, getCreatorProfile, getSubscriberCount, deleteReel } = useData();
  const isHindi = i18n.language === 'hi';

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reelToDelete, setReelToDelete] = useState<string | null>(null);

  const creatorProfile = user ? getCreatorProfile(user.id) : undefined;

  // Redirect if not a creator
  if (user && !creatorProfile?.isCreator) {
    navigate('/become-creator');
    return null;
  }

  const myReels = reels.filter(reel => reel.creatorId === user?.id);
  const totalViews = myReels.reduce((sum, reel) => sum + reel.views, 0);
  const totalLikes = myReels.reduce((sum, reel) => sum + reel.likes.length, 0);
  const subscribers = user ? getSubscriberCount(user.id) : 0;

  const stats = [
    { icon: Eye, label: isHindi ? 'व्यूज' : 'Views', value: totalViews, color: 'text-blue-600' },
    { icon: Heart, label: isHindi ? 'लाइक्स' : 'Likes', value: totalLikes, color: 'text-red-500' },
    { icon: Users, label: isHindi ? 'फॉलोअर्स' : 'Followers', value: subscribers, color: 'text-green-600' },
    { icon: Video, label: isHindi ? 'वीडियो' : 'Videos', value: myReels.length, color: 'text-purple-600' },
  ];

  const handleDeleteReel = (reelId: string) => {
    setReelToDelete(reelId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (reelToDelete) {
      deleteReel(reelToDelete);
      toast.success(isHindi ? 'वीडियो हटा दिया गया' : 'Video deleted successfully');
    }
    setDeleteDialogOpen(false);
    setReelToDelete(null);
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="bg-gradient-to-b from-primary/20 to-background px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {isHindi ? 'क्रिएटर स्टूडियो' : 'Creator Studio'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isHindi ? 'अपने वीडियो प्रबंधित करें' : 'Manage your videos'}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-3 text-center"
                >
                  <Icon className={cn('h-5 w-5 mx-auto mb-1', stat.color)} />
                  <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Upload Button */}
        <div className="px-4 py-4">
          <Button
            onClick={() => navigate('/creator-studio/upload')}
            className="w-full h-14 rounded-xl text-lg gradient-kishu shadow-kishu"
          >
            <Plus className="mr-2 h-5 w-5" />
            {isHindi ? 'नया वीडियो अपलोड करें' : 'Upload New Video'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="videos" className="px-4">
          <TabsList className="w-full bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="videos" className="flex-1 rounded-lg">
              <Video className="h-4 w-4 mr-2" />
              {isHindi ? 'मेरे वीडियो' : 'My Videos'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 rounded-lg">
              <BarChart3 className="h-4 w-4 mr-2" />
              {isHindi ? 'एनालिटिक्स' : 'Analytics'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-4">
            {myReels.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {isHindi ? 'अभी तक कोई वीडियो नहीं' : 'No videos yet'}
                </p>
                <Button
                  onClick={() => navigate('/creator-studio/upload')}
                  variant="outline"
                  className="rounded-xl"
                >
                  {isHindi ? 'पहला वीडियो अपलोड करें' : 'Upload your first video'}
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {myReels.map((reel, index) => (
                  <motion.div
                    key={reel.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted group"
                  >
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    {/* Stats Overlay */}
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-2 mb-2">
                        {reel.caption}
                      </p>
                      <div className="flex items-center gap-3 text-white/80 text-xs">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {reel.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {reel.likes.length}
                        </span>
                      </div>
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => navigate(`/creator-studio/edit/${reel.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {isHindi ? 'संपादित करें' : 'Edit'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteReel(reel.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {isHindi ? 'हटाएं' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-12 w-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <div className="space-y-4">
              {/* Performance Summary */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {isHindi ? 'प्रदर्शन सारांश' : 'Performance Summary'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {isHindi ? 'कुल व्यूज' : 'Total Views'}
                    </span>
                    <span className="font-semibold text-foreground">{totalViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {isHindi ? 'कुल लाइक्स' : 'Total Likes'}
                    </span>
                    <span className="font-semibold text-foreground">{totalLikes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {isHindi ? 'एंगेजमेंट रेट' : 'Engagement Rate'}
                    </span>
                    <span className="font-semibold text-foreground">
                      {totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Performing */}
              {myReels.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="font-semibold text-foreground mb-3">
                    {isHindi ? 'सबसे लोकप्रिय वीडियो' : 'Top Performing Video'}
                  </h3>
                  {(() => {
                    const topReel = myReels.reduce((prev, current) => 
                      current.views > prev.views ? current : prev
                    );
                    return (
                      <div className="flex gap-3">
                        <div className="h-20 w-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={topReel.thumbnailUrl}
                            alt={topReel.caption}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm line-clamp-2">
                            {topReel.caption}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {topReel.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {topReel.likes.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isHindi ? 'वीडियो हटाएं?' : 'Delete Video?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isHindi 
                  ? 'यह क्रिया पूर्ववत नहीं की जा सकती। वीडियो स्थायी रूप से हटा दिया जाएगा।'
                  : 'This action cannot be undone. The video will be permanently deleted.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{isHindi ? 'रद्द करें' : 'Cancel'}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                {isHindi ? 'हटाएं' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AppLayout>
  );
};

export default CreatorStudio;
