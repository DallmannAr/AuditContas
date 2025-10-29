import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Vendas", value: 4500, color: "hsl(var(--chart-1))" },
  { name: "Serviços", value: 3200, color: "hsl(var(--chart-2))" },
  { name: "Produtos", value: 2800, color: "hsl(var(--chart-3))" },
  { name: "Outros", value: 1500, color: "hsl(var(--chart-5))" },
];

export function CategoryChart() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border h-full">
      <h3 className="text-lg font-semibold mb-4">Distribuição por Categoria</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
            }}
            formatter={(value: number) => `R$${value.toLocaleString()}`}
          />
          <Legend 
            wrapperStyle={{ color: "hsl(var(--foreground))" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
