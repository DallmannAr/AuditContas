// src/hooks/useOCR.ts
import { useState, useCallback } from 'react';
import { ocrService, OCRResult, OCRTableData, BatchOCRResult } from '@/services/ocrService';
import { toast } from 'sonner';

interface UseOCROptions {
  method?: 'azure' | 'claude' | 'smart'; // smart = híbrido
  onSuccess?: (data: OCRTableData) => void;
  onError?: (error: Error) => void;
  showToast?: boolean;
}

export function useOCR(options: UseOCROptions = {}) {
  const [data, setData] = useState<OCRTableData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<OCRResult | null>(null);

  const {
    method = 'smart', // Padrão: híbrido
    onSuccess,
    onError,
    showToast = true,
  } = options;

  /**
   * Processa uma única imagem
   */
  const processImage = useCallback(
    async (file: File) => {
      setLoading(true);
      setError(null);
      
      try {
        let ocrResult: OCRResult;

        // Escolhe o método de processamento
        switch (method) {
          case 'azure':
            ocrResult = await ocrService.extractWithAzure(file);
            break;
          case 'claude':
            ocrResult = await ocrService.extractWithClaude(file);
            break;
          case 'smart':
          default:
            ocrResult = await ocrService.extractSmart(file);
            break;
        }

        if (ocrResult.success && ocrResult.data) {
          setData(ocrResult.data);
          setResult(ocrResult);

          if (showToast) {
            toast.success(
              `Tabela extraída com sucesso! (${(ocrResult.averageConfidence || 0) * 100}% confiança)`,
              {
                description: `Método: ${ocrResult.method?.toUpperCase()}`,
              }
            );
          }

          if (onSuccess) {
            onSuccess(ocrResult.data);
          }

          return ocrResult;
        } else {
          throw new Error(ocrResult.message || 'Erro ao processar imagem');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);

        if (showToast) {
          toast.error('Erro ao processar imagem', {
            description: error.message,
          });
        }

        if (onError) {
          onError(error);
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [method, onSuccess, onError, showToast]
  );

  /**
   * Processa múltiplas imagens
   */
  const processBatch = useCallback(
    async (files: File[]) => {
      setLoading(true);
      setError(null);

      try {
        const batchResult = await ocrService.extractBatch(files);

        if (showToast) {
          toast.success(`${batchResult.totalImages} imagens processadas!`, {
            description: `Confiança média: ${(batchResult.averageConfidence * 100).toFixed(1)}%`,
          });
        }

        return batchResult;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);

        if (showToast) {
          toast.error('Erro ao processar lote', {
            description: error.message,
          });
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  /**
   * Exporta dados para CSV
   */
  const exportCSV = useCallback(
    (fileName?: string) => {
      if (!data) {
        toast.error('Nenhum dado para exportar');
        return;
      }

      try {
        ocrService.exportToCSV(data, fileName);
        
        if (showToast) {
          toast.success('Dados exportados com sucesso!');
        }
      } catch (err) {
        toast.error('Erro ao exportar dados');
      }
    },
    [data, showToast]
  );

  /**
   * Exporta dados para JSON
   */
  const exportJSON = useCallback(
    (fileName?: string) => {
      if (!data) {
        toast.error('Nenhum dado para exportar');
        return;
      }

      try {
        ocrService.exportToJSON(data, fileName);
        
        if (showToast) {
          toast.success('Dados exportados com sucesso!');
        }
      } catch (err) {
        toast.error('Erro ao exportar dados');
      }
    },
    [data, showToast]
  );

  /**
   * Reseta o estado
   */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setResult(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    result,
    processImage,
    processBatch,
    exportCSV,
    exportJSON,
    reset,
  };
}