import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTranslation } from "@/lib/translations";
import type { Report } from "@/types/api";

interface MonthlyReportChartProps {
  reports: Report[];
}

export function MonthlyReportChart({ reports = [] }: MonthlyReportChartProps) {
  const { t } = useTranslation();

  const getChartData = () => {
    const months = [];
    const now = new Date();
    
    // Gerar os últimos 6 meses dinamicamente
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('pt-BR', { month: 'short' });
      months.push({
        month: label.charAt(0).toUpperCase() + label.slice(1, 3), // Capitalizar (ex: Jan, Fev)
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        receita: 0, // Mapeado para valor Pago
        despesa: 0  // Mapeado para valor Pendente
      });
    }

    // Acumular valores reais do banco de dados
    reports.forEach((report) => {
      const date = new Date(report.processedAt || report.createdAt);
      const match = months.find(m => m.monthNum === date.getMonth() && m.year === date.getFullYear());
      if (match) {
        match.receita += Number(report.paidValue || 0);
        match.despesa += Number(report.pendingValue || 0);
      }
    });

    return months;
  };

  const chartData = getChartData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">{t.common.monthChart}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--foreground))" }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: "hsl(var(--foreground))" }}
            tickFormatter={(value) => `R$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => [formatCurrency(value), '']}
          />
          <Legend 
            wrapperStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Bar dataKey="receita" name="Recebido (R$)" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          <Bar dataKey="despesa" name="Pendente (R$)" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
