import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, MapPin, Phone, MessageSquare, Clock, User, 
  CheckCircle, Send, Package, Truck, HelpCircle,
  Calendar, History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Inquiry, Product } from '@/contexts/DataContext';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface InquiryDetailModalProps {
  inquiry: Inquiry;
  products: Product[];
  onClose: () => void;
  onRespond: (id: string, response: string, products?: string[]) => void;
  onResolve: (id: string) => void;
  onCall: (phone: string) => void;
}

const typeConfig = {
  stock: { label: 'Stock', icon: Package, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  delivery: { label: 'Delivery', icon: Truck, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  general: { label: 'General', icon: HelpCircle, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
};

export const InquiryDetailModal = ({
  inquiry,
  products,
  onClose,
  onRespond,
  onResolve,
  onCall,
}: InquiryDetailModalProps) => {
  const [response, setResponse] = useState(inquiry.response || '');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showProducts, setShowProducts] = useState(false);

  const suggestedProducts = products.slice(0, 3);
  const config = typeConfig[inquiry.type];
  const TypeIcon = config.icon;

  const handleSendResponse = () => {
    if (response.trim()) {
      onRespond(inquiry.id, response, selectedProducts);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const quickResponses = [
    'Thank you for reaching out! The item is currently in stock...',
    'Your order has been shipped and is expected to arrive by...',
    'I\'ll check the availability and get back to you shortly.',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
    >
      <div className="container max-w-lg mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Inquiry Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Status & Type Badges */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={cn('flex items-center gap-1', config.color)}>
            <TypeIcon className="h-3 w-3" /> {config.label}
          </Badge>
          <Badge variant={inquiry.status === 'resolved' ? 'default' : 'secondary'}>
            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
          </Badge>
        </div>

        {/* Farmer Info Card */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{inquiry.farmerName}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {inquiry.location}
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full"
              onClick={() => onCall('1234567890')}
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(inquiry.createdAt), 'MMM d, yyyy')}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              <History className="h-3 w-3" />
              First inquiry
            </span>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-soft">
          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
            <TypeIcon className="h-4 w-4 text-primary" /> {inquiry.subject}
          </h4>
          <p className="text-sm text-muted-foreground">{inquiry.message}</p>
          {inquiry.productName && (
            <p className="text-xs text-primary mt-2 flex items-center gap-1">
              <Package className="h-3 w-3" /> Product: {inquiry.productName}
            </p>
          )}
          {inquiry.orderId && (
            <p className="text-xs text-primary mt-1 flex items-center gap-1">
              <Truck className="h-3 w-3" /> Order: #{inquiry.orderId}
            </p>
          )}
        </div>

        {/* Recommended Products */}
        {inquiry.type === 'stock' && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" /> Suggested Products
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProducts(!showProducts)}
                className="text-xs text-primary"
              >
                {showProducts ? 'Hide' : 'Show All'}
              </Button>
            </div>

            <div className="space-y-2">
              {(showProducts ? products : suggestedProducts).map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    'flex items-center gap-3 p-2 rounded-xl border transition-colors cursor-pointer',
                    selectedProducts.includes(product.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => toggleProduct(product.id)}
                >
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">₹{product.price}</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                  </div>
                  {selectedProducts.includes(product.id) && (
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>

            {selectedProducts.length > 0 && (
              <p className="text-xs text-primary mt-2">
                {selectedProducts.length} product(s) selected
              </p>
            )}
          </div>
        )}

        {/* Response Section */}
        {inquiry.status !== 'resolved' && (
          <div className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-soft">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" /> Your Response
            </h4>

            {/* Quick Responses */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {quickResponses.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => setResponse(qr)}
                  className="px-3 py-1.5 text-xs bg-muted rounded-full whitespace-nowrap hover:bg-muted/80 transition-colors"
                >
                  Template {idx + 1}
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Write your detailed response..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="min-h-[120px] rounded-xl mb-3"
            />

            <div className="flex gap-2">
              <Button
                className="flex-1 rounded-xl gradient-kishu shadow-kishu"
                onClick={handleSendResponse}
                disabled={!response.trim()}
              >
                <Send className="h-4 w-4 mr-2" /> Send Response
              </Button>
              {inquiry.status === 'responded' && (
                <Button
                  variant="outline"
                  className="rounded-xl text-green-600 border-green-200"
                  onClick={() => onResolve(inquiry.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Resolve
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Previous Response */}
        {inquiry.response && inquiry.status === 'resolved' && (
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <h4 className="font-medium text-green-700 dark:text-green-400">Resolved</h4>
            </div>
            <p className="text-sm text-foreground">{inquiry.response}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onCall('1234567890')}
          >
            <Phone className="h-4 w-4 mr-2" /> Call Farmer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
