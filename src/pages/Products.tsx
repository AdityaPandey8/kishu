import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Package, Edit2, Trash2, Search,
  IndianRupee, Box, ImagePlus, X, Eye, Users, ShoppingCart
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const categories = ['Fungicide', 'Insecticide', 'Fertilizer', 'Organic', 'Seeds', 'Equipment', 'Plants'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const Products = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, orders, customers } = useData();
  const isHindi = i18n.language === 'hi';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: 'Fungicide',
    price: '',
    stock: '',
    description: '',
    image: '',
  });

  const dealerProducts = products.filter(p => p.dealerId === user?.id);
  const dealerOrders = orders.filter(o => o.dealerId === user?.id);
  
  // Compute per-product stats from orders
  const productStats = useMemo(() => {
    const stats: Record<string, { unitsSold: number; revenue: number }> = {};
    dealerOrders.forEach(order => {
      if (order.status === 'delivered' || order.status === 'shipped' || order.status === 'confirmed') {
        order.items.forEach(item => {
          if (!stats[item.productId]) stats[item.productId] = { unitsSold: 0, revenue: 0 };
          stats[item.productId].unitsSold += item.quantity;
          stats[item.productId].revenue += item.quantity * item.price;
        });
      }
    });
    return stats;
  }, [dealerOrders]);

  const filteredProducts = dealerProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalStock = dealerProducts.reduce((acc, p) => acc + p.stock, 0);
  const totalRevenue = useMemo(() => 
    Object.values(productStats).reduce((acc, s) => acc + s.revenue, 0), [productStats]
  );

  const resetForm = () => {
    setFormData({ name: '', category: 'Fungicide', price: '', stock: '', description: '', image: '' });
    setEditingProduct(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      toast.error(isHindi ? 'छवि 500KB से छोटी होनी चाहिए' : 'Image must be under 500KB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
    reader.readAsDataURL(file);
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
        image: formData.image || undefined,
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
        image: formData.image || undefined,
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
      image: product.image || '',
    });
    setEditingProduct(product.id);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.success(isHindi ? 'उत्पाद हटाया गया' : 'Product deleted');
  };

  // Product detail data
  const selectedProduct = dealerProducts.find(p => p.id === selectedProductId);
  const selectedProductOrders = useMemo(() => {
    if (!selectedProductId) return [];
    return dealerOrders.filter(o => o.items.some(i => i.productId === selectedProductId));
  }, [selectedProductId, dealerOrders]);

  const selectedProductBuyers = useMemo(() => {
    if (!selectedProductId) return [];
    const buyerMap: Record<string, { name: string; location: string; totalQty: number; totalSpent: number }> = {};
    selectedProductOrders.forEach(order => {
      const item = order.items.find(i => i.productId === selectedProductId);
      if (!item) return;
      const customer = customers.find(c => c.farmerId === order.farmerId);
      if (!buyerMap[order.farmerId]) {
        buyerMap[order.farmerId] = {
          name: order.farmerName || customer?.farmerName || 'Unknown',
          location: customer?.location || order.shippingAddress.split(',').slice(-2).join(',').trim(),
          totalQty: 0,
          totalSpent: 0,
        };
      }
      buyerMap[order.farmerId].totalQty += item.quantity;
      buyerMap[order.farmerId].totalSpent += item.quantity * item.price;
    });
    return Object.entries(buyerMap).map(([id, data]) => ({ id, ...data }));
  }, [selectedProductId, selectedProductOrders, customers]);

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
            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl" onClick={() => navigate(-1)}>
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
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button className="rounded-xl gradient-kishu shadow-kishu">
                <Plus className="h-4 w-4 mr-1" />
                {isHindi ? 'जोड़ें' : 'Add'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct 
                    ? (isHindi ? 'उत्पाद संपादित करें' : 'Edit Product')
                    : (isHindi ? 'नया उत्पाद जोड़ें' : 'Add New Product')
                  }
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    {isHindi ? 'उत्पाद छवि' : 'Product Image'}
                  </label>
                  {formData.image ? (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-border">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="absolute top-2 right-2 bg-background/80 rounded-full p-1"
                      >
                        <X className="h-4 w-4 text-foreground" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-border cursor-pointer hover:bg-muted/50 transition-colors">
                      <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-xs text-muted-foreground">{isHindi ? 'छवि अपलोड करें (500KB तक)' : 'Upload image (up to 500KB)'}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  )}
                </div>
                <Input
                  placeholder={isHindi ? 'उत्पाद का नाम' : 'Product name'}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="rounded-xl"
                />
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder={isHindi ? 'कीमत (₹)' : 'Price (₹)'} value={formData.price} onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))} className="rounded-xl" />
                  <Input type="number" placeholder={isHindi ? 'स्टॉक' : 'Stock'} value={formData.stock} onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))} className="rounded-xl" />
                </div>
                <Textarea
                  placeholder={isHindi ? 'विवरण' : 'Description'}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="rounded-xl"
                />
                <Button className="w-full rounded-xl gradient-kishu shadow-kishu" onClick={handleSubmit}>
                  {editingProduct ? (isHindi ? 'अपडेट करें' : 'Update') : (isHindi ? 'जोड़ें' : 'Add Product')}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 gap-3 mb-6">
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
              <span className="text-xs text-muted-foreground">{isHindi ? 'कुल राजस्व' : 'Total Revenue'}</span>
            </div>
            <p className="text-xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder={isHindi ? 'उत्पाद खोजें...' : 'Search products...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 rounded-xl" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button onClick={() => setActiveCategory('all')} className={cn('px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors', activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
              {isHindi ? 'सभी' : 'All'}
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors', activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">{isHindi ? 'कोई उत्पाद नहीं मिला' : 'No products found'}</p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => {
                const stats = productStats[product.id] || { unitsSold: 0, revenue: 0 };
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: 0.2 + index * 0.03 }}
                    className="bg-card border border-border rounded-xl p-4 shadow-soft"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="h-14 w-14 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer"
                        onClick={() => setSelectedProductId(product.id)}
                      >
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <Package className="h-7 w-7 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setSelectedProductId(product.id)}>
                        <h3 className="font-medium text-foreground text-sm truncate">{product.name}</h3>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-semibold text-foreground">₹{product.price}</span>
                          <span className="text-xs text-muted-foreground">Stock: {product.stock}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-xs text-green-600">{stats.unitsSold} sold</span>
                          <span className="text-xs font-medium text-primary">₹{stats.revenue.toLocaleString()} revenue</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(product)}>
                          <Edit2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Product Detail Dialog */}
        <Dialog open={!!selectedProductId} onOpenChange={(open) => { if (!open) setSelectedProductId(null); }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedProduct && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    {isHindi ? 'उत्पाद विवरण' : 'Product Details'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-2">
                  {/* Product Info */}
                  <div className="flex gap-3">
                    <div className="h-20 w-20 rounded-xl bg-muted flex-shrink-0 overflow-hidden">
                      {selectedProduct.image ? (
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center"><Package className="h-8 w-8 text-muted-foreground" /></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{selectedProduct.name}</h3>
                      <Badge variant="secondary" className="text-xs mt-1">{selectedProduct.category}</Badge>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-bold text-foreground">₹{selectedProduct.price}</span>
                        <span className="text-xs text-muted-foreground">Stock: {selectedProduct.stock}</span>
                      </div>
                    </div>
                  </div>
                  {selectedProduct.description && (
                    <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>
                  )}

                  {/* Revenue Summary */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-foreground">{(productStats[selectedProduct.id]?.unitsSold || 0)}</p>
                      <p className="text-xs text-muted-foreground">{isHindi ? 'बिक्री' : 'Units Sold'}</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-primary">₹{(productStats[selectedProduct.id]?.revenue || 0).toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{isHindi ? 'राजस्व' : 'Revenue'}</p>
                    </div>
                  </div>

                  {/* Tabs: Orders & Buyers */}
                  <Tabs defaultValue="orders" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="orders" className="flex-1 text-xs gap-1">
                        <ShoppingCart className="h-3 w-3" /> {isHindi ? 'ऑर्डर' : 'Orders'} ({selectedProductOrders.length})
                      </TabsTrigger>
                      <TabsTrigger value="buyers" className="flex-1 text-xs gap-1">
                        <Users className="h-3 w-3" /> {isHindi ? 'खरीदार' : 'Buyers'} ({selectedProductBuyers.length})
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="orders">
                      {selectedProductOrders.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">{isHindi ? 'कोई ऑर्डर नहीं' : 'No orders yet'}</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {selectedProductOrders.map(order => {
                            const item = order.items.find(i => i.productId === selectedProductId)!;
                            return (
                              <div key={order.id} className="bg-muted/30 rounded-lg p-3 text-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-foreground">{order.farmerName || 'Unknown'}</span>
                                  <Badge className={cn('text-[10px] px-1.5 py-0', statusColors[order.status])}>{order.status}</Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>Qty: {item.quantity} × ₹{item.price}</span>
                                  <span className="font-medium text-foreground">₹{(item.quantity * item.price).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                  <span>#{order.id}</span>
                                  <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="buyers">
                      {selectedProductBuyers.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-6">{isHindi ? 'कोई खरीदार नहीं' : 'No buyers yet'}</p>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {selectedProductBuyers.map(buyer => (
                            <div key={buyer.id} className="bg-muted/30 rounded-lg p-3 text-sm flex items-center justify-between">
                              <div>
                                <p className="font-medium text-foreground">{buyer.name}</p>
                                <p className="text-xs text-muted-foreground">{buyer.location}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-semibold text-primary">₹{buyer.totalSpent.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{buyer.totalQty} units</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default Products;
