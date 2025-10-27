// src/services/apiService.ts
import { API_CONFIG } from '@/config/api';
import { ApiError } from '@/types/api';

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
    this.timeout = API_CONFIG.timeout;
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestOptions = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição excedido');
      }
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, headers = {}, ...restOptions } = options;

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (requiresAuth) {
      const token = this.getAuthToken();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await this.fetchWithTimeout(url, {
        ...restOptions,
        headers: requestHeaders,
      });

      // Tratamento de erro 401 (Não autorizado)
      if (response.status === 401) {
        this.clearAuthToken();
        window.location.href = '/login';
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      // Se não for OK, trata o erro
      if (!response.ok) {
        let errorMessage = `Erro HTTP: ${response.status}`;
        
        try {
          const errorData: ApiError = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Se não conseguir parsear o JSON, usa a mensagem padrão
        }

        throw new Error(errorMessage);
      }

      // Verifica se há conteúdo para retornar
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      // Para respostas sem conteúdo (204 No Content)
      return null as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Ocorreu um erro inesperado');
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();