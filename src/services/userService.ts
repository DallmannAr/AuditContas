// src/services/userService.ts
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api';
import { User, UpdateUserRequest } from '@/types/api';

class UserService {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>(API_ENDPOINTS.users.list);
    return response.data;
  }

  async getById(id: number): Promise<User> {
    const response = await api.get<User>(API_ENDPOINTS.users.getById(id));
    return response.data;
  }

  async update(id: number, data: UpdateUserRequest): Promise<void> {
    const response = await api.put<void>(API_ENDPOINTS.users.update(id), data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    const response = await api.delete<void>(API_ENDPOINTS.users.delete(id));
    return response.data;
  }
}

export const userService = new UserService();