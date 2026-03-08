import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AppLayout } from '@/components/layout/AppLayout';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, FileText, Play, Trash2, Eye, MessageSquare, Heart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const AdminContent = () => {
  const { i18n } = useTranslation();
  const { posts, reels, deletePost, deleteReel } = useData();
  const navigate = useNavigate();
  const isHindi = i18n.language === 'hi';
  const [tab, setTab] = useState<'posts' | 'reels'>('posts');
  const [search, setSearch] = useState('');

  const filteredPosts = posts.filter(p => !search || p.content.toLowerCase().includes(search.toLowerCase()) || p.authorName.toLowerCase().includes(search.toLowerCase()));
  const filteredReels = reels.filter(r => !search || r.caption.toLowerCase().includes(search.toLowerCase()) || r.creatorName.toLowerCase().includes(search.toLowerCase()));

  const handleDeletePost = (id: string) => {
    deletePost(id);
    toast.success('Post deleted');
  };

  const handleDeleteReel = (id: string) => {
    deleteReel(id);
    toast.success('Reel deleted');
  };

  return (
    <AppLayout>
      <motion.div className="container px-4 py-6 space-y-4 pb-24" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-xl font-bold text-foreground">{isHindi ? 'सामग्री प्रबंधन' : 'Content Moderation'}</h1>
        </div>

        <div className="flex gap-2">
          <Button variant={tab === 'posts' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs" onClick={() => setTab('posts')}>
            <FileText className="h-3.5 w-3.5 mr-1" /> Posts ({posts.length})
          </Button>
          <Button variant={tab === 'reels' ? 'default' : 'outline'} size="sm" className="rounded-full text-xs" onClick={() => setTab('reels')}>
            <Play className="h-3.5 w-3.5 mr-1" /> Reels ({reels.length})
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search content..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 rounded-xl" />
        </div>

        {tab === 'posts' && (
          <div className="space-y-3">
            {filteredPosts.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No posts found</p>
              </div>
            )}
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{post.authorName}</p>
                    <p className="text-[10px] text-muted-foreground">{post.location} • {post.createdAt}</p>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">{post.type}</span>
                </div>
                <p className="text-xs text-foreground line-clamp-3">{post.content}</p>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {post.likes.length}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {post.comments.length}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.shares}</span>
                </div>
                <Button variant="destructive" size="sm" className="text-xs rounded-lg w-full" onClick={() => handleDeletePost(post.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete Post
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {tab === 'reels' && (
          <div className="space-y-3">
            {filteredReels.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Play className="h-10 w-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No reels found</p>
              </div>
            )}
            {filteredReels.map((reel, i) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{reel.creatorName}</p>
                    <p className="text-[10px] text-muted-foreground">{reel.category} • {reel.createdAt}</p>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{reel.duration}s</span>
                </div>
                <p className="text-xs text-foreground">{reel.caption}</p>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart className="h-3 w-3" /> {reel.likes.length}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {reel.comments.length}</span>
                  <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {reel.views}</span>
                </div>
                <Button variant="destructive" size="sm" className="text-xs rounded-lg w-full" onClick={() => handleDeleteReel(reel.id)}>
                  <Trash2 className="h-3 w-3 mr-1" /> Delete Reel
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default AdminContent;
