import { RefreshCw } from "lucide-react";

const recentItems = [
  { name: "Table_Name1", date: "08/10/25", size: "300KB" },
  { name: "Table_Name2", date: "08/10/25", size: "450KB" },
  { name: "Table_Name1", date: "08/10/25", size: "280KB" },
];

export function RecentWorks() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="w-5 h-5" />
        <h3 className="font-semibold">Trabalhos recentes</h3>
      </div>
      <div className="space-y-3">
        {recentItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 hover:bg-muted/50 rounded px-2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
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
