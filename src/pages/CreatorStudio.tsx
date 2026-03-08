import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Plus, Play, Heart, Eye, Users, TrendingUp, 
  Video, Settings, MoreVertical, Trash2, BarChart3,
  FileText, Film, PenSquare, MessageSquare, Share2
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const CreatorStudio = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reels, posts, getCreatorProfile, getSubscriberCount, deleteReel, deletePost, addPost } = useData();
  const isHindi = i18n.language === 'hi';

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'reel' | 'post' } | null>(null);
  const [showUploadChoice, setShowUploadChoice] = useState(false);
  const [showTextPostForm, setShowTextPostForm] = useState(false);
  const [textPostContent, setTextPostContent] = useState('');
  const [textPostTags, setTextPostTags] = useState('');

  const creatorProfile = user ? getCreatorProfile(user.id) : undefined;

  if (user && !creatorProfile?.isCreator) {
    navigate('/become-creator');
    return null;
  }

  const myReels = reels.filter(reel => reel.creatorId === user?.id);
  const myPosts = posts.filter(post => post.authorId === user?.id);
  const myLongVideos = myPosts.filter(p => p.type === 'long-video');
  const myTextImagePosts = myPosts.filter(p => p.type === 'text' || p.type === 'image');
  
  const totalViews = myReels.reduce((sum, reel) => sum + reel.views, 0);
  const totalLikes = myReels.reduce((sum, reel) => sum + reel.likes.length, 0) + myPosts.reduce((sum, p) => sum + p.likes.length, 0);
  const subscribers = user ? getSubscriberCount(user.id) : 0;

  const stats = [
    { icon: Eye, label: isHindi ? 'व्यूज' : 'Views', value: totalViews, color: 'text-blue-600' },
    { icon: Heart, label: isHindi ? 'लाइक्स' : 'Likes', value: totalLikes, color: 'text-red-500' },
    { icon: Users, label: isHindi ? 'फॉलोअर्स' : 'Followers', value: subscribers, color: 'text-green-600' },
    { icon: Video, label: isHindi ? 'कंटेंट' : 'Content', value: myReels.length + myPosts.length, color: 'text-purple-600' },
  ];

  const handleDelete = (id: string, type: 'reel' | 'post') => {
    setItemToDelete({ id, type });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'reel') deleteReel(itemToDelete.id);
      else deletePost(itemToDelete.id);
      toast.success(isHindi ? 'हटा दिया गया' : 'Deleted successfully');
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleCreateTextPost = () => {
    if (!user || !textPostContent.trim()) return;
    addPost({
      authorId: user.id,
      authorName: user.name,
      location: user.location || 'India',
      content: textPostContent.trim(),
      tags: textPostTags.split(',').map(t => t.trim()).filter(Boolean),
      type: 'text',
    });
    setTextPostContent('');
    setTextPostTags('');
    setShowTextPostForm(false);
    toast.success(isHindi ? 'पोस्ट प्रकाशित' : 'Post published!');
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
                {isHindi ? 'अपना कंटेंट प्रबंधित करें' : 'Manage your content'}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => navigate('/settings')}>
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
            onClick={() => setShowUploadChoice(true)}
            className="w-full h-14 rounded-xl text-lg gradient-kishu shadow-kishu"
          >
            <Plus className="mr-2 h-5 w-5" />
            {isHindi ? 'नया कंटेंट बनाएं' : 'Create New Content'}
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="posts" className="px-4">
          <TabsList className="w-full bg-muted/50 rounded-xl p-1">
            <TabsTrigger value="posts" className="flex-1 rounded-lg text-xs">
              <FileText className="h-3.5 w-3.5 mr-1" />
              {isHindi ? 'पोस्ट' : 'Posts'}
            </TabsTrigger>
            <TabsTrigger value="reels" className="flex-1 rounded-lg text-xs">
              <Play className="h-3.5 w-3.5 mr-1" />
              {isHindi ? 'रील्स' : 'Reels'}
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex-1 rounded-lg text-xs">
              <Film className="h-3.5 w-3.5 mr-1" />
              {isHindi ? 'वीडियो' : 'Videos'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 rounded-lg text-xs">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              {isHindi ? 'एनालिटिक्स' : 'Stats'}
            </TabsTrigger>
          </TabsList>

          {/* Posts Tab */}
          <TabsContent value="posts" className="mt-4">
            {myTextImagePosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {isHindi ? 'अभी तक कोई पोस्ट नहीं' : 'No posts yet'}
                </p>
                <Button onClick={() => setShowTextPostForm(true)} variant="outline" className="rounded-xl">
                  {isHindi ? 'पहली पोस्ट बनाएं' : 'Create your first post'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myTextImagePosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-xl p-3 flex gap-3"
                  >
                    {post.imageUrl && (
                      <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes.length}</span>
                        <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.comments.length}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDelete(post.id, 'post')} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" /> {isHindi ? 'हटाएं' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reels Tab */}
          <TabsContent value="reels" className="mt-4">
            {myReels.length === 0 ? (
              <div className="text-center py-12">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {isHindi ? 'अभी तक कोई रील नहीं' : 'No reels yet'}
                </p>
                <Button onClick={() => navigate('/creator-studio/upload')} variant="outline" className="rounded-xl">
                  {isHindi ? 'पहली रील अपलोड करें' : 'Upload your first reel'}
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
                    <img src={reel.thumbnailUrl} alt={reel.caption} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-2 mb-2">{reel.caption}</p>
                      <div className="flex items-center gap-3 text-white/80 text-xs">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {reel.views}</span>
                        <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {reel.likes.length}</span>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDelete(reel.id, 'reel')} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> {isHindi ? 'हटाएं' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

          {/* Long Videos Tab */}
          <TabsContent value="videos" className="mt-4">
            {myLongVideos.length === 0 ? (
              <div className="text-center py-12">
                <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {isHindi ? 'अभी तक कोई लॉन्ग वीडियो नहीं' : 'No long videos yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {myLongVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <div className="aspect-video relative bg-muted">
                      <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      {video.videoDuration && (
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                          {Math.floor(video.videoDuration / 60)}:{(video.videoDuration % 60).toString().padStart(2, '0')}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-2">{video.content}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {video.likes.length}</span>
                          <span className="flex items-center gap-1"><Share2 className="h-3 w-3" /> {video.shares}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost" className="h-8 w-8 flex-shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDelete(video.id, 'post')} className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> {isHindi ? 'हटाएं' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-4">
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  {isHindi ? 'प्रदर्शन सारांश' : 'Performance Summary'}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{isHindi ? 'कुल व्यूज' : 'Total Views'}</span>
                    <span className="font-semibold text-foreground">{totalViews}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{isHindi ? 'कुल लाइक्स' : 'Total Likes'}</span>
                    <span className="font-semibold text-foreground">{totalLikes}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{isHindi ? 'कुल पोस्ट' : 'Total Posts'}</span>
                    <span className="font-semibold text-foreground">{myPosts.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{isHindi ? 'कुल रील्स' : 'Total Reels'}</span>
                    <span className="font-semibold text-foreground">{myReels.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Upload Choice Dialog */}
        <Dialog open={showUploadChoice} onOpenChange={setShowUploadChoice}>
          <DialogContent className="max-w-[90%] rounded-2xl">
            <DialogHeader>
              <DialogTitle>{isHindi ? 'कंटेंट प्रकार चुनें' : 'Choose Content Type'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-3 py-2">
              <Button
                variant="outline"
                className="h-16 rounded-xl justify-start gap-3"
                onClick={() => { setShowUploadChoice(false); setShowTextPostForm(true); }}
              >
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <PenSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{isHindi ? 'टेक्स्ट पोस्ट' : 'Text Post'}</p>
                  <p className="text-xs text-muted-foreground">{isHindi ? 'अपने विचार साझा करें' : 'Share your thoughts'}</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 rounded-xl justify-start gap-3"
                onClick={() => { setShowUploadChoice(false); navigate('/creator-studio/upload'); }}
              >
                <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Play className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{isHindi ? 'शॉर्ट वीडियो (रील)' : 'Short Video (Reel)'}</p>
                  <p className="text-xs text-muted-foreground">{isHindi ? '60 सेकंड तक' : 'Up to 60 seconds'}</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="h-16 rounded-xl justify-start gap-3"
                onClick={() => { setShowUploadChoice(false); navigate('/creator-studio/upload?type=long'); }}
              >
                <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <Film className="h-5 w-5 text-red-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium">{isHindi ? 'लॉन्ग वीडियो' : 'Long Video'}</p>
                  <p className="text-xs text-muted-foreground">{isHindi ? 'ट्यूटोरियल और गाइड' : 'Tutorials & guides'}</p>
                </div>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Text Post Form Dialog */}
        <Dialog open={showTextPostForm} onOpenChange={setShowTextPostForm}>
          <DialogContent className="max-w-[90%] rounded-2xl">
            <DialogHeader>
              <DialogTitle>{isHindi ? 'नई पोस्ट बनाएं' : 'Create New Post'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <Textarea
                placeholder={isHindi ? 'आप क्या साझा करना चाहते हैं?' : 'What do you want to share?'}
                value={textPostContent}
                onChange={(e) => setTextPostContent(e.target.value)}
                className="min-h-[120px] rounded-xl"
              />
              <Input
                placeholder={isHindi ? 'टैग (कॉमा से अलग करें)' : 'Tags (comma separated)'}
                value={textPostTags}
                onChange={(e) => setTextPostTags(e.target.value)}
                className="rounded-xl"
              />
              <Button
                onClick={handleCreateTextPost}
                disabled={!textPostContent.trim()}
                className="w-full rounded-xl gradient-kishu"
              >
                {isHindi ? 'पोस्ट करें' : 'Publish Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{isHindi ? 'हटाएं?' : 'Delete?'}</AlertDialogTitle>
              <AlertDialogDescription>
                {isHindi ? 'यह क्रिया पूर्ववत नहीं की जा सकती।' : 'This action cannot be undone.'}
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
