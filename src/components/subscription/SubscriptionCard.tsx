import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UsageProgressBar } from './UsageProgressBar';
import { UpgradeModal } from './UpgradeModal';
import { OverageAcceptModal } from './OverageAcceptModal';
import { ActiveSubscription, UsageStatus, Plan } from '@/types/subscription';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, Calendar, CreditCard, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubscriptionCardProps {
  subscription: ActiveSubscription;
  usageStatus: UsageStatus;
  plans: Plan[];
  onUpgrade: (planId: string) => Promise<boolean>;
  onAcceptOverage: () => Promise<boolean>;
}

export function SubscriptionCard({
  subscription,
  usageStatus,
  plans,
  onUpgrade,
  onAcceptOverage,
}: SubscriptionCardProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showOverage, setShowOverage] = useState(false);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const currentPlan = plans.find(p => p.id === subscription.plan_id);
  const renewalDate = format(new Date(subscription.current_period_end), "dd 'de' MMMM", { locale: ptBR });

  const needsUpgrade = usageStatus.isAtLimit && !usageStatus.allowsOverage;
  const needsOverageAccept = usageStatus.isAtLimit && usageStatus.allowsOverage && !usageStatus.overageAccepted;

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {subscription.plan_name}
                <Badge variant="secondary" className="font-normal">
                  Ativo
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Renova em {renewalDate}
                </span>
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {formatPrice(currentPlan?.price_cents || 0)}
              </div>
              <span className="text-sm text-muted-foreground">/mês</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <UsageProgressBar usageStatus={usageStatus} />

          {/* Overage charges summary */}
          {usageStatus.overagePhotosCount > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Fotos excedentes este mês</span>
              </div>
              <div className="text-right">
                <span className="font-semibold">
                  {usageStatus.overagePhotosCount} fotos
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({formatPrice(usageStatus.overagePhotosCount * (usageStatus.overagePriceCents || 150))})
                </span>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex flex-col sm:flex-row gap-2">
            {needsUpgrade && (
              <Button 
                className="flex-1" 
                variant="destructive"
                onClick={() => setShowUpgrade(true)}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Fazer Upgrade
              </Button>
            )}

            {needsOverageAccept && (
              <Button 
                className="flex-1" 
                variant="default"
                onClick={() => setShowOverage(true)}
              >
                Aceitar Excedente
              </Button>
            )}

            {!needsUpgrade && !needsOverageAccept && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowUpgrade(true)}
              >
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Mudar Plano
              </Button>
            )}

            <Button variant="ghost" asChild>
              <Link to="/plans">Ver todos os planos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        usageStatus={usageStatus}
        currentPlanId={subscription.plan_id}
        plans={plans}
        onUpgrade={onUpgrade}
      />

      <OverageAcceptModal
        open={showOverage}
        onOpenChange={setShowOverage}
        overagePriceCents={usageStatus.overagePriceCents || 150}
        onAccept={onAcceptOverage}
      />
    </>
  );
}
