import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Types
export interface Diagnosis {
  id: string;
  userId: string;
  crop: string;
  disease: string;
  severity: 'none' | 'low' | 'medium' | 'high';
  confidence: number;
  image?: string;
  date: string;
  treatment?: string;
  bookmarked?: boolean;
}

export interface Product {
  id: string;
  dealerId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image?: string;
  sales: number;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  farmerId: string;
  farmerName: string;
  dealerId: string;
  crop: string;
  issue: string;
  location: string;
  status: 'pending' | 'responded' | 'resolved';
  urgent: boolean;
  createdAt: string;
  response?: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  location: string;
  content: string;
  contentHi?: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'weather' | 'disease' | 'inquiry' | 'system' | 'community';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface PlatformUser {
  id: string;
  email: string;
  name: string;
  role: 'farmer' | 'dealer' | 'admin';
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  lastActive: string;
  location?: string;
}

// CRM Types
export interface Customer {
  id: string;
  farmerId: string;
  dealerId: string;
  farmerName: string;
  phone: string;
  email: string;
  location: string;
  crops: string[];
  firstContact: string;
  lastContact: string;
  totalInquiries: number;
  totalPurchases: number;
  status: 'active' | 'inactive' | 'vip';
  isFavorite: boolean;
}

export interface CustomerNote {
  id: string;
  customerId: string;
  dealerId: string;
  content: string;
  createdAt: string;
  type: 'general' | 'followup' | 'issue' | 'purchase';
}

export interface FollowUpReminder {
  id: string;
  customerId: string;
  dealerId: string;
  customerName: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface DataContextType {
  // Diagnoses
  diagnoses: Diagnosis[];
  addDiagnosis: (diagnosis: Omit<Diagnosis, 'id' | 'date'>) => Diagnosis;
  deleteDiagnosis: (id: string) => void;
  toggleBookmark: (id: string) => void;
  
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'sales' | 'createdAt'>) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  // Inquiries
  inquiries: Inquiry[];
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status'], response?: string) => void;
  
  // Posts
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => void;
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  deletePost: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadCount: number;
  
  // Platform Users (Admin)
  platformUsers: PlatformUser[];
  updateUserStatus: (id: string, status: PlatformUser['status']) => void;
  updateUserRole: (id: string, role: PlatformUser['role']) => void;

  // Customers (CRM)
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'firstContact' | 'lastContact' | 'totalInquiries' | 'totalPurchases'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  toggleFavoriteCustomer: (id: string) => void;
  getCustomerById: (id: string) => Customer | undefined;

  // Customer Notes
  customerNotes: CustomerNote[];
  addCustomerNote: (note: Omit<CustomerNote, 'id' | 'createdAt'>) => void;
  deleteCustomerNote: (id: string) => void;
  getNotesForCustomer: (customerId: string) => CustomerNote[];

