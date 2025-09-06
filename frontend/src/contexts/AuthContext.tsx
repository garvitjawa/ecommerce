import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import toast from 'react-hot-toast';
import apiService from '../services/api';

interface User {
  _id: string;
  name: string;
  cart: Array<{ productId: string; quantity: number }>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      // Get saved username from localStorage
      const savedUsername = localStorage.getItem('username') || 'User';
      // Create a mock user object for existing token
      // In a real app, you'd verify the token by making a request to get user info
      setUser({
        _id: 'temp-id',
        name: savedUsername,
        cart: [],
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.login({ username, password });

      // 1️⃣ Store token immediately in localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', username);

      // 2️⃣ Update state
      setToken(response.token);
      setUser({
        _id: 'temp-id',
        name: username,
        cart: [],
      });

      toast.success(`Welcome back, ${username}! 🎉`);

      // 3️⃣ Optional: force components to mount with token ready
      // window.location.reload();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      toast.error('Login failed. Please check your credentials.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await apiService.signup({ username, password });

      // After signup, immediately login and store token
      await login(username, password);

      toast.success(`Account created successfully! Welcome, ${username}! 🎉`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      toast.error('Signup failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    toast.success('Logged out successfully! 👋');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
