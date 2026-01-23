import { DashboardLayout } from "@/components/DashboardLayout";
import { ValuesCard } from "@/components/ValuesCard";
import { TableInfoSection } from "@/components/TableInfoSection";
import { MonthlyReportChart } from "@/components/MonthlyReportChart";
import { CategoryChart } from "@/components/CategoryChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Table } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from '@/lib/translations';


export default function Home() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Home</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder={t.nav.search} 
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => navigate("/table-upload")} className="gap-2">
              <Plus className="w-4 h-4" />
              {t.common.create}
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Values and Charts */}
          <div className="lg:col-span-2 space-y-6">
            <ValuesCard />
            <MonthlyReportChart />
            <CategoryChart />
          </div>

          {/* Right Column - TableInfo Sections */}
          <div className="space-y-6">
            <TableInfoSection title="Trabalhos Recentes" type="recent" />
            <TableInfoSection title="Trabalhos Pagos" type="paid" />
            <TableInfoSection title="Em Pendente" type="pending" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
