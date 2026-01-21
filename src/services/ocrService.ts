// src/services/ocrService.ts
import api from '@/lib/api';
import { toast } from 'sonner';

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
  totalRows?: number;
  averageConfidence?: number;
  method?: 'azure' | 'claude' | 'hybrid';
  estimatedCost?: number;
  processingTime?: number;
}

export interface BatchOCRResult {
  totalImages: number;
  processedWithAzure: number;
  processedWithClaude: number;
  averageConfidence: number;
  totalCost: number;
  needingReview: number;
  totalProcessingTime: number;
  results: OCRResult[];
}

class OCRService {
  /**
   * Extrai dados de tabela usando Azure Computer Vision
   */
  async extractWithAzure(file: File): Promise<OCRResult> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post<OCRResult>(
        '/ocr/extract-table',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erro ao processar com Azure:', error);
      throw new Error(error.response?.data?.error || 'Erro ao processar imagem com Azure');
    }
  }

  /**
   * Extrai dados de tabela médica usando Claude API
   */
  async extractWithClaude(file: File): Promise<OCRResult> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post<OCRResult>(
        '/ocr/extract-medical-table',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erro ao processar com Claude:', error);
      throw new Error(error.response?.data?.error || 'Erro ao processar imagem com Claude');
    }
  }

  /**
   * Extrai dados usando abordagem híbrida (Azure + Claude)
   * Usa Azure primeiro, se confiança baixa, refina com Claude
   */
  async extractSmart(file: File): Promise<OCRResult> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post<OCRResult>(
        '/ocr/extract-smart',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Erro ao processar:', error);
      throw new Error(error.response?.data?.error || 'Erro ao processar imagem');
    }
  }

  /**
   * Processa múltiplas imagens em lote
   */
  async extractBatch(files: File[]): Promise<BatchOCRResult> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await api.post<BatchOCRResult>(
        '/ocr/batch-extract',
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
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  }
}

export const ocrService = new OCRService();