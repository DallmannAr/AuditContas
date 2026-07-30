import { RefreshCw, CheckCircle, Clock } from "lucide-react";
import type { Report } from "@/types/api";

interface TableInfoSectionProps {
  title: string;
  type: "recent" | "paid" | "pending";
  reports: Report[];
}

const icons = {
  recent: RefreshCw,
  paid: CheckCircle,
  pending: Clock,
};

const statusColors = {
  recent: "bg-chart-1",
  paid: "bg-chart-2",
  pending: "bg-chart-3",
};

export function TableInfoSection({ title, type, reports = [] }: TableInfoSectionProps) {
  const Icon = icons[type];
  const statusColor = statusColors[type];

  const getFilteredReports = () => {
    let filtered = [...reports];
    if (type === "recent") {
      filtered.sort((a, b) => new Date(b.processedAt || b.createdAt).getTime() - new Date(a.processedAt || a.createdAt).getTime());
    } else if (type === "paid") {
      filtered = filtered.filter(r => (r.pendingValue || 0) === 0);
      filtered.sort((a, b) => new Date(b.processedAt || b.createdAt).getTime() - new Date(a.processedAt || a.createdAt).getTime());
    } else if (type === "pending") {
      filtered = filtered.filter(r => (r.pendingValue || 0) > 0);
      filtered.sort((a, b) => new Date(b.processedAt || b.createdAt).getTime() - new Date(a.processedAt || a.createdAt).getTime());
    }
    return filtered.slice(0, 3);
  };

  const items = getFilteredReports();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2 px-2">Nenhum relatório encontrado</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 hover:bg-muted/50 rounded px-2 transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${statusColor}`}></div>
                <div>
                  <p className="text-sm font-medium truncate max-w-[180px]" title={item.title}>
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(item.totalValue)}
                    {type === "pending" && ` (Pendente: ${formatCurrency(item.pendingValue)})`}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(item.processedAt || item.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
