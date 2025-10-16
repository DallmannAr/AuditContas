import { DashboardLayout } from "@/components/DashboardLayout";
import { ValuesCard } from "@/components/ValuesCard";
import { RecentWorks } from "@/components/RecentWorks";
import { MonthlyReportChart } from "@/components/MonthlyReportChart";
import { CategoryChart } from "@/components/CategoryChart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Home</h1>
          <Button onClick={() => navigate("/table-upload")} className="gap-2">
            <Plus className="w-4 h-4" />
            Criar
          </Button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Values and Chart */}
          <div className="lg:col-span-2 space-y-6">
            <ValuesCard />
            <MonthlyReportChart />
            <CategoryChart />
          </div>

          {/* Right Column - Recent Works */}
          <div>
            <RecentWorks />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
