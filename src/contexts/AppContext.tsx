import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionService } from '@/services/subscriptionService';
import type { UserSubscription, UsageStats, SubscriptionPlan } from '@/types/subscription';
import { calculateUsageStats } from '@/types/subscription';

interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  notifications: boolean;
  autoSave: boolean;
}

interface AppContextType {
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
  const { isAuthenticated } = useAuth();
  
  //Subscription State
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);

  //Setting State
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('appSettings');
    return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const hasShownNearLimitToast = useRef(false);

  //Subscription load when logging
  useEffect(() => {
    if (isAuthenticated) {
      refreshSubscription();
    } else {
      setSubscription(null);
      setUsageStats(null);
      hasShownNearLimitToast.current = false;
    }
  }, [isAuthenticated]);

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

  //Refresh status when subscription chage
  useEffect(() => {
    if (subscription) {
      const stats = calculateUsageStats(subscription);
      setUsageStats(stats);

      //Save in local storage 
      localStorage.setItem('userSubscription', JSON.stringify(subscription));

      //Show warnings if need
      if (stats.isNearLimit && !hasShownNearLimitToast.current && showWarning && settings.notifications) {
        showWarning(
          'Atenção: Limite Próximo',
          `Você usou ${stats.percentage.toFixed(0)}% do seu plano mensal` 
        );
        hasShownNearLimitToast.current = true;
      }
    }
  }, [subscription, showWarning, settings.notifications]);

  //Load user's subscription
  const refreshSubscription = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoadingSubscription(true);

    try {
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
  }, [isAuthenticated]);

  //Verify if the user can use OCR
  const canUseOCR = useCallback(async (): Promise<boolean> => {
    if (!subscription) {
      showError('Erro', 'Assinatura não encontrada');
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

    //Limit already capped
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
    } catch (error: any) {
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
  }, [showSuccess, showError]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('appSettings', JSON.stringify(updated));

      if (newSettings.theme) {
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

  const value: AppContextType = {
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
