// src/pages/TableUpload/index.tsx - Com controle de assinatura
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  BarChart3,
  Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOCR } from "@/hooks/useOCR";
import { useTranslation } from "@/lib/translations";
import { subscriptionService } from "@/services/subscriptionService";
import { UsageWarning80, LimitReachedDialog, ExcessConfirmDialog } from "@/components/UsageWarnings";
import { calculateUsageStats, OVERAGE_PHOTO_PRICE } from "@/types/subscription";
import type { OCRTableData } from "@/services/ocrService";
import type { UserSubscription } from "@/types/subscription";
import { toast } from "sonner";

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
  const { t } = useTranslation();
  
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<'azure' | 'claude' | 'smart'>('smart');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [showExcessDialog, setShowExcessDialog] = useState(false);
  const [excessAccepted, setExcessAccepted] = useState(false);
  
  const { processImage } = useOCR({
    mode: selectedMethod === 'azure' ? 'TesseractOnly' : (selectedMethod === 'claude' ? 'ClaudeOnly' : 'Hybrid'),
    showToast: true,
  });

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      const data = await subscriptionService.getCurrentSubscription();
      setSubscription(data);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
      toast.error('Erro ao carregar dados da assinatura');
    } finally {
      setLoadingSubscription(false);
    }
  };

  const checkCanUseOCR = async (): Promise<boolean> => {
    try {
      const result = await subscriptionService.canUseOCR();
      
      if (!result.canUse) {
        if (subscription?.plan === 'photo_200' && !excessAccepted) {
          setShowExcessDialog(true);
          return false;
        } else {
          // Any other plans - ask for upgrade
          setShowLimitDialog(true);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao verificar uso:', error);
      toast.error('Erro ao verificar limite de uso');
      return false;
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: ProcessedFile[] = Array.from(selectedFiles).map((file) => ({
      id: Math.random().toString(36).slice(2, 11),
      file,
      status: 'pending',
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const processAllFiles = async () => {
    if (!subscription) {
      toast.error('Erro ao carregar assinatura');
      return;
    }

    // Verify basic plan
    if (subscription.plan === 'basic') {
      toast.error('Plano Básico não permite OCR de fotos. Faça upgrade!');
      navigate('/plans');
      return;
    }

    setIsProcessing(true);

    for (const fileItem of files) {
      if (fileItem.status !== 'pending') continue;

      // Verify if OCR is enabled before any photo
      const canUse = await checkCanUseOCR();
      if (!canUse) {
        setIsProcessing(false);
        return;
      }

      // 
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id ? { ...f, status: 'processing' as const } : f
        )
      );

      try {
        // Register photo use in limit
        await subscriptionService.registerPhotoUsage();
        
        // Process image
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
        
        // Refresh subscription to update the counter
        await loadSubscription();
        
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

      // Small delay between process
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
  };

  const handleAcceptExcess = async () => {
    try {
      await subscriptionService.acceptExcessCharges();
      setExcessAccepted(true);
      setShowExcessDialog(false);
      toast.success('Fotos excedentes autorizadas. Continue processando!');
      
      // Continue process
      processAllFiles();
    } catch (error: any) {
      toast.error('Erro ao aceitar fotos excedentes');
    }
  };

  const handleUpgradeClick = () => {
    navigate('/plans');
  };

  {/* Methods to handle files*/}
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

  const stats = subscription ? calculateUsageStats(subscription) : null;

  if (loadingSubscription) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/home")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{t.ocr.title}</h1>
            <p className="text-muted-foreground mt-1">
              {t.ocr.headerDescription}
            </p>
          </div>
        </div>

        {/* Usage Warning */}
        {stats && <UsageWarning80 stats={stats} />}

        {/* Usage Stats */}
        {subscription && stats && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{t.plans.photosUsed}</h3>
                  <p className="text-sm text-muted-foreground"> 
                 {/* Plans - s = Plan */}  {t.nav.plans.slice(0, -1)}: {subscription.plan}  
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/plans')}>
                  {t.plans.upgradePlan}
                </Button>
              </div>
              
              <Progress value={stats.percentage} className="h-3 mb-2" />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{stats.photosUsed} / {stats.photoLimit} fotos</span>
                <span>{stats.remainingPhotos} restantes</span>
              </div>

              {stats.overagePhotos > 0 && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{t.plans.overagePhotos}:</span>
                    <span className="font-bold text-primary">
                      {stats.overagePhotos} × R$ {OVERAGE_PHOTO_PRICE} = R$ {(stats.overagePhotos * OVERAGE_PHOTO_PRICE).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Blocked for Basic Plan */}
        {subscription?.plan === 'basic' && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <Lock className="w-12 h-12 text-destructive" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">
                    {t.ocr.unavailableOCR}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {t.ocr.basicPLanOCR}
                  </p>
                  <Button onClick={() => navigate('/plans')}>
                    {t.plans.availablePlans}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Method Selection - Only if not Basic */}
        {subscription?.plan !== 'basic' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                {t.ocr.method}
              </CardTitle>
              <CardDescription>
                {t.ocr.methodOCR}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['azure', 'smart', 'claude'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method as any)}
                    disabled={isProcessing}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedMethod === method
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="font-semibold mb-1">
                      {method === 'azure' && 'Azure Vision'}
                      {method === 'smart' && (t.plans.hibrid)}
                      {method === 'claude' && 'Claude API'}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      {method === 'azure' && (t.ocr.azureDescription)}
                      {method === 'smart' && (t.ocr.smartDescription)}
                      {method === 'claude' &&  (t.ocr.claudeDescription)}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Area - Only if not Basic */}
        {subscription?.plan !== 'basic' && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8">
                <div className="flex flex-col items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {t.ocr.uploadImage}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
                    {t.ocr.instructionsOCR}
                  </p>
                  <label htmlFor="file-upload">
                    <Button asChild disabled={isProcessing}>
                      <span className="cursor-pointer gap-2">
                        <Upload className="w-4 h-4" />
                        {t.ocr.selectFiles}
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
        )}

          {/* File List */}
        {files.length > 0 && (
          <>
            {/* Summary */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{files.length}</div>
                    <div className="text-sm text-muted-foreground">{t.ocr.totalFiles}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{successCount}</div>
                    <div className="text-sm text-muted-foreground">{t.ocr.processedFiles}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                    <div className="text-sm text-muted-foreground">{t.ocr.errorFiles}</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${totalCost.toFixed(3)}
                    </div>
                    <div className="text-sm text-muted-foreground">{t.ocr.estimatedPrice}</div>
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
                      {t.common.loading}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      {t.common.process} {pendingCount} {pendingCount === 1 ?  (t.common.file.slice(0, -1)) : (t.common.file)}
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
                          <Badge variant="outline">{t.common.pending}</Badge>
                        )}
                        {fileItem.status === 'processing' && (
                          <Badge variant="outline" className="gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            {t.ocr.processing}
                          </Badge>
                        )}
                        {fileItem.status === 'success' && (
                          <Badge className="bg-green-500 gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {t.common.success}
                          </Badge>
                        )}
                        {fileItem.status === 'error' && (
                          <Badge variant="destructive" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {t.common.error}
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
                            ... {fileItem.data.rows.length - 5} {t.common.lines}
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
                          {t.ocr.exportCSV}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => exportFile(fileItem, 'json')}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          {t.ocr.exportJSON}
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
              <p className="text-lg font-medium mb-2">{t.ocr.emptyFiles}</p>
              <p className="text-sm text-muted-foreground">
                {t.ocr.selectFilesDescription}
              </p>
            </CardContent>
          </Card>
        )}
       
      </div>

      {/* Dialogs */}
      {stats && (
        <>
          <LimitReachedDialog
            open={showLimitDialog}
            onOpenChange={setShowLimitDialog}
            stats={stats}
            canUseExcess={subscription?.plan === 'photo_200'}
            onUpgrade={handleUpgradeClick}
            onAcceptExcess={() => setShowExcessDialog(true)}
          />

          <ExcessConfirmDialog
            open={showExcessDialog}
            onOpenChange={setShowExcessDialog}
            onConfirm={handleAcceptExcess}
            excessPrice={OVERAGE_PHOTO_PRICE}
          />
        </>
      )}
    </DashboardLayout>
  );
}