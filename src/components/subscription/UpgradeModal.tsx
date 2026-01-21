import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlanDetails, SubscriptionPlan, UsageStats } from '@/types/subscription';
import { PlanCard } from './PlanCard';
import { ArrowUp, AlertCircle } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usageStats: UsageStats;
  currentPlanId: string | null;
  plans: PlanDetails;
  onUpgrade: (planId: string) => Promise<boolean>;
}

export function UpgradeModal({
  open,
  onOpenChange,
  usageStats,
  currentPlanId,
  plans,
  onUpgrade,
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  // Filter plans that are upgrades from current
  const currentPlan = plans.find(p => p.id === currentPlanId);
  const upgradePlans = plans.filter(
    p => !currentPlanId || p.display_order > (currentPlan?.display_order || 0)
  );

  const handleUpgrade = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    const success = await onUpgrade(selectedPlan);
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5 text-primary" />
            Fazer Upgrade do Plano
          </DialogTitle>
          <DialogDescription>
            Você atingiu o limite do seu plano atual. Escolha um plano com mais fotos para continuar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Seu uso atual ({usageStatus.photosUsed} fotos) será mantido ao fazer upgrade.
            O novo limite será aplicado imediatamente.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {upgradePlans.map((plan) => (
            <div
              key={plan.id}
              className={`cursor-pointer transition-all ${
                selectedPlan === plan.id ? 'ring-2 ring-primary rounded-lg' : ''
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              <PlanCard
                plan={plan}
                isRecommended={plan.slug === 'foto-100'}
                onSelect={setSelectedPlan}
              />
            </div>
          ))}
        </div>

        {upgradePlans.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Você já está no plano máximo. 
              {usageStatus.allowsOverage && (
                <span> Aceite as cobranças por foto excedente para continuar.</span>
              )}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpgrade}
            disabled={!selectedPlan || loading}
          >
            {loading ? 'Processando...' : 'Confirmar Upgrade'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
