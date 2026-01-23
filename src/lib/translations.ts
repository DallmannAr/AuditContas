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
    unavailable: string;
    process: string;
    file: string;
    lines: string;
    pending: string;
  };
  
  // Navigation
  nav: {
    home: string;
    search: string;
    settings: string;
    plans: string;
    tableUpload: string;
    reports: string;
    tools: string;
  };
  
  // Auth
  auth: {
    welcomeMessage: string;
    welcomeTitle: string;
    login: string;
    signup: string;
    logout: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    name: string;
    phone: string;
    confirmPassword: string;
    forgotPassword: string;
    noAccount: string;
    hasAccount: string;
    loginButton: string;
    loginState: string;
    signupButton: string;
    signupState: string;
    signUpTitle: string;
    signUpMessage: string;
  };
  
  // Settings
  settings: {
    title: string;
    profile: string;
    profileDescription: string;
    appearance: string;
    appearanceDescription: string;
    language: string;
    languageDescription: string;
    languageInstruction: string;
    notifications: string;
    notificationDescription: string;
    notificationAlert: string;
    saveAlert: string;
    theme: string;
    themeDescription: string;
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
    overagePhotos: string;
    overagePhotoPrice: string;
    plansDescription: string;
    availablePlans: string;
    hibrid: string;
    planExcessPhoto: string;
    planExcessPhotoDetails: string;
    excessPhotoDetails1: string;
    excessPhotoDetails2: string;
    excessPhotoDetails3: string;
  };
  
  // OCR
  ocr: {
    title: string;
    uploadImage: string;
    emptyFiles: string;
    selectFiles: string;
    selectFilesDescription: string;
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
    headerDescription: string;
    unavailableOCR: string;
    basicPLanOCR: string;
    methodOCR: string;
    instructionsOCR: string;
    totalFiles: string;
    processedFiles: string;
    errorFiles: string;
    estimatedPrice: string;
    azureDescription: string;
    smartDescription: string;
    claudeDescription: string;
  };
  
  // Usage warnings
  usage: {
    dueLimit: string;
    warning80Title: string;
    warning80Description: string;
    limitReachedTitle: string;
    limitReachedDescription: string;
    upgradeNow: string;
    continueWithExcess: string;
    excessConfirmTitle: string;
    excessConfirmDescription: string;
    photos: string;
    coin: string;   
  };

  toast: {
    downgradeToast: string;
    samePlanToast: string;
    signatureLoadErrorToast: string;
    signatureRefreshSucessToast: string;
    signatureRefreshErrorToast: string;
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
      unavailable: 'Indisponível',
      process: 'Processar',
      file: 'Arquivos',
      pending: 'Pendente',
      lines: 'Linhas'
    },
    nav: {
      home: 'Início',
      search: 'Pesquisar',
      settings: 'Configurações',
      plans: 'Planos',
      tableUpload: 'Upload de Tabelas',
      reports: 'Relatórios',
      tools: 'Ferramentas',
    },
    auth: {
      welcomeMessage: 'Entre com suas credenciais para continuar',
      welcomeTitle:  'Bem-vindo de volta',
      login: 'Entrar',
      signup: 'Cadastrar',
      logout: 'Sair',
      email: 'Email',
      emailPlaceholder: 'seu@email.com',
      password: 'Senha',
      name: 'Nome completo',
      phone: 'Telefone',
      confirmPassword: 'Confirmar Senha',
      forgotPassword: 'Esqueceu a senha?',
      noAccount: 'Não tem uma conta?',
      hasAccount: 'Já tem uma conta?',
      loginButton: 'Entrar',
      loginState: 'Entrando...',
      signupButton: 'Criar conta',
      signupState: 'Criando conta...',
      signUpTitle: 'Crie sua conta',
      signUpMessage: 'Preencha os dados pra começar'
    },
    settings: {
      title: 'Configurações',
      profile: 'Perfil',
      profileDescription: 'Informações da sua conta',
      appearance: 'Aparência',
      appearanceDescription: 'Personalize a aparência do aplicativo',
      language: 'Idioma',
      languageDescription: 'Configure o idioma do aplicativo',
      languageInstruction: 'Selecione o idioma de exibição',
      notifications: 'Notificações',
      notificationDescription: 'Configure as notificações do aplicativo',
      notificationAlert: 'Receba alertas sobre atualizações e novidades',
      saveAlert: 'Salvar alterações automaticamente',
      theme: 'Tema',
      themeDescription: 'Escolha o tema de cores do aplicativo',
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
      overagePhotos: 'Fotos Excedentes',
      overagePhotoPrice: 'R$ 1,50 por foto adicional',
      plansDescription: 'Escolha o plano ideal para suas necessidades',
      availablePlans: 'Ver planos disponíveis',
      hibrid: 'Hibrído',
      planExcessPhoto: 'Plano Foto 200',
      planExcessPhotoDetails: 'Após usar suas 200 fotos mensais, você pode continuar usando o OCR pagando',
      excessPhotoDetails1: 'As fotos excedentes são cobradas à parte na sua fatura mensal',
      excessPhotoDetails2: 'Você precisa aceitar explicitamente usar fotos excedentes',
      excessPhotoDetails3: 'Esta opção está disponível apenas no plano Foto 200 ',
    },
    ocr: {
      title: 'Extração de Tabelas',
      uploadImage: 'Enviar Imagem',
      emptyFiles: 'Nenhum arquivo adicionado',
      selectFiles: 'Selecionar Arquivos',
      selectFilesDescription: 'Selecione arquivos para começar',
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
      headerDescription: 'Faça upload de imagens de tabelas para extrair dados automaticamente',
      unavailableOCR: 'OCR de Fotos Não Disponível',
      basicPLanOCR: 'Seu plano Básico não inclui OCR de fotos. Faça upgrade para desbloquear!',
      methodOCR: 'Escolha o método de processamento das imagens',
      instructionsOCR: 'Suporta JPG, PNG, PDF. Recomendado: imagens com boa iluminação',
      totalFiles: 'Total de arquivos',
      processedFiles: 'Processados',
      errorFiles: 'Com erro',
      estimatedPrice: 'Custo estimado',
      azureDescription: 'Rápido e econômico',
      smartDescription: 'Melhor custo-benefício',
      claudeDescription: 'Máxima precisão',      
    },
    usage: {
      dueLimit: 'Valido até',
      warning80Title: 'Limite de Fotos Próximo',
      warning80Description: 'Você usou 80% do seu plano mensal. Considere fazer upgrade.',
      limitReachedTitle: 'Limite de Fotos Atingido',
      limitReachedDescription: 'Você atingiu o limite do seu plano. Faça upgrade para continuar.',
      upgradeNow: 'Fazer Upgrade Agora',
      continueWithExcess: 'Continuar com Fotos Excedentes',
      excessConfirmTitle: 'Usar Fotos Excedentes?',
      excessConfirmDescription: 'Cada foto adicional custará R$ 1,50. Você aceita?',
      photos: 'Fotos',
      coin: 'R$',
    },

    toast: {
      downgradeToast: 'Não é possível fazer downgrade. Entre em contato com o suporte.',
      samePlanToast: 'Você já está nesse plano',
      signatureLoadErrorToast: 'Erro ao carregar dados da assinatura',
      signatureRefreshErrorToast: 'Erro ao atualizar plano',
      signatureRefreshSucessToast: 'Plano atualizado com sucesso!'
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
      unavailable: 'Unavailable',
      process: 'Load',
      file: 'Files',
      pending: 'Pending',
      lines: 'Lines'
    },
    nav: {
      home: 'Home',
      search: 'Search',
      settings: 'Settings',
      plans: 'Plans',
      tableUpload: 'Table Upload',
      reports: 'Reports',
      tools: 'Tools',

    },
    auth: {
      welcomeMessage: 'Enter your credentials to continue.',
      welcomeTitle: 'Welcome back',
      login: 'Login',
      signup: 'Sign Up',
      logout: 'Logout',
      email: 'Email',
      emailPlaceholder: 'your@email.com',
      password: 'Password',
      name: 'Full name',
      phone: 'Phone',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot password?',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      loginButton: 'Sign In',
      loginState: 'Logging in...',
      signupButton: 'Create Account',
      signupState: 'Creating account...',
       signUpTitle: 'Create your account',
      signUpMessage: 'Fill in the details to get started.'

    },
    settings: {
      title: 'Settings',
      profile: 'Profile',
      profileDescription: 'Your account information',
      appearance: 'Appearance',
      appearanceDescription: "Customize the app's appearance.",
      language: 'Language',
      languageDescription: "Configure the app's language",
      languageInstruction: 'Select the display language',
      notifications: 'Notifications',
      notificationDescription: 'Change app notifications',
      notificationAlert: 'Receive alerts about updates and news',
      saveAlert: 'Save changes automatically',      
      theme: 'Theme',
      themeDescription: "Choose the app's color theme",
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
      overagePhotos: 'Excess Photos',
      overagePhotoPrice: '$0.30 per additional photo',
      plansDescription: 'Choose the ideal plan for your needs',
      availablePlans: 'View available plans',
      hibrid: 'Hybrid',
      planExcessPhoto: 'Plan Foto 200',
      planExcessPhotoDetails: 'After using your 200 monthly photos, you can continue using the OCR by paying',
      excessPhotoDetails1: 'As fotos excedentes são cobradas à parte na sua fatura mensal',
      excessPhotoDetails2: 'Additional photos will be charged separately on your monthly bill',
      excessPhotoDetails3: 'This option is only available on the Foto 200 plan',
    },
    ocr: {
      title: 'Table Extraction',
      uploadImage: 'Upload Image',
      emptyFiles: 'No files added',
      selectFiles: 'Select Files',
      selectFilesDescription: 'Select files to get started',
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
      headerDescription: 'Upload table images to automatically extract data',
      unavailableOCR: 'Photo OCR unavaiable',
      basicPLanOCR: 'Your Basic plan does not include photo OCR. Upgrade to unlock it!',
      methodOCR: 'Choose the image processing method',
      instructionsOCR: 'Supports JPG, PNG, and PDF. Recommended: images with good lighting',
      totalFiles: 'Total Files',
      processedFiles: 'Processed',
      errorFiles: 'Error',
      estimatedPrice: 'Estimated cost',
      azureDescription: 'Fast and economic',
      smartDescription: 'Best value for money',
      claudeDescription: 'Max Precision', 
    },
    usage: {
      dueLimit: 'Valid until',
      warning80Title: 'Photo Limit Near',
      warning80Description: "You've used 80% of your monthly plan. Consider upgrading.",
      limitReachedTitle: 'Photo Limit Reached',
      limitReachedDescription: "You've reached your plan limit. Upgrade to continue.",
      upgradeNow: 'Upgrade Now',
      continueWithExcess: 'Continue with Excess Photos',
      excessConfirmTitle: 'Use Excess Photos?',
      excessConfirmDescription: 'Each additional photo will cost $0.30. Do you accept?',
      photos: 'Photos',
      coin: '$',
    },

    toast: {
      downgradeToast: 'Downgrading is not possible. Please contact support.',
      samePlanToast: "You're already on that plan",
      signatureLoadErrorToast: 'Error loading signature data',
      signatureRefreshErrorToast:  'Error updating plan',
      signatureRefreshSucessToast:  'Plan updated successfully!'
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
      unavailable: 'Indisponible',
      process: 'Processo',
      file: 'Archivos',
      pending: 'Pendiente',
      lines: 'Pautas'
    },
    nav: {
      home: 'Inicio',
      search: 'Buscar',
      settings: 'Configuración',
      plans: 'Planes',
      tableUpload: 'Subir Tablas',
      reports: 'Informes',
      tools: 'Herramientas'
    },
    auth: {
      welcomeTitle: 'Bienvenido de nuevo',
      welcomeMessage: 'Ingrese sus credenciales para continuar.',
      login: 'Iniciar sesión',
      signup: 'Registrarse',
      logout: 'Cerrar sesión',
      email: 'Correo electrónico',
      emailPlaceholder: 'su@email.com',
      password: 'Contraseña',
      name: 'Nombre completo',
      phone: 'Teléfono',
      confirmPassword: 'Confirmar Contraseña',
      forgotPassword: '¿Olvidaste tu contraseña?',
      noAccount: '¿No tienes una cuenta?',
      hasAccount: '¿Ya tienes una cuenta?',
      loginButton: 'Entrar',
      loginState: 'Entrando...',
      signupButton: 'Crear cuenta',
      signUpTitle: 'Crea tu cuenta',
      signupState: 'Creando cuenta...',
      signUpMessage: 'Complete los datos para comenzar.'
    },
    settings: {
      title: 'Configuración',
      profile: 'Perfil',
      profileDescription: 'La información de tu cuenta',
      appearance: 'Apariencia',
      appearanceDescription: 'Personaliza la apariencia de la aplicación',
      language: 'Idioma',
      languageDescription: 'Configurar el idioma de la aplicación',
      languageInstruction:  'Seleccione el idioma de visualización',
      notifications: 'Notificaciones',
      notificationDescription: 'Configurar notificaciones de la app',
      notificationAlert: 'Recibir alertas sobre actualizaciones y noticias',
      saveAlert: 'Guardar cambios automáticamente',            
      theme: 'Tema',
      themeDescription: 'Elige el tema de color de la aplicación',
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
      overagePhotos: 'Fotos Excedentes',
      overagePhotoPrice: '$0,30 por foto adicional',
      plansDescription: 'Elige el plan ideal para tus necesidades',
      availablePlans: 'Ver planes disponibles',
      hibrid: 'Híbrido',
      planExcessPhoto: 'Plano Foto 200',
      planExcessPhotoDetails: 'Después de usar tus 200 fotos mensuales, puedes seguir usando el OCR pagando',
      excessPhotoDetails1: 'Las fotos sobrantes se cobran aparte en tu factura mensual',
      excessPhotoDetails2: 'Las fotos adicionales se cobrarán aparte en tu factura mensual',
      excessPhotoDetails3: 'Esta opción solo está disponible en el plan Foto 200',
    },
    ocr: {
      title: 'Extracción de Tablas',
      uploadImage: 'Subir Imagen',
      emptyFiles: 'No se agregaron archivos',
      selectFiles: 'Seleccionar Archivos',
      selectFilesDescription: 'Seleccione archivos para comenzar',
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
      headerDescription: 'Sube imágenes de tablas para extraer datos automáticamente',
      unavailableOCR: 'OCR de fotos no disponible',
      basicPLanOCR: 'Tu plan Básico no incluye OCR de fotos. ¡Mejora tu plan para desbloquearlo!',
      methodOCR: 'Elija el método de procesamiento de imágenes',
      instructionsOCR: 'Compatible con JPG, PNG y PDF. Recomendado: imágenes con buena iluminación',
      totalFiles: 'Archivos Totales',
      processedFiles: 'Procesado',
      errorFiles: 'Con error', 
      estimatedPrice: 'Costo estimado',
      azureDescription: 'Rápido y económico',
      smartDescription: 'La mejor relación calidad-precio',
      claudeDescription: 'Máxima precisión',     
    },
    usage: {
      dueLimit: 'Válida hasta',
      warning80Title: 'Límite de Fotos Próximo',
      warning80Description: 'Has usado el 80% de tu plan mensual. Considera actualizar.',
      limitReachedTitle: 'Límite de Fotos Alcanzado',
      limitReachedDescription: 'Has alcanzado el límite de tu plan. Actualiza para continuar.',
      upgradeNow: 'Actualizar Ahora',
      continueWithExcess: 'Continuar con Fotos Excedentes',
      excessConfirmTitle: '¿Usar Fotos Excedentes?',
      excessConfirmDescription: 'Cada foto adicional costará $0,30. ¿Aceptas?',
      photos: 'Fotos', 
      coin: '$',
    },

    toast: {
      downgradeToast: 'No es posible cambiar a una versión inferior. Contacta con el servicio de asistencia.',
      samePlanToast: "Ya estás en ese plan",
      signatureLoadErrorToast: 'Error al cargar los datos de la firma',
      signatureRefreshErrorToast:  'Error al actualizar el plan',
      signatureRefreshSucessToast:  'Plan actualizado correctamente!'
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