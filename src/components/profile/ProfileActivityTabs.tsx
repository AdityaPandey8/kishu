import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Bookmark, Users, Play, FileText, Film, Image, UserMinus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

const typeIcon = (type: string) => {
  switch (type) {
    case 'image': return <Image className="h-3 w-3" />;
    case 'short-video': return <Play className="h-3 w-3" />;
    case 'long-video': return <Film className="h-3 w-3" />;
    default: return <FileText className="h-3 w-3" />;
  }
};

const creatorNames: Record<string, string> = {
  'creator-001': 'Kisan Vikas',
  'creator-002': 'Organic Farming India',
  'creator-003': 'Modern Kheti',
};

const ProfileActivityTabs = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    posts, reels, savedPosts, savedReels, 
    subscriptions, creatorProfiles, unsubscribe, getSubscriberCount 
  } = useData();
  const isHindi = i18n.language === 'hi';

  if (!user) return null;

  const followedCreatorIds = subscriptions.filter(s => s.subscriberId === user.id).map(s => s.creatorId);
  const followedCreators = creatorProfiles.filter(c => followedCreatorIds.includes(c.userId));
  
  const likedPosts = posts.filter(p => p.likes.includes(user.id));
  const likedReels = reels.filter(r => r.likes.includes(user.id));

  const commentedPosts = posts.filter(p => p.comments.some(c => c.authorId === user.id));

  const savedPostItems = posts.filter(p => savedPosts.includes(p.id));
  const savedReelItems = reels.filter(r => savedReels.includes(r.id));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
      <h2 className="text-sm font-semibold text-foreground mb-3">
        {isHindi ? 'मेरी गतिविधि' : 'My Activity'}
      </h2>
      <Tabs defaultValue="following">
        <TabsList className="w-full bg-muted/50 rounded-xl p-1">
          <TabsTrigger value="following" className="flex-1 rounded-lg text-xs">
            <Users className="h-3 w-3 mr-1" /> {followedCreators.length}
          </TabsTrigger>
          <TabsTrigger value="liked" className="flex-1 rounded-lg text-xs">
            <Heart className="h-3 w-3 mr-1" /> {likedPosts.length + likedReels.length}
          </TabsTrigger>
          <TabsTrigger value="commented" className="flex-1 rounded-lg text-xs">
            <MessageSquare className="h-3 w-3 mr-1" /> {commentedPosts.length}
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex-1 rounded-lg text-xs">
            <Bookmark className="h-3 w-3 mr-1" /> {savedPostItems.length + savedReelItems.length}
          </TabsTrigger>
        </TabsList>

        {/* Following */}
        <TabsContent value="following" className="mt-3">
          {followedCreators.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              {isHindi ? 'किसी को फॉलो नहीं कर रहे' : 'Not following anyone'}
            </p>
          ) : (
            <div className="space-y-2">
              {followedCreators.map(creator => {
                const name = creatorNames[creator.userId] || creator.userId;
                return (
                  <div key={creator.userId} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                    <div 
                      className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer"
                      onClick={() => navigate(`/creator/${creator.userId}`)}
                    >
                      <span className="text-primary font-bold text-sm">{name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{name}</p>
                      <p className="text-[11px] text-muted-foreground">{getSubscriberCount(creator.userId) + creator.totalFollowers} followers</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full text-xs h-8"
                      onClick={() => unsubscribe(creator.userId, user.id)}
                    >
                      <UserMinus className="h-3 w-3 mr-1" />
                      {isHindi ? 'अनफॉलो' : 'Unfollow'}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Liked */}
        <TabsContent value="liked" className="mt-3">
          {likedPosts.length + likedReels.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              {isHindi ? 'अभी तक कुछ लाइक नहीं किया' : 'Nothing liked yet'}
            </p>
          ) : (
            <div className="space-y-2">
              {likedPosts.map(post => (
                <div key={post.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    {post.thumbnailUrl ? (
                      <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : post.imageUrl ? (
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      typeIcon(post.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{post.content}</p>
                    <p className="text-[10px] text-muted-foreground">{post.authorName}</p>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                    {typeIcon(post.type)} {post.type}
                  </span>
                </div>
              ))}
              {likedReels.map(reel => (
                <div key={reel.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                    <img src={reel.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{reel.caption}</p>
                    <p className="text-[10px] text-muted-foreground">{reel.creatorName}</p>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Play className="h-3 w-3" /> Reel
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Commented */}
        <TabsContent value="commented" className="mt-3">
          {commentedPosts.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              {isHindi ? 'अभी तक कोई कमेंट नहीं किया' : 'No comments yet'}
            </p>
          ) : (
            <div className="space-y-2">
              {commentedPosts.map(post => {
                const myComment = post.comments.find(c => c.authorId === user.id);
                return (
                  <div key={post.id} className="bg-card border border-border rounded-xl p-3">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{post.content}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">by {post.authorName}</p>
                    {myComment && (
                      <p className="text-[11px] text-foreground/70 mt-1.5 bg-muted rounded-lg px-2 py-1.5 line-clamp-2">
                        "{myComment.content}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Saved */}
        <TabsContent value="saved" className="mt-3">
          {savedPostItems.length + savedReelItems.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              {isHindi ? 'कुछ भी सेव नहीं किया' : 'Nothing saved yet'}
            </p>
          ) : (
            <div className="space-y-2">
              {savedPostItems.map(post => (
                <div key={post.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {post.thumbnailUrl ? (
                      <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    ) : post.imageUrl ? (
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      typeIcon(post.type)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{post.content}</p>
                    <p className="text-[10px] text-muted-foreground">{post.authorName}</p>
                  </div>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                    {post.type}
                  </span>
                </div>
              ))}
              {savedReelItems.map(reel => (
                <div key={reel.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex-shrink-0 overflow-hidden">
                    <img src={reel.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-1">{reel.caption}</p>
                    <p className="text-[10px] text-muted-foreground">{reel.creatorName}</p>
                  </div>
                  <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    Reel
                  </span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default ProfileActivityTabs;
