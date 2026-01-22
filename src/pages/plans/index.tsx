// src/pages/Plans/index.tsx
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Zap, Crown, TrendingUp } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/translations';
import { PLANS, PLAN_ORDER, calculateUsageStats, OVERAGE_PHOTO_PRICE } from '@/types/subscription';
import type { UserSubscription, SubscriptionPlan } from '@/types/subscription';
import { subscriptionService } from '@/services/subscriptionService';
import { toast } from 'sonner';

export default function Plans() {
  const { t } = useTranslation();
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await subscriptionService.getCurrentSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
      toast.error('Erro ao carregar dados da assinatura');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newPlan: SubscriptionPlan) => {
    if (!subscription) return;

    if (subscription.plan === newPlan) {
      toast.info('Você já está neste plano');
      return;
    }

    // Verificar se é downgrade
    const currentIndex = PLAN_ORDER.indexOf(subscription.plan);
    const newIndex = PLAN_ORDER.indexOf(newPlan);

    if (newIndex < currentIndex) {
      toast.error('Não é possível fazer downgrade. Entre em contato com o suporte.');
      return;
    }

    setUpgrading(true);

    try {
      const updated = await subscriptionService.upgradePlan(newPlan);
      setSubscription(updated);
      toast.success('Plano atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao fazer upgrade:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar plano');
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t.common.loading}</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stats = subscription ? calculateUsageStats(subscription) : null;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t.plans.title}</h1>
          <p  className="text-muted-foreground">
            {t.plans.plansDescription}
          </p>
        </div>

        {/* Current Usage */}
        {subscription && stats && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t.plans.currentPlan}</CardTitle>
              <CardDescription>
                {t.usage.dueLimit} {new Date(subscription.endDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{t.plans.photosUsed}</span>
                    <span className="text-muted-foreground">
                      {stats.photosUsed} / {stats.photoLimit}
                    </span>
                  </div>
                  <Progress 
                    value={stats.percentage} 
                    className={`h-2 ${stats.percentage >= 80 ? 'bg-orange-200' : ''}`}
                  />
                  <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                    <span>{stats.remainingPhotos} {t.plans.photosRemaining}</span>
                    <span>{stats.percentage.toFixed(0)}%</span>
                  </div>
                </div>

                {stats.overagePhotos > 0 && (
                  <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-primary">
                          {t.plans.overagePhotos}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stats.overagePhotos} {t.usage.photos} × R$ {OVERAGE_PHOTO_PRICE.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        R$ {(stats.overagePhotos * OVERAGE_PHOTO_PRICE).toFixed(2)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLAN_ORDER.map((planId) => {
            const plan = PLANS[planId];
            const isCurrentPlan = subscription?.plan === planId;
            const currentIndex = subscription ? PLAN_ORDER.indexOf(subscription.plan) : -1;
            const planIndex = PLAN_ORDER.indexOf(planId);
            const isUpgrade = planIndex > currentIndex;
            const isDowngrade = planIndex < currentIndex;

            return (
              <Card
                key={planId}
                className={`relative ${
                  isCurrentPlan
                    ? 'border-primary border-2 shadow-lg'
                    : plan.recommended
                    ? 'border-primary/50'
                    : ''
                }`}
              >
                {plan.recommended && !isCurrentPlan && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    <Crown className="w-3 h-3 mr-1" />
                    {t.plans.recommended}
                  </Badge>
                )}

                {isCurrentPlan && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
                    <Check className="w-3 h-3 mr-1" />
                    {t.plans.currentPlan}
                  </Badge>
                )}

                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {plan.photoLimit === 0 && <Zap className="w-5 h-5" />}
                    {plan.photoLimit > 0 && <TrendingUp className="w-5 h-5" />}
                    {plan.name}
                  </CardTitle>
                  <CardDescription>
                    {plan.photoLimit === 0
                      ? (t.usage.limitReachedTitle)
                      : `${plan.photoLimit}  ${t.plans.perMonth}`}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Price */}
                  <div>
                    <div className="text-4xl font-bold">
                      {t.usage.coin} {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t.plans.perMonth}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full"
                    variant={isCurrentPlan ? 'outline' : isUpgrade ? 'default' : 'ghost'}
                    disabled={isCurrentPlan || isDowngrade || upgrading}
                    onClick={() => handleUpgrade(planId)}
                  >
                    {upgrading && t.common.loading}
                    {!upgrading && isCurrentPlan && t.plans.currentPlan}
                    {!upgrading && isUpgrade && t.plans.selectPlan}
                    {!upgrading && isDowngrade && t.common.unavailable}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>


          
        {/* Excess Photos Info 

          We need to translate that after the testing phase

          */}
        <Card className="mt-8 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sobre Fotos Excedentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Plano Foto 200:</strong> Após usar suas 200 fotos mensais, 
              você pode continuar usando o OCR pagando R$ {OVERAGE_PHOTO_PRICE.toFixed(2)} por foto adicional.
            </p>
            <p className="text-muted-foreground">
              • As fotos excedentes são cobradas à parte na sua fatura mensal
            </p>
            <p className="text-muted-foreground">
              • Você precisa aceitar explicitamente usar fotos excedentes
            </p>
            <p className="text-muted-foreground">
              • Esta opção está disponível apenas no plano Foto 200 
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}