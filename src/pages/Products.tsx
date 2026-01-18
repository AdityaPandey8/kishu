import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Package, Edit2, Trash2, Search,
  Filter, IndianRupee, Box
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const categories = ['Fungicide', 'Insecticide', 'Fertilizer', 'Organic', 'Seeds', 'Equipment'];

const Products = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fungicide',
    price: '',
    stock: '',
    description: '',
  });

  const dealerProducts = products.filter(p => p.dealerId === user?.id);
  
  const filteredProducts = dealerProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({ name: '', category: 'Fungicide', price: '', stock: '', description: '' });
    setEditingProduct(null);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price || !formData.stock) {
      toast.error(isHindi ? 'कृपया सभी फ़ील्ड भरें' : 'Please fill all required fields');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
      });
      toast.success(isHindi ? 'उत्पाद अपडेट किया गया' : 'Product updated');
    } else {
      addProduct({
        dealerId: user?.id || '',
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description,
      });
      toast.success(isHindi ? 'उत्पाद जोड़ा गया' : 'Product added');
    }
    
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEdit = (product: typeof products[0]) => {
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
    });
    setEditingProduct(product.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success(isHindi ? 'उत्पाद हटाया गया' : 'Product deleted');
  };

  const totalStock = dealerProducts.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = dealerProducts.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <AppLayout>
      <div className="container px-4 py-4 pb-8">
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
                {isHindi ? 'मेरे उत्पाद' : 'My Products'}
              </h1>
              <p className="text-xs text-muted-foreground">
                {dealerProducts.length} {isHindi ? 'उत्पाद' : 'products'}
              </p>
            </div>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gradient-kishu shadow-kishu">
                <Plus className="h-4 w-4 mr-1" />
                {isHindi ? 'जोड़ें' : 'Add'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct 
                    ? (isHindi ? 'उत्पाद संपादित करें' : 'Edit Product')
                    : (isHindi ? 'नया उत्पाद जोड़ें' : 'Add New Product')
                  }
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder={isHindi ? 'उत्पाद का नाम' : 'Product name'}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl"
                />
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    placeholder={isHindi ? 'कीमत (₹)' : 'Price (₹)'}
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="rounded-xl"
                  />
                  <Input
                    type="number"
                    placeholder={isHindi ? 'स्टॉक' : 'Stock'}
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    className="rounded-xl"
                  />
                </div>
                <Textarea
                  placeholder={isHindi ? 'विवरण' : 'Description'}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-xl"
                />
                <Button 
                  className="w-full rounded-xl gradient-kishu shadow-kishu"
                  onClick={handleSubmit}
                >
                  {editingProduct 
                    ? (isHindi ? 'अपडेट करें' : 'Update')
                    : (isHindi ? 'जोड़ें' : 'Add Product')
                  }
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <Box className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-muted-foreground">{isHindi ? 'कुल स्टॉक' : 'Total Stock'}</span>
            </div>
            <p className="text-xl font-bold text-foreground">{totalStock}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">{isHindi ? 'कुल मूल्य' : 'Total Value'}</span>
            </div>
            <p className="text-xl font-bold text-foreground">₹{totalValue.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4"
        >
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isHindi ? 'उत्पाद खोजें...' : 'Search products...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              )}
            >
              {isHindi ? 'सभी' : 'All'}
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors',
                  activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16"
          >
            <Package className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">
              {isHindi ? 'कोई उत्पाद नहीं मिला' : 'No products found'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 + index * 0.03 }}
                  className="bg-card border border-border rounded-xl p-4 shadow-soft"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <Package className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-semibold text-foreground">₹{product.price}</span>
                        <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                        <span className="text-xs text-green-600">{product.sales} sold</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Products;
