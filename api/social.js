// API Social Ultra-Segura - EcoWaste Green V6.3
// Implementa proteção IDOR, sanitização UGC e controle de acesso

import { kv } from '@vercel/kv';
import { getAuthUserId, getAuthUser, hasPermission } from './utils/auth.js';
import { validateSchema, sanitizeString, validateText } from './utils/validation.js';

// Configurações de segurança
const MAX_POST_LENGTH = 1000;
const MAX_COMMENT_LENGTH = 500;
const MAX_POSTS_PER_HOUR = 20;
const MAX_COMMENTS_PER_HOUR = 50;
const POSTS_PER_PAGE = 10;

// Rate limiting por usuário
const userPostCounts = new Map();
const userCommentCounts = new Map();

/**
 * Verifica rate limiting para posts
 * @param {string} userId - ID do usuário
 * @returns {boolean} True se dentro do limite
 */
function checkPostRateLimit(userId) {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  if (!userPostCounts.has(userId)) {
    userPostCounts.set(userId, []);
  }
  
  const userPosts = userPostCounts.get(userId);
  const recentPosts = userPosts.filter(timestamp => now - timestamp < oneHour);
  
  if (recentPosts.length >= MAX_POSTS_PER_HOUR) {
    return false;
  }
  
  recentPosts.push(now);
  userPostCounts.set(userId, recentPosts);
  return true;
}

/**
 * Verifica rate limiting para comentários
 * @param {string} userId - ID do usuário
 * @returns {boolean} True se dentro do limite
 */
function checkCommentRateLimit(userId) {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  if (!userCommentCounts.has(userId)) {
    userCommentCounts.set(userId, []);
  }
  
  const userComments = userCommentCounts.get(userId);
  const recentComments = userComments.filter(timestamp => now - timestamp < oneHour);
  
  if (recentComments.length >= MAX_COMMENTS_PER_HOUR) {
    return false;
  }
  
  recentComments.push(now);
  userCommentCounts.set(userId, recentComments);
  return true;
}

/**
 * Verifica se o usuário pode acessar/modificar um post (proteção IDOR)
 * @param {string} postId - ID do post
 * @param {string} userId - ID do usuário
 * @param {string} action - Ação a ser realizada ('read', 'edit', 'delete')
 * @returns {object} Resultado da verificação
 */
async function checkPostAccess(postId, userId, action = 'read') {
  try {
    const post = await kv.get(`post:${postId}`);
    
    if (!post) {
      return {
        allowed: false,
        reason: 'Post não encontrado'
      };
    }
    
    const postData = typeof post === 'string' ? JSON.parse(post) : post;
    
    // Verificar se o post foi deletado
    if (postData.deleted) {
      return {
        allowed: false,
        reason: 'Post foi removido'
      };
    }
    
    // Para leitura, qualquer usuário autenticado pode ver posts públicos
    if (action === 'read') {
      if (postData.visibility === 'public') {
        return { allowed: true, post: postData };
      }
      
      // Posts privados só podem ser vistos pelo autor
      if (postData.authorId === userId) {
        return { allowed: true, post: postData };
      }
      
      return {
        allowed: false,
        reason: 'Post privado'
      };
    }
    
    // Para edição e exclusão, apenas o autor pode modificar
    if (action === 'edit' || action === 'delete') {
      if (postData.authorId !== userId) {
        return {
          allowed: false,
          reason: 'Apenas o autor pode modificar este post'
        };
      }
      
      return { allowed: true, post: postData };
    }
    
    return {
      allowed: false,
      reason: 'Ação não permitida'
    };
    
  } catch (error) {
    console.error('Erro ao verificar acesso ao post:', error);
    return {
      allowed: false,
      reason: 'Erro interno'
    };
  }
}

/**
 * Sanitiza e valida conteúdo gerado pelo usuário
 * @param {string} content - Conteúdo a ser sanitizado
 * @param {number} maxLength - Tamanho máximo permitido
 * @returns {object} Resultado da sanitização
 */
