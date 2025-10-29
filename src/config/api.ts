// Configure sua URL da API C# aqui
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
} as const;

export const API_ENDPOINTS = {
  // Autenticação
  auth: {
    login: 'api/auth/login',
    register: 'api/auth/register',
    logout: 'api/auth/logout',
    refresh: 'api/auth/refresh',
  },


  users:{
    list: '/users',
     getById: (id: number) => `api/users/${id}`,
    create: 'api/users',
    update: (id: number) => `api/users/${id}`,
    delete: (id: number) => `api/users/${id}`,

  },
  // Relatórios
  reports: {
    list: '/reports',
     getById: (id: number) => `api/reports/${id}`,
    create: 'api/reports',
    update: (id: number) => `api/reports/${id}`,
    delete: (id: number) => `api/reports/${id}`,
  },
} as const;