  // Follow-up Reminders
  followUpReminders: FollowUpReminder[];
  addFollowUpReminder: (reminder: Omit<FollowUpReminder, 'id' | 'createdAt' | 'completed'>) => void;
  completeFollowUp: (id: string) => void;
  deleteFollowUp: (id: string) => void;
  getRemindersForDealer: (dealerId: string) => FollowUpReminder[];
  getPendingRemindersCount: (dealerId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// Initial seed data
const seedDiagnoses: Diagnosis[] = [
  { id: 'd1', userId: 'farmer-001', crop: 'Tomato', disease: 'Early Blight', severity: 'medium', confidence: 87, date: 'Jan 15, 2026', treatment: 'Apply fungicide' },
  { id: 'd2', userId: 'farmer-001', crop: 'Rice', disease: 'Healthy', severity: 'none', confidence: 95, date: 'Jan 14, 2026' },
  { id: 'd3', userId: 'farmer-001', crop: 'Wheat', disease: 'Leaf Rust', severity: 'high', confidence: 92, date: 'Jan 12, 2026', treatment: 'Apply propiconazole' },
  { id: 'd4', userId: 'farmer-001', crop: 'Cotton', disease: 'Healthy', severity: 'none', confidence: 98, date: 'Jan 10, 2026' },
  { id: 'd5', userId: 'farmer-001', crop: 'Potato', disease: 'Late Blight', severity: 'high', confidence: 89, date: 'Jan 8, 2026', treatment: 'Remove infected plants' },
];

const seedProducts: Product[] = [
  { id: 'p1', dealerId: 'dealer-001', name: 'Mancozeb 75% WP', category: 'Fungicide', price: 450, stock: 120, description: 'Broad-spectrum fungicide', sales: 45, createdAt: 'Jan 1, 2026' },
  { id: 'p2', dealerId: 'dealer-001', name: 'Neem Oil Organic', category: 'Organic', price: 320, stock: 85, description: 'Natural pest control', sales: 72, createdAt: 'Jan 1, 2026' },
  { id: 'p3', dealerId: 'dealer-001', name: 'DAP Fertilizer', category: 'Fertilizer', price: 1200, stock: 200, description: 'Diammonium phosphate', sales: 38, createdAt: 'Jan 1, 2026' },
  { id: 'p4', dealerId: 'dealer-001', name: 'Urea 46%', category: 'Fertilizer', price: 800, stock: 300, description: 'Nitrogen fertilizer', sales: 56, createdAt: 'Jan 1, 2026' },
  { id: 'p5', dealerId: 'dealer-001', name: 'Carbendazim 50%', category: 'Fungicide', price: 380, stock: 90, description: 'Systemic fungicide', sales: 29, createdAt: 'Jan 1, 2026' },
  { id: 'p6', dealerId: 'dealer-001', name: 'Imidacloprid', category: 'Insecticide', price: 520, stock: 75, description: 'Systemic insecticide', sales: 34, createdAt: 'Jan 1, 2026' },
  { id: 'p7', dealerId: 'dealer-001', name: 'Potash MOP', category: 'Fertilizer', price: 950, stock: 150, description: 'Muriate of potash', sales: 41, createdAt: 'Jan 1, 2026' },
  { id: 'p8', dealerId: 'dealer-001', name: 'Micronutrient Mix', category: 'Fertilizer', price: 280, stock: 110, description: 'Essential micronutrients', sales: 63, createdAt: 'Jan 1, 2026' },
];

const seedInquiries: Inquiry[] = [
  { id: 'i1', farmerId: 'farmer-001', farmerName: 'Ramesh Kumar', dealerId: 'dealer-001', crop: 'Tomato - Early Blight', issue: 'Need fungicide recommendation', location: 'Jaipur, RJ', status: 'pending', urgent: true, createdAt: new Date().toISOString() },
  { id: 'i2', farmerId: 'f2', farmerName: 'Sunil Yadav', dealerId: 'dealer-001', crop: 'Rice - Leaf Rust', issue: 'Looking for organic solution', location: 'Lucknow, UP', status: 'pending', urgent: false, createdAt: new Date().toISOString() },
  { id: 'i3', farmerId: 'f3', farmerName: 'Priya Sharma', dealerId: 'dealer-001', crop: 'Cotton - Pest Attack', issue: 'Urgent pest control needed', location: 'Ahmedabad, GJ', status: 'responded', urgent: true, createdAt: new Date().toISOString(), response: 'Recommended Imidacloprid spray' },
  { id: 'i4', farmerId: 'f4', farmerName: 'Mohan Singh', dealerId: 'dealer-001', crop: 'Wheat - Nutrient Deficiency', issue: 'Yellowing leaves', location: 'Bhopal, MP', status: 'resolved', urgent: false, createdAt: new Date().toISOString() },
  { id: 'i5', farmerId: 'f5', farmerName: 'Geeta Devi', dealerId: 'dealer-001', crop: 'Potato - Late Blight', issue: 'Spreading disease', location: 'Patna, BR', status: 'resolved', urgent: true, createdAt: new Date().toISOString() },
];

const seedPosts: Post[] = [
  { id: 'post1', authorId: 'farmer-001', authorName: 'Ramesh Kumar', location: 'Jaipur, RJ', content: 'My wheat crop is showing yellow spots on leaves. Any suggestions?', contentHi: 'मेरी गेहूं की फसल में पत्तियों पर पीले धब्बे दिख रहे हैं। कोई सुझाव?', tags: ['Wheat', 'Disease'], likes: ['f2', 'f3'], comments: [], createdAt: new Date().toISOString() },
  { id: 'post2', authorId: 'f2', authorName: 'Sunita Devi', location: 'Lucknow, UP', content: 'Successfully treated tomato blight using neem oil spray! Sharing my experience.', contentHi: 'नीम तेल स्प्रे से टमाटर के ब्लाइट का सफल इलाज किया!', tags: ['Tomato', 'Success Story'], likes: ['farmer-001', 'f3', 'f4'], comments: [], createdAt: new Date().toISOString() },
  { id: 'post3', authorId: 'f3', authorName: 'Mohan Singh', location: 'Bhopal, MP', content: 'What is the best time to sow mustard in central India this year?', contentHi: 'इस साल मध्य भारत में सरसों बोने का सबसे अच्छा समय क्या है?', tags: ['Mustard', 'Question'], likes: [], comments: [], createdAt: new Date().toISOString() },
];

const seedNotifications: Notification[] = [
  { id: 'n1', userId: 'farmer-001', type: 'weather', title: 'Rain Alert', message: 'Heavy rain expected in your area tomorrow', read: false, createdAt: new Date().toISOString() },
  { id: 'n2', userId: 'farmer-001', type: 'disease', title: 'Disease Alert', message: 'Early blight reported in nearby farms', read: false, createdAt: new Date().toISOString() },
  { id: 'n3', userId: 'dealer-001', type: 'inquiry', title: 'New Inquiry', message: 'Ramesh Kumar is asking about fungicides', read: false, createdAt: new Date().toISOString() },
  { id: 'n4', userId: 'admin-001', type: 'system', title: 'New Registration', message: '15 new farmers registered today', read: true, createdAt: new Date().toISOString() },
];

const seedPlatformUsers: PlatformUser[] = [
  { id: 'farmer-001', email: 'farmer@kishu.com', name: 'Ramesh Kumar', role: 'farmer', status: 'active', createdAt: 'Jan 1, 2026', lastActive: 'Today', location: 'Jaipur, RJ' },
  { id: 'dealer-001', email: 'dealer@kishu.com', name: 'Sunil Agro Supplies', role: 'dealer', status: 'active', createdAt: 'Jan 1, 2026', lastActive: 'Today', location: 'Delhi' },
  { id: 'admin-001', email: 'admin@kishu.com', name: 'Admin User', role: 'admin', status: 'active', createdAt: 'Dec 1, 2025', lastActive: 'Today', location: 'Mumbai' },
  { id: 'f2', email: 'sunita@email.com', name: 'Sunita Devi', role: 'farmer', status: 'active', createdAt: 'Jan 5, 2026', lastActive: 'Yesterday', location: 'Lucknow, UP' },
  { id: 'f3', email: 'mohan@email.com', name: 'Mohan Singh', role: 'farmer', status: 'active', createdAt: 'Jan 8, 2026', lastActive: '2 days ago', location: 'Bhopal, MP' },
  { id: 'd2', email: 'greenfarmsupply@email.com', name: 'Green Farm Supplies', role: 'dealer', status: 'pending', createdAt: 'Jan 12, 2026', lastActive: 'Jan 12, 2026', location: 'Pune, MH' },
  { id: 'd3', email: 'agrisolutions@email.com', name: 'Agri Solutions Pvt Ltd', role: 'dealer', status: 'pending', createdAt: 'Jan 14, 2026', lastActive: 'Jan 14, 2026', location: 'Mumbai, MH' },
];

// CRM Seed Data
const seedCustomers: Customer[] = [
  {
    id: 'c1',
    farmerId: 'farmer-001',
    dealerId: 'dealer-001',
    farmerName: 'Ramesh Kumar',
    phone: '+91 9876543210',
    email: 'ramesh@email.com',
    location: 'Jaipur, RJ',
    crops: ['Tomato', 'Wheat', 'Cotton'],
    firstContact: '2025-12-15',
    lastContact: '2026-01-15',
    totalInquiries: 3,
    totalPurchases: 2,
    status: 'vip',
    isFavorite: true,
  },
  {
    id: 'c2',
    farmerId: 'f2',
    dealerId: 'dealer-001',
    farmerName: 'Sunil Yadav',
    phone: '+91 9876543211',
    email: 'sunil@email.com',
    location: 'Lucknow, UP',
    crops: ['Rice', 'Sugarcane'],
    firstContact: '2026-01-05',
    lastContact: '2026-01-16',
    totalInquiries: 1,
    totalPurchases: 0,
    status: 'active',
    isFavorite: false,
  },
  {
    id: 'c3',
    farmerId: 'f3',
    dealerId: 'dealer-001',
    farmerName: 'Priya Sharma',
    phone: '+91 9876543212',
    email: 'priya@email.com',
    location: 'Ahmedabad, GJ',
    crops: ['Cotton', 'Groundnut'],
    firstContact: '2025-11-20',
    lastContact: '2026-01-10',
    totalInquiries: 5,
    totalPurchases: 4,
    status: 'vip',
    isFavorite: true,
  },
  {
    id: 'c4',
    farmerId: 'f4',
    dealerId: 'dealer-001',
    farmerName: 'Mohan Singh',
    phone: '+91 9876543213',
    email: 'mohan@email.com',
    location: 'Bhopal, MP',
    crops: ['Wheat', 'Soybean'],
    firstContact: '2026-01-08',
    lastContact: '2026-01-14',
    totalInquiries: 2,
    totalPurchases: 1,
    status: 'active',
    isFavorite: false,
  },
  {
    id: 'c5',
    farmerId: 'f5',
    dealerId: 'dealer-001',
    farmerName: 'Geeta Devi',
    phone: '+91 9876543214',
    email: 'geeta@email.com',
    location: 'Patna, BR',
    crops: ['Potato', 'Maize'],
    firstContact: '2025-12-01',
    lastContact: '2026-01-12',
    totalInquiries: 4,
    totalPurchases: 3,
    status: 'active',
    isFavorite: false,
  },
];

const seedCustomerNotes: CustomerNote[] = [
  {
    id: 'cn1',
    customerId: 'c1',
    dealerId: 'dealer-001',
    content: 'Prefers organic products. Budget conscious but willing to pay for quality.',
    createdAt: '2026-01-10T10:00:00Z',
    type: 'general',
  },
  {
    id: 'cn2',
    customerId: 'c1',
    dealerId: 'dealer-001',
    content: 'Follow up on fungicide effectiveness after 2 weeks.',
    createdAt: '2026-01-15T14:30:00Z',
    type: 'followup',
  },
  {
    id: 'cn3',
    customerId: 'c3',
    dealerId: 'dealer-001',
    content: 'Manages 50 acres. Key customer for bulk orders.',
    createdAt: '2026-01-05T09:00:00Z',
    type: 'general',
  },
  {
    id: 'cn4',
    customerId: 'c5',
    dealerId: 'dealer-001',
    content: 'Had issue with late blight. Resolved with Mancozeb treatment.',
    createdAt: '2026-01-12T16:00:00Z',
    type: 'issue',
  },
];

const seedFollowUpReminders: FollowUpReminder[] = [
  {
    id: 'fr1',
    customerId: 'c1',
    dealerId: 'dealer-001',
    customerName: 'Ramesh Kumar',
    title: 'Check on wheat treatment',
    description: 'Follow up on the fungicide recommendation for early blight',
    dueDate: '2026-01-20',
    completed: false,
    priority: 'high',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'fr2',
    customerId: 'c3',
    dealerId: 'dealer-001',
    customerName: 'Priya Sharma',
    title: 'Bulk order discussion',
    description: 'Discuss fertilizer requirements for next season',
    dueDate: '2026-01-22',
    completed: false,
    priority: 'medium',
    createdAt: '2026-01-14T11:00:00Z',
  },
  {
    id: 'fr3',
    customerId: 'c2',
    dealerId: 'dealer-001',
    customerName: 'Sunil Yadav',
    title: 'Send product catalog',
    description: 'Share organic product options for rice cultivation',
    dueDate: '2026-01-19',
    completed: false,
    priority: 'low',
    createdAt: '2026-01-16T08:00:00Z',
  },
];

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [diagnoses, setDiagnoses] = useLocalStorage<Diagnosis[]>('kishu-diagnoses', seedDiagnoses);
  const [products, setProducts] = useLocalStorage<Product[]>('kishu-products', seedProducts);
  const [inquiries, setInquiries] = useLocalStorage<Inquiry[]>('kishu-inquiries', seedInquiries);
  const [posts, setPosts] = useLocalStorage<Post[]>('kishu-posts', seedPosts);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('kishu-notifications', seedNotifications);
  const [platformUsers, setPlatformUsers] = useLocalStorage<PlatformUser[]>('kishu-platform-users', seedPlatformUsers);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('kishu-customers', seedCustomers);
  const [customerNotes, setCustomerNotes] = useLocalStorage<CustomerNote[]>('kishu-customer-notes', seedCustomerNotes);
  const [followUpReminders, setFollowUpReminders] = useLocalStorage<FollowUpReminder[]>('kishu-followups', seedFollowUpReminders);

  // Diagnoses
  const addDiagnosis = useCallback((diagnosis: Omit<Diagnosis, 'id' | 'date'>): Diagnosis => {
    const newDiagnosis: Diagnosis = {
      ...diagnosis,
      id: `d${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setDiagnoses(prev => [newDiagnosis, ...prev]);
    return newDiagnosis;
  }, [setDiagnoses]);

  const deleteDiagnosis = useCallback((id: string) => {
    setDiagnoses(prev => prev.filter(d => d.id !== id));
  }, [setDiagnoses]);

  const toggleBookmark = useCallback((id: string) => {
    setDiagnoses(prev => prev.map(d => 
      d.id === id ? { ...d, bookmarked: !d.bookmarked } : d
    ));
  }, [setDiagnoses]);

  // Products
  const addProduct = useCallback((product: Omit<Product, 'id' | 'sales' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: `p${Date.now()}`,
      sales: 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setProducts(prev => [newProduct, ...prev]);
  }, [setProducts]);

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, [setProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, [setProducts]);

  // Inquiries
  const addInquiry = useCallback((inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `i${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setInquiries(prev => [newInquiry, ...prev]);
  }, [setInquiries]);

  const updateInquiryStatus = useCallback((id: string, status: Inquiry['status'], response?: string) => {
    setInquiries(prev => prev.map(i => 
      i.id === id ? { ...i, status, response: response || i.response } : i
    ));
  }, [setInquiries]);

  // Posts
  const addPost = useCallback((post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    const newPost: Post = {
      ...post,
      id: `post${Date.now()}`,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => [newPost, ...prev]);
  }, [setPosts]);

  const toggleLike = useCallback((postId: string, userId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const likes = p.likes.includes(userId) 
        ? p.likes.filter(id => id !== userId)
        : [...p.likes, userId];
      return { ...p, likes };
    }));
  }, [setPosts]);

