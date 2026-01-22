import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, Video, Image, X, ArrowLeft, Check, 
  Tag, AlignLeft, Folder, Play
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const UploadReel = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addReel } = useData();
  const isHindi = i18n.language === 'hi';

  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { id: 'technique', label: isHindi ? 'तकनीक' : 'Technique' },
    { id: 'tips', label: isHindi ? 'टिप्स' : 'Tips' },
    { id: 'harvest', label: isHindi ? 'कटाई' : 'Harvest' },
    { id: 'equipment', label: isHindi ? 'उपकरण' : 'Equipment' },
    { id: 'organic', label: isHindi ? 'जैविक' : 'Organic' },
    { id: 'success-story', label: isHindi ? 'सफलता की कहानी' : 'Success Story' },
  ];

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error(isHindi ? 'कृपया पहले लॉगिन करें' : 'Please login first');
      return;
    }

    if (!videoUrl.trim()) {
      toast.error(isHindi ? 'कृपया वीडियो URL दर्ज करें' : 'Please enter video URL');
      return;
    }

    if (!caption.trim()) {
      toast.error(isHindi ? 'कृपया कैप्शन दर्ज करें' : 'Please enter caption');
      return;
    }

    if (!category) {
      toast.error(isHindi ? 'कृपया श्रेणी चुनें' : 'Please select category');
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    addReel({
      creatorId: user.id,
      creatorName: user.name,
      videoUrl: videoUrl.trim(),
      thumbnailUrl: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      caption: caption.trim(),
      description: description.trim(),
      tags,
      category: category as any,
      duration: 30, // Default duration
    });

    setIsUploading(false);
    toast.success(isHindi ? 'वीडियो सफलतापूर्वक अपलोड हो गया!' : 'Video uploaded successfully!');
    navigate('/creator-studio');
  };

  // Sample video URLs for demo
  const sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => navigate('/creator-studio')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-foreground">
                {isHindi ? 'वीडियो अपलोड करें' : 'Upload Video'}
              </h1>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isUploading || !videoUrl || !caption || !category}
              className="rounded-xl gradient-kishu"
            >
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Upload className="h-4 w-4" />
                </motion.div>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  {isHindi ? 'पोस्ट करें' : 'Post'}
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Video Upload Section */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Video className="h-4 w-4 text-primary" />
              {isHindi ? 'वीडियो URL' : 'Video URL'}
            </Label>
            <Input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/video.mp4"
              className="rounded-xl"
            />
            <p className="text-xs text-muted-foreground">
              {isHindi ? 'डेमो के लिए: नीचे से एक सैंपल वीडियो चुनें' : 'For demo: Pick a sample video below'}
            </p>
            <div className="flex flex-wrap gap-2">
              {sampleVideos.map((url, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setVideoUrl(url)}
                  className={cn(
                    'rounded-full text-xs',
                    videoUrl === url && 'bg-primary/10 border-primary'
                  )}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Sample {index + 1}
                </Button>
              ))}
            </div>
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[9/16] max-w-[200px] mx-auto rounded-xl overflow-hidden bg-muted"
            >
              <video
                src={videoUrl}
                className="w-full h-full object-cover"
                controls
                muted
              />
            </motion.div>
          )}

          {/* Thumbnail */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Image className="h-4 w-4 text-primary" />
              {isHindi ? 'थंबनेल URL (वैकल्पिक)' : 'Thumbnail URL (Optional)'}
            </Label>
            <Input
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
              className="rounded-xl"
            />
          </div>

          {/* Caption */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <AlignLeft className="h-4 w-4 text-primary" />
              {isHindi ? 'कैप्शन' : 'Caption'}
            </Label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder={isHindi ? 'अपने वीडियो का कैप्शन लिखें...' : 'Write a caption for your video...'}
              className="rounded-xl"
              maxLength={150}
            />
            <p className="text-xs text-muted-foreground text-right">
              {caption.length}/150
            </p>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label>{isHindi ? 'विवरण (वैकल्पिक)' : 'Description (Optional)'}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={isHindi ? 'विस्तृत विवरण जोड़ें...' : 'Add detailed description...'}
              className="rounded-xl min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500
            </p>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-primary" />
              {isHindi ? 'श्रेणी' : 'Category'}
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={isHindi ? 'श्रेणी चुनें' : 'Select category'} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              {isHindi ? 'टैग्स' : 'Tags'} ({tags.length}/5)
            </Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder={isHindi ? 'टैग जोड़ें...' : 'Add tag...'}
                className="rounded-xl flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button
                onClick={handleAddTag}
                disabled={!tagInput.trim() || tags.length >= 5}
                variant="outline"
                className="rounded-xl"
              >
                {isHindi ? 'जोड़ें' : 'Add'}
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 rounded-full"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UploadReel;
