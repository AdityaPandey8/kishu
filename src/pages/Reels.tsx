import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, Play, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Reels = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { reels, toggleReelLike, incrementReelViews, toggleSaveReel, isSavedReel } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const currentReel = reels[currentIndex];

  useEffect(() => {
    if (currentReel) {
      incrementReelViews(currentReel.id);
    }
  }, [currentIndex]);

  const handleDoubleTap = () => {
    if (!user || !currentReel) return;
    if (!currentReel.likes.includes(user.id)) {
      toggleReelLike(currentReel.id, user.id);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleLike = () => {
    if (!user) {
      toast.error('Please login to like');
      return;
    }
    if (currentReel) toggleReelLike(currentReel.id, user.id);
  };

  const handleSave = () => {
    if (!user) {
      toast.error('Please login to save');
      return;
    }
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
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <h1 className="text-white font-bold text-lg">Agri Reels</h1>
        <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/reels/search')}>
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Video Container */}
      <div 
        className="h-full w-full"
        onDoubleClick={handleDoubleTap}
        onTouchStart={(e) => {
          const startY = e.touches[0].clientY;
          const handleTouchEnd = (e: TouchEvent) => {
            const endY = e.changedTouches[0].clientY;
            if (startY - endY > 50) handleScroll('down');
            else if (endY - startY > 50) handleScroll('up');
            document.removeEventListener('touchend', handleTouchEnd);
          };
          document.addEventListener('touchend', handleTouchEnd);
        }}
      >
        <video
          ref={el => videoRefs.current[currentIndex] = el}
          src={currentReel.videoUrl}
          className="h-full w-full object-cover"
          loop
          autoPlay
          muted={isMuted}
          playsInline
        />

        {/* Heart Animation */}
        <AnimatePresence>
          {showHeart && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="h-24 w-24 text-red-500 fill-red-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-40">
        <button onClick={() => navigate(`/creator/${currentReel.creatorId}`)} className="relative">
          <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center border-2 border-white">
            <User className="h-6 w-6 text-white" />
          </div>
        </button>

        <button onClick={handleLike} className="flex flex-col items-center">
          <Heart className={cn('h-8 w-8', isLiked ? 'text-red-500 fill-red-500' : 'text-white')} />
          <span className="text-white text-xs mt-1">{currentReel.likes.length}</span>
        </button>

        <button onClick={() => toast.info('Comments coming soon!')} className="flex flex-col items-center">
          <MessageCircle className="h-8 w-8 text-white" />
          <span className="text-white text-xs mt-1">{currentReel.comments.length}</span>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center">
          <Share2 className="h-8 w-8 text-white" />
          <span className="text-white text-xs mt-1">{currentReel.shares}</span>
        </button>

        <button onClick={handleSave}>
          <Bookmark className={cn('h-8 w-8', isSaved ? 'text-yellow-400 fill-yellow-400' : 'text-white')} />
        </button>

        <button onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
        </button>
      </div>

      {/* Bottom Info */}
      <div className="absolute left-4 right-20 bottom-24 z-40">
        <p className="text-white font-semibold mb-1">@{currentReel.creatorName}</p>
        <p className="text-white/90 text-sm line-clamp-2">{currentReel.caption}</p>
        <div className="flex gap-2 mt-2 flex-wrap">
          {currentReel.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-40">
        {reels.slice(0, 5).map((_, i) => (
          <div key={i} className={cn('w-1 rounded-full transition-all', i === currentIndex ? 'h-4 bg-white' : 'h-1 bg-white/40')} />
        ))}
      </div>

      {/* Bottom Nav Spacer */}
      <div className="h-16" />
    </div>
  );
};

export default Reels;
