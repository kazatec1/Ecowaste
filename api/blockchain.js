// API Blockchain Ultra-Segura - EcoWaste Green V6.3
// Implementa validação robusta, proteção IDOR e controle de acesso

import { kv } from '@vercel/kv';
import { getAuthUserId, getAuthUser, hasPermission } from './utils/auth.js';
import { validateSchema, sanitizeString } from './utils/validation.js';

// Configurações de segurança
const MAX_TRANSACTION_AMOUNT = 10000; // Limite máximo por transação
const MIN_TRANSACTION_AMOUNT = 0.01; // Valor mínimo
const MAX_TRANSACTIONS_PER_HOUR = 50; // Rate limiting por usuário
const VALID_ADDRESS_PATTERN = /^[a-zA-Z0-9]{20,50}$/; // Padrão de endereço válido

// Cache de rate limiting (em produção, usar Redis)
const userTransactionCounts = new Map();

/**
 * Verifica rate limiting para transações
 * @param {string} userId - ID do usuário
 * @returns {boolean} True se dentro do limite
 */
function checkTransactionRateLimit(userId) {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  if (!userTransactionCounts.has(userId)) {
    userTransactionCounts.set(userId, []);
  }
  
  const userTransactions = userTransactionCounts.get(userId);
  
  // Remover transações antigas (mais de 1 hora)
  const recentTransactions = userTransactions.filter(timestamp => 
    now - timestamp < oneHour
  );
  
  if (recentTransactions.length >= MAX_TRANSACTIONS_PER_HOUR) {
    return false;
  }
  
  // Adicionar transação atual
  recentTransactions.push(now);
  userTransactionCounts.set(userId, recentTransactions);
  
  return true;
}

/**
 * Valida endereço de carteira
 * @param {string} address - Endereço a validar
 * @returns {object} Resultado da validação
 */
function validateWalletAddress(address) {
  const result = { valid: false, errors: [] };
  
  if (!address || typeof address !== 'string') {
    result.errors.push('Endereço é obrigatório');
    return result;
  }
  
  const sanitized = sanitizeString(address, { maxLength: 50 });
  
  if (!VALID_ADDRESS_PATTERN.test(sanitized)) {
    result.errors.push('Formato de endereço inválido');
    return result;
  }
  
  // Verificar se não é um endereço conhecido como malicioso
  const blacklistedAddresses = [
    'malicious123456789012345',
    'scammer98765432109876543'
  ];
  
  if (blacklistedAddresses.includes(sanitized)) {
    result.errors.push('Endereço bloqueado por segurança');
    return result;
  }
  
  result.valid = true;
  result.sanitized = sanitized;
  
  return result;
}

/**
 * Obtém saldo do usuário de forma segura
 * @param {string} userId - ID do usuário
 * @returns {number} Saldo do usuário
 */
async function getUserBalance(userId) {
  try {
    const balance = await kv.get(`user:${userId}:balance`);
    return typeof balance === 'number' ? balance : 1000; // Saldo inicial padrão
  } catch (error) {
    console.error('Erro ao obter saldo:', error);
    return 0;
  }
}

/**
 * Obtém transações do usuário de forma segura
 * @param {string} userId - ID do usuário
 * @param {number} limit - Limite de transações
 * @returns {Array} Lista de transações
 */
async function getUserTransactions(userId, limit = 50) {
  try {
    const transactions = await kv.lrange(`user:${userId}:transactions`, 0, limit - 1);
    return transactions ? transactions.map(tx => {
      try {
        return JSON.parse(tx);
      } catch {
        return null;
      }
    }).filter(Boolean) : [];
  } catch (error) {
    console.error('Erro ao obter transações:', error);
    return [];
  }
}

/**
 * Processa transação de forma segura
 * @param {string} senderId - ID do remetente
 * @param {string} recipientAddress - Endereço do destinatário
 * @param {number} amount - Valor da transação
 * @returns {object} Resultado da transação
 */
