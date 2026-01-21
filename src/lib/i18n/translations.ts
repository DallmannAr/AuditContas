// src/lib/i18n/translations.ts

export type Language = 'pt-BR' | 'en-US' | 'es-ES';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    loading: string;
    error: string;
    success: string;
    back: string;
    next: string;
    previous: string;
    confirm: string;
    close: string;
  };
  
  // Navigation
  nav: {
    home: string;
    search: string;
    settings: string;
    plans: string;
    tableUpload: string;
    reports: string;
  };
  
  // Auth
  auth: {
    login: string;
    signup: string;
    logout: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    confirmPassword: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    loginButton: string;
    signupButton: string;
  };
  
  // Settings
  settings: {
    title: string;
    profile: string;
    appearance: string;
    language: string;
    notifications: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    enableNotifications: string;
    autoSave: string;
    savedSuccess: string;
  };
  
  // Plans
  plans: {
    title: string;
    currentPlan: string;
    upgradePlan: string;
    features: string;
    photosUsed: string;
    photosRemaining: string;
    monthlyPrice: string;
    perMonth: string;
    selectPlan: string;
    recommended: string;
    excessPhotos: string;
    excessPhotoPrice: string;
  };
  
  // OCR
  ocr: {
    title: string;
    uploadImage: string;
    selectFiles: string;
    processing: string;
    extractedData: string;
    exportCSV: string;
    exportJSON: string;
    confidence: string;
    method: string;
    cost: string;
    limitReached: string;
    upgradeRequired: string;
    warningLimit: string;
  };
  
  // Usage warnings
  usage: {
    warning80Title: string;
    warning80Description: string;
    limitReachedTitle: string;
    limitReachedDescription: string;
    upgradeNow: string;
    continueWithExcess: string;
    excessConfirmTitle: string;
    excessConfirmDescription: string;
  };
}

