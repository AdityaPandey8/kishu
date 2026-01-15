import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Loader2, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Scan = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleGalleryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulate analysis - will be replaced with actual AI call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    navigate('/diagnosis/new');
  };

  const handleRetake = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AppLayout>
      <div className="container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">{t('scan.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('scan.instructions')}</p>
        </motion.div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!selectedImage ? (
            <motion.div
              key="capture"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Camera Preview Area */}
              <div className="aspect-[4/3] rounded-2xl bg-muted border-2 border-dashed border-border flex items-center justify-center">
                <div className="text-center p-6">
                  <Camera className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {t('scan.instructions')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleCameraCapture}
                  size="lg"
                  className="h-14 rounded-xl gradient-kishu shadow-kishu"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  {t('scan.takePhoto')}
                </Button>
                <Button
                  onClick={handleGalleryUpload}
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-xl"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  {t('scan.uploadPhoto')}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Image Preview */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={selectedImage}
                  alt="Selected crop"
                  className="w-full h-full object-cover"
                />
                {!isAnalyzing && (
                  <button
                    onClick={handleRetake}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}

                {/* Analyzing Overlay */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles className="h-12 w-12 text-white mb-4" />
                      </motion.div>
                      <p className="text-white font-medium">{t('scan.analyzing')}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleRetake}
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-xl"
                  disabled={isAnalyzing}
                >
                  {t('scan.retake')}
                </Button>
                <Button
                  onClick={handleAnalyze}
                  size="lg"
                  className="h-14 rounded-xl gradient-kishu shadow-kishu"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      {t('scan.analyze')}
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default Scan;
