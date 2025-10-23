import { RefreshCw, CheckCircle, Clock } from "lucide-react";

interface TableInfoSectionProps {
  title: string;
  type: "recent" | "paid" | "pending";
}

const worksData = {
  recent: [
    { name: "Table_Name1", date: "08/10/25", size: "300KB" },
    { name: "Table_Name2", date: "08/10/25", size: "450KB" },
    { name: "Table_Name3", date: "08/10/25", size: "280KB" },
  ],
  paid: [
    { name: "Table_Paid1", date: "07/10/25", size: "500KB" },
    { name: "Table_Paid2", date: "06/10/25", size: "350KB" },
  ],
  pending: [
    { name: "Table_Pending1", date: "09/10/25", size: "420KB" },
    { name: "Table_Pending2", date: "09/10/25", size: "380KB" },
  ],
};

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

export function TableInfoSection({ title, type }: TableInfoSectionProps) {
  const Icon = icons[type];
  const items = worksData[type];
  const statusColor = statusColors[type];

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 hover:bg-muted/50 rounded px-2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.size}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
