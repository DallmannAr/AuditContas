import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Search as SearchIcon, Filter, X, Calendar, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { reportService } from "@/services/reportService";
import type { Report } from "@/types/api";
import { toast } from "sonner";

const statusLabels = {
  paid: "Pago",
  pending: "Pendente",
};

const statusColors = {
  paid: "bg-green-500 text-green-50",
  pending: "bg-amber-500 text-amber-50",
};

export default function Search() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [procedureFilter, setProcedureFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const data = await reportService.getAllReports();
        setReports(data);
      } catch (err: any) {
        toast.error(err.message || 'Erro ao carregar relatórios para pesquisa');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Extrair convênios únicos das faturas reais do banco
  const uniqueCovenants = Array.from(
    new Set(reports.map((r) => r.covenant).filter(Boolean))
  );

  // Filtrar resultados
  const filteredResults = reports.filter((result) => {
    const matchesSearch = 
      result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.covenant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.item.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesProcedure = procedureFilter === "all" || result.covenant === procedureFilter;
    
    // Status
    const status = (result.pendingValue || 0) === 0 ? "paid" : "pending";
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    
    // Filtro de Data
    let matchesDate = true;
    if (dateFilter !== "all") {
      const date = new Date(result.processedAt || result.createdAt);
      const diffTime = Math.abs(new Date().getTime() - date.getTime());
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (dateFilter === "today") {
        matchesDate = date.toDateString() === new Date().toDateString();
      } else if (dateFilter === "week") {
        matchesDate = diffDays <= 7;
      } else if (dateFilter === "month") {
        matchesDate = diffDays <= 30;
      }
    }
    
    return matchesSearch && matchesProcedure && matchesStatus && matchesDate;
  });

  const clearFilters = () => {
    setProcedureFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const activeFiltersCount = [procedureFilter, statusFilter, dateFilter].filter(f => f !== "all").length;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pesquisa</h1>
          <p className="text-muted-foreground">
            Busque e filtre suas tabelas por convênio, status e data
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              {/* Search Input */}
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por convênio, paciente, título ou procedimento..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button
                  variant={showFilters ? "default" : "outline"}
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Filters Section */}
              {showFilters && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Convênio</label>
                      <Select value={procedureFilter} onValueChange={setProcedureFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {uniqueCovenants.map((cov) => (
                            <SelectItem key={cov} value={cov}>
                              {cov}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="paid">Pago</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data de Processamento</label>
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="today">Hoje</SelectItem>
                          <SelectItem value="week">Última semana</SelectItem>
                          <SelectItem value="month">Último mês</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-2 self-start"
                    >
                      <X className="w-4 h-4" />
                      Limpar filtros
                    </Button>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Carregando relatórios...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {filteredResults.length} {filteredResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </h2>
            </div>

            {filteredResults.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <SearchIcon className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">Nenhum resultado encontrado</p>
                  <p className="text-sm text-muted-foreground">
                    Tente ajustar seus filtros ou termo de busca
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredResults.map((result) => {
                  const status = (result.pendingValue || 0) === 0 ? "paid" : "pending";
                  return (
                    <Card key={result.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-2">{result.title}</CardTitle>
                            <CardDescription className="flex flex-wrap gap-3">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(result.processedAt || result.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                              <span>•</span>
                              <span>Paciente: {result.patient}</span>
                              <span>•</span>
                              <span>Total: {formatCurrency(result.totalValue)}</span>
                              {(result.pendingValue || 0) > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-destructive font-medium">
                                    Pendente: {formatCurrency(result.pendingValue)}
                                  </span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge variant="outline">{result.covenant}</Badge>
                            <Badge className={`${statusColors[status]}`}>
                              {statusLabels[status]}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
