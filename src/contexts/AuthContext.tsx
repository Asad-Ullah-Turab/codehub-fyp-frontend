import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
import { STORAGE_KEYS } from '../constants';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SignupResult {
  needsVerification: boolean;
  email?: string;
  isResend?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signin: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<SignupResult>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verify token is still valid
        try {
          const response = await authAPI.getProfile();
          setUser(response.data.user);
        } catch {
          // Token invalid, clear stored data
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signin = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authAPI.signin({ email, password });
      
      const { token: newToken, data } = response;
      setToken(newToken);
      setUser(data.user);
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      
      setIsLoading(false);
      
    } catch (error: unknown) {
      const errorResponse = (error as { response?: { data?: { message?: string; needsEmailVerification?: boolean } } })?.response?.data;
      
      // If it's an email verification error, let the component handle it completely
      if (errorResponse?.needsEmailVerification) {
        setIsLoading(false);
        throw error; // Pass the full error object to the component
      }
      
      // For other errors, set generic error message
      const errorMessage = errorResponse?.message || 'Failed to sign in';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const signup = async (name: string, email: string, password: string, confirmPassword: string) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await authAPI.signup({ name, email, password, confirmPassword });
      
      // Check if email verification is needed
      if (response.data && response.data.needsVerification) {
        // Don't set auth state yet, user needs to verify email first
        return { 
          needsVerification: true, 
          email: response.data.email,
          isResend: response.data.isResend 
        };
      }
      
      // If no verification needed (email service not available), proceed normally
      const { token: newToken, data } = response;
      setToken(newToken);
      setUser(data.user);
      
      // Store in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
      
      return { needsVerification: false };
      
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to sign up';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setToken(null);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    signin,
    signup,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};