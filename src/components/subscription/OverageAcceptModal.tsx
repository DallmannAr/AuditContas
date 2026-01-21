import { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { DollarSign, AlertTriangle } from 'lucide-react';

interface OverageAcceptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  overagePriceCents: number;
  onAccept: () => Promise<boolean>;
}

export function OverageAcceptModal({
  open,
  onOpenChange,
  overagePriceCents,
  onAccept,
}: OverageAcceptModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(cents / 100);
  };

  const handleAccept = async () => {
    if (!accepted) return;
    
    setLoading(true);
    const success = await onAccept();
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Aceitar Fotos Excedentes
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Você atingiu o limite de 200 fotos do seu plano. 
                Para continuar usando o OCR, você pode aceitar a cobrança por fotos excedentes.
              </p>

              <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">
                    Preço por foto excedente: {formatPrice(overagePriceCents)}
                  </p>
                  <p className="text-muted-foreground">
                    Cada foto processada além do limite de 200 será cobrada separadamente.
                    As cobranças serão faturadas junto com sua próxima mensalidade.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="accept-terms"
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked === true)}
                />
                <Label htmlFor="accept-terms" className="text-sm leading-tight cursor-pointer">
                  Eu entendo e aceito ser cobrado {formatPrice(overagePriceCents)} por cada 
                  foto processada além do limite de 200 fotos/mês.
                </Label>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleAccept}
            disabled={!accepted || loading}
          >
            {loading ? 'Processando...' : 'Aceitar e continuar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
