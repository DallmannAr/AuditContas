import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Upload, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ExtractedData {
  fileName: string;
  headers: string[];
  rows: string[][];
}

export default function TableUpload() {
  const navigate = useNavigate();
  const [extractedData, setExtractedData] = useState<ExtractedData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    
    // Simulate PDF processing
    setTimeout(() => {
      const mockData: ExtractedData[] = Array.from(files).map((file) => ({
        fileName: file.name,
        headers: ["Data", "Nome do Paciente", "Procedimento", "Valor", "Repasse"],
        rows: [
          ["02/06/25", "ANGELITA OLIVEIRA", "RETINOGRAFIA", "960,00", "336,00"],
          ["03/06/25", "ANA MARIA CORREIA", "CONSULTA", "240,00", "144,00"],
          ["03/06/25", "ELIANE ROSA DE", "CONSULTA", "240,00", "144,00"],
          ["04/06/25", "BENVINDA TIGRE", "PTERIGIO - EXERESE", "1.235,00", "494,00"],
        ],
      }));
      
      setExtractedData(mockData);
      setIsProcessing(false);
      toast.success(`${files.length} arquivo(s) processado(s) com sucesso!`);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">Upload e Extração de PDF</h1>
        </div>

        {/* Upload Area */}
        <div className="bg-card rounded-lg p-8 border-2 border-dashed border-border mb-8">
          <div className="flex flex-col items-center justify-center py-12">
            <Upload className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Faça upload de arquivos PDF
            </h3>
            <p className="text-muted-foreground mb-6">
              Arraste e solte ou clique para selecionar
            </p>
            <label htmlFor="file-upload">
              <Button asChild disabled={isProcessing}>
                <span className="cursor-pointer">
                  {isProcessing ? "Processando..." : "Selecionar Arquivos"}
                </span>
              </Button>
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Extracted Data Display */}
        {extractedData.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dados Extraídos</h2>
            {extractedData.map((data, index) => (
              <div key={index} className="bg-card rounded-lg p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{data.fileName}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {data.headers.map((header, i) => (
                          <th
                            key={i}
                            className="text-left py-3 px-4 font-semibold text-sm"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.rows.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                        >
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="py-3 px-4 text-sm">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            
            <div className="flex gap-4">
              <Button variant="secondary">Exportar Dados</Button>
              <Button variant="outline">Comparar Tabelas</Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
