import { useState } from "react";
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
import { Search as SearchIcon, Filter, X, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock data para resultados de pesquisa
const mockResults = [
  { 
    id: 1, 
    name: "Tabela_Procedimentos_Cardiologia", 
    procedure: "Cardiologia", 
    date: "15/10/25", 
    size: "450KB",
    status: "paid",
    items: 24
  },
  { 
    id: 2, 
    name: "Tabela_Exames_Laboratoriais", 
    procedure: "Laboratório", 
    date: "14/10/25", 
    size: "320KB",
    status: "pending",
    items: 18
  },
  { 
    id: 3, 
    name: "Tabela_Consultas_Ortopedia", 
    procedure: "Ortopedia", 
    date: "13/10/25", 
    size: "280KB",
    status: "recent",
    items: 15
  },
  { 
    id: 4, 
    name: "Tabela_Procedimentos_Neurologia", 
    procedure: "Neurologia", 
    date: "12/10/25", 
    size: "390KB",
    status: "paid",
    items: 21
  },
  { 
    id: 5, 
    name: "Tabela_Consultas_Pediatria", 
    procedure: "Pediatria", 
    date: "11/10/25", 
    size: "310KB",
    status: "recent",
    items: 19
  },
];

const statusLabels = {
  paid: "Pago",
  pending: "Pendente",
  recent: "Recente",
};

const statusColors = {
  paid: "bg-popover text-chart-1",
  pending: "bg-popover text-chart-3",
  recent: "bg-popover text-chart-2",
};

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [procedureFilter, setProcedureFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar resultados
  const filteredResults = mockResults.filter((result) => {
    const matchesSearch = result.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.procedure.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProcedure = procedureFilter === "all" || result.procedure === procedureFilter;
    const matchesStatus = statusFilter === "all" || result.status === statusFilter;
    
    return matchesSearch && matchesProcedure && matchesStatus;
  });

  const clearFilters = () => {
    setProcedureFilter("all");
    setStatusFilter("all");
    setDateFilter("all");
  };

  const activeFiltersCount = [procedureFilter, statusFilter, dateFilter].filter(f => f !== "all").length;

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pesquisa</h1>
          <p className="text-muted-foreground">
            Busque e filtre suas tabelas por procedimento, status e data
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
                    placeholder="Buscar por nome da tabela ou procedimento..."
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
                      <label className="text-sm font-medium">Procedimento</label>
                      <Select value={procedureFilter} onValueChange={setProcedureFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="Cardiologia">Cardiologia</SelectItem>
                          <SelectItem value="Laboratório">Laboratório</SelectItem>
                          <SelectItem value="Ortopedia">Ortopedia</SelectItem>
                          <SelectItem value="Neurologia">Neurologia</SelectItem>
                          <SelectItem value="Pediatria">Pediatria</SelectItem>
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
                          <SelectItem value="recent">Recente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data</label>
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
              {filteredResults.map((result) => (
                <Card key={result.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{result.name}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {result.date}
                          </span>
                          <span>•</span>
                          <span>{result.size}</span>
                          <span>•</span>
                          <span>{result.items} itens</span>
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{result.procedure}</Badge>
                        <Badge 
                          className={`${statusColors[result.status as keyof typeof statusColors]} bg-opacity-10`}
                        >
                          {statusLabels[result.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
