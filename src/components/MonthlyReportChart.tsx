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


// Mocked data - monthly financial values in Reais
const chartData = [
  { month: "Jan", receita: 3200, despesa: 1800 },
  { month: "Fev", receita: 4100, despesa: 2200 },
  { month: "Mar", receita: 3800, despesa: 2000 },
  { month: "Abr", receita: 5200, despesa: 2800 },
  { month: "Mai", receita: 4700, despesa: 2500 },
  { month: "Jun", receita: 5000, despesa: 2600 },
];

export function MonthlyReportChart() {
const { t } = useTranslation()

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
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            labelStyle={{ color: "hsl(var(--foreground))" }}
            formatter={(value: number) => `R$${value}`}
          />
          <Legend 
            wrapperStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Bar dataKey="receita" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          <Bar dataKey="despesa" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
