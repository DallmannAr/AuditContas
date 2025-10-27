// src/services/authService.ts
import { apiService } from './apiService';
import { API_ENDPOINTS } from '@/config/api';
import { 
  LoginRequest, 
  LoginResponse, 
  CreateUserRequest,
  User 
} from '@/types/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiService.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      credentials,
      { requiresAuth: false }
    );

    if (response.token) {
      apiService.setAuthToken(response.token);
    }

    return response;
  }

  async signUp(data: CreateUserRequest): Promise<number> {
    const response = await apiService.post<number>(
      API_ENDPOINTS.auth.register,
      data,
      { requiresAuth: false }
    );

    return response;
  }

  logout(): void {
    apiService.clearAuthToken();
  }

  isAuthenticated(): boolean {
    return apiService.isAuthenticated();
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Salvar dados do usuário no localStorage
  saveUserData(user: User): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  // Obter dados do usuário do localStorage
  getUserData(): User | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Limpar dados do usuário
  clearUserData(): void {
    localStorage.removeItem('user_data');
  }
}

export const authService = new AuthService();