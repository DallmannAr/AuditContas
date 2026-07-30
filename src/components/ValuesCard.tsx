import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/translations";
import type { Report } from "@/types/api";

type Period = "Dia" | "Semana" | "Mês" | "Ano";

interface ValuesCardProps {
  reports: Report[];
}

export function ValuesCard({ reports = [] }: ValuesCardProps) {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Mês");
  const periods: Period[] = ["Dia", "Semana", "Mês", "Ano"];

  const calculateValues = (period: Period) => {
    const now = new Date();
    let totalValue = 0;
    let pendingValue = 0;

    reports.forEach((report) => {
      const date = new Date(report.processedAt || report.createdAt);
      let matches = false;

      if (period === "Dia") {
        matches = date.toDateString() === now.toDateString();
      } else if (period === "Semana") {
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        matches = diffDays <= 7;
      } else if (period === "Mês") {
        matches = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      } else if (period === "Ano") {
        matches = date.getFullYear() === now.getFullYear();
      }

      if (matches) {
        totalValue += report.totalValue || 0;
        pendingValue += report.pendingValue || 0;
      }
    });

    return { total: totalValue, pendente: pendingValue };
  };

  const { total, pendente } = calculateValues(selectedPeriod);
  const percentage = total > 0 ? ((total - pendente) / total) * 100 : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">{t.common.value}</h2>
        <div className="flex gap-2">
          {periods.map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="text-xs"
            >
              {period}
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Total</p>
          <p className="text-4xl font-bold">{formatCurrency(total)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">{t.common.pending}</p>
          <p className="text-4xl font-bold">{formatCurrency(pendente)}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Progress value={percentage} className="h-3" />
        <p className="text-right text-lg font-semibold">{percentage.toFixed(1)}%</p>
      </div>
    </div>
  );
}
