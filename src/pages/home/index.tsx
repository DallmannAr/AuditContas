import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ValuesCard } from "@/components/ValuesCard";
import { TableInfoSection } from "@/components/TableInfoSection";
import { MonthlyReportChart } from "@/components/MonthlyReportChart";
import { CategoryChart } from "@/components/CategoryChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from '@/lib/translations';
import { reportService } from "@/services/reportService";
import type { Report } from "@/types/api";
import { toast } from "sonner";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAllReports();
        setReports(data);
      } catch (err: any) {
        toast.error(err.message || 'Erro ao conectar ao servidor de faturas');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">{t.nav.home}</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder={t.nav.search} 
                className="pl-10 w-64"
                onFocus={() => navigate("/search")}
              />
            </div>
            <Button onClick={() => navigate("/table-upload")} className="gap-2">
              <Plus className="w-4 h-4" />
              {t.common.create}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t.common.loading}</p>
          </div>
        ) : (
          /* Main Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Values and Charts */}
            <div className="lg:col-span-2 space-y-6">
              <ValuesCard reports={reports} />
              <MonthlyReportChart reports={reports} />
              <CategoryChart reports={reports} />
            </div>

            {/* Right Column - TableInfo Sections */}
            <div className="space-y-6">
              <TableInfoSection title="Trabalhos Recentes" type="recent" reports={reports} />
              <TableInfoSection title="Trabalhos Pagos" type="paid" reports={reports} />
              <TableInfoSection title="Em Pendente" type="pending" reports={reports} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
