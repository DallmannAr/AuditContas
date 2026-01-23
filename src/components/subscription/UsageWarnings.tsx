// src/components/UsageWarnings.tsx
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Ban, TrendingUp } from 'lucide-react';
import { UsageStats } from '@/types/subscription';
import { useTranslation } from '@/lib/translations';
import { useNavigate } from 'react-router-dom';

interface UsageWarning80Props {
  stats: UsageStats;
}

export function UsageWarning80({ stats }: UsageWarning80Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!stats.isNearLimit || !stats.isAtLimit) return null;

  return (
    <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
      <AlertTriangle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-900 dark:text-orange-100">
        {t.usage.warning80Title}
      </AlertTitle>
      <AlertDescription className="text-orange-800 dark:text-orange-200">
        <p className="mb-3">{t.usage.warning80Description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{stats.photosUsed} de {stats.photoLimit} fotos usadas</span>
            <span>{stats.percentage.toFixed(0)}%</span>
          </div>
          <Progress value={stats.percentage} className="h-2" />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => navigate('/plans')}
        >
          {t.usage.upgradeNow}
        </Button>
      </AlertDescription>
    </Alert>
  );
}

interface LimitReachedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stats: UsageStats;
  canUseExcess: boolean; // Se é plano Foto 200
  onUpgrade: () => void;
  onAcceptExcess?: () => void;
}

export function LimitReachedDialog({
  open,
  onOpenChange,
  stats,
  canUseExcess,
  onUpgrade,
  onAcceptExcess,
}: LimitReachedDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Ban className="h-6 w-6 text-destructive" />
            <AlertDialogTitle>{t.usage.limitReachedTitle}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {t.usage.limitReachedDescription}
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{t.plans.photosUsed}:</span>
                <span className="text-destructive font-bold">
                  {stats.photosUsed} / {stats.photoLimit}
                </span>
              </div>
              <Progress value={100} className="h-2" />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
          
          {canUseExcess && onAcceptExcess ? (
            <>
              <Button variant="outline" onClick={onUpgrade}>
                {t.usage.upgradeNow}
              </Button>
              <AlertDialogAction onClick={onAcceptExcess}>
                {t.usage.continueWithExcess}
              </AlertDialogAction>
            </>
          ) : (
            <AlertDialogAction onClick={onUpgrade}>
              {t.usage.upgradeNow}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ExcessConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  excessPrice: number;
}

export function ExcessConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  excessPrice,
}: ExcessConfirmDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <AlertDialogTitle>{t.usage.excessConfirmTitle}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            <p className="mb-4">{t.usage.excessConfirmDescription}</p>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  R$ {excessPrice.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  por foto adicional
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Você será cobrado apenas pelas fotos que usar acima do limite.
              O valor será adicionado à sua fatura mensal.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t.common.confirm}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}