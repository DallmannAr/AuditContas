// src/services/reportService.ts
import api from '@/lib/api';
import { Report } from '@/types/api';

class ReportService {
  /**
   * Busca todos os relatórios processados
   */
  async getAllReports(): Promise<Report[]> {
    try {
      const response = await api.get<Report[]>('/reports');
      return response.data || [];
    } catch (error: any) {
      console.error('Erro ao buscar relatórios:', error);
      // Tratamento genérico e seguro de erros para evitar exposição de detalhes cibernéticos
      throw new Error(error.response?.data?.message || 'Erro ao carregar relatórios do servidor');
    }
  }
}

export const reportService = new ReportService();
