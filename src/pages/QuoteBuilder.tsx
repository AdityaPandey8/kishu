import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Minus, Trash2, Send, Copy, CheckCircle,
  Package, IndianRupee, Percent, Calendar, User, Save
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useData, Product } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QuoteItem {
  product: Product;
  quantity: number;
}

const QuoteBuilder = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useData();
  const isHindi = i18n.language === 'hi';

  const dealerProducts = products.filter(p => p.dealerId === user?.id);

  const [selectedItems, setSelectedItems] = useState<QuoteItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [notes, setNotes] = useState('');
  const [validDays, setValidDays] = useState(7);
  const [showProductSelector, setShowProductSelector] = useState(false);

  const addProduct = (product: Product) => {
    const existing = selectedItems.find(item => item.product.id === product.id);
    if (existing) {
      setSelectedItems(prev =>
        prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems(prev => [...prev, { product, quantity: 1 }]);
    }
    setShowProductSelector(false);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setSelectedItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, Math.min(item.product.stock, item.quantity + delta));
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (productId: string) => {
    setSelectedItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  const handleSendQuote = () => {
    if (selectedItems.length === 0) {
      toast.error(isHindi ? 'कृपया उत्पाद जोड़ें' : 'Please add products');
      return;
    }
    if (!customerName.trim()) {
      toast.error(isHindi ? 'कृपया ग्राहक का नाम दर्ज करें' : 'Please enter customer name');
      return;
    }

    // In a real app, this would send the quote
    toast.success(isHindi ? 'कोटेशन भेजी गई' : 'Quote sent successfully');
    navigate(-1);
  };

  const handleCopyQuote = () => {
    const quoteText = `
Quote for ${customerName}
${selectedItems.map(i => `${i.product.name} x${i.quantity} = ₹${i.product.price * i.quantity}`).join('\n')}
Subtotal: ₹${subtotal}
Discount: ${discount}% (-₹${discountAmount})
Total: ₹${total}
Valid for ${validDays} days
${notes ? `Notes: ${notes}` : ''}
    `.trim();

    navigator.clipboard.writeText(quoteText);
    toast.success(isHindi ? 'कोटेशन कॉपी हुई' : 'Quote copied to clipboard');
  };

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {isHindi ? 'नई कोटेशन' : 'New Quote'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {isHindi ? 'ग्राहक के लिए कोटेशन बनाएं' : 'Create quote for customer'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-soft"
        >
          <div className="flex items-center gap-2 mb-3">
            <User className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">
              {isHindi ? 'ग्राहक जानकारी' : 'Customer Info'}
            </h3>
          </div>
          <Input
            placeholder={isHindi ? 'ग्राहक का नाम' : 'Customer name'}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="rounded-xl"
          />
        </motion.div>

        {/* Selected Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card border border-border rounded-2xl p-4 mb-4 shadow-soft"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-foreground">
                {isHindi ? 'उत्पाद' : 'Products'}
              </h3>
            </div>
            <Button
              size="sm"
              className="rounded-xl gradient-kishu"
              onClick={() => setShowProductSelector(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> {isHindi ? 'जोड़ें' : 'Add'}
            </Button>
          </div>

          {selectedItems.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-2 opacity-40" />
              <p className="text-sm">{isHindi ? 'कोई उत्पाद नहीं जोड़ा' : 'No products added'}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {selectedItems.map((item) => (
                  <motion.div
                    key={item.product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-2 bg-muted/50 rounded-xl"
                  >
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ₹{item.product.price} x {item.quantity} = ₹{item.product.price * item.quantity}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.product.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Discount & Validity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-3 mb-4"
        >
          <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <Percent className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{isHindi ? 'छूट' : 'Discount'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="rounded-xl text-center"
                min={0}
                max={100}
              />
              <span className="text-muted-foreground">%</span>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{isHindi ? 'वैधता' : 'Valid for'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={validDays}
                onChange={(e) => setValidDays(Math.max(1, Number(e.target.value)))}
                className="rounded-xl text-center"
                min={1}
              />
              <span className="text-muted-foreground text-sm">{isHindi ? 'दिन' : 'days'}</span>
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4"
        >
          <Textarea
            placeholder={isHindi ? 'अतिरिक्त नोट्स...' : 'Additional notes...'}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded-xl"
          />
        </motion.div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <IndianRupee className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-foreground">{isHindi ? 'सारांश' : 'Summary'}</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{isHindi ? 'उप-योग' : 'Subtotal'}</span>
              <span className="font-medium">₹{subtotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{isHindi ? 'छूट' : 'Discount'} ({discount}%)</span>
                <span>-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="font-semibold">{isHindi ? 'कुल' : 'Total'}</span>
              <span className="text-lg font-bold text-primary">₹{total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex gap-3"
        >
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={handleCopyQuote}
            disabled={selectedItems.length === 0}
          >
            <Copy className="h-4 w-4 mr-2" /> {isHindi ? 'कॉपी' : 'Copy'}
          </Button>
          <Button
            className="flex-1 rounded-xl gradient-kishu shadow-kishu"
            onClick={handleSendQuote}
          >
            <Send className="h-4 w-4 mr-2" /> {isHindi ? 'भेजें' : 'Send Quote'}
          </Button>
        </motion.div>

        {/* Product Selector Modal */}
        <AnimatePresence>
          {showProductSelector && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto"
            >
              <div className="container max-w-lg mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">{isHindi ? 'उत्पाद चुनें' : 'Select Product'}</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowProductSelector(false)}>
                    ✕
                  </Button>
                </div>
                <div className="space-y-2">
                  {dealerProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => addProduct(product)}
                      className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category} • Stock: {product.stock}</p>
                      </div>
                      <p className="font-semibold text-primary">₹{product.price}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default QuoteBuilder;
