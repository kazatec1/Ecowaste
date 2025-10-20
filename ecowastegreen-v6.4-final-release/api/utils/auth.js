// Utilitários de Autenticação - EcoWaste Green V6.4
// Compatível com Vite/React

// Simulação de armazenamento de sessões (em produção, usar backend real)
const sessions = new Map();
const users = [
  {
    id: 'user_123',
    name: 'Usuário Eco',
    email: 'user@ecowaste.com',
    permissions: ['user', 'scanner', 'blockchain', 'social'],
    role: 'user'
  }
];

const COOKIE_NAME = 'ecowastegreen_session';

/**
 * Obtém valor de cookie
 */
function getCookieValue(cookieName) {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie;
  if (!cookies) return null;

  const cookie = cookies
    .split(';')
    .find(c => c.trim().startsWith(`${cookieName}=`));
  
  return cookie ? cookie.split('=')[1] : null;
}

/**
 * Define cookie
 */
function setCookie(name, value, days = 1) {
  if (typeof document === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
}

/**
 * Remove cookie
 */
function removeCookie(name) {
  if (typeof document === 'undefined') return;
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

/**
 * Valida sessão
 */
function validateSession(sessionToken) {
  if (!sessionToken) return { valid: false };
  
  const session = sessions.get(sessionToken);
  if (!session) return { valid: false };
  
  if (new Date() > session.expiresAt) {
    sessions.delete(sessionToken);
    return { valid: false };
  }
  
  return { valid: true, session };
}

/**
 * Obtém usuário atual
 */
export function getCurrentUser() {
  const sessionToken = getCookieValue(COOKIE_NAME);
  if (!sessionToken) return null;
  
  const validation = validateSession(sessionToken);
  if (!validation.valid) return null;
  
  const user = users.find(u => u.id === validation.session.userId);
  return user || null;
}

/**
 * Verifica se usuário está autenticado
 */
export function isAuthenticated() {
  return getCurrentUser() !== null;
}

/**
 * Verifica permissão
 */
export function hasPermission(permission) {
  const user = getCurrentUser();
  return user?.permissions?.includes(permission) || false;
}

/**
 * Login do usuário
 */
export async function login(email, password) {
  try {
    // Simular validação (em produção, fazer requisição para API)
    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user || password !== '123456') { // Senha demo
      throw new Error('Credenciais inválidas');
    }
    
    // Criar sessão
    const sessionToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    sessions.set(sessionToken, {
      userId: user.id,
      createdAt: new Date(),
      expiresAt,
      lastActivity: new Date()
    });
    
    // Definir cookie
    setCookie(COOKIE_NAME, sessionToken, 1);
    
    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        permissions: user.permissions
      }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Logout do usuário
 */
export function logout() {
  const sessionToken = getCookieValue(COOKIE_NAME);
  
  if (sessionToken) {
    sessions.delete(sessionToken);
  }
  
  removeCookie(COOKIE_NAME);
  
  return { success: true };
}

/**
 * Verifica sessão
 */
export function verifySession() {
  const user = getCurrentUser();
  
  if (!user) {
    return {
      success: false,
      message: 'Sessão inválida'
    };
  }
  
  return {
    success: true,
    user
  };
}