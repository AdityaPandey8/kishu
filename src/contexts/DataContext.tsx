import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Shop Types
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  farmerId: string;
  dealerId: string;
  dealerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'online' | 'upi';
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  dealerId: string;
  dealerName: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

// Reel Types
export interface ReelComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  likes: string[];
  createdAt: string;
}

export interface Reel {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  description: string;
  tags: string[];
  category: 'technique' | 'tips' | 'harvest' | 'equipment' | 'organic' | 'success-story';
  likes: string[];
  comments: ReelComment[];
  shares: number;
  views: number;
  duration: number;
  createdAt: string;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  creatorId: string;
  createdAt: string;
}

export interface CreatorProfile {
  userId: string;
  isCreator: boolean;
  bio: string;
  coverImage?: string;
  totalFollowers: number;
  totalLikes: number;
  totalViews: number;
  reelIds: string[];
  createdAt: string;
}

// Market Prices Types
export interface TrackedCrop {
  id: string;
  cropId: string;
  cropName: string;
  userId: string;
  alertEnabled: boolean;
  alertThreshold?: number;
  createdAt: string;
}

// Expert Types
export interface ExpertApplication {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  specialization: string[];
  experience: string;
  certifications: string;
  bio: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

// Dealer KYC Types
export interface DealerKYC {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerEmail: string;
  businessName: string;
  businessType: 'retail' | 'wholesale' | 'manufacturer' | 'distributor';
  gstNumber: string;
  panNumber: string;
  businessAddress: string;
  city: string;
  state: string;
  pincode: string;
  contactNumber: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

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
  rating?: number;
  reviews?: number;
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
  type: 'text' | 'image' | 'short-video' | 'long-video';
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  videoDuration?: number;
  saves: string[];
  shares: number;
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
  type: 'weather' | 'disease' | 'inquiry' | 'system' | 'community' | 'order';
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
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt' | 'saves' | 'shares'>) => void;
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

  // Shopping Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Orders
  orders: Order[];
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersByFarmer: (farmerId: string) => Order[];
  getOrdersByDealer: (dealerId: string) => Order[];

  // Reels
  reels: Reel[];
  addReel: (reel: Omit<Reel, 'id' | 'likes' | 'comments' | 'shares' | 'views' | 'createdAt'>) => Reel;
  updateReel: (id: string, data: Partial<Reel>) => void;
  deleteReel: (id: string) => void;
  toggleReelLike: (reelId: string, userId: string) => void;
  addReelComment: (reelId: string, comment: Omit<ReelComment, 'id' | 'likes' | 'createdAt'>) => void;
  incrementReelViews: (reelId: string) => void;
  incrementReelShares: (reelId: string) => void;
  getReelsByCreator: (creatorId: string) => Reel[];

  // Subscriptions
  subscriptions: Subscription[];
  subscribe: (creatorId: string, subscriberId: string) => void;
  unsubscribe: (creatorId: string, subscriberId: string) => void;
  isSubscribed: (creatorId: string, subscriberId: string) => boolean;
  getSubscriberCount: (creatorId: string) => number;
  getSubscribedCreators: (subscriberId: string) => string[];

  // Creator Profiles
  creatorProfiles: CreatorProfile[];
  becomeCreator: (userId: string, bio: string) => void;
  updateCreatorProfile: (userId: string, data: Partial<CreatorProfile>) => void;
  getCreatorProfile: (userId: string) => CreatorProfile | undefined;
  isCreator: (userId: string) => boolean;

  // Saved Reels
  savedReels: string[];
  toggleSaveReel: (reelId: string) => void;
  isSavedReel: (reelId: string) => boolean;

  // Saved Posts
  savedPosts: string[];
  toggleSavePost: (postId: string) => void;
  isSavedPost: (postId: string) => boolean;
  incrementPostShares: (postId: string) => void;

  // Tracked Crops (Market Prices)
  trackedCrops: TrackedCrop[];
  trackCrop: (crop: Omit<TrackedCrop, 'id' | 'createdAt'>) => void;
  untrackCrop: (cropId: string) => void;
  isTrackedCrop: (cropId: string) => boolean;

  // Expert Applications
  expertApplications: ExpertApplication[];
  applyForExpert: (application: Omit<ExpertApplication, 'id' | 'status' | 'appliedAt'>) => void;
  approveExpert: (applicationId: string, adminId: string) => void;
  rejectExpert: (applicationId: string, adminId: string, reason: string) => void;
  getExpertApplication: (userId: string) => ExpertApplication | undefined;

