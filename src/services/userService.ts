// src/services/userService.ts
import { apiService } from './apiService';
import { API_ENDPOINTS } from '@/config/api';
import { User, UpdateUserRequest } from '@/types/api';

class UserService {
  async getAll(): Promise<User[]> {
    return apiService.get<User[]>(API_ENDPOINTS.users.list);
  }

  async getById(id: number): Promise<User> {
    return apiService.get<User>(API_ENDPOINTS.users.getById(id));
  }

  async update(id: number, data: UpdateUserRequest): Promise<void> {
    return apiService.put<void>(API_ENDPOINTS.users.update(id), data);
  }

  async delete(id: number): Promise<void> {
    return apiService.delete<void>(API_ENDPOINTS.users.delete(id));
  }
}

export const userService = new UserService();