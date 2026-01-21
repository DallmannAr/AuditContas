import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Camera, Zap } from 'lucide-react';
import { Plan } from '@/types/subscription';
import { cn } from '@/lib/cssMerge';

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  isRecommended?: boolean;
  onSelect: (planId: string) => void;
  loading?: boolean;
}

export function PlanCard({ plan, isCurrentPlan, isRecommended, onSelect, loading }: PlanCardProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const features = [
    plan.photo_limit > 0 
      ? `${plan.photo_limit} fotos/mês com OCR`
      : 'Apenas Excel/PDF (sem OCR)',
    'Extração de dados automatizada',
    'Dashboard de relatórios',
    'Suporte por email',
    ...(plan.allows_overage 
      ? [`Fotos extras a ${formatPrice(plan.overage_price_cents || 150)}/foto`]
      : []),
  ];

  return (
    <Card className={cn(
      'relative flex flex-col transition-all duration-300 hover:shadow-lg',
      isCurrentPlan && 'ring-2 ring-primary',
      isRecommended && 'border-primary shadow-lg scale-105'
    )}>
      {isRecommended && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          <Zap className="h-3 w-3 mr-1" />
          Mais popular
        </Badge>
      )}

      {isCurrentPlan && (
        <Badge variant="secondary" className="absolute -top-3 right-4">
          Plano atual
        </Badge>
      )}

      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription className="flex items-center justify-center gap-1">
          <Camera className="h-4 w-4" />
          {plan.photo_limit > 0 
            ? `${plan.photo_limit} fotos/mês`
            : 'Sem OCR por foto'}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="text-center mb-6">
          <span className="text-4xl font-bold">{formatPrice(plan.price_cents)}</span>
          <span className="text-muted-foreground">/mês</span>
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? 'secondary' : isRecommended ? 'default' : 'outline'}
          onClick={() => onSelect(plan.id)}
          disabled={isCurrentPlan || loading}
        >
          {isCurrentPlan ? 'Plano atual' : 'Selecionar'}
        </Button>
      </CardFooter>
    </Card>
  );
}