export const translations: Record<Language, Translations> = {
  'pt-BR': {
    common: {
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      create: 'Criar',
      search: 'Pesquisar',
      loading: 'Carregando...',
      error: 'Erro',
      success: 'Sucesso',
      back: 'Voltar',
      next: 'Próximo',
      previous: 'Anterior',
      confirm: 'Confirmar',
      close: 'Fechar',
    },
    nav: {
      home: 'Início',
      search: 'Pesquisar',
      settings: 'Configurações',
      plans: 'Planos',
      tableUpload: 'Upload de Tabelas',
      reports: 'Relatórios',
    },
    auth: {
      login: 'Entrar',
      signup: 'Cadastrar',
      logout: 'Sair',
      email: 'Email',
      password: 'Senha',
      name: 'Nome',
      phone: 'Telefone',
      confirmPassword: 'Confirmar Senha',
      forgotPassword: 'Esqueceu a senha?',
      noAccount: 'Não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      loginButton: 'Entrar',
      signupButton: 'Criar conta',
    },
    settings: {
      title: 'Configurações',
      profile: 'Perfil',
      appearance: 'Aparência',
      language: 'Idioma',
      notifications: 'Notificações',
      theme: 'Tema',
      themeLight: 'Claro',
      themeDark: 'Escuro',
      themeSystem: 'Sistema',
      enableNotifications: 'Ativar notificações',
      autoSave: 'Salvamento automático',
      savedSuccess: 'Configurações salvas com sucesso',
    },
    plans: {
      title: 'Planos e Preços',
      currentPlan: 'Plano Atual',
      upgradePlan: 'Fazer Upgrade',
      features: 'Recursos',
      photosUsed: 'Fotos Usadas',
      photosRemaining: 'Fotos Restantes',
      monthlyPrice: 'Preço Mensal',
      perMonth: 'por mês',
      selectPlan: 'Selecionar Plano',
      recommended: 'Recomendado',
      excessPhotos: 'Fotos Excedentes',
      excessPhotoPrice: 'R$ 1,50 por foto adicional',
    },
    ocr: {
      title: 'Extração de Tabelas',
      uploadImage: 'Enviar Imagem',
      selectFiles: 'Selecionar Arquivos',
      processing: 'Processando',
      extractedData: 'Dados Extraídos',
      exportCSV: 'Exportar CSV',
      exportJSON: 'Exportar JSON',
      confidence: 'Confiança',
      method: 'Método',
      cost: 'Custo',
      limitReached: 'Limite Atingido',
      upgradeRequired: 'Upgrade Necessário',
      warningLimit: 'Atenção: Limite Próximo',
    },
    usage: {
      warning80Title: 'Limite de Fotos Próximo',
      warning80Description: 'Você usou 80% do seu plano mensal. Considere fazer upgrade.',
      limitReachedTitle: 'Limite de Fotos Atingido',
      limitReachedDescription: 'Você atingiu o limite do seu plano. Faça upgrade para continuar.',
      upgradeNow: 'Fazer Upgrade Agora',
      continueWithExcess: 'Continuar com Fotos Excedentes',
      excessConfirmTitle: 'Usar Fotos Excedentes?',
      excessConfirmDescription: 'Cada foto adicional custará R$ 1,50. Você aceita?',
    },
  },
  
  'en-US': {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      search: 'Search',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      confirm: 'Confirm',
      close: 'Close',
    },
    nav: {
      home: 'Home',
      search: 'Search',
      settings: 'Settings',
      plans: 'Plans',
      tableUpload: 'Table Upload',
      reports: 'Reports',
    },
    auth: {
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      phone: 'Phone',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      loginButton: 'Sign In',
      signupButton: 'Create Account',
    },
    settings: {
      title: 'Settings',
      profile: 'Profile',
      appearance: 'Appearance',
      language: 'Language',
      notifications: 'Notifications',
      theme: 'Theme',
      themeLight: 'Light',
      themeDark: 'Dark',
      themeSystem: 'System',
      enableNotifications: 'Enable notifications',
      autoSave: 'Auto-save',
      savedSuccess: 'Settings saved successfully',
    },
    plans: {
      title: 'Plans & Pricing',
      currentPlan: 'Current Plan',
      upgradePlan: 'Upgrade Plan',
      features: 'Features',
      photosUsed: 'Photos Used',
      photosRemaining: 'Photos Remaining',
      monthlyPrice: 'Monthly Price',
      perMonth: 'per month',
      selectPlan: 'Select Plan',
      recommended: 'Recommended',
      excessPhotos: 'Excess Photos',
      excessPhotoPrice: '$0.30 per additional photo',
    },
    ocr: {
      title: 'Table Extraction',
      uploadImage: 'Upload Image',
      selectFiles: 'Select Files',
      processing: 'Processing',
      extractedData: 'Extracted Data',
      exportCSV: 'Export CSV',
      exportJSON: 'Export JSON',
      confidence: 'Confidence',
      method: 'Method',
      cost: 'Cost',
      limitReached: 'Limit Reached',
      upgradeRequired: 'Upgrade Required',
      warningLimit: 'Warning: Limit Near',
    },
    usage: {
      warning80Title: 'Photo Limit Near',
      warning80Description: "You've used 80% of your monthly plan. Consider upgrading.",
      limitReachedTitle: 'Photo Limit Reached',
      limitReachedDescription: "You've reached your plan limit. Upgrade to continue.",
      upgradeNow: 'Upgrade Now',
      continueWithExcess: 'Continue with Excess Photos',
      excessConfirmTitle: 'Use Excess Photos?',
      excessConfirmDescription: 'Each additional photo will cost $0.30. Do you accept?',
    },
  },
  
  'es-ES': {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      search: 'Buscar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      back: 'Volver',
      next: 'Siguiente',
      previous: 'Anterior',
      confirm: 'Confirmar',
      close: 'Cerrar',
    },
    nav: {
      home: 'Inicio',
      search: 'Buscar',
      settings: 'Configuración',
      plans: 'Planes',
      tableUpload: 'Subir Tablas',
      reports: 'Informes',
    },
    auth: {
      login: 'Iniciar sesión',
      signup: 'Registrarse',
      logout: 'Cerrar sesión',
      email: 'Correo electrónico',
      password: 'Contraseña',
      name: 'Nombre',
      phone: 'Teléfono',
      confirmPassword: 'Confirmar Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta?',
      hasAccount: '¿Ya tienes una cuenta?',
      loginButton: 'Entrar',
      signupButton: 'Crear cuenta',
    },
    settings: {
      title: 'Configuración',
      profile: 'Perfil',
      appearance: 'Apariencia',
      language: 'Idioma',
      notifications: 'Notificaciones',
      theme: 'Tema',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      themeSystem: 'Sistema',
      enableNotifications: 'Activar notificaciones',
      autoSave: 'Guardado automático',
      savedSuccess: 'Configuración guardada con éxito',
    },
    plans: {
      title: 'Planes y Precios',
      currentPlan: 'Plan Actual',
      upgradePlan: 'Actualizar Plan',
      features: 'Características',
      photosUsed: 'Fotos Usadas',
      photosRemaining: 'Fotos Restantes',
      monthlyPrice: 'Precio Mensual',
      perMonth: 'por mes',
      selectPlan: 'Seleccionar Plan',
      recommended: 'Recomendado',
      excessPhotos: 'Fotos Excedentes',
      excessPhotoPrice: '$0,30 por foto adicional',
    },
    ocr: {
      title: 'Extracción de Tablas',
      uploadImage: 'Subir Imagen',
      selectFiles: 'Seleccionar Archivos',
      processing: 'Procesando',
      extractedData: 'Datos Extraídos',
      exportCSV: 'Exportar CSV',
      exportJSON: 'Exportar JSON',
      confidence: 'Confianza',
      method: 'Método',
      cost: 'Costo',
      limitReached: 'Límite Alcanzado',
      upgradeRequired: 'Actualización Requerida',
      warningLimit: 'Atención: Límite Próximo',
    },
    usage: {
      warning80Title: 'Límite de Fotos Próximo',
      warning80Description: 'Has usado el 80% de tu plan mensual. Considera actualizar.',
      limitReachedTitle: 'Límite de Fotos Alcanzado',
      limitReachedDescription: 'Has alcanzado el límite de tu plan. Actualiza para continuar.',
      upgradeNow: 'Actualizar Ahora',
      continueWithExcess: 'Continuar con Fotos Excedentes',
      excessConfirmTitle: '¿Usar Fotos Excedentes?',
      excessConfirmDescription: 'Cada foto adicional costará $0,30. ¿Aceptas?',
    },
  },
};

// Hook para usar traduções
import { useApp } from '@/contexts/AppContext';

export function useTranslation() {
  const { settings } = useApp();
  const t = translations[settings.language];
  
  return { t, language: settings.language };
}