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

  //Refresh status when subscription chage
  useEffect(() => {
    if(subscription) {
      const stats = calculateUsageStats(subscription);
      setUsageStats(stats);

      //Save in local storage 
      localStorage.setItem('userSubscription', JSON.stringify(subscription));

      //Show warnings if need
      if(showWarning && settings.notifications) {
        showWarning(
          'Atenção: Limite Próximo',
          `Você usou ${stats.percentage.toFixed(0)}% do seu plano mensal` 
        )
      }
    }
  }, [subscription])



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

  //Load user's subscription
  const refreshSubscription = useCallback(async  () => {
    if(!isAuthenticated) return;

    setLoadingSubscription(true);

    try{
        const data = await subscriptionService.getCurrentSubscription();
        setSubscription(data);
    } catch (error) {
      console.error('Error when loading subscription', error);

      //Try load with cache
      const cached = localStorage.getItem('userSubscription');
      if (cached) {
        setSubscription(JSON.parse(cached));
      }
    } finally {
      setLoadingSubscription(false);
    }
  }, [isAuthenticated])

  //Veryfy if the user can use OCR
  const canUseOCR= useCallback(async (): Promise<boolean> => {
    if (!subscription) {
      showError('Error', 'Subscription not found');
      return false;
    }

    if (subscription.plan === 'basic') {
      showError(
        'Plano Básico',
        'Seu plano não inclui OCR de fotos. Faça upgrade!'
      );
      return false;
    }

    if (!usageStats) return false;

    //Limit alreeady capped
    if (usageStats.needsUpgrade) return false;

    //Can use OCR
    if (usageStats.canUseOCR) return true;
  

    
  try {
    const result = await subscriptionService.canUseOCR();
    return result.canUse;
  } catch (error) {
    console.error('Erro ao verificar uso', error);
    return false;
  }
  }, [subscription, usageStats, showError]);

  //Register photo usage
  const registerPhotoUsage = useCallback(async () => {
    try { 
      await subscriptionService.registerPhotoUsage();

      //Refresh subscription to refresh the counters
      await refreshSubscription();  
    } catch (error:any) {
      console.error('Error when register use:', error);
      showError('Erro', error.message || 'Não foi possível registrar o uso');
      throw error;
    }
  }, [refreshSubscription, showError]);

  //Do plan upgrade
  const upgradePlan = useCallback(async (newPlan: SubscriptionPlan) => {
    try {
      const updated = await subscriptionService.upgradePlan(newPlan);
      setSubscription(updated);

      showSuccess(
        'Plano Atualizado!',
        'Seu plano foi atualizado com sucesso.'
      );
    } catch (error: any) {
      console.error('Erro ao fazer upgrade:', error);
      showError('Erro', error.message || 'Não foi possível atualizar o plano');
      throw error;
    }
  }, [showSuccess, showError])


  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('appSettings', JSON.stringify(updated));

      if(newSettings.theme){
        applyTheme(newSettings.theme);
      }

      return updated;
    });
  }, []);

  const applyTheme = (theme: AppSettings['theme']) => {
     if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

   useEffect(() => {
    applyTheme(settings.theme);
  }, []);

  // Auth helpers
  const login = useCallback((userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', token);

    showSuccess('Login realizado', 'Bem-vindo de volta!');

    refreshSubscription();
  }, [showSuccess, refreshSubscription]);

  const logout = useCallback(() => {
    setUser(null);
    setSubscription(null);
    setUsageStats(null);


    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userSubscription');
    showInfo('Logout realizado', 'Até logo!');
  }, [showInfo]);

  const value: AppContextType = {
    //User
    user,
    setUser,
    isAuthenticated,

    //Subscription
    subscription,
    usageStats,
    loadingSubscription,
    refreshSubscription,
    canUseOCR,
    registerPhotoUsage,
    upgradePlan,

    //Settings
    settings,
    updateSettings,

    //Loading
    isLoading,
    setIsLoading,

    //Toasts
    showSuccess,
    showError,
    showWarning,
    showInfo,

    //Auth 
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
