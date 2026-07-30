// src/services/authService.ts
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { 
  AUTH_TOKEN_KEY, 
  REFRESH_TOKEN_KEY, 
  USER_DATA_KEY 
} from '@/constants/auth';
import { 
  LoginRequest, 
  LoginResponse, 
  CreateUserRequest,
  User 
} from '@/types/api';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.auth.login,
      credentials
    );

    const data = response.data;

    if (data.token) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    }

    if (data.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
    }

    return data;
  }

  async signUp(data: CreateUserRequest): Promise<number> {
    const response = await api.post<number>(
      API_ENDPOINTS.auth.register,
      data
    );

    return response.data;
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.clearUserData();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // Salvar dados do usuário no localStorage
  saveUserData(user: User): void {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  }

  // Obter dados do usuário do localStorage
  getUserData(): User | null {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Limpar dados do usuário
  clearUserData(): void {
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export const authService = new AuthService();