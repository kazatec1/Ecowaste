// API de Verificação de Sessão - EcoWaste Green V6.2
// Valida tokens de sessão e retorna dados do usuário

// Simulação de banco de dados (em produção, usar um banco real)
const users = [
  {
    id: 'user_123',
    name: 'Usuário Eco',
    email: 'user@ecowaste.com',
    permissions: ['user', 'scanner', 'blockchain']
  }
];

// Armazenamento de sessões em memória (em produção, usar Redis ou banco)
// Esta variável deve ser compartilhada entre todas as APIs de auth
const sessions = new Map();

const COOKIE_NAME = 'ecowastegreen_session';

// Função para extrair cookie da requisição
function getCookieValue(request, cookieName) {
  const cookies = request.headers.cookie;
  if (!cookies) return null;

  const cookie = cookies
    .split(';')
    .find(c => c.trim().startsWith(`${cookieName}=`));
  
  return cookie ? cookie.split('=')[1] : null;
}

// Função para validar sessão
function validateSession(sessionToken) {
  const session = sessions.get(sessionToken);
  
  if (!session) {
    return { valid: false, reason: 'Session not found' };
  }

  // Verificar se a sessão expirou
  if (new Date() > session.expiresAt) {
    sessions.delete(sessionToken);
    return { valid: false, reason: 'Session expired' };
  }

  // Atualizar última atividade
  session.lastActivity = new Date();
  sessions.set(sessionToken, session);

  return { valid: true, session };
}

export default async function handler(request, response) {
  // Apenas métodos GET são permitidos
  if (request.method !== 'GET') {
    return response.status(405).json({ 
      success: false, 
      message: 'Método não permitido' 
    });
  }

  try {
    // Extrair token de sessão do cookie
    const sessionToken = getCookieValue(request, COOKIE_NAME);
    
    if (!sessionToken) {
      return response.status(401).json({
        success: false,
        message: 'Token de sessão não encontrado'
      });
    }

    // Validar sessão
    const validation = validateSession(sessionToken);
    
    if (!validation.valid) {
      return response.status(401).json({
        success: false,
        message: 'Sessão inválida ou expirada'
      });
    }

    // Buscar dados do usuário
    const user = users.find(u => u.id === validation.session.userId);
    
    if (!user) {
      // Remover sessão órfã
      sessions.delete(sessionToken);
      return response.status(401).json({
        success: false,
        message: 'Usuário não encontrado'
      });
    }

    // Retornar dados do usuário
    return response.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        permissions: user.permissions
      },
      sessionToken, // Para referência no frontend
      session: {
        createdAt: validation.session.createdAt,
        expiresAt: validation.session.expiresAt,
        lastActivity: validation.session.lastActivity
      }
    });

  } catch (error) {
    console.error('Erro na verificação de sessão:', error);
    
    return response.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
