// Configure sua URL da API C# aqui
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000,
} as const;

export const API_ENDPOINTS = {
  // Autenticação
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  // Procedimentos
  procedures: {
    list: '/procedures',
    getById: (id: string) => `/procedures/${id}`,
    create: '/procedures',
    update: (id: string) => `/procedures/${id}`,
    delete: (id: string) => `/procedures/${id}`,
  },
  patients: {
    list: '/patients',
    getById: (id: string) => `/patients/${id}`,
    create: '/patients',
    update: (id: string) => `/patients/${id}`,
    delete: (id: string) => `/patients/${id}`,
  },

  users:{
    list: '/users',
     getById: (id: number) => `/user/${id}`,
    create: '/user',
    update: (id: number) => `/user/${id}`,
    delete: (id: number) => `/user/${id}`,

  },
  // Relatórios
  reports: {
    monthly: '/reports/monthly',
    byCategory: '/reports/category',
  },
} as const;
