// API de Login Segura - EcoWaste Green V6.2
// Implementa autenticação com cookies HttpOnly e validação robusta

import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Simulação de banco de dados (em produção, usar um banco real)
const users = [
  {
    id: 'user_123',
    name: 'Usuário Eco',
    email: 'user@ecowaste.com',
    // Senha: 123456 (hash bcrypt)
    passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    permissions: ['user', 'scanner', 'blockchain']
  }
];

// Armazenamento de sessões em memória (em produção, usar Redis ou banco)
const sessions = new Map();

// Configurações de segurança
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
const COOKIE_NAME = 'ecowastegreen_session';

// Função para gerar token de sessão seguro
function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Função para criar sessão
function createSession(userId) {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  sessions.set(sessionToken, {
    userId,
    createdAt: new Date(),
    expiresAt,
    lastActivity: new Date()
  });
  
  return { sessionToken, expiresAt };
}

// Função para validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para sanitizar entrada
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 255); // Limitar tamanho
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
    const { email, password } = request.body;

    // Validação de entrada
    if (!email || !password) {
      return response.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Sanitizar entradas
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedPassword = sanitizeInput(password);

    // Validar formato do email
    if (!isValidEmail(sanitizedEmail)) {
      return response.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar comprimento da senha
    if (sanitizedPassword.length < 6 || sanitizedPassword.length > 128) {
      return response.status(400).json({
        success: false,
        message: 'Senha deve ter entre 6 e 128 caracteres'
      });
    }

    // Buscar usuário
    const user = users.find(u => u.email === sanitizedEmail);
    if (!user) {
      // Delay para prevenir ataques de timing
      await new Promise(resolve => setTimeout(resolve, 1000));
      return response.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(sanitizedPassword, user.passwordHash);
    if (!isPasswordValid) {
      // Delay para prevenir ataques de timing
      await new Promise(resolve => setTimeout(resolve, 1000));
      return response.status(401).json({
        success: false,
        message: 'Credenciais inválidas'
      });
    }

    // Criar sessão
    const { sessionToken, expiresAt } = createSession(user.id);

    // Configurar cookie HttpOnly
    response.setHeader('Set-Cookie', [
      `${COOKIE_NAME}=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION / 1000}`
    ]);

    // Retornar dados do usuário (sem informações sensíveis)
    return response.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        permissions: user.permissions
      },
      sessionToken, // Apenas para referência no frontend, não para armazenamento
      expiresAt
    });

  } catch (error) {
    console.error('Erro no login:', error);
    
    // Não expor detalhes do erro para o cliente
    return response.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
}