function sanitizeUserContent(content, maxLength) {
  const validation = validateText(content, {
    required: true,
    maxLength: maxLength,
    allowHtml: false // Não permitir HTML para evitar XSS
  });
  
  if (!validation.valid) {
    return validation;
  }
  
  // Sanitização adicional para conteúdo social
  let sanitized = validation.sanitized;
  
  // Remover múltiplas quebras de linha consecutivas
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');
  
  // Remover espaços excessivos
  sanitized = sanitized.replace(/\s{3,}/g, ' ');
  
  // Filtrar palavras ofensivas (lista básica)
  const offensiveWords = ['spam', 'scam', 'hack', 'malware'];
  const lowerContent = sanitized.toLowerCase();
  
  for (const word of offensiveWords) {
    if (lowerContent.includes(word)) {
      return {
        valid: false,
        errors: ['Conteúdo contém palavras não permitidas']
      };
    }
  }
  
  return {
    valid: true,
    sanitized: sanitized
  };
}

/**
 * Obtém posts do feed de forma segura
 * @param {string} userId - ID do usuário solicitante
 * @param {number} page - Página solicitada
 * @returns {Array} Lista de posts
 */
async function getFeedPosts(userId, page = 0) {
  try {
    const start = page * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE - 1;
    
    // Obter IDs dos posts públicos mais recentes
    const postIds = await kv.lrange('posts:public', start, end) || [];
    
    const posts = [];
    
    for (const postId of postIds) {
      const accessCheck = await checkPostAccess(postId, userId, 'read');
      
      if (accessCheck.allowed) {
        // Remover dados sensíveis antes de retornar
        const safePost = {
          id: accessCheck.post.id,
          content: accessCheck.post.content,
          authorName: accessCheck.post.authorName,
          createdAt: accessCheck.post.createdAt,
          likes: accessCheck.post.likes || 0,
          comments: accessCheck.post.comments || 0,
          ecoPoints: accessCheck.post.ecoPoints || 0,
          // NÃO incluir authorId para evitar exposição de dados
        };
        
        posts.push(safePost);
      }
    }
    
    return posts;
    
  } catch (error) {
    console.error('Erro ao obter posts do feed:', error);
    return [];
  }
}

/**
 * Cria um novo post de forma segura
 * @param {string} userId - ID do autor
 * @param {string} content - Conteúdo do post
 * @param {string} visibility - Visibilidade do post
 * @returns {object} Resultado da criação
 */
async function createPost(userId, content, visibility = 'public') {
  try {
    // Obter dados do usuário
    const user = await getAuthUser({ headers: { cookie: `ecowastegreen_session=${userId}` } });
    if (!user) {
      return {
        success: false,
        error: 'Usuário não encontrado'
      };
    }
    
    // Gerar ID único para o post
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date().toISOString();
    
    const postData = {
      id: postId,
      content: content,
      authorId: userId,
      authorName: user.name,
      visibility: visibility,
      createdAt: timestamp,
      updatedAt: timestamp,
      likes: 0,
      comments: 0,
      ecoPoints: 5, // Pontos por criar post
      deleted: false
    };
    
    // Salvar post
    await kv.set(`post:${postId}`, JSON.stringify(postData));
    
    // Adicionar à lista de posts públicos se for público
    if (visibility === 'public') {
      await kv.lpush('posts:public', postId);
    }
    
    // Adicionar à lista de posts do usuário
    await kv.lpush(`user:${userId}:posts`, postId);
    
    return {
      success: true,
      postId: postId,
      ecoPoints: postData.ecoPoints
    };
    
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return {
      success: false,
      error: 'Erro interno do servidor'
    };
  }
}