  // Dealer KYC
  dealerKYCs: DealerKYC[];
  submitDealerKYC: (kyc: Omit<DealerKYC, 'id' | 'status' | 'submittedAt'>) => void;
  approveDealerKYC: (kycId: string, dealerId: string, adminId: string) => void;
  rejectDealerKYC: (kycId: string, dealerId: string, adminId: string, reason: string) => void;
  getDealerKYC: (dealerId: string) => DealerKYC | undefined;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  getWishlistProducts: () => Product[];
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
  { id: 'p1', dealerId: 'dealer-001', name: 'Mancozeb 75% WP', category: 'Fungicide', price: 450, stock: 120, description: 'Broad-spectrum fungicide for various crops', sales: 45, createdAt: 'Jan 1, 2026', rating: 4.5, reviews: 28 },
  { id: 'p2', dealerId: 'dealer-001', name: 'Neem Oil Organic', category: 'Organic', price: 320, stock: 85, description: 'Natural pest control solution', sales: 72, createdAt: 'Jan 1, 2026', rating: 4.8, reviews: 45 },
  { id: 'p3', dealerId: 'dealer-001', name: 'DAP Fertilizer', category: 'Fertilizer', price: 1200, stock: 200, description: 'Diammonium phosphate for healthy growth', sales: 38, createdAt: 'Jan 1, 2026', rating: 4.3, reviews: 32 },
  { id: 'p4', dealerId: 'dealer-001', name: 'Urea 46%', category: 'Fertilizer', price: 800, stock: 300, description: 'High nitrogen fertilizer', sales: 56, createdAt: 'Jan 1, 2026', rating: 4.2, reviews: 19 },
  { id: 'p5', dealerId: 'dealer-001', name: 'Carbendazim 50%', category: 'Fungicide', price: 380, stock: 90, description: 'Systemic fungicide for soil-borne diseases', sales: 29, createdAt: 'Jan 1, 2026', rating: 4.4, reviews: 15 },
  { id: 'p6', dealerId: 'dealer-001', name: 'Imidacloprid', category: 'Insecticide', price: 520, stock: 75, description: 'Systemic insecticide for sucking pests', sales: 34, createdAt: 'Jan 1, 2026', rating: 4.6, reviews: 22 },
  { id: 'p7', dealerId: 'dealer-001', name: 'Potash MOP', category: 'Fertilizer', price: 950, stock: 150, description: 'Muriate of potash for fruit quality', sales: 41, createdAt: 'Jan 1, 2026', rating: 4.1, reviews: 12 },
  { id: 'p8', dealerId: 'dealer-001', name: 'Micronutrient Mix', category: 'Fertilizer', price: 280, stock: 110, description: 'Essential micronutrients blend', sales: 63, createdAt: 'Jan 1, 2026', rating: 4.7, reviews: 38 },
  { id: 'p9', dealerId: 'd2', name: 'Trichoderma Bio', category: 'Organic', price: 350, stock: 60, description: 'Biological fungicide for root health', sales: 25, createdAt: 'Jan 5, 2026', rating: 4.9, reviews: 41 },
  { id: 'p10', dealerId: 'd2', name: 'Vermicompost Premium', category: 'Organic', price: 450, stock: 200, description: 'Organic soil enrichment', sales: 88, createdAt: 'Jan 5, 2026', rating: 4.8, reviews: 56 },
];

const seedInquiries: Inquiry[] = [
  { id: 'i1', farmerId: 'farmer-001', farmerName: 'Ramesh Kumar', dealerId: 'dealer-001', crop: 'Tomato - Early Blight', issue: 'Need fungicide recommendation', location: 'Jaipur, RJ', status: 'pending', urgent: true, createdAt: new Date().toISOString() },
  { id: 'i2', farmerId: 'f2', farmerName: 'Sunil Yadav', dealerId: 'dealer-001', crop: 'Rice - Leaf Rust', issue: 'Looking for organic solution', location: 'Lucknow, UP', status: 'pending', urgent: false, createdAt: new Date().toISOString() },
  { id: 'i3', farmerId: 'f3', farmerName: 'Priya Sharma', dealerId: 'dealer-001', crop: 'Cotton - Pest Attack', issue: 'Urgent pest control needed', location: 'Ahmedabad, GJ', status: 'responded', urgent: true, createdAt: new Date().toISOString(), response: 'Recommended Imidacloprid spray' },
  { id: 'i4', farmerId: 'f4', farmerName: 'Mohan Singh', dealerId: 'dealer-001', crop: 'Wheat - Nutrient Deficiency', issue: 'Yellowing leaves', location: 'Bhopal, MP', status: 'resolved', urgent: false, createdAt: new Date().toISOString() },
  { id: 'i5', farmerId: 'f5', farmerName: 'Geeta Devi', dealerId: 'dealer-001', crop: 'Potato - Late Blight', issue: 'Spreading disease', location: 'Patna, BR', status: 'resolved', urgent: true, createdAt: new Date().toISOString() },
];

const seedPosts: Post[] = [
  { id: 'post1', authorId: 'creator-001', authorName: 'Kisan Vikas', location: 'Punjab', content: 'My wheat crop is showing yellow spots on leaves. Any suggestions?', contentHi: 'मेरी गेहूं की फसल में पत्तियों पर पीले धब्बे दिख रहे हैं। कोई सुझाव?', tags: ['Wheat', 'Disease'], likes: ['f2', 'f3'], comments: [{ id: 'pc1', authorId: 'f2', authorName: 'Sunita Devi', content: 'Try neem oil spray!', createdAt: new Date().toISOString() }], createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: 'text', saves: ['farmer-001'], shares: 3 },
  { id: 'post2', authorId: 'creator-002', authorName: 'Organic Farming India', location: 'Maharashtra', content: 'Successfully treated tomato blight using neem oil spray! Sharing my experience.', contentHi: 'नीम तेल स्प्रे से टमाटर के ब्लाइट का सफल इलाज किया!', tags: ['Tomato', 'Success Story'], likes: ['farmer-001', 'f3', 'f4'], comments: [], createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), type: 'image', imageUrl: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=600', saves: ['f2'], shares: 12 },
  { id: 'post3', authorId: 'creator-003', authorName: 'Modern Kheti', location: 'Haryana', content: 'Complete guide to organic composting at home - watch this detailed tutorial!', contentHi: 'घर पर जैविक खाद बनाने की पूरी गाइड - यह विस्तृत ट्यूटोरियल देखें!', tags: ['Organic', 'Tutorial'], likes: ['farmer-001', 'f2', 'f3', 'f4', 'f5'], comments: [{ id: 'pc2', authorId: 'farmer-001', authorName: 'Ramesh Kumar', content: 'Amazing tutorial!', createdAt: new Date().toISOString() }], createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'long-video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnailUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600', videoDuration: 596, saves: ['farmer-001', 'f3'], shares: 45 },
  { id: 'post4', authorId: 'creator-001', authorName: 'Kisan Vikas', location: 'Punjab', content: 'Quick tip: How to identify nitrogen deficiency in your crops 🌱', contentHi: 'त्वरित सुझाव: अपनी फसलों में नाइट्रोजन की कमी की पहचान कैसे करें 🌱', tags: ['Tips', 'Nutrient'], likes: ['f2'], comments: [], createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), type: 'short-video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnailUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400', videoDuration: 32, saves: [], shares: 8 },
  { id: 'post5', authorId: 'creator-002', authorName: 'Organic Farming India', location: 'Maharashtra', content: 'Drip irrigation system installation - A complete guide for small farmers', contentHi: 'ड्रिप सिंचाई प्रणाली स्थापना - छोटे किसानों के लिए एक पूर्ण गाइड', tags: ['Irrigation', 'Guide'], likes: ['farmer-001', 'f3', 'f4'], comments: [{ id: 'pc3', authorId: 'f3', authorName: 'Mohan Singh', content: 'Very helpful, thank you!', createdAt: new Date().toISOString() }], createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), type: 'long-video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnailUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600', videoDuration: 653, saves: ['farmer-001'], shares: 34 },
  { id: 'post6', authorId: 'creator-003', authorName: 'Modern Kheti', location: 'Haryana', content: 'Look at my wheat harvest this season! Record production achieved with proper soil management.', contentHi: 'इस सीज़न में मेरी गेहूं की फसल देखें! उचित मिट्टी प्रबंधन से रिकॉर्ड उत्पादन हासिल किया।', tags: ['Wheat', 'Success Story'], likes: ['farmer-001', 'f2', 'f5'], comments: [], createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), type: 'image', imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600', saves: ['f2', 'f4'], shares: 22 },
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
  { id: 'd2', email: 'greenfarmsupply@email.com', name: 'Green Farm Supplies', role: 'dealer', status: 'active', createdAt: 'Jan 12, 2026', lastActive: 'Jan 12, 2026', location: 'Pune, MH' },
  { id: 'd3', email: 'agrisolutions@email.com', name: 'Agri Solutions Pvt Ltd', role: 'dealer', status: 'pending', createdAt: 'Jan 14, 2026', lastActive: 'Jan 14, 2026', location: 'Mumbai, MH' },
];

