import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, XCircle, Camera } from 'lucide-react';
import { UsageStats } from '@/types/subscription';
import { cn } from '@/lib/cssMerge';

interface UsageProgressBarProps {
  usageStatus: UsageStats;
  showWarnings?: boolean;
  className?: string;
}

export function UsageProgressBar({ usageStatus, showWarnings = true, className }: UsageProgressBarProps) {
  const { photosUsed, photoLimit, percentage, isNearLimit, isAtLimit, overagePhotos } = usageStatus;

  const getProgressColor = () => {
    if (isAtLimit) return 'bg-destructive';
    if (isNearLimit) return 'bg-yellow-500';
    return 'bg-primary';
  };

  const displayPercentage = Math.min(percentage, 100);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">Uso de fotos no mês</span>
        </div>
        <span className={cn(
          'font-semibold',
          isAtLimit && 'text-destructive',
          isNearLimit && !isAtLimit && 'text-yellow-600'
        )}>
          {photosUsed} de {photoLimit} fotos
          {overagePhotos > 0 && (
            <span className="text-muted-foreground ml-1">
              (+{overagePhotos} excedentes)
            </span>
          )}
        </span>
      </div>

      <div className="relative">
        <Progress 
          value={displayPercentage} 
          className="h-3"
        />
        <div 
          className={cn(
            'absolute top-0 left-0 h-full rounded-full transition-all',
            getProgressColor()
          )}
          style={{ width: `${displayPercentage}%` }}
        />
      </div>

      {showWarnings && isNearLimit && !isAtLimit && (
        <Alert className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            Você está usando <strong>{percentage}%</strong> do seu limite mensal. 
            Considere fazer upgrade para evitar bloqueio.
          </AlertDescription>
        </Alert>
      )}

      {showWarnings && isAtLimit && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Você atingiu o limite de fotos do seu plano. 
            {usageStatus.allowsOverage 
              ? 'Você pode aceitar cobranças por foto excedente ou fazer upgrade.'
              : 'Faça upgrade para continuar usando o OCR.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
