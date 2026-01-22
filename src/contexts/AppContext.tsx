import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { subscriptionService } from '@/services/subscriptionService';
import type { UserSubscription, UsageStats, SubscriptionPlan } from '@/types/subscription';
import { calculateUsageStats } from '@/types/subscription';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  notifications: boolean;
  autoSave: boolean;
}

interface AppContextType {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  
  //Subscription State
  subscription: UserSubscription | null;
  usageStats: UsageStats | null;
  loadingSubscription: boolean;
  refreshSubscription: () => Promise<void>;


  //Subscription Helpers
  canUseOCR: () => Promise<boolean>;
  registerPhotoUsage: () => Promise<void>;
  upgradePlan: (newPlan: SubscriptionPlan) => Promise<void>;

  // Settings
  settings: AppSettings;
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Toast helpers
  showSuccess: (title: string, description?: string) => void;
  showError: (title: string, description?: string) => void;
  showWarning: (title: string, description?: string) => void;
  showInfo: (title: string, description?: string) => void;

  // Auth helpers
  login: (user: User, token: string) => void;
  logout: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'pt-BR',
  notifications: true,
  autoSave: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { toast } = useToast();
  
  //User State
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  //Subscription State
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loadingSubscription, setLoadingSubscription] = useState(false)

  //Setting State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = !!user;

  //Subscription load when logging
  useEffect(() => {
    if(isAuthenticated) {
      refreshSubscription();
    } else {
      setSubscription(null);
      setUsageStats(null);
    }
  }, [isAuthenticated])

  
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('appSettings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Toast helpers
  const showSuccess = useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  }, [toast]);

  const showError = useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'destructive',
    });
  }, [toast]);

  const showWarning = useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  }, [toast]);

  const showInfo = useCallback((title: string, description?: string) => {
    toast({
      title,
      description,
      variant: 'default',
    });
  }, [toast]);

  // Auth helpers
  const login = useCallback((userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);
    showSuccess('Login realizado', 'Bem-vindo de volta!');
  }, [showSuccess]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    showInfo('Logout realizado', 'Até logo!');
  }, [showInfo]);

  const value: AppContextType = {
    user,
    setUser,
    isAuthenticated,
    settings,
    updateSettings,
    isLoading,
    setIsLoading,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    login,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