// CRM Seed Data
const seedCustomers: Customer[] = [
  { id: 'c1', farmerId: 'farmer-001', dealerId: 'dealer-001', farmerName: 'Ramesh Kumar', phone: '+91 9876543210', email: 'ramesh@email.com', location: 'Jaipur, RJ', crops: ['Tomato', 'Wheat', 'Cotton'], firstContact: '2025-12-15', lastContact: '2026-01-15', totalInquiries: 3, totalPurchases: 2, status: 'vip', isFavorite: true },
  { id: 'c2', farmerId: 'f2', dealerId: 'dealer-001', farmerName: 'Sunil Yadav', phone: '+91 9876543211', email: 'sunil@email.com', location: 'Lucknow, UP', crops: ['Rice', 'Sugarcane'], firstContact: '2026-01-05', lastContact: '2026-01-16', totalInquiries: 1, totalPurchases: 0, status: 'active', isFavorite: false },
  { id: 'c3', farmerId: 'f3', dealerId: 'dealer-001', farmerName: 'Priya Sharma', phone: '+91 9876543212', email: 'priya@email.com', location: 'Ahmedabad, GJ', crops: ['Cotton', 'Groundnut'], firstContact: '2025-11-20', lastContact: '2026-01-10', totalInquiries: 5, totalPurchases: 4, status: 'vip', isFavorite: true },
  { id: 'c4', farmerId: 'f4', dealerId: 'dealer-001', farmerName: 'Mohan Singh', phone: '+91 9876543213', email: 'mohan@email.com', location: 'Bhopal, MP', crops: ['Wheat', 'Soybean'], firstContact: '2026-01-08', lastContact: '2026-01-14', totalInquiries: 2, totalPurchases: 1, status: 'active', isFavorite: false },
  { id: 'c5', farmerId: 'f5', dealerId: 'dealer-001', farmerName: 'Geeta Devi', phone: '+91 9876543214', email: 'geeta@email.com', location: 'Patna, BR', crops: ['Potato', 'Maize'], firstContact: '2025-12-01', lastContact: '2026-01-12', totalInquiries: 4, totalPurchases: 3, status: 'active', isFavorite: false },
];

const seedCustomerNotes: CustomerNote[] = [
  { id: 'cn1', customerId: 'c1', dealerId: 'dealer-001', content: 'Prefers organic products. Budget conscious but willing to pay for quality.', createdAt: '2026-01-10T10:00:00Z', type: 'general' },
  { id: 'cn2', customerId: 'c1', dealerId: 'dealer-001', content: 'Follow up on fungicide effectiveness after 2 weeks.', createdAt: '2026-01-15T14:30:00Z', type: 'followup' },
  { id: 'cn3', customerId: 'c3', dealerId: 'dealer-001', content: 'Manages 50 acres. Key customer for bulk orders.', createdAt: '2026-01-05T09:00:00Z', type: 'general' },
  { id: 'cn4', customerId: 'c5', dealerId: 'dealer-001', content: 'Had issue with late blight. Resolved with Mancozeb treatment.', createdAt: '2026-01-12T16:00:00Z', type: 'issue' },
];

const seedFollowUpReminders: FollowUpReminder[] = [
  { id: 'fr1', customerId: 'c1', dealerId: 'dealer-001', customerName: 'Ramesh Kumar', title: 'Check on wheat treatment', description: 'Follow up on the fungicide recommendation for early blight', dueDate: '2026-01-20', completed: false, priority: 'high', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'fr2', customerId: 'c3', dealerId: 'dealer-001', customerName: 'Priya Sharma', title: 'Bulk order discussion', description: 'Discuss fertilizer requirements for next season', dueDate: '2026-01-22', completed: false, priority: 'medium', createdAt: '2026-01-14T11:00:00Z' },
  { id: 'fr3', customerId: 'c2', dealerId: 'dealer-001', customerName: 'Sunil Yadav', title: 'Send product catalog', description: 'Share organic product options for rice cultivation', dueDate: '2026-01-19', completed: false, priority: 'low', createdAt: '2026-01-16T08:00:00Z' },
];

// Seed Reels
const seedReels: Reel[] = [
  {
    id: 'reel1',
    creatorId: 'creator-001',
    creatorName: 'Kisan Vikas',
    creatorAvatar: undefined,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400',
    caption: 'बेहतर उपज के लिए ड्रिप इरीगेशन 💧',
    description: 'Learn how drip irrigation can increase your yield by 40% while saving water',
    tags: ['irrigation', 'water-saving', 'technique'],
    category: 'technique',
    likes: ['farmer-001', 'f2', 'f3'],
    comments: [
      { id: 'rc1', userId: 'f2', userName: 'Sunita Devi', content: 'Very helpful! 🙏', likes: [], createdAt: new Date().toISOString() }
    ],
    shares: 45,
    views: 1250,
    duration: 32,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'reel2',
    creatorId: 'creator-002',
    creatorName: 'Organic Farming India',
    creatorAvatar: undefined,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    caption: 'जैविक खाद बनाने का आसान तरीका 🌱',
    description: 'Step by step guide to make organic compost at home',
    tags: ['organic', 'compost', 'sustainable'],
    category: 'organic',
    likes: ['farmer-001', 'f3', 'f4', 'f5'],
    comments: [],
    shares: 89,
    views: 3420,
    duration: 45,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'reel3',
    creatorId: 'creator-001',
    creatorName: 'Kisan Vikas',
    creatorAvatar: undefined,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
    caption: 'टमाटर में कीट नियंत्रण के घरेलू उपाय 🍅',
    description: 'Natural pest control methods for tomato crops',
    tags: ['tomato', 'pest-control', 'tips'],
    category: 'tips',
    likes: ['f2', 'f4'],
    comments: [
      { id: 'rc2', userId: 'farmer-001', userName: 'Ramesh Kumar', content: 'This worked great on my farm!', likes: ['f2'], createdAt: new Date().toISOString() }
    ],
    shares: 23,
    views: 890,
    duration: 28,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'reel4',
    creatorId: 'creator-003',
    creatorName: 'Modern Kheti',
    creatorAvatar: undefined,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400',
    caption: 'मेरी गेहूं की बम्पर फसल का राज़ 🌾',
    description: 'How I achieved record wheat harvest this season',
    tags: ['wheat', 'harvest', 'success'],
    category: 'success-story',
    likes: ['farmer-001', 'f2', 'f3', 'f4', 'f5'],
    comments: [],
    shares: 156,
    views: 5670,
    duration: 52,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'reel5',
    creatorId: 'creator-002',
    creatorName: 'Organic Farming India',
    creatorAvatar: undefined,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
    caption: 'ट्रैक्टर मेंटेनेंस टिप्स 🚜',
    description: 'Essential tractor maintenance tips every farmer should know',
    tags: ['tractor', 'equipment', 'maintenance'],
    category: 'equipment',
    likes: ['f3', 'f4'],
    comments: [],
    shares: 34,
    views: 1890,
    duration: 38,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
];

// Seed Creator Profiles
const seedCreatorProfiles: CreatorProfile[] = [
  {
    userId: 'creator-001',
    isCreator: true,
    bio: 'Sharing modern farming techniques | 10+ years experience | Punjab 🌾',
    coverImage: undefined,
    totalFollowers: 2450,
    totalLikes: 8900,
    totalViews: 45000,
    reelIds: ['reel1', 'reel3'],
    createdAt: '2025-06-15T10:00:00Z'
  },
  {
    userId: 'creator-002',
    isCreator: true,
    bio: 'Organic farming advocate | Sustainable agriculture | Maharashtra 🌱',
    coverImage: undefined,
    totalFollowers: 5680,
    totalLikes: 23400,
    totalViews: 98000,
    reelIds: ['reel2', 'reel5'],
    createdAt: '2025-03-20T10:00:00Z'
  },
  {
    userId: 'creator-003',
    isCreator: true,
    bio: 'Progressive farmer | Tech in agriculture | Haryana 🚜',
    coverImage: undefined,
    totalFollowers: 8920,
    totalLikes: 45600,
    totalViews: 156000,
    reelIds: ['reel4'],
    createdAt: '2024-11-10T10:00:00Z'
  },
];

// Seed Subscriptions
const seedSubscriptions: Subscription[] = [
  { id: 'sub1', subscriberId: 'farmer-001', creatorId: 'creator-001', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'sub2', subscriberId: 'farmer-001', creatorId: 'creator-002', createdAt: '2026-01-12T10:00:00Z' },
  { id: 'sub3', subscriberId: 'f2', creatorId: 'creator-001', createdAt: '2026-01-08T10:00:00Z' },
];

// Seed Orders
const seedOrders: Order[] = [
  {
    id: 'ord1',
    farmerId: 'farmer-001',
    dealerId: 'dealer-001',
    dealerName: 'Sunil Agro Supplies',
    items: [
      { productId: 'p1', productName: 'Mancozeb 75% WP', quantity: 2, price: 450 },
      { productId: 'p2', productName: 'Neem Oil Organic', quantity: 1, price: 320 }
    ],
    totalAmount: 1220,
    status: 'delivered',
    paymentMethod: 'cod',
    shippingAddress: 'Village Rampur, Jaipur, Rajasthan',
    createdAt: '2026-01-10T10:00:00Z',
    updatedAt: '2026-01-14T15:00:00Z'
  },
  {
    id: 'ord2',
    farmerId: 'farmer-001',
    dealerId: 'dealer-001',
    dealerName: 'Sunil Agro Supplies',
    items: [
      { productId: 'p3', productName: 'DAP Fertilizer', quantity: 3, price: 1200 }
    ],
    totalAmount: 3600,
    status: 'shipped',
    paymentMethod: 'upi',
    shippingAddress: 'Village Rampur, Jaipur, Rajasthan',
    createdAt: '2026-01-18T10:00:00Z',
    updatedAt: '2026-01-19T12:00:00Z'
  },
];

// Seed Expert Applications
const seedExpertApplications: ExpertApplication[] = [
  {
    id: 'exp1',
    userId: 'f2',
    userName: 'Sunita Devi',
    userEmail: 'sunita@email.com',
    specialization: ['Rice', 'Organic Farming'],
    experience: '8 years',
    certifications: 'Organic Farming Certificate',
    bio: 'Experienced organic farmer from Lucknow with expertise in rice cultivation.',
    status: 'pending',
    appliedAt: '2026-01-18T10:00:00Z',
  },
  {
    id: 'exp2',
    userId: 'f3',
    userName: 'Mohan Singh',
    userEmail: 'mohan@email.com',
    specialization: ['Wheat', 'Soybean'],
    experience: '15 years',
    certifications: 'Agricultural Science Diploma',
    bio: 'Progressive farmer from Bhopal specializing in wheat and soybean cultivation.',
    status: 'pending',
    appliedAt: '2026-01-19T14:00:00Z',
  },
];

// Seed Dealer KYCs
const seedDealerKYCs: DealerKYC[] = [
  {
    id: 'kyc1',
    dealerId: 'd3',
    dealerName: 'Agri Solutions Pvt Ltd',
    dealerEmail: 'agrisolutions@email.com',
    businessName: 'Agri Solutions Pvt Ltd',
    businessType: 'distributor',
    gstNumber: '27AABCA1234A1Z5',
    panNumber: 'AABCA1234A',
    businessAddress: 'Shop 45, Market Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    contactNumber: '+91 98765 00001',
    bankDetails: {
      accountName: 'Agri Solutions Pvt Ltd',
      accountNumber: '1234567890123',
      ifscCode: 'SBIN0001234',
      bankName: 'State Bank of India',
    },
    status: 'pending',
    submittedAt: '2026-01-14T10:00:00Z',
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
  const [cart, setCart] = useLocalStorage<CartItem[]>('kishu-cart', []);
  const [orders, setOrders] = useLocalStorage<Order[]>('kishu-orders', seedOrders);
  const [reels, setReels] = useLocalStorage<Reel[]>('kishu-reels', seedReels);
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>('kishu-subscriptions', seedSubscriptions);
  const [creatorProfiles, setCreatorProfiles] = useLocalStorage<CreatorProfile[]>('kishu-creators', seedCreatorProfiles);
  const [savedReels, setSavedReels] = useLocalStorage<string[]>('kishu-saved-reels', []);
  const [savedPosts, setSavedPosts] = useLocalStorage<string[]>('kishu-saved-posts', []);
  const [trackedCrops, setTrackedCrops] = useLocalStorage<TrackedCrop[]>('kishu-tracked-crops', []);
  const [expertApplications, setExpertApplications] = useLocalStorage<ExpertApplication[]>('kishu-expert-applications', seedExpertApplications);
  const [dealerKYCs, setDealerKYCs] = useLocalStorage<DealerKYC[]>('kishu-dealer-kycs', seedDealerKYCs);


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
  const addPost = useCallback((post: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt' | 'saves' | 'shares'>) => {
    const newPost: Post = {
      ...post,
      id: `post${Date.now()}`,
      likes: [],
      comments: [],
      saves: [],
      shares: 0,
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

  // Shopping Cart
  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i => 
          i.productId === item.productId 
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, [setCart]);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId));
    } else {
      setCart(prev => prev.map(i => 
        i.productId === productId ? { ...i, quantity } : i
      ));
    }
  }, [setCart]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }, [setCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const getCartItemCount = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Orders
  const placeOrder = useCallback((order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Order => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...order,
      id: `ord${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, [setOrders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    ));
  }, [setOrders]);

  const getOrdersByFarmer = useCallback((farmerId: string) => {
    return orders.filter(o => o.farmerId === farmerId);
  }, [orders]);

  const getOrdersByDealer = useCallback((dealerId: string) => {
    return orders.filter(o => o.dealerId === dealerId);
  }, [orders]);

  // Reels
  const addReel = useCallback((reel: Omit<Reel, 'id' | 'likes' | 'comments' | 'shares' | 'views' | 'createdAt'>): Reel => {
    const newReel: Reel = {
      ...reel,
      id: `reel${Date.now()}`,
      likes: [],
      comments: [],
      shares: 0,
      views: 0,
      createdAt: new Date().toISOString(),
    };
    setReels(prev => [newReel, ...prev]);
    
    // Update creator profile
    setCreatorProfiles(prev => prev.map(p => 
      p.userId === reel.creatorId 
        ? { ...p, reelIds: [newReel.id, ...p.reelIds] }
        : p
    ));
    
    return newReel;
  }, [setReels, setCreatorProfiles]);

  const updateReel = useCallback((id: string, data: Partial<Reel>) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  }, [setReels]);

  const deleteReel = useCallback((id: string) => {
    const reel = reels.find(r => r.id === id);
    setReels(prev => prev.filter(r => r.id !== id));
    
    if (reel) {
      setCreatorProfiles(prev => prev.map(p => 
        p.userId === reel.creatorId 
          ? { ...p, reelIds: p.reelIds.filter(rid => rid !== id) }
          : p
      ));
    }
  }, [reels, setReels, setCreatorProfiles]);

  const toggleReelLike = useCallback((reelId: string, userId: string) => {
    setReels(prev => prev.map(r => {
      if (r.id !== reelId) return r;
      const likes = r.likes.includes(userId) 
        ? r.likes.filter(id => id !== userId)
        : [...r.likes, userId];
      return { ...r, likes };
    }));
  }, [setReels]);

  const addReelComment = useCallback((reelId: string, comment: Omit<ReelComment, 'id' | 'likes' | 'createdAt'>) => {
    const newComment: ReelComment = {
      ...comment,
      id: `rc${Date.now()}`,
      likes: [],
      createdAt: new Date().toISOString(),
    };
    setReels(prev => prev.map(r => 
      r.id === reelId ? { ...r, comments: [...r.comments, newComment] } : r
    ));
  }, [setReels]);

  const incrementReelViews = useCallback((reelId: string) => {
    setReels(prev => prev.map(r => 
      r.id === reelId ? { ...r, views: r.views + 1 } : r
    ));
  }, [setReels]);

  const incrementReelShares = useCallback((reelId: string) => {
    setReels(prev => prev.map(r => 
      r.id === reelId ? { ...r, shares: r.shares + 1 } : r
    ));
  }, [setReels]);

  const getReelsByCreator = useCallback((creatorId: string) => {
    return reels.filter(r => r.creatorId === creatorId);
  }, [reels]);

  // Subscriptions
  const subscribe = useCallback((creatorId: string, subscriberId: string) => {
    const exists = subscriptions.find(s => s.creatorId === creatorId && s.subscriberId === subscriberId);
    if (!exists) {
      const newSub: Subscription = {
        id: `sub${Date.now()}`,
        subscriberId,
        creatorId,
        createdAt: new Date().toISOString(),
      };
      setSubscriptions(prev => [...prev, newSub]);
      
      setCreatorProfiles(prev => prev.map(p => 
        p.userId === creatorId 
          ? { ...p, totalFollowers: p.totalFollowers + 1 }
          : p
      ));
    }
  }, [subscriptions, setSubscriptions, setCreatorProfiles]);

  const unsubscribe = useCallback((creatorId: string, subscriberId: string) => {
    setSubscriptions(prev => prev.filter(s => 
      !(s.creatorId === creatorId && s.subscriberId === subscriberId)
    ));
    
    setCreatorProfiles(prev => prev.map(p => 
      p.userId === creatorId 
        ? { ...p, totalFollowers: Math.max(0, p.totalFollowers - 1) }
        : p
    ));
  }, [setSubscriptions, setCreatorProfiles]);

  const isSubscribed = useCallback((creatorId: string, subscriberId: string) => {
    return subscriptions.some(s => s.creatorId === creatorId && s.subscriberId === subscriberId);
  }, [subscriptions]);

  const getSubscriberCount = useCallback((creatorId: string) => {
    return subscriptions.filter(s => s.creatorId === creatorId).length;
  }, [subscriptions]);

  const getSubscribedCreators = useCallback((subscriberId: string) => {
    return subscriptions.filter(s => s.subscriberId === subscriberId).map(s => s.creatorId);
  }, [subscriptions]);

  // Creator Profiles
  const becomeCreator = useCallback((userId: string, bio: string) => {
    const exists = creatorProfiles.find(p => p.userId === userId);
    if (!exists) {
      const newProfile: CreatorProfile = {
        userId,
        isCreator: true,
        bio,
        totalFollowers: 0,
        totalLikes: 0,
        totalViews: 0,
        reelIds: [],
        createdAt: new Date().toISOString(),
      };
      setCreatorProfiles(prev => [...prev, newProfile]);
    }
  }, [creatorProfiles, setCreatorProfiles]);

  const updateCreatorProfile = useCallback((userId: string, data: Partial<CreatorProfile>) => {
    setCreatorProfiles(prev => prev.map(p => 
      p.userId === userId ? { ...p, ...data } : p
    ));
  }, [setCreatorProfiles]);

  const getCreatorProfile = useCallback((userId: string) => {
    return creatorProfiles.find(p => p.userId === userId);
  }, [creatorProfiles]);

  const isCreator = useCallback((userId: string) => {
    return creatorProfiles.some(p => p.userId === userId && p.isCreator);
  }, [creatorProfiles]);

  // Saved Reels
  const toggleSaveReel = useCallback((reelId: string) => {
    setSavedReels(prev => 
      prev.includes(reelId) 
        ? prev.filter(id => id !== reelId)
        : [...prev, reelId]
    );
  }, [setSavedReels]);

  const isSavedReel = useCallback((reelId: string) => {
    return savedReels.includes(reelId);
  }, [savedReels]);

  // Saved Posts
  const toggleSavePost = useCallback((postId: string) => {
    setSavedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    );
  }, [setSavedPosts]);

  const isSavedPost = useCallback((postId: string) => {
    return savedPosts.includes(postId);
  }, [savedPosts]);

  const incrementPostShares = useCallback((postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, shares: p.shares + 1 } : p
    ));
  }, [setPosts]);

  // Tracked Crops
  const trackCrop = useCallback((crop: Omit<TrackedCrop, 'id' | 'createdAt'>) => {
    const newCrop: TrackedCrop = {
      ...crop,
      id: `tc${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTrackedCrops(prev => [...prev, newCrop]);
  }, [setTrackedCrops]);

  const untrackCrop = useCallback((cropId: string) => {
    setTrackedCrops(prev => prev.filter(c => c.cropId !== cropId));
  }, [setTrackedCrops]);

  const isTrackedCrop = useCallback((cropId: string) => {
    return trackedCrops.some(c => c.cropId === cropId);
  }, [trackedCrops]);

  // Expert Applications
  const applyForExpert = useCallback((application: Omit<ExpertApplication, 'id' | 'status' | 'appliedAt'>) => {
    const newApp: ExpertApplication = {
      ...application,
      id: `exp${Date.now()}`,
      status: 'pending',
      appliedAt: new Date().toISOString(),
    };
    setExpertApplications(prev => [...prev, newApp]);
  }, [setExpertApplications]);

  const approveExpert = useCallback((applicationId: string, adminId: string) => {
    setExpertApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: adminId }
        : app
    ));
  }, [setExpertApplications]);

  const rejectExpert = useCallback((applicationId: string, adminId: string, reason: string) => {
    setExpertApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { ...app, status: 'rejected' as const, reviewedAt: new Date().toISOString(), reviewedBy: adminId, rejectionReason: reason }
        : app
    ));
  }, [setExpertApplications]);

  const getExpertApplication = useCallback((userId: string) => {
    return expertApplications.find(app => app.userId === userId);
  }, [expertApplications]);

  // Dealer KYC
  const submitDealerKYC = useCallback((kyc: Omit<DealerKYC, 'id' | 'status' | 'submittedAt'>) => {
    const newKYC: DealerKYC = {
      ...kyc,
      id: `kyc${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setDealerKYCs(prev => [...prev, newKYC]);
  }, [setDealerKYCs]);

  const approveDealerKYC = useCallback((kycId: string, dealerId: string, adminId: string) => {
    setDealerKYCs(prev => prev.map(kyc => 
      kyc.id === kycId 
        ? { ...kyc, status: 'approved' as const, reviewedAt: new Date().toISOString(), reviewedBy: adminId }
        : kyc
    ));
    // Update the dealer's KYC status in platform users as well
    setPlatformUsers(prev => prev.map(u => 
      u.id === dealerId ? { ...u, status: 'active' as const } : u
    ));
  }, [setDealerKYCs, setPlatformUsers]);

  const rejectDealerKYC = useCallback((kycId: string, dealerId: string, adminId: string, reason: string) => {
    setDealerKYCs(prev => prev.map(kyc => 
      kyc.id === kycId 
        ? { ...kyc, status: 'rejected' as const, reviewedAt: new Date().toISOString(), reviewedBy: adminId, rejectionReason: reason }
        : kyc
    ));
  }, [setDealerKYCs]);

  const getDealerKYC = useCallback((dealerId: string) => {
    return dealerKYCs.find(kyc => kyc.dealerId === dealerId);
  }, [dealerKYCs]);

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
      cart, addToCart, updateCartQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount,
      orders, placeOrder, updateOrderStatus, getOrdersByFarmer, getOrdersByDealer,
      reels, addReel, updateReel, deleteReel, toggleReelLike, addReelComment, incrementReelViews, incrementReelShares, getReelsByCreator,
      subscriptions, subscribe, unsubscribe, isSubscribed, getSubscriberCount, getSubscribedCreators,
      creatorProfiles, becomeCreator, updateCreatorProfile, getCreatorProfile, isCreator,
      savedReels, toggleSaveReel, isSavedReel,
      savedPosts, toggleSavePost, isSavedPost, incrementPostShares,
      trackedCrops, trackCrop, untrackCrop, isTrackedCrop,
      expertApplications, applyForExpert, approveExpert, rejectExpert, getExpertApplication,
      dealerKYCs, submitDealerKYC, approveDealerKYC, rejectDealerKYC, getDealerKYC,
    }}>
      {children}
    </DataContext.Provider>
  );
};
