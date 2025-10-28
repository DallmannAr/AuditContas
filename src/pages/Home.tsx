// src/pages/Home.tsx
import { DashboardLayout } from "@/components/DashboardLayout";
import { ValuesCard } from "@/components/ValuesCard";
import { TableInfoSection } from "@/components/TableInfoSection";
import { MonthlyReportChart } from "@/components/MonthlyReportChart";
import { CategoryChart } from "@/components/CategoryChart";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Home</h1>
            {user && (
              <p className="text-muted-foreground mt-1">
                Bem-vindo, {user.name || user.email}
              </p>
            )}
          </div>
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
          <div className="space-y-6">
            <TableInfoSection title="Trabalhos Recentes" type="recent"/>
            <TableInfoSection title="Trabalhos Pagos" type="paid"/>
            <TableInfoSection title="Trabalhos Pendentes" type="pending"/>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}