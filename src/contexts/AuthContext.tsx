import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'farmer' | 'dealer' | 'admin';

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
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  phone?: string;
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
  },
  'dealer@kishu.com': {
    id: 'dealer-001',
    email: 'dealer@kishu.com',
    name: 'Sunil Agro Supplies',
    role: 'dealer',
    phone: '+91 87654 32109',
    location: 'Delhi, India',
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

  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Check for demo accounts first
    const lowerEmail = email.toLowerCase();
    if (DEMO_ACCOUNTS[lowerEmail]) {
      const demoUser = DEMO_ACCOUNTS[lowerEmail];
      setUser(demoUser);
      localStorage.setItem('kishu-user', JSON.stringify(demoUser));
      return;
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
    };
    
    setUser(mockUser);
    localStorage.setItem('kishu-user', JSON.stringify(mockUser));
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
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
