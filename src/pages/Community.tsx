import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, MessageSquare, ThumbsUp, Share2, Plus, 
  ChevronRight, Clock, MapPin, Leaf, Filter
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const mockPosts = [
  {
    id: '1',
    author: 'Ramesh Kumar',
    location: 'Jaipur, RJ',
    time: '2h ago',
    content: 'My wheat crop is showing yellow spots on leaves. Any suggestions?',
    contentHi: 'मेरी गेहूं की फसल में पत्तियों पर पीले धब्बे दिख रहे हैं। कोई सुझाव?',
    image: null,
    likes: 12,
    comments: 5,
    tags: ['Wheat', 'Disease'],
  },
  {
    id: '2',
    author: 'Sunita Devi',
    location: 'Lucknow, UP',
    time: '5h ago',
    content: 'Successfully treated tomato blight using neem oil spray! Sharing my experience.',
    contentHi: 'नीम तेल स्प्रे से टमाटर के ब्लाइट का सफल इलाज किया! अपना अनुभव साझा कर रही हूं।',
    image: null,
    likes: 45,
    comments: 18,
    tags: ['Tomato', 'Success Story'],
  },
  {
    id: '3',
    author: 'Mohan Singh',
    location: 'Bhopal, MP',
    time: '1d ago',
    content: 'What is the best time to sow mustard in central India this year?',
    contentHi: 'इस साल मध्य भारत में सरसों बोने का सबसे अच्छा समय क्या है?',
    image: null,
    likes: 8,
    comments: 12,
    tags: ['Mustard', 'Question'],
  },
];

const Community = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isHindi = i18n.language === 'hi';
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: isHindi ? 'सभी' : 'All' },
    { id: 'questions', label: isHindi ? 'सवाल' : 'Questions' },
    { id: 'tips', label: isHindi ? 'सुझाव' : 'Tips' },
    { id: 'success', label: isHindi ? 'सफलता' : 'Success' },
  ];

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {isHindi ? 'समुदाय' : 'Community'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isHindi ? 'किसानों से जुड़ें और सीखें' : 'Connect and learn from farmers'}
            </p>
          </div>
          <Button className="gradient-kishu shadow-kishu rounded-xl">
            <Plus className="h-4 w-4 mr-1" />
            {isHindi ? 'पोस्ट' : 'Post'}
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {mockPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="bg-card border border-border rounded-2xl p-4 shadow-soft"
            >
              {/* Author */}
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full gradient-kishu flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">
                    {post.author.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{post.author}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3 w-3" /> {post.location}
                    <span>•</span>
                    <Clock className="h-3 w-3" /> {post.time}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-foreground text-sm leading-relaxed mb-3">
                {isHindi ? post.contentHi : post.content}
              </p>

              {/* Tags */}
              <div className="flex gap-2 mb-3">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-sm">{post.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">{post.comments}</span>
                </button>
                <button className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors ml-auto">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Community;
