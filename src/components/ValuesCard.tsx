import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Period = "Dia" | "Semana" | "Mês" | "Ano";

export function ValuesCard() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("Mês");
  
  // Mock data that changes based on period
  const data = {
    Dia: { total: 350, pendente: 80 },
    Semana: { total: 2100, pendente: 450 },
    Mês: { total: 5000, pendente: 1000 },
    Ano: { total: 60000, pendente: 12000 },
  };

  const { total, pendente } = data[selectedPeriod];
  const percentage = ((total - pendente) / total) * 100;

  const periods: Period[] = ["Dia", "Semana", "Mês", "Ano"];

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Valores</h2>
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
          <p className="text-4xl font-bold">R${total.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-2">Pendente</p>
          <p className="text-4xl font-bold">R${pendente.toLocaleString()}</p>
        </div>
      </div>
      <div className="space-y-2">
        <Progress value={percentage} className="h-3" />
        <p className="text-right text-lg font-semibold">{percentage.toFixed(1)}%</p>
      </div>
    </div>
  );
}
