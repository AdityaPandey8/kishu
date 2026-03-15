import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, ArrowLeft, Search, User, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const Reels = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reels, toggleReelLike, incrementReelViews, toggleSaveReel, isSavedReel, addReelComment } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const touchStartY = useRef(0);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    if (currentReel) {
      incrementReelViews(currentReel.id);
    }
    // Pause all, play current
    videoRefs.current.forEach((v, i) => {
      if (v) {
        if (i === currentIndex) {
          v.currentTime = 0;
          v.play().catch(() => {});
          setIsPlaying(true);
        } else {
          v.pause();
        }
      }
    });
    setVideoProgress(0);
  }, [currentIndex]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRefs.current[currentIndex];
    if (video && video.duration) {
      setVideoProgress((video.currentTime / video.duration) * 100);
    }
  }, [currentIndex]);

  const togglePlayPause = () => {
    const video = videoRefs.current[currentIndex];
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleDoubleTap = () => {
    if (!user || !currentReel) return;
    if (!currentReel.likes.includes(user.id)) {
      toggleReelLike(currentReel.id, user.id);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleLike = () => {
    if (!user) { toast.error('Please login to like'); return; }
    if (currentReel) toggleReelLike(currentReel.id, user.id);
  };

  const handleSave = () => {
    if (!user) { toast.error('Please login to save'); return; }
    if (currentReel) {
      toggleSaveReel(currentReel.id);
      toast.success(isSavedReel(currentReel.id) ? 'Removed from saved' : 'Saved!');
    }
  };

  const handleShare = () => {
    if (currentReel) {
      navigator.clipboard.writeText(`Check out this agri tip!`);
      toast.success('Link copied!');
    }
  };

  const handleAddComment = () => {
    if (!user || !commentText.trim() || !currentReel) return;
    addReelComment(currentReel.id, { userId: user.id, userName: user.name, content: commentText.trim() });
    setCommentText('');
    toast.success('Comment added!');
  };

  const handleScroll = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!currentReel) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <p className="text-white">No reels available</p>
      </div>
    );
  }

  const isLiked = user ? currentReel.likes.includes(user.id) : false;
  const isSaved = currentReel ? isSavedReel(currentReel.id) : false;

  return (
    <div className="h-screen bg-black relative overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 z-50">
        <Progress value={videoProgress} className="h-1 rounded-none bg-white/20 [&>div]:bg-white" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-1 left-0 right-0 z-50 p-3 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
        <Button variant="ghost" size="icon" className="text-white h-10 w-10" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-white font-bold text-lg">Agri Reels</h1>
        <Button variant="ghost" size="icon" className="text-white h-10 w-10" onClick={() => navigate('/reels/search')}>
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Video Container */}
      <div
        className="h-full w-full"
        onClick={togglePlayPause}
        onDoubleClick={handleDoubleTap}
        onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
        onTouchEnd={(e) => {
          const diff = touchStartY.current - e.changedTouches[0].clientY;
          if (diff > 50) handleScroll('down');
          else if (diff < -50) handleScroll('up');
        }}
      >
        {reels.map((reel, i) => (
          <video
            key={reel.id}
            ref={el => { videoRefs.current[i] = el; }}
            src={reel.videoUrl}
            className={cn('absolute inset-0 h-full w-full object-cover transition-opacity duration-300', i === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0')}
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={i === currentIndex ? handleTimeUpdate : undefined}
          />
        ))}

        {/* Pause indicator */}
        <AnimatePresence>
          {!isPlaying && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div className="h-16 w-16 rounded-full bg-black/40 flex items-center justify-center">
                <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Heart Animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <Heart className="h-24 w-24 text-red-500 fill-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Actions */}
      <div className="absolute right-3 bottom-28 flex flex-col items-center gap-5 z-40">
        <button onClick={() => navigate(`/creator/${currentReel.creatorId}`)} className="relative">
          <div className="h-11 w-11 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
            <User className="h-5 w-5 text-white" />
          </div>
        </button>

        <button onClick={handleLike} className="flex flex-col items-center">
          <Heart className={cn('h-7 w-7', isLiked ? 'text-red-500 fill-red-500' : 'text-white')} />
          <span className="text-white text-[10px] mt-0.5">{currentReel.likes.length}</span>
        </button>

        <button onClick={() => setShowComments(true)} className="flex flex-col items-center">
          <MessageCircle className="h-7 w-7 text-white" />
          <span className="text-white text-[10px] mt-0.5">{currentReel.comments.length}</span>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center">
          <Share2 className="h-7 w-7 text-white" />
          <span className="text-white text-[10px] mt-0.5">{currentReel.shares}</span>
        </button>

        <button onClick={handleSave}>
          <Bookmark className={cn('h-7 w-7', isSaved ? 'text-yellow-400 fill-yellow-400' : 'text-white')} />
        </button>

        <button onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX className="h-5 w-5 text-white" /> : <Volume2 className="h-5 w-5 text-white" />}
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-3 right-16 bottom-20 z-40">
        <p className="text-white font-semibold text-sm mb-0.5">@{currentReel.creatorName}</p>
        <p className="text-white/90 text-xs line-clamp-2">{currentReel.caption}</p>
        <div className="flex gap-1.5 mt-1.5 flex-wrap">
          {currentReel.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Vertical navigation dots */}
      <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-40">
        {reels.slice(0, 6).map((_, i) => (
          <div key={i} className={cn('w-1 rounded-full transition-all', i === currentIndex ? 'h-4 bg-white' : 'h-1.5 bg-white/40')} />
        ))}
      </div>

      {/* Comments Sheet */}
      <Sheet open={showComments} onOpenChange={setShowComments}>
        <SheetContent side="bottom" className="h-[60vh] rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="text-sm">Comments ({currentReel.comments.length})</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto space-y-3 mt-3 max-h-[calc(60vh-120px)]">
            {currentReel.comments.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-8">No comments yet. Be the first!</p>
            )}
            {currentReel.comments.map(c => (
              <div key={c.id} className="flex gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground">{c.userName}</p>
                  <p className="text-xs text-muted-foreground">{c.content}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t border-border">
            <Input
              placeholder="Add a comment..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="flex-1 rounded-full text-sm h-9"
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
            />
            <Button size="icon" className="h-9 w-9 rounded-full" onClick={handleAddComment} disabled={!commentText.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Reels;
