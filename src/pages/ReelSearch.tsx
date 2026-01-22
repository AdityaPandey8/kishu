import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, User, Play, Heart } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useData } from '@/contexts/DataContext';
import { cn } from '@/lib/utils';

const ReelSearch = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { reels, creatorProfiles, getSubscriberCount } = useData();
  const isHindi = i18n.language === 'hi';

  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'organic farming',
    'wheat cultivation',
    'pest control'
  ]);

  const categories = [
    { id: 'technique', label: isHindi ? 'तकनीक' : 'Technique', emoji: '🔧' },
    { id: 'tips', label: isHindi ? 'टिप्स' : 'Tips', emoji: '💡' },
    { id: 'harvest', label: isHindi ? 'कटाई' : 'Harvest', emoji: '🌾' },
    { id: 'equipment', label: isHindi ? 'उपकरण' : 'Equipment', emoji: '🚜' },
    { id: 'organic', label: isHindi ? 'जैविक' : 'Organic', emoji: '🌱' },
    { id: 'success-story', label: isHindi ? 'सफलता' : 'Success', emoji: '⭐' },
  ];

  // Get unique creators from reels
  const creators = creatorProfiles.filter(cp => cp.isCreator);

  // Filter creators and reels based on search
  const filteredCreators = creators.filter(creator =>
    searchQuery === '' || 
    creator.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredReels = reels.filter(reel =>
    searchQuery === '' ||
    reel.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reel.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reel.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        {/* Search Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={isHindi ? 'क्रिएटर या वीडियो खोजें...' : 'Search creators or videos...'}
              className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-0"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {isHindi ? 'श्रेणियां' : 'Categories'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  variant="outline"
                  className="px-3 py-2 rounded-full cursor-pointer hover:bg-primary/10 hover:border-primary transition-colors"
                  onClick={() => handleSearch(category.label)}
                >
                  <span className="mr-1">{category.emoji}</span>
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recent Searches */}
          {!searchQuery && recentSearches.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {isHindi ? 'हाल की खोज' : 'Recent Searches'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="px-3 py-2 rounded-full cursor-pointer group"
                    onClick={() => handleSearch(search)}
                  >
                    {search}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(search);
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Trending Creators */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              {isHindi ? 'लोकप्रिय क्रिएटर्स' : 'Trending Creators'}
            </h2>
            <div className="space-y-3">
              {(searchQuery ? filteredCreators : creators).slice(0, 5).map((creator, index) => (
                <motion.div
                  key={creator.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => navigate(`/creator/${creator.userId}`)}
                >
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {creator.bio?.split(' ').slice(0, 2).join(' ') || 'Creator'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getSubscriberCount(creator.userId)} {isHindi ? 'फॉलोअर्स' : 'followers'} • {reels.filter(r => r.creatorId === creator.userId).length} {isHindi ? 'वीडियो' : 'videos'}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full">
                    {isHindi ? 'फॉलो' : 'Follow'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search Results - Reels */}
          {searchQuery && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                {isHindi ? 'वीडियो' : 'Videos'} ({filteredReels.length})
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {filteredReels.map((reel, index) => (
                  <motion.div
                    key={reel.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted cursor-pointer group"
                    onClick={() => navigate('/reels', { state: { startReelId: reel.id } })}
                  >
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.caption}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-2">
                        {reel.caption}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-white/80 text-xs">
                        <span className="flex items-center gap-1">
                          <Play className="h-3 w-3" />
                          {reel.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {reel.likes.length}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="h-10 w-10 text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {searchQuery && filteredReels.length === 0 && filteredCreators.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isHindi ? 'कोई परिणाम नहीं मिला' : 'No results found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ReelSearch;
