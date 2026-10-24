import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '../lib/apiClient';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'creator' | 'admin';
  isVerified: boolean;
  preferences?: {
    theme?: string;
    preferredLanguage?: string;
    defaultPlatforms?: string[];
    defaultTone?: string;
    reducedMotion?: boolean;
  };
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bhaktigrow_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    const storedToken = localStorage.getItem('bhaktigrow_auth_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res.success && res.user) {
        setUser(res.user as AuthUser);
      } else {
        localStorage.removeItem('bhaktigrow_auth_token');
        setUser(null);
        setToken(null);
      }
    } catch {
      localStorage.removeItem('bhaktigrow_auth_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const res = await api.auth.login({ email, password });
    setIsLoading(false);

    if (res.success && res.token && res.user) {
      localStorage.setItem('bhaktigrow_auth_token', res.token);
      setToken(res.token);
      setUser(res.user as AuthUser);
      return { success: true };
    }

    return {
      success: false,
      message: res.message || 'Login failed. Please check your credentials.'
    };
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const res = await api.auth.register({ name, email, password });
    setIsLoading(false);

    if (res.success && res.token && res.user) {
      localStorage.setItem('bhaktigrow_auth_token', res.token);
      setToken(res.token);
      setUser(res.user as AuthUser);
      return { success: true };
    }

    return {
      success: false,
      message: res.message || 'Registration failed.'
    };
  };

  const logout = () => {
    api.auth.logout();
    localStorage.removeItem('bhaktigrow_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    // Graceful fallback for non-auth wrapped trees (e.g. isolated unit tests or previews)
    return {
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      login: async () => ({ success: false, message: 'Auth provider not mounted' }),
      register: async () => ({ success: false, message: 'Auth provider not mounted' }),
      logout: async () => {},
      refreshUser: async () => {}
    };
  }
  return context;
}
