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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('kishu-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call - will be replaced with real auth
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock user based on email
    const mockUser: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      role: email.includes('dealer') ? 'dealer' : email.includes('admin') ? 'admin' : 'farmer',
      location: 'Delhi, India',
      crops: ['Wheat', 'Rice', 'Tomato'],
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
