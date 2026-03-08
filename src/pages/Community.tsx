import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, MessageSquare, Heart, Share2, Plus, Search,
  Clock, MapPin, Bookmark, Play, Film, Image, FileText,
  ChevronDown, ChevronUp, Send
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

const Community = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    posts, toggleLike, addComment, toggleSavePost, isSavedPost, 
    incrementPostShares, creatorProfiles, isSubscribed, subscribe, unsubscribe 
  } = useData();
  const isHindi = i18n.language === 'hi';
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedComments, setExpandedComments] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const filters = [
    { id: 'all', label: isHindi ? 'सभी' : 'All', icon: null },
    { id: 'text', label: isHindi ? 'टेक्स्ट' : 'Text', icon: FileText },
    { id: 'image', label: isHindi ? 'फ़ोटो' : 'Photos', icon: Image },
    { id: 'short-video', label: isHindi ? 'शॉर्ट' : 'Shorts', icon: Play },
    { id: 'long-video', label: isHindi ? 'वीडियो' : 'Videos', icon: Film },
  ];

  const filteredPosts = activeFilter === 'all' 
    ? posts 
    : posts.filter(p => p.type === activeFilter);

  const handleLike = (postId: string) => {
    if (!user) { toast.error('Please login first'); return; }
    toggleLike(postId, user.id);
  };

  const handleSave = (postId: string) => {
    if (!user) { toast.error('Please login first'); return; }
    toggleSavePost(postId);
  };

  const handleShare = (postId: string) => {
    incrementPostShares(postId);
    toast.success(isHindi ? 'लिंक कॉपी किया गया' : 'Link copied!');
  };

  const handleComment = (postId: string) => {
    if (!user) { toast.error('Please login first'); return; }
    const text = commentInputs[postId]?.trim();
    if (!text) return;
    addComment(postId, { authorId: user.id, authorName: user.name, content: text });
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
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
    <AppLayout>
      <div className="container px-4 py-4 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {isHindi ? 'समुदाय' : 'Community'}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isHindi ? 'क्रिएटर्स से जुड़ें और सीखें' : 'Connect and learn from creators'}
            </p>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="rounded-xl"
            onClick={() => navigate('/community/search')}
          >
            <Search className="h-5 w-5" />
          </Button>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {filters.map((filter) => {
            const Icon = filter.icon;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                  activeFilter === filter.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {filteredPosts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {isHindi ? 'कोई पोस्ट नहीं मिली' : 'No posts found'}
            </div>
          )}
          {filteredPosts.map((post, index) => {
            const isLiked = user ? post.likes.includes(user.id) : false;
            const isSaved = isSavedPost(post.id);
            const creator = creatorProfiles.find(c => c.userId === post.authorId);
            const following = user ? isSubscribed(post.authorId, user.id) : false;
            const showComments = expandedComments === post.id;

            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft"
              >
                {/* Author Row */}
                <div className="flex items-center gap-3 p-4 pb-2">
                  <div 
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer"
                    onClick={() => creator && navigate(`/creator/${post.authorId}`)}
                  >
                    <span className="text-primary font-bold text-sm">
                      {post.authorName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className="font-semibold text-foreground text-sm cursor-pointer hover:underline"
                      onClick={() => creator && navigate(`/creator/${post.authorId}`)}
                    >
                      {post.authorName}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" /> {post.location}
                      <span>•</span>
                      <Clock className="h-3 w-3" /> {formatTimeAgo(post.createdAt)}
                    </p>
                  </div>
                  {creator && user?.id !== post.authorId && (
                    <Button
                      size="sm"
                      variant={following ? 'outline' : 'default'}
                      className={cn('rounded-full text-xs h-8 px-3', !following && 'gradient-kishu')}
                      onClick={() => handleFollow(post.authorId)}
                    >
                      {following ? (isHindi ? 'फॉलोइंग' : 'Following') : (isHindi ? 'फॉलो' : 'Follow')}
                    </Button>
                  )}
                </div>

                {/* Content */}
                <div className="px-4 pb-2">
                  <p className="text-foreground text-sm leading-relaxed">
                    {isHindi && post.contentHi ? post.contentHi : post.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex gap-1.5 px-4 pb-3">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Media */}
                {post.type === 'image' && post.imageUrl && (
                  <div className="w-full aspect-video bg-muted">
                    <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {post.type === 'short-video' && post.thumbnailUrl && (
                  <div className="w-full aspect-video bg-black relative cursor-pointer group">
                    <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="h-14 w-14 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                        <Play className="h-7 w-7 text-white fill-white" />
                      </div>
                    </div>
                    {post.videoDuration && (
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                        {formatDuration(post.videoDuration)}
                      </span>
                    )}
                  </div>
                )}

                {post.type === 'long-video' && post.thumbnailUrl && (
                  <div
                    className="w-full aspect-video bg-black relative cursor-pointer group"
                    onClick={() => navigate(`/community/video/${post.id}`)}
                  >
                    <img src={post.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                        <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground ml-1" />
                      </div>
                    </div>
                    {post.videoDuration && (
                      <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
                        {formatDuration(post.videoDuration)}
                      </span>
                    )}
                    <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                      <Film className="h-3 w-3" />
                      {isHindi ? 'लॉन्ग वीडियो' : 'Long Video'}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-1 px-3 py-2.5 border-t border-border">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors',
                      isLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
                    )}
                  >
                    <Heart className={cn('h-[18px] w-[18px]', isLiked && 'fill-current')} />
                    <span className="text-xs font-medium">{post.likes.length}</span>
                  </button>
                  <button 
                    onClick={() => setExpandedComments(showComments ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                  >
                    <MessageSquare className="h-[18px] w-[18px]" />
                    <span className="text-xs font-medium">{post.comments.length}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Share2 className="h-[18px] w-[18px]" />
                    <span className="text-xs font-medium">{post.shares}</span>
                  </button>
                  <button 
                    onClick={() => handleSave(post.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ml-auto',
                      isSaved ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    )}
                  >
                    <Bookmark className={cn('h-[18px] w-[18px]', isSaved && 'fill-current')} />
                  </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {showComments && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="px-4 py-3 space-y-3 max-h-48 overflow-y-auto">
                        {post.comments.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            {isHindi ? 'कोई कमेंट नहीं' : 'No comments yet'}
                          </p>
                        )}
                        {post.comments.map(comment => (
                          <div key={comment.id} className="flex gap-2">
                            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                              <span className="text-[10px] font-bold text-muted-foreground">
                                {comment.authorName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="text-xs">
                                <span className="font-semibold text-foreground">{comment.authorName}</span>{' '}
                                <span className="text-muted-foreground">{comment.content}</span>
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">
                                {formatTimeAgo(comment.createdAt)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {user && (
                        <div className="flex gap-2 px-4 pb-3">
                          <Input
                            placeholder={isHindi ? 'कमेंट करें...' : 'Add a comment...'}
                            className="h-8 text-xs rounded-full"
                            value={commentInputs[post.id] || ''}
                            onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                          />
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-full flex-shrink-0"
                            onClick={() => handleComment(post.id)}
                          >
                            <Send className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default Community;
