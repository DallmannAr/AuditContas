import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Report } from "@/types/api";

interface CategoryChartProps {
  reports: Report[];
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-5))",
];

export function CategoryChart({ reports = [] }: CategoryChartProps) {
  const getCategoryData = () => {
    const categories: Record<string, number> = {};
    
    // Agrupar faturamento por convênio
    reports.forEach((report) => {
      const key = report.covenant || 'Sem Convênio';
      categories[key] = (categories[key] || 0) + Number(report.totalValue || 0);
    });

    const entries = Object.entries(categories).map(([name, value]) => ({
      name,
      value
    }));

    // Ordenar pelo maior faturamento
    entries.sort((a, b) => b.value - a.value);

    // Se houver mais de 4 convênios, agrupar o restante em "Outros"
    if (entries.length > 4) {
      const top = entries.slice(0, 3);
      const othersValue = entries.slice(3).reduce((sum, item) => sum + item.value, 0);
      top.push({ name: 'Outros Convênios', value: othersValue });
      return top;
    }

    return entries;
  };

  const chartData = getCategoryData();

  const dataWithColors = chartData.map((item, index) => ({
    ...item,
    color: COLORS[index % COLORS.length]
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria (Convênio)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataWithColors}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {dataWithColors.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => [formatCurrency(value), '']}
          />
          <Legend 
            wrapperStyle={{ color: "hsl(var(--foreground))" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
