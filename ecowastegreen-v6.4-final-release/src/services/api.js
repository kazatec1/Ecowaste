// Serviços de API - EcoWaste Green V6.4
// Simulação de APIs para desenvolvimento

import { getCurrentUser, hasPermission } from '../utils/auth.js';
import { validateSchema, sanitizeString } from '../utils/validation.js';

// Simulação de dados
let mockData = {
  posts: [
    {
      id: 'post_1',
      content: 'Acabei de reciclar 5 garrafas plásticas! 🌱',
      authorId: 'user_123',
      authorName: 'Usuário Eco',
      createdAt: new Date().toISOString(),
      likes: 12,
      comments: 3,
      ecoPoints: 10
    }
  ],
  userBalance: 1000,
  transactions: [
    {
      id: 'tx_1',
      type: 'received',
      amount: 50,
      description: 'Recompensa por reciclagem',
      timestamp: new Date().toISOString()
    }
  ]
};

/**
 * Simula delay de rede
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * API de Blockchain
 */
export const blockchainAPI = {
  async getBalance() {
    await delay(500);
    
    if (!hasPermission('blockchain')) {
      throw new Error('Permissão de blockchain necessária');
    }
    
    return {
      success: true,
      data: {
        balance: mockData.userBalance,
        transactions: mockData.transactions
      }
    };
  },

  async sendTransaction(recipientAddress, amount) {
    await delay(1000);
    
    if (!hasPermission('blockchain')) {
      throw new Error('Permissão de blockchain necessária');
    }
    
    const validation = validateSchema({ recipientAddress, amount }, {
      recipientAddress: { type: 'text', required: true, maxLength: 50 },
      amount: { type: 'number', required: true }
    });
    
    if (!validation.valid) {
      throw new Error('Dados inválidos');
    }
    
    const parsedAmount = parseFloat(amount);
    
    if (parsedAmount <= 0 || parsedAmount > mockData.userBalance) {
      throw new Error('Valor inválido ou saldo insuficiente');
    }
    
    // Simular transação
    const transaction = {
      id: `tx_${Date.now()}`,
      type: 'sent',
      amount: parsedAmount,
      recipientAddress: validation.sanitized.recipientAddress,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    mockData.userBalance -= parsedAmount;
    mockData.transactions.unshift(transaction);
    
    return {
      success: true,
      data: {
        transactionId: transaction.id,
        newBalance: mockData.userBalance
      }
    };
  }
};

/**
 * API Social
 */
export const socialAPI = {
  async getPosts(page = 0) {
    await delay(300);
    
    if (!hasPermission('social')) {
      throw new Error('Permissão de rede social necessária');
    }
    
    const postsPerPage = 10;
    const start = page * postsPerPage;
    const posts = mockData.posts.slice(start, start + postsPerPage);
    
    return {
      success: true,
      data: {
        posts,
        page,
        hasMore: posts.length === postsPerPage
      }
    };
  },

  async createPost(content, visibility = 'public') {
    await delay(500);
    
    if (!hasPermission('social')) {
      throw new Error('Permissão de rede social necessária');
    }
    
    const validation = validateSchema({ content }, {
      content: { type: 'text', required: true, maxLength: 1000 }
    });
    
    if (!validation.valid) {
      throw new Error('Conteúdo inválido');
    }
    
    const user = getCurrentUser();
    const post = {
      id: `post_${Date.now()}`,
      content: validation.sanitized.content,
      authorId: user.id,
      authorName: user.name,
      visibility,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      ecoPoints: 5
    };
    
    mockData.posts.unshift(post);
    
    return {
      success: true,
      data: {
        postId: post.id,
        ecoPoints: post.ecoPoints
      }
    };
  }
};

/**
 * API AI Scanner
 */
export const aiScannerAPI = {
  async scanImage(imageData, mimeType) {
    await delay(2000); // Simular processamento de IA
    
    if (!hasPermission('scanner')) {
      throw new Error('Permissão de scanner necessária');
    }
    
    // Validações básicas
    if (!imageData || !mimeType) {
      throw new Error('Imagem e tipo MIME são obrigatórios');
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(mimeType.toLowerCase())) {
      throw new Error('Tipo de arquivo não suportado');
    }
    
    // Simular classificação de IA
    const classifications = [
      {
        type: 'plastic',
        subtype: 'bottle',
        confidence: 0.95,
        recyclable: true,
        ecoPoints: 10,
        instructions: 'Remova a tampa e lave antes de descartar na lixeira de recicláveis.'
      },
      {
        type: 'paper',
        subtype: 'cardboard',
        confidence: 0.88,
        recyclable: true,
        ecoPoints: 5,
        instructions: 'Dobre e coloque na lixeira de papel reciclável.'
      },
      {
        type: 'metal',
        subtype: 'aluminum_can',
        confidence: 0.92,
        recyclable: true,
        ecoPoints: 15,
        instructions: 'Lave e amasse antes de descartar na lixeira de metais.'
      }
    ];
    
    const randomIndex = Math.floor(Math.random() * classifications.length);
    const classification = classifications[randomIndex];
    
    return {
      success: true,
      classification,
      processedAt: new Date().toISOString(),
      processingTime: '2.0s'
    };
  }
};