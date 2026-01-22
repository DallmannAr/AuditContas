// src/services/subscriptionService.ts
import api from '@/lib/api';
import { UserSubscription, SubscriptionPlan } from '@/types/subscription';

class SubscriptionService {
  /**
   * Obtém assinatura do usuário atual
   */
  async getCurrentSubscription(): Promise<UserSubscription> {
    const response = await api.get<UserSubscription>('/subscriptions/current');
    return response.data;
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
    const response = await api.get('/subscriptions/can-use-ocr');
    return response.data;
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
    const response = await api.post('/subscriptions/register-usage');
    return response.data;
  }

  /**
   * Faz upgrade do plano
   */
  async upgradePlan(newPlan: SubscriptionPlan): Promise<UserSubscription> {
    const response = await api.post<UserSubscription>('/subscriptions/upgrade', {
      newPlan,
    });
    return response.data;
  }

  /**
   * Aceita cobrança de fotos excedentes (apenas Foto 200)
   */
  async acceptExcessCharges(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post('/subscriptions/accept-excess');
    return response.data;
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
    const response = await api.get('/subscriptions/usage-history', {
      params: { month },
    });
    return response.data;
  }

  /**
   * Cancela assinatura
   */
  async cancelSubscription(): Promise<{
    success: boolean;
    message: string;
  }> {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  }

  /**
   * Reativa assinatura
   */
  async reactivateSubscription(): Promise<UserSubscription> {
    const response = await api.post<UserSubscription>('/subscriptions/reactivate');
    return response.data;
  }
}

export const subscriptionService = new SubscriptionService();