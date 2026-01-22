// src/types/subscription.ts

export type SubscriptionPlan = 'basic' | 'photo_60' | 'photo_100' | 'photo_150' | 'photo_200';

export interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  photoLimit: number;
  price: number;
  features: string[];
  recommended?: boolean;
}

export interface UserSubscription {
  id: number;
  userId: number;
  plan: SubscriptionPlan;
  photosUsed: number;
  photoLimit: number;
  price: number;
  overagePhotos: number;
  overagePhotoPrice: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  autoRenew: boolean;
}

export interface UsageStats {
  photosUsed: number;
  photoLimit: number;
  percentage: number;
  remainingPhotos: number;
  overagePhotos: number;
  canUseOCR: boolean;
  needsUpgrade: boolean;
  isNearLimit: boolean; // >=80%
  isAtLimit:boolean; // >=100%
}

export const PLANS: Record<SubscriptionPlan, PlanDetails> = {
  basic: {
    id: 'basic',
    name: 'Básico (Excel/PDF)',
    photoLimit: 0,
    price: 49,
    features: [
      'Processamento de Excel e PDF',
      'Exportação de dados',
      'Suporte por email',
      'Sem OCR de fotos',
    ],
  },
  photo_60: {
    id: 'photo_60',
    name: 'Foto 60',
    photoLimit: 60,
    price: 89,
    features: [
      'Tudo do Básico',
      '60 fotos com OCR por mês',
      'Extração de tabelas complexas',
      'Suporte prioritário',
    ],
  },
  photo_100: {
    id: 'photo_100',
    name: 'Foto 100',
    photoLimit: 100,
    price: 129,
    features: [
      'Tudo do Foto 60',
      '100 fotos com OCR por mês',
      'Processamento em lote',
      'API de integração',
    ],
    recommended: true,
  },
  photo_150: {
    id: 'photo_150',
    name: 'Foto 150',
    photoLimit: 150,
    price: 179,
    features: [
      'Tudo do Foto 100',
      '150 fotos com OCR por mês',
      'Prioridade no processamento',
      'Relatórios avançados',
    ],
  },
  photo_200: {
    id: 'photo_200',
    name: 'Foto 200',
    photoLimit: 200,
    price: 239,
    features: [
      'Tudo do Foto 150',
      '200 fotos com OCR por mês',
      'Fotos adicionais: R$ 1,50/foto',
      'Suporte dedicado 24/7',
    ],
  },
};

export const OVERAGE_PHOTO_PRICE = 1.50; // R$ por foto excedente

export const PLAN_ORDER: SubscriptionPlan[] = [
  'basic',
  'photo_60',
  'photo_100',
  'photo_150',
  'photo_200',
];

export function getNextPlan(currentPlan: SubscriptionPlan): SubscriptionPlan | null {
  const currentIndex = PLAN_ORDER.indexOf(currentPlan);
  if (currentIndex === -1 || currentIndex === PLAN_ORDER.length - 1) {
    return null;
  }
  return PLAN_ORDER[currentIndex + 1];
}

export function getPlanDetails(plan: SubscriptionPlan): PlanDetails {
  return PLANS[plan];
}

export function calculateUsageStats(subscription: UserSubscription): UsageStats {
  const percentage = subscription.photoLimit > 0
    ? (subscription.photosUsed / subscription.photoLimit) * 100
    : 0;

  return {
    photosUsed: subscription.photosUsed,
    photoLimit: subscription.photoLimit,
    percentage: Math.min(percentage, 100),
    remainingPhotos: Math.max(0, subscription.photoLimit - subscription.photosUsed),
    overagePhotos: subscription.overagePhotos || 0,
    canUseOCR: subscription.plan !== 'basic' && (
      subscription.photosUsed < subscription.photoLimit ||
      (subscription.plan === 'photo_200' && subscription.overagePhotos >= 0)
    ),
    needsUpgrade: subscription.photosUsed >= subscription.photoLimit && subscription.plan !== 'photo_200',
    isNearLimit: percentage >= 80,
    isAtLimit: percentage >= 100
  };
}