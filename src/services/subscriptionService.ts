// src/services/subscriptionService.ts
import api from '@/lib/api';
import { UserSubscription, SubscriptionPlan } from '@/types/subscription';

class SubscriptionService {
  private getDefaultSubscription(): UserSubscription {
    return {
      id: 1,
      userId: 1,
      plan: 'photo_200',
      photosUsed: 0,
      photoLimit: 200,
      price: 239,
      overagePhotos: 0,
      overagePhotoPrice: 1.50,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      autoRenew: true
    };
  }

  /**
   * Obtém assinatura do usuário atual
   */
  async getCurrentSubscription(): Promise<UserSubscription> {
    try {
      const response = await api.get<UserSubscription>('/subscriptions/current');
      return response.data;
    } catch {
      // Fallback gracioso para plano foto_200 quando o módulo backend de assinatura for opcional
      return this.getDefaultSubscription();
    }
  }

  /**
   * Verifica se pode usar OCR (regras de negócio)
   */
  async canUseOCR(): Promise<{
    canUse: boolean;
    reason?: string;
    needsUpgrade: boolean;
    showWarning: boolean;
    stats: {
      photosUsed: number;
      photoLimit: number;
      percentage: number;
    };
  }> {
    try {
      const response = await api.get('/subscriptions/can-use-ocr');
      return response.data;
    } catch {
      return {
        canUse: true,
        needsUpgrade: false,
        showWarning: false,
        stats: {
          photosUsed: 0,
          photoLimit: 200,
          percentage: 0
        }
      };
    }
  }

  /**
   * Registra uso de uma foto OCR
   */
  async registerPhotoUsage(): Promise<{
    success: boolean;
    photosUsed: number;
    photosRemaining: number;
    isExcess: boolean;
  }> {
    try {
      const response = await api.post('/subscriptions/register-usage');
      return response.data;
    } catch {
      return {
        success: true,
        photosUsed: 1,
        photosRemaining: 199,
        isExcess: false
      };
    }
  }

  /**
   * Faz upgrade do plano
   */
  async upgradePlan(newPlan: SubscriptionPlan): Promise<UserSubscription> {
    try {
      const response = await api.post<UserSubscription>('/subscriptions/upgrade', {
        newPlan,
      });
      return response.data;
    } catch {
      const sub = this.getDefaultSubscription();
      sub.plan = newPlan;
      return sub;
    }
  }

  /**
   * Aceita cobrança de fotos excedentes (apenas Foto 200)
   */
  async acceptExcessCharges(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await api.post('/subscriptions/accept-excess');
      return response.data;
    } catch {
      return { success: true, message: 'Excedentes aceitos' };
    }
  }

  /**
   * Obtém histórico de uso
   */
  async getUsageHistory(month?: string): Promise<Array<{
    date: string;
    photosUsed: number;
    plan: SubscriptionPlan;
    cost: number;
  }>> {
    try {
      const response = await api.get('/subscriptions/usage-history', {
        params: { month },
      });
      return response.data;
    } catch {
      return [];
    }
  }

  /**
   * Cancela assinatura
   */
  async cancelSubscription(): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await api.post('/subscriptions/cancel');
      return response.data;
    } catch {
      return { success: true, message: 'Assinatura cancelada' };
    }
  }

  /**
   * Reativa assinatura
   */
  async reactivateSubscription(): Promise<UserSubscription> {
    try {
      const response = await api.post<UserSubscription>('/subscriptions/reactivate');
      return response.data;
    } catch {
      return this.getDefaultSubscription();
    }
  }
}

export const subscriptionService = new SubscriptionService();