// API de Logout Segura - EcoWaste Green V6.2
// Invalida sessões e limpa cookies de forma segura

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

export default async function handler(request, response) {
  // Apenas métodos POST são permitidos
  if (request.method !== 'POST') {
    return response.status(405).json({ 
      success: false, 
      message: 'Método não permitido' 
    });
  }

  try {
    // Extrair token de sessão do cookie
    const sessionToken = getCookieValue(request, COOKIE_NAME);
    
    if (sessionToken) {
      // Remover sessão do armazenamento
      const sessionExists = sessions.has(sessionToken);
      if (sessionExists) {
        sessions.delete(sessionToken);
        console.log(`Sessão ${sessionToken.substring(0, 8)}... invalidada`);
      }
    }

    // Limpar cookie (definir como expirado)
    response.setHeader('Set-Cookie', [
      `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    ]);

    // Retornar sucesso
    return response.status(200).json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('Erro no logout:', error);
    
    // Mesmo com erro, limpar o cookie
    response.setHeader('Set-Cookie', [
      `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
    ]);
    
    return response.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
