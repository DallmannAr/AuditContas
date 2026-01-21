// src/pages/TableUpload/index.tsx
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  ArrowLeft, 
  Download, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Loader2,
  ImageIcon,
  BarChart3
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOCR } from "@/hooks/useOCR";
import { OCRTableData } from "@/services/ocrService";

interface ProcessedFile {
  id: string;
  file: File;
  data?: OCRTableData;
  status: 'pending' | 'processing' | 'success' | 'error';
  error?: string;
  confidence?: number;
  method?: string;
  estimatedCost?: number;
}

export default function TableUpload() {
  const navigate = useNavigate();
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'azure' | 'claude' | 'smart'>('smart');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { processImage, loading } = useOCR({
    method: selectedMethod,
    showToast: true,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: ProcessedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const processAllFiles = async () => {
    setIsProcessing(true);

    for (const fileItem of files) {
      if (fileItem.status !== 'pending') continue;

      // Atualizar status para processing
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: 'processing' as const } : f
        )
      );

      try {
        const result = await processImage(fileItem.file);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  status: 'success' as const,
                  data: result.data,
                  confidence: result.averageConfidence,
                  method: result.method,
                  estimatedCost: result.estimatedCost,
                }
              : f
          )
        );
      } catch (error: any) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  status: 'error' as const,
                  error: error.message,
                }
              : f
          )
        );
      }

      // Pequeno delay entre processamentos
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const exportFile = (fileItem: ProcessedFile, format: 'csv' | 'json') => {
    if (!fileItem.data) return;

    const fileName = fileItem.file.name.replace(/\.[^/.]+$/, '');
    
    if (format === 'csv') {
      const csvContent = [
        fileItem.data.headers.join(','),
        ...fileItem.data.rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.csv`;
      link.click();
    } else {
      const jsonContent = JSON.stringify(fileItem.data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.json`;
      link.click();
    }
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;
  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const totalCost = files.reduce((sum, f) => sum + (f.estimatedCost || 0), 0);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Extração de Tabelas com IA</h1>
            <p className="text-muted-foreground mt-1">
              Faça upload de imagens de tabelas médicas para extrair dados automaticamente
            </p>
          </div>
        </div>

        {/* Method Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Método de Extração
            </CardTitle>
            <CardDescription>
              Escolha o método de processamento das imagens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedMethod('azure')}
                disabled={isProcessing}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedMethod === 'azure'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="font-semibold mb-1">Azure Vision</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Rápido e econômico
                </div>
                <div className="text-xs">
                  <Badge variant="outline">~85% precisão</Badge>
                  <Badge variant="outline" className="ml-2">$0.0015/img</Badge>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('smart')}
                disabled={isProcessing}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedMethod === 'smart'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="font-semibold mb-1 flex items-center gap-2">
                  Híbrido (Recomendado)
                  <Badge>✨</Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Melhor custo-benefício
                </div>
                <div className="text-xs">
                  <Badge variant="outline">~94% precisão</Badge>
                  <Badge variant="outline" className="ml-2">$0.015/img</Badge>
                </div>
              </button>

              <button
                onClick={() => setSelectedMethod('claude')}
                disabled={isProcessing}
                className={`p-4 border-2 rounded-lg transition-all ${
                  selectedMethod === 'claude'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="font-semibold mb-1">Claude API</div>
                <div className="text-sm text-muted-foreground mb-2">
                  Máxima precisão
                </div>
                <div className="text-xs">
                  <Badge variant="outline">~98% precisão</Badge>
                  <Badge variant="outline" className="ml-2">$0.069/img</Badge>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8">
              <div className="flex flex-col items-center justify-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Adicionar Imagens
                </h3>
                <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                  Suporta JPG, PNG, PDF. Recomendado: imagens com boa iluminação e resolução mínima de 300 DPI
                </p>
                <label htmlFor="file-upload">
                  <Button asChild disabled={isProcessing}>
                    <span className="cursor-pointer gap-2">
                      <Upload className="w-4 h-4" />
                      Selecionar Arquivos
                    </span>
                  </Button>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isProcessing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <>
            {/* Summary */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{files.length}</div>
                    <div className="text-sm text-muted-foreground">Total de arquivos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{successCount}</div>
                    <div className="text-sm text-muted-foreground">Processados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                    <div className="text-sm text-muted-foreground">Com erro</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${totalCost.toFixed(3)}
                    </div>
                    <div className="text-sm text-muted-foreground">Custo estimado</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            {pendingCount > 0 && (
              <div className="mb-6 flex justify-center">
                <Button
                  onClick={processAllFiles}
                  disabled={isProcessing}
                  size="lg"
                  className="gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Processar {pendingCount} {pendingCount === 1 ? 'arquivo' : 'arquivos'}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Files */}
            <div className="space-y-4">
              {files.map((fileItem) => (
                <Card key={fileItem.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <FileText className="w-5 h-5 text-primary mt-1" />
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">
                            {fileItem.file.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 mt-1">
                            <span>{(fileItem.file.size / 1024).toFixed(1)} KB</span>
                            {fileItem.method && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs">
                                  {fileItem.method.toUpperCase()}
                                </Badge>
                              </>
                            )}
                            {fileItem.confidence && (
                              <>
                                <span>•</span>
                                <span className="text-xs">
                                  {(fileItem.confidence * 100).toFixed(1)}% confiança
                                </span>
                              </>
                            )}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {fileItem.status === 'pending' && (
                          <Badge variant="outline">Pendente</Badge>
                        )}
                        {fileItem.status === 'processing' && (
                          <Badge variant="outline" className="gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Processando
                          </Badge>
                        )}
                        {fileItem.status === 'success' && (
                          <Badge className="bg-green-500 gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Sucesso
                          </Badge>
                        )}
                        {fileItem.status === 'error' && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Erro
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(fileItem.id)}
                          disabled={isProcessing}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {fileItem.status === 'error' && fileItem.error && (
                    <CardContent>
                      <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                        {fileItem.error}
                      </div>
                    </CardContent>
                  )}

                  {fileItem.status === 'success' && fileItem.data && (
                    <CardContent>
                      {/* Data Preview */}
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              {fileItem.data.headers.map((header, i) => (
                                <th key={i} className="text-left py-2 px-3 font-semibold">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {fileItem.data.rows.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b">
                                {row.map((cell, cellIndex) => (
                                  <td key={cellIndex} className="py-2 px-3">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {fileItem.data.rows.length > 5 && (
                          <div className="text-center text-sm text-muted-foreground mt-2">
                            ... e mais {fileItem.data.rows.length - 5} linhas
                          </div>
                        )}
                      </div>

                      {/* Export Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportFile(fileItem, 'csv')}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Exportar CSV
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportFile(fileItem, 'json')}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Exportar JSON
                        </Button>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {files.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Nenhum arquivo adicionado</p>
              <p className="text-sm text-muted-foreground">
                Selecione arquivos para começar
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}