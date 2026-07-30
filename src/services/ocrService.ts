// src/services/ocrService.ts
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import Papa from 'papaparse';

export interface OCRTableData {
  headers: string[];
  rows: string[][];
  confidence: number;
  totalWords?: number;
  processingMetadata?: {
    detectedColumns: number;
    detectedRows: number;
    averageConfidence: number;
  };
}

export interface OCRResult {
  success: boolean;
  data?: OCRTableData;
  message?: string;
  errorMessage?: string;
  totalRows?: number;
  averageConfidence?: number;
  confidence?: number;
  fromCache?: boolean;
  method?: string;
  estimatedCost?: number;
  processingTime?: number;
  metrics?: {
    totalMs: number;
    preprocessMs: number;
    claudeMs: number;
    estimatedCostUsd: number;
    imageQuality: string;
    pagesProcessed: number;
  };
}

export interface BatchOCRResult {
  totalImages: number;
  results: OCRResult[];
}

export type OcrProcessingMode = 'TesseractOnly' | 'ClaudeOnly' | 'Hybrid';

class OCRService {
  /**
   * Processa uma imagem com OCR (POST /api/ocr/process)
   * @param file Arquivo de imagem/PDF
   * @param mode Modo de processamento: TesseractOnly | ClaudeOnly | Hybrid
   */
  async processImage(file: File, mode: OcrProcessingMode = 'ClaudeOnly'): Promise<OCRResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<OCRResult>(
        `${API_ENDPOINTS.ocr.process}?mode=${mode}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erro ao processar imagem:', error);
      throw new Error(error.response?.data?.error || 'Erro ao processar imagem');
    }
  }

  /**
   * Processa e salva como reports (POST /api/ocr/process-and-save)
   * @param file Arquivo de imagem/PDF
   * @param mode Modo de processamento
   */
  async processAndSave(file: File, mode: OcrProcessingMode = 'ClaudeOnly'): Promise<OCRResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<OCRResult>(
        `${API_ENDPOINTS.ocr.processAndSave}?mode=${mode}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erro ao processar e salvar:', error);
      throw new Error(error.response?.data?.error || 'Erro ao processar e salvar imagem');
    }
  }

  /**
   * Processa múltiplas imagens em lote (POST /api/ocr/batch)
   * Backend aceita max 10 arquivos
   */
  async processBatch(files: File[], mode: OcrProcessingMode = 'ClaudeOnly'): Promise<OCRResult[]> {
    try {
      if (files.length > 10) {
        throw new Error('Máximo de 10 arquivos por lote');
      }

      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await api.post<OCRResult[]>(
        `${API_ENDPOINTS.ocr.batch}?mode=${mode}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 300000, // 5 minutos para batch
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erro ao processar lote:', error);
      throw new Error(error.response?.data?.error || 'Erro ao processar lote de imagens');
    }
  }

  /**
   * Exporta dados extraídos para CSV
   */
  exportToCSV(data: OCRTableData, fileName: string = 'dados_extraidos.csv') {
    const csvData = [
      data.headers,
      ...data.rows
    ];

    const csvContent = Papa.unparse(csvData);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Exporta dados extraídos para JSON
   */
  exportToJSON(data: OCRTableData, fileName: string = 'dados_extraidos.json') {
    const jsonContent = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const ocrService = new OCRService();