async function processTransaction(senderId, recipientAddress, amount) {
  try {
    // Verificar saldo do remetente
    const senderBalance = await getUserBalance(senderId);
    
    if (senderBalance < amount) {
      return {
        success: false,
        error: 'Saldo insuficiente'
      };
    }
    
    // Gerar IDs únicos para a transação
    const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    // Em um cenário real, validar se o endereço do destinatário existe
    // Por enquanto, usar um mock baseado no endereço
    const recipientId = `user_${recipientAddress.slice(-8)}`;
    
    // Executar transação atômica
    const multi = kv.multi();
    
    // Debitar do remetente
    multi.decrby(`user:${senderId}:balance`, amount);
    
    // Creditar ao destinatário (em produção, verificar se existe)
    multi.incrby(`user:${recipientId}:balance`, amount);
    
    // Registrar transação do remetente
    const senderTransaction = {
      id: transactionId,
      type: 'sent',
      amount: amount,
      recipientAddress: recipientAddress,
      timestamp: timestamp,
      status: 'completed'
    };
    multi.lpush(`user:${senderId}:transactions`, JSON.stringify(senderTransaction));
    
    // Registrar transação do destinatário
    const recipientTransaction = {
      id: transactionId,
      type: 'received',
      amount: amount,
      senderAddress: `eco_${senderId.slice(-8)}`, // Mock do endereço do remetente
      timestamp: timestamp,
      status: 'completed'
    };
    multi.lpush(`user:${recipientId}:transactions`, JSON.stringify(recipientTransaction));
    
    // Executar todas as operações
    await multi.exec();
    
    return {
      success: true,
      transactionId: transactionId,
      newBalance: senderBalance - amount
    };
    
  } catch (error) {
    console.error('Erro ao processar transação:', error);
    return {
      success: false,
      error: 'Erro interno do servidor'
    };
  }
}

export default async function handler(request, response) {
  const { method } = request;

  // Verificar autenticação para todas as operações
  const userId = getAuthUserId(request);
  if (!userId) {
    return response.status(401).json({
      success: false,
      message: 'Autenticação necessária'
    });
  }

  // Verificar permissão blockchain
  if (!hasPermission(request, 'blockchain')) {
    return response.status(403).json({
      success: false,
      message: 'Permissão de blockchain necessária'
    });
  }

  switch (method) {
    case 'GET':
      try {
        // Obter dados do usuário autenticado (proteção IDOR)
        const balance = await getUserBalance(userId);
        const transactions = await getUserTransactions(userId);

        return response.status(200).json({
          success: true,
          data: {
            balance: balance,
            transactions: transactions,
            userId: userId // Apenas para referência
          }
        });

      } catch (error) {
        console.error('Erro ao obter dados blockchain:', error);
        return response.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

    case 'POST':
      try {
        // Validar schema da requisição
        const schema = {
          recipientAddress: { type: 'text', required: true, maxLength: 50 },
          amount: { type: 'number', required: true }
        };

        const validation = validateSchema(request.body, schema);
        
        if (!validation.valid) {
          return response.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: validation.errors
          });
        }

        const { recipientAddress, amount } = validation.sanitized;

        // Validar endereço do destinatário
        const addressValidation = validateWalletAddress(recipientAddress);
        if (!addressValidation.valid) {
          return response.status(400).json({
            success: false,
            message: 'Endereço inválido',
            errors: addressValidation.errors
          });
        }

        // Validar valor da transação
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          return response.status(400).json({
            success: false,
            message: 'Valor da transação inválido'
          });
        }

        if (parsedAmount < MIN_TRANSACTION_AMOUNT) {
          return response.status(400).json({
            success: false,
            message: `Valor mínimo é ${MIN_TRANSACTION_AMOUNT} ECO`
          });
        }

        if (parsedAmount > MAX_TRANSACTION_AMOUNT) {
          return response.status(400).json({
            success: false,
            message: `Valor máximo é ${MAX_TRANSACTION_AMOUNT} ECO`
          });
        }

        // Verificar rate limiting
        if (!checkTransactionRateLimit(userId)) {
          return response.status(429).json({
            success: false,
            message: 'Muitas transações. Tente novamente em 1 hora.'
          });
        }

        // Processar transação
        const result = await processTransaction(
          userId, 
          addressValidation.sanitized, 
          parsedAmount
        );

        if (!result.success) {
          return response.status(400).json({
            success: false,
            message: result.error
          });
        }

        return response.status(200).json({
          success: true,
          message: 'Transação realizada com sucesso',
          data: {
            transactionId: result.transactionId,
            newBalance: result.newBalance
          }
        });

      } catch (error) {
        console.error('Erro ao processar transação:', error);
        return response.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

    default:
      response.setHeader('Allow', ['GET', 'POST']);
      return response.status(405).json({
        success: false,
        message: `Método ${method} não permitido`
      });
  }
}
