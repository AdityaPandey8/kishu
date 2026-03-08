import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, Share2, Bookmark, Send,
  Clock, UserPlus, UserCheck, Film
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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

const CommunityVideo = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { 
    posts, toggleLike, addComment, toggleSavePost, isSavedPost,
    incrementPostShares, creatorProfiles, isSubscribed, subscribe, unsubscribe,
    getSubscriberCount
  } = useData();
  const isHindi = i18n.language === 'hi';
  const [commentText, setCommentText] = useState('');

  const post = posts.find(p => p.id === postId);
  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Post not found</p>
      </div>
    );
  }

  const creator = creatorProfiles.find(c => c.userId === post.authorId);
  const isLiked = user ? post.likes.includes(user.id) : false;
  const isSaved = isSavedPost(post.id);
  const following = user ? isSubscribed(post.authorId, user.id) : false;
  const subscriberCount = getSubscriberCount(post.authorId);

  const handleComment = () => {
    if (!user) { toast.error('Please login first'); return; }
    if (!commentText.trim()) return;
    addComment(post.id, { authorId: user.id, authorName: user.name, content: commentText.trim() });
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player */}
      <div className="w-full aspect-video bg-black relative">
        <video
          src={post.videoUrl}
          controls
          autoPlay
          className="w-full h-full"
          poster={post.thumbnailUrl}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-3 left-3 text-white bg-black/40 hover:bg-black/60 rounded-full h-9 w-9"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Video Info */}
      <div className="px-4 py-4 space-y-4">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-lg font-bold text-foreground leading-tight">
            {isHindi && post.contentHi ? post.contentHi : post.content}
          </h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" /> {post.likes.length} likes
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {formatTimeAgo(post.createdAt)}
            </span>
            {post.videoDuration && (
              <span>{formatDuration(post.videoDuration)}</span>
            )}
          </div>
        </motion.div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap">
          {post.tags.map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded-full font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Creator Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3 bg-card border border-border rounded-xl p-3"
        >
          <div 
            className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center cursor-pointer"
            onClick={() => navigate(`/creator/${post.authorId}`)}
          >
            <span className="text-primary font-bold text-lg">{post.authorName.charAt(0)}</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground text-sm">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">
              {subscriberCount} {isHindi ? 'फॉलोअर्स' : 'followers'}
            </p>
          </div>
          {user?.id !== post.authorId && (
            <Button
              size="sm"
              variant={following ? 'outline' : 'default'}
              className={cn('rounded-full', !following && 'gradient-kishu')}
              onClick={() => {
                if (!user) { toast.error('Please login first'); return; }
                following ? unsubscribe(post.authorId, user.id) : subscribe(post.authorId, user.id);
              }}
            >
              {following ? <UserCheck className="h-4 w-4 mr-1" /> : <UserPlus className="h-4 w-4 mr-1" />}
              {following ? (isHindi ? 'फॉलोइंग' : 'Following') : (isHindi ? 'फॉलो' : 'Follow')}
            </Button>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? 'default' : 'outline'}
            size="sm"
            className={cn('rounded-full flex-1', isLiked && 'bg-red-500 hover:bg-red-600 border-red-500')}
            onClick={() => { if (!user) { toast.error('Please login'); return; } toggleLike(post.id, user.id); }}
          >
            <Heart className={cn('h-4 w-4 mr-1', isLiked && 'fill-current')} />
            {post.likes.length}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full flex-1"
            onClick={() => { incrementPostShares(post.id); toast.success('Link copied!'); }}
          >
            <Share2 className="h-4 w-4 mr-1" /> {post.shares}
          </Button>
          <Button
            variant={isSaved ? 'default' : 'outline'}
            size="sm"
            className={cn('rounded-full', isSaved && 'bg-primary')}
            onClick={() => { if (!user) { toast.error('Please login'); return; } toggleSavePost(post.id); }}
          >
            <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
          </Button>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground text-sm">
            {isHindi ? 'कमेंट्स' : 'Comments'} ({post.comments.length})
          </h3>

          {user && (
            <div className="flex gap-2">
              <Input
                placeholder={isHindi ? 'कमेंट करें...' : 'Add a comment...'}
                className="rounded-full text-sm h-9"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button size="icon" className="rounded-full h-9 w-9 flex-shrink-0" onClick={handleComment}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-3">
            {post.comments.map(comment => (
              <div key={comment.id} className="flex gap-2.5">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-muted-foreground">{comment.authorName.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{comment.authorName}</span>{' '}
                    <span className="text-foreground/80">{comment.content}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatTimeAgo(comment.createdAt)}</p>
                </div>
              </div>
            ))}
            {post.comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                {isHindi ? 'पहला कमेंट करें' : 'Be the first to comment'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityVideo;