export default async function handler(request, response) {
  const { method } = request;

  // Verificar autenticação
  const userId = getAuthUserId(request);
  if (!userId) {
    return response.status(401).json({
      success: false,
      message: 'Autenticação necessária'
    });
  }

  // Verificar permissão social
  if (!hasPermission(request, 'social')) {
    return response.status(403).json({
      success: false,
      message: 'Permissão de rede social necessária'
    });
  }

  switch (method) {
    case 'GET':
      try {
        const { page = 0, postId } = request.query || {};
        
        // Se postId for fornecido, retornar post específico
        if (postId) {
          const accessCheck = await checkPostAccess(postId, userId, 'read');
          
          if (!accessCheck.allowed) {
            return response.status(403).json({
              success: false,
              message: accessCheck.reason
            });
          }
          
          return response.status(200).json({
            success: true,
            data: {
              id: accessCheck.post.id,
              content: accessCheck.post.content,
              authorName: accessCheck.post.authorName,
              createdAt: accessCheck.post.createdAt,
              likes: accessCheck.post.likes || 0,
              comments: accessCheck.post.comments || 0,
              ecoPoints: accessCheck.post.ecoPoints || 0
            }
          });
        }
        
        // Retornar feed de posts
        const posts = await getFeedPosts(userId, parseInt(page));
        
        return response.status(200).json({
          success: true,
          data: {
            posts: posts,
            page: parseInt(page),
            hasMore: posts.length === POSTS_PER_PAGE
          }
        });

      } catch (error) {
        console.error('Erro ao obter posts:', error);
        return response.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

    case 'POST':
      try {
        // Validar schema da requisição
        const schema = {
          content: { type: 'text', required: true, maxLength: MAX_POST_LENGTH },
          visibility: { type: 'text', required: false, maxLength: 10 }
        };

        const validation = validateSchema(request.body, schema);
        
        if (!validation.valid) {
          return response.status(400).json({
            success: false,
            message: 'Dados inválidos',
            errors: validation.errors
          });
        }

        const { content, visibility = 'public' } = validation.sanitized;

        // Sanitizar conteúdo do usuário
        const contentValidation = sanitizeUserContent(content, MAX_POST_LENGTH);
        if (!contentValidation.valid) {
          return response.status(400).json({
            success: false,
            message: 'Conteúdo inválido',
            errors: contentValidation.errors
          });
        }

        // Validar visibilidade
        if (!['public', 'private'].includes(visibility)) {
          return response.status(400).json({
            success: false,
            message: 'Visibilidade deve ser "public" ou "private"'
          });
        }

        // Verificar rate limiting
        if (!checkPostRateLimit(userId)) {
          return response.status(429).json({
            success: false,
            message: 'Muitos posts criados. Tente novamente em 1 hora.'
          });
        }

        // Criar post
        const result = await createPost(userId, contentValidation.sanitized, visibility);

        if (!result.success) {
          return response.status(400).json({
            success: false,
            message: result.error
          });
        }

        return response.status(201).json({
          success: true,
          message: 'Post criado com sucesso',
          data: {
            postId: result.postId,
            ecoPoints: result.ecoPoints
          }
        });

      } catch (error) {
        console.error('Erro ao criar post:', error);
        return response.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

    case 'PUT':
      try {
        const { postId, content } = request.body;

        if (!postId) {
          return response.status(400).json({
            success: false,
            message: 'ID do post é obrigatório'
          });
        }

        // Verificar acesso para edição (proteção IDOR)
        const accessCheck = await checkPostAccess(postId, userId, 'edit');
        
        if (!accessCheck.allowed) {
          return response.status(403).json({
            success: false,
            message: accessCheck.reason
          });
        }

        // Sanitizar novo conteúdo
        const contentValidation = sanitizeUserContent(content, MAX_POST_LENGTH);
        if (!contentValidation.valid) {
          return response.status(400).json({
            success: false,
            message: 'Conteúdo inválido',
            errors: contentValidation.errors
          });
        }

        // Atualizar post
        const updatedPost = {
          ...accessCheck.post,
          content: contentValidation.sanitized,
          updatedAt: new Date().toISOString()
        };

        await kv.set(`post:${postId}`, JSON.stringify(updatedPost));

        return response.status(200).json({
          success: true,
          message: 'Post atualizado com sucesso'
        });

      } catch (error) {
        console.error('Erro ao atualizar post:', error);
        return response.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

    case 'DELETE':
      try {
        const { postId } = request.body;

        if (!postId) {
          return response.status(400).json({
            success: false,
            message: 'ID do post é obrigatório'
          });
        }

        // Verificar acesso para exclusão (proteção IDOR)
        const accessCheck = await checkPostAccess(postId, userId, 'delete');
        
        if (!accessCheck.allowed) {
          return response.status(403).json({
            success: false,
            message: accessCheck.reason
          });
        }

        // Marcar como deletado (soft delete)
        const deletedPost = {
          ...accessCheck.post,
          deleted: true,
          deletedAt: new Date().toISOString()
        };

        await kv.set(`post:${postId}`, JSON.stringify(deletedPost));

        // Remover da lista pública se necessário
        if (accessCheck.post.visibility === 'public') {
          await kv.lrem('posts:public', 1, postId);
        }

        return response.status(200).json({
          success: true,
          message: 'Post removido com sucesso'
        });

      } catch (error) {
        console.error('Erro ao deletar post:', error);
        return response.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

    default:
      response.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return response.status(405).json({
        success: false,
        message: `Método ${method} não permitido`
      });
  }
}
