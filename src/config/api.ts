// Configure sua URL da API C# aqui
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

  // Usuários
  users: {
    list: '/users',
    getById: (id: number) => `/users/${id}`,
    create: '/users',
    update: (id: number) => `/users/${id}`,
    delete: (id: number) => `/users/${id}`,
  },

  // Relatórios
  reports: {
    list: '/reports',
    getById: (id: number) => `/reports/${id}`,
    create: '/reports',
    update: (id: number) => `/reports/${id}`,
    delete: (id: number) => `/reports/${id}`,
  },

  // OCR — corresponde a OcrController [Route("api/ocr")]
  ocr: {
    process: '/ocr/process',
    processAndSave: '/ocr/process-and-save',
    batch: '/ocr/batch',
    compare: '/ocr/compare',
    validate: '/ocr/validate',
    reprocess: (reportId: number) => `/ocr/reprocess/${reportId}`,
    stats: '/ocr/stats',
  },
} as const;
