import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  'pt-BR': {
    // Navigation
    home: 'Início',
    dashboard: 'Painel',
    scanner: 'Scanner IA',
    blockchain: 'Blockchain',
    social: 'Rede Social',
    marketplace: 'Marketplace',
    profile: 'Perfil',
    settings: 'Configurações',
    logout: 'Sair',
    
    // Auth
    login: 'Entrar',
    register: 'Cadastrar',
    email: 'Email',
    password: 'Senha',
    name: 'Nome',
    forgotPassword: 'Esqueceu a senha?',
    noAccount: 'Não tem conta?',
    hasAccount: 'Já tem conta?',
    createAccount: 'Criar conta',
    
    // Dashboard
    welcome: 'Bem-vindo',
    level: 'Nível',
    xp: 'XP',
    ecoCoins: 'EcoCoins',
    totalRecycled: 'Total Reciclado',
    todayGoal: 'Meta de Hoje',
    weeklyProgress: 'Progresso Semanal',
    achievements: 'Conquistas',
    recentActivity: 'Atividade Recente',
    
    // Scanner
    scanItem: 'Escanear Item',
    takePhoto: 'Tirar Foto',
    uploadImage: 'Enviar Imagem',
    analyzing: 'Analisando...',
    result: 'Resultado',
    recyclable: 'Reciclável',
    notRecyclable: 'Não Reciclável',
    howToDispose: 'Como Descartar',
    
    // Blockchain
    transactions: 'Transações',
    verified: 'Verificado',
    pending: 'Pendente',
    hash: 'Hash',
    timestamp: 'Data/Hora',
    
    // Social
    feed: 'Feed',
    friends: 'Amigos',
    challenges: 'Desafios',
    leaderboard: 'Ranking',
    share: 'Compartilhar',
    like: 'Curtir',
    comment: 'Comentar',
    
    // Marketplace
    rewards: 'Recompensas',
    redeem: 'Resgatar',
    available: 'Disponível',
    redeemed: 'Resgatado',
    points: 'Pontos',
    
    // Common
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
    save: 'Salvar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    search: 'Buscar',
    filter: 'Filtrar',
    sort: 'Ordenar',
    
    // Messages
    loginSuccess: 'Login realizado com sucesso!',
    registerSuccess: 'Conta criada com sucesso!',
    logoutSuccess: 'Você saiu da sua conta',
    itemScanned: 'Item escaneado com sucesso!',
    rewardRedeemed: 'Recompensa resgatada!',
    
    // App specific
    appName: 'EcoWaste Green',
    appSlogan: 'Reciclagem Inteligente com IA, Blockchain e Gamificação',
    appDescription: 'Transforme seus resíduos em recompensas e ajude o planeta!'
  },
  'en': {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    scanner: 'AI Scanner',
    blockchain: 'Blockchain',
    social: 'Social Network',
    marketplace: 'Marketplace',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    
    // Auth
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    forgotPassword: 'Forgot password?',
    noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?',
    createAccount: 'Create account',
    
    // Dashboard
    welcome: 'Welcome',
    level: 'Level',
    xp: 'XP',
    ecoCoins: 'EcoCoins',
    totalRecycled: 'Total Recycled',
    todayGoal: "Today's Goal",
    weeklyProgress: 'Weekly Progress',
    achievements: 'Achievements',
    recentActivity: 'Recent Activity',
    
    // Scanner
    scanItem: 'Scan Item',
    takePhoto: 'Take Photo',
    uploadImage: 'Upload Image',
    analyzing: 'Analyzing...',
    result: 'Result',
    recyclable: 'Recyclable',
    notRecyclable: 'Not Recyclable',
    howToDispose: 'How to Dispose',
    
    // Blockchain
    transactions: 'Transactions',
    verified: 'Verified',
    pending: 'Pending',
    hash: 'Hash',
    timestamp: 'Timestamp',
    
    // Social
    feed: 'Feed',
    friends: 'Friends',
    challenges: 'Challenges',
    leaderboard: 'Leaderboard',
    share: 'Share',
    like: 'Like',
    comment: 'Comment',
    
    // Marketplace
    rewards: 'Rewards',
    redeem: 'Redeem',
    available: 'Available',
    redeemed: 'Redeemed',
    points: 'Points',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    
    // Messages
    loginSuccess: 'Login successful!',
    registerSuccess: 'Account created successfully!',
    logoutSuccess: 'You have been logged out',
    itemScanned: 'Item scanned successfully!',
    rewardRedeemed: 'Reward redeemed!',
    
    // App specific
    appName: 'EcoWaste Green',
    appSlogan: 'Smart Recycling with AI, Blockchain and Gamification',
    appDescription: 'Turn your waste into rewards and help the planet!'
  },
  'es': {
    // Navigation
    home: 'Inicio',
    dashboard: 'Panel',
    scanner: 'Escáner IA',
    blockchain: 'Blockchain',
    social: 'Red Social',
    marketplace: 'Tienda',
    profile: 'Perfil',
    settings: 'Configuración',
    logout: 'Salir',
    
    // Auth
    login: 'Iniciar sesión',
    register: 'Registrarse',
    email: 'Correo',
    password: 'Contraseña',
    name: 'Nombre',
    forgotPassword: '¿Olvidaste tu contraseña?',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',
    createAccount: 'Crear cuenta',
    
    // Dashboard
    welcome: 'Bienvenido',
    level: 'Nivel',
    xp: 'XP',
    ecoCoins: 'EcoCoins',
    totalRecycled: 'Total Reciclado',
    todayGoal: 'Meta de Hoy',
    weeklyProgress: 'Progreso Semanal',
    achievements: 'Logros',
    recentActivity: 'Actividad Reciente',
    
    // App specific
    appName: 'EcoWaste Green',
    appSlogan: 'Reciclaje Inteligente con IA, Blockchain y Gamificación',
    appDescription: '¡Convierte tus residuos en recompensas y ayuda al planeta!'
  }
};

const currencies = {
  'BRL': { symbol: 'R$', name: 'Real Brasileiro', rate: 1 },
  'USD': { symbol: '$', name: 'US Dollar', rate: 0.20 },
  'EUR': { symbol: '€', name: 'Euro', rate: 0.18 },
  'GBP': { symbol: '£', name: 'British Pound', rate: 0.16 }
};

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt-BR');
  const [currency, setCurrency] = useState('BRL');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('ecowastegreen_language');
    const storedCurrency = localStorage.getItem('ecowastegreen_currency');
    
    if (storedLanguage) setLanguage(storedLanguage);
    if (storedCurrency) setCurrency(storedCurrency);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('ecowastegreen_language', lang);
  };

  const changeCurrency = (curr) => {
    setCurrency(curr);
    localStorage.setItem('ecowastegreen_currency', curr);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  const formatCurrency = (amount) => {
    const currencyInfo = currencies[currency];
    const convertedAmount = amount * currencyInfo.rate;
    return `${currencyInfo.symbol} ${convertedAmount.toFixed(2)}`;
  };

  const value = {
    language,
    currency,
    changeLanguage,
    changeCurrency,
    t,
    formatCurrency,
    availableLanguages: Object.keys(translations),
    availableCurrencies: currencies
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
