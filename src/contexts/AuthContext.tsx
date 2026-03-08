import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'farmer' | 'dealer' | 'admin';
export type KYCStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export interface UserCoordinates {
  lat: number;
  lng: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  location?: string;
  crops?: string[];
  avatar?: string;
  farmSize?: string;
  experience?: string;
  // Location fields
  coordinates?: UserCoordinates;
  manualLocation?: boolean;
  locationUpdatedAt?: string;
  // Expert fields
  isExpert?: boolean;
  expertStatus?: 'pending' | 'approved' | 'rejected';
  // Dealer KYC fields
  kycStatus?: KYCStatus;
  kycSubmittedAt?: string;
  kycApprovedAt?: string;
  kycRejectionReason?: string;
  // Store profile fields
  storeDescription?: string;
  storeLogo?: string;
  operatingHours?: { open: string; close: string; days: string[] };
}

interface LoginResult {
  user: User;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateLocation: (coordinates: UserCoordinates, manualLocation?: boolean) => void;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
  businessName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Demo accounts for testing
const DEMO_ACCOUNTS: Record<string, User> = {
  'farmer@kishu.com': {
    id: 'farmer-001',
    email: 'farmer@kishu.com',
    name: 'Ramesh Kumar',
    role: 'farmer',
    phone: '+91 98765 43210',
    location: 'Jaipur, Rajasthan',
    crops: ['Wheat', 'Rice', 'Tomato', 'Cotton'],
    farmSize: '5 Acres',
    experience: '12 years',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    locationUpdatedAt: new Date().toISOString(),
  },
  'dealer@kishu.com': {
    id: 'dealer-001',
    email: 'dealer@kishu.com',
    name: 'Sunil Agro Supplies',
    role: 'dealer',
    phone: '+91 87654 32109',
    location: 'Delhi, India',
    kycStatus: 'approved', // Pre-approved for demo
    kycApprovedAt: '2025-12-01T10:00:00Z',
  },
  'admin@kishu.com': {
    id: 'admin-001',
    email: 'admin@kishu.com',
    name: 'Admin User',
    role: 'admin',
    phone: '+91 99999 00000',
    location: 'Mumbai, India',
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('kishu-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<LoginResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check for demo accounts first
    const lowerEmail = email.toLowerCase();
    if (DEMO_ACCOUNTS[lowerEmail]) {
      const demoUser = DEMO_ACCOUNTS[lowerEmail];
      setUser(demoUser);
      localStorage.setItem('kishu-user', JSON.stringify(demoUser));
      return { user: demoUser };
    }
    
    // For other emails, determine role by keyword
    let role: UserRole = 'farmer';
    if (lowerEmail.includes('dealer')) role = 'dealer';
    if (lowerEmail.includes('admin')) role = 'admin';
    
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0].replace(/[._]/g, ' '),
      role,
      location: 'India',
      crops: ['Wheat', 'Rice'],
      // New dealers need KYC
      ...(role === 'dealer' && { kycStatus: 'not_submitted' as KYCStatus }),
    };
    
    setUser(mockUser);
    localStorage.setItem('kishu-user', JSON.stringify(mockUser));
    return { user: mockUser };
  };

  const signup = async (data: SignupData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: data.role,
      phone: data.phone,
      location: 'India',
      // Dealers start with not_submitted KYC status
      ...(data.role === 'dealer' && { kycStatus: 'not_submitted' as KYCStatus }),
    };
    
    setUser(newUser);
    localStorage.setItem('kishu-user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kishu-user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('kishu-user', JSON.stringify(updated));
    }
  };

  const updateLocation = (coordinates: UserCoordinates, manualLocation = false) => {
    if (user) {
      const updated = {
        ...user,
        coordinates,
        manualLocation,
        locationUpdatedAt: new Date().toISOString(),
      };
      setUser(updated);
      localStorage.setItem('kishu-user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser, updateLocation }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export demo credentials for display
export const DEMO_CREDENTIALS = [
  { role: 'Farmer', email: 'farmer@kishu.com', password: 'demo123', icon: '🧑‍🌾' },
  { role: 'Dealer', email: 'dealer@kishu.com', password: 'demo123', icon: '🏪' },
  { role: 'Admin', email: 'admin@kishu.com', password: 'demo123', icon: '🛡️' },
];