  const addComment = useCallback((postId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: `c${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
    ));
  }, [setPosts]);

  const deletePost = useCallback((id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  }, [setPosts]);

  // Notifications
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, [setNotifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  }, [setNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, [setNotifications]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, [setNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Platform Users
  const updateUserStatus = useCallback((id: string, status: PlatformUser['status']) => {
    setPlatformUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  }, [setPlatformUsers]);

  const updateUserRole = useCallback((id: string, role: PlatformUser['role']) => {
    setPlatformUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  }, [setPlatformUsers]);

  // Customers (CRM)
  const addCustomer = useCallback((customer: Omit<Customer, 'id' | 'firstContact' | 'lastContact' | 'totalInquiries' | 'totalPurchases'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newCustomer: Customer = {
      ...customer,
      id: `c${Date.now()}`,
      firstContact: now,
      lastContact: now,
      totalInquiries: 0,
      totalPurchases: 0,
    };
    setCustomers(prev => [newCustomer, ...prev]);
  }, [setCustomers]);

  const updateCustomer = useCallback((id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, [setCustomers]);

  const toggleFavoriteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.map(c => 
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ));
  }, [setCustomers]);

  const getCustomerById = useCallback((id: string) => {
    return customers.find(c => c.id === id);
  }, [customers]);

  // Customer Notes
  const addCustomerNote = useCallback((note: Omit<CustomerNote, 'id' | 'createdAt'>) => {
    const newNote: CustomerNote = {
      ...note,
      id: `cn${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCustomerNotes(prev => [newNote, ...prev]);
  }, [setCustomerNotes]);

  const deleteCustomerNote = useCallback((id: string) => {
    setCustomerNotes(prev => prev.filter(n => n.id !== id));
  }, [setCustomerNotes]);

  const getNotesForCustomer = useCallback((customerId: string) => {
    return customerNotes.filter(n => n.customerId === customerId);
  }, [customerNotes]);

  // Follow-up Reminders
  const addFollowUpReminder = useCallback((reminder: Omit<FollowUpReminder, 'id' | 'createdAt' | 'completed'>) => {
    const newReminder: FollowUpReminder = {
      ...reminder,
      id: `fr${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setFollowUpReminders(prev => [newReminder, ...prev]);
  }, [setFollowUpReminders]);

  const completeFollowUp = useCallback((id: string) => {
    setFollowUpReminders(prev => prev.map(r => 
      r.id === id ? { ...r, completed: true } : r
    ));
  }, [setFollowUpReminders]);

  const deleteFollowUp = useCallback((id: string) => {
    setFollowUpReminders(prev => prev.filter(r => r.id !== id));
  }, [setFollowUpReminders]);

  const getRemindersForDealer = useCallback((dealerId: string) => {
    return followUpReminders.filter(r => r.dealerId === dealerId);
  }, [followUpReminders]);

  const getPendingRemindersCount = useCallback((dealerId: string) => {
    return followUpReminders.filter(r => r.dealerId === dealerId && !r.completed).length;
  }, [followUpReminders]);

  return (
    <DataContext.Provider value={{
      diagnoses, addDiagnosis, deleteDiagnosis, toggleBookmark,
      products, addProduct, updateProduct, deleteProduct,
      inquiries, addInquiry, updateInquiryStatus,
      posts, addPost, toggleLike, addComment, deletePost,
      notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, unreadCount,
      platformUsers, updateUserStatus, updateUserRole,
      customers, addCustomer, updateCustomer, toggleFavoriteCustomer, getCustomerById,
      customerNotes, addCustomerNote, deleteCustomerNote, getNotesForCustomer,
      followUpReminders, addFollowUpReminder, completeFollowUp, deleteFollowUp, getRemindersForDealer, getPendingRemindersCount,
    }}>
      {children}
    </DataContext.Provider>
  );
};
