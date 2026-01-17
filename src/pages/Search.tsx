import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search as SearchIcon, ArrowLeft, Leaf, History, Users, 
  Package, X, Clock, TrendingUp
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const popularSearches = [
  { query: 'Tomato diseases', queryHi: 'टमाटर की बीमारियां' },
  { query: 'Wheat care', queryHi: 'गेहूं की देखभाल' },
  { query: 'Pest control', queryHi: 'कीट नियंत्रण' },
  { query: 'Organic farming', queryHi: 'जैविक खेती' },
];

const Search = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { diagnoses, posts, products } = useData();
  const isHindi = i18n.language === 'hi';
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { diagnoses: [], posts: [], products: [] };
    
    const lowerQuery = query.toLowerCase();
    
    return {
      diagnoses: diagnoses
        .filter(d => 
          d.crop.toLowerCase().includes(lowerQuery) || 
          d.disease.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5),
      posts: posts
        .filter(p => 
          p.content.toLowerCase().includes(lowerQuery) ||
          p.tags.some(t => t.toLowerCase().includes(lowerQuery))
        )
        .slice(0, 5),
      products: products
        .filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5),
    };
  }, [query, diagnoses, posts, products]);

  const hasResults = results.diagnoses.length > 0 || results.posts.length > 0 || results.products.length > 0;

  return (
    <AppLayout hideNav>
      <div className="container px-4 py-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl flex-shrink-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'फसल, बीमारी, उत्पाद खोजें...' : 'Search crops, diseases, products...'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 h-11 rounded-xl"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </motion.div>

        {!query ? (
          <>
            {/* Popular Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                {isHindi ? 'लोकप्रिय खोज' : 'Popular Searches'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(isHindi ? item.queryHi : item.query)}
                    className="px-3 py-1.5 bg-muted rounded-full text-sm text-foreground hover:bg-muted/80 transition-colors"
                  >
                    {isHindi ? item.queryHi : item.query}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Recent Searches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {isHindi ? 'हाल की खोज' : 'Recent Searches'}
              </h2>
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {isHindi ? 'कोई हाल की खोज नहीं' : 'No recent searches'}
                </p>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {!hasResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <SearchIcon className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">
                  {isHindi ? 'कोई परिणाम नहीं मिला' : 'No results found'}
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {/* Diagnoses Results */}
                {results.diagnoses.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <History className="h-4 w-4 text-primary" />
                      {isHindi ? 'निदान' : 'Diagnoses'}
                    </h2>
                    <div className="space-y-2">
                      {results.diagnoses.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => navigate(`/diagnosis/${item.id}`)}
                          className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                            <Leaf className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{item.disease}</p>
                            <p className="text-xs text-muted-foreground">{item.crop} • {item.date}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Posts Results */}
                {results.posts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {isHindi ? 'समुदाय पोस्ट' : 'Community Posts'}
                    </h2>
                    <div className="space-y-2">
                      {results.posts.map((post) => (
                        <button
                          key={post.id}
                          onClick={() => navigate('/community')}
                          className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="h-10 w-10 rounded-xl gradient-kishu flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {post.authorName.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{post.authorName}</p>
                            <p className="text-xs text-muted-foreground truncate">{post.content}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Products Results */}
                {results.products.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4 text-primary" />
                      {isHindi ? 'उत्पाद' : 'Products'}
                    </h2>
                    <div className="space-y-2">
                      {results.products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl"
                        >
                          <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category} • ₹{product.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Search;
