import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for active session on load
    const storedSession = localStorage.getItem('estate_admin_session');
    if (storedSession) {
      try {
        setUser(JSON.parse(storedSession));
      } catch (e) {
        console.error("Failed to parse session", e);
        localStorage.removeItem('estate_admin_session');
      }
    } else {
      // Auto-login for preview purposes
      const defaultUser = { name: 'Alex Morgan', email: 'alex@estate.com' };
      setUser(defaultUser);
      localStorage.setItem('estate_admin_session', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem('estate_admin_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const sessionUser = { name: foundUser.name, email: foundUser.email };
      setUser(sessionUser);
      localStorage.setItem('estate_admin_session', JSON.stringify(sessionUser));
      return true;
    }
    
    // For demo purposes, allow a default admin login if no users exist or match matches hardcoded mock
    if (email === 'alex@estate.com' && password === 'password') {
       const defaultUser = { name: 'Alex Morgan', email: 'alex@estate.com' };
       setUser(defaultUser);
       localStorage.setItem('estate_admin_session', JSON.stringify(defaultUser));
       return true;
    }

    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const users = JSON.parse(localStorage.getItem('estate_admin_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('estate_admin_users', JSON.stringify(users));

    // Auto login after register
    const sessionUser = { name, email };
    setUser(sessionUser);
    localStorage.setItem('estate_admin_session', JSON.stringify(sessionUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estate_admin_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};