// Edge Function AI Scanner Ultra-Segura - EcoWaste Green V6.3
// Implementa validação robusta de imagens e proteção contra DoS

import { NextResponse } from 'next/server';

export const config = {
  runtime: 'edge',
};

// Configurações de segurança
const MAX_IMAGE_SIZE_MB = 5; // Limite de 5MB
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png', 
  'image/webp'
];

// Rate limiting por IP (em produção, usar Redis)
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_MINUTE = 10;

// Cache de classificações para evitar reprocessamento
const classificationCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Verifica rate limiting por IP
 * @param {string} ip - Endereço IP
 * @returns {boolean} True se dentro do limite
 */
function checkRateLimit(ip) {
  const now = Date.now();
  
  if (!ipRequestCounts.has(ip)) {
    ipRequestCounts.set(ip, []);
  }
  
  const requests = ipRequestCounts.get(ip);
  
  // Remover requests antigas
  const recentRequests = requests.filter(timestamp => 
    now - timestamp < RATE_LIMIT_WINDOW
  );
  
  if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  
  // Adicionar request atual
  recentRequests.push(now);
  ipRequestCounts.set(ip, recentRequests);
  
  return true;
}

/**
 * Valida o tipo MIME da imagem
 * @param {string} mimeType - Tipo MIME
 * @returns {object} Resultado da validação
 */
function validateMimeType(mimeType) {
  if (!mimeType || typeof mimeType !== 'string') {
    return {
      valid: false,
      error: 'Tipo de arquivo não especificado'
    };
  }
  
  const normalizedMimeType = mimeType.toLowerCase().trim();
  
  if (!ALLOWED_MIME_TYPES.includes(normalizedMimeType)) {
    return {
      valid: false,
      error: `Tipo de arquivo não suportado. Permitidos: ${ALLOWED_MIME_TYPES.join(', ')}`
    };
  }
  
  return {
    valid: true,
    mimeType: normalizedMimeType
  };
}

/**
 * Valida dados base64 da imagem
 * @param {string} imageData - Dados da imagem em base64
 * @returns {object} Resultado da validação
 */
function validateImageData(imageData) {
  if (!imageData || typeof imageData !== 'string') {
    return {
      valid: false,
      error: 'Dados da imagem não fornecidos'
    };
  }
  
  // Verificar se tem o prefixo data URL
  let base64Data;
  if (imageData.startsWith('data:')) {
    const parts = imageData.split(',');
    if (parts.length !== 2) {
      return {
        valid: false,
        error: 'Formato de data URL inválido'
      };
    }
    base64Data = parts[1];
  } else {
    base64Data = imageData;
  }
  
  // Validar se é base64 válido
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  if (!base64Regex.test(base64Data)) {
    return {
      valid: false,
      error: 'Dados base64 inválidos'
    };
  }
  
  // Verificar tamanho após decodificação
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    
    if (buffer.length > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Imagem muito grande. Máximo: ${MAX_IMAGE_SIZE_MB}MB`
      };
    }
    
    // Verificar se o buffer não está vazio
    if (buffer.length === 0) {
      return {
        valid: false,
        error: 'Imagem vazia'
      };
    }
    
    return {
      valid: true,
      buffer: buffer,
      size: buffer.length
    };
    
  } catch (error) {
    return {
      valid: false,
      error: 'Erro ao decodificar imagem'
    };
  }
}

/**
 * Verifica assinatura de arquivo para detectar tipo real
 * @param {Buffer} buffer - Buffer da imagem
 * @param {string} expectedMimeType - Tipo MIME esperado
 * @returns {object} Resultado da verificação
 */
function verifyFileSignature(buffer, expectedMimeType) {
  if (buffer.length < 4) {
    return {
      valid: false,
      error: 'Arquivo muito pequeno para verificação'
    };
  }
  
  const signatures = {
    'image/jpeg': [
      [0xFF, 0xD8, 0xFF], // JPEG
    ],
    'image/jpg': [
      [0xFF, 0xD8, 0xFF], // JPEG (mesmo que jpeg)
    ],
    'image/png': [
      [0x89, 0x50, 0x4E, 0x47], // PNG
    ],
    'image/webp': [
      [0x52, 0x49, 0x46, 0x46], // WEBP (RIFF)
    ]
  };
  
  const expectedSignatures = signatures[expectedMimeType];
  if (!expectedSignatures) {
    return {
      valid: false,
      error: 'Tipo de arquivo não suportado para verificação'
    };
  }
  
  // Verificar se alguma assinatura corresponde
  const isValid = expectedSignatures.some(signature => {
    return signature.every((byte, index) => buffer[index] === byte);
  });
  
  if (!isValid) {
    return {
      valid: false,
      error: 'Tipo de arquivo não corresponde ao conteúdo'
    };
  }
  
  return { valid: true };
}

/**
 * Gera hash da imagem para cache
 * @param {Buffer} buffer - Buffer da imagem
 * @returns {string} Hash da imagem
 */
function generateImageHash(buffer) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(buffer).digest('hex').substring(0, 16);
}

/**
 * Classifica imagem usando IA (simulado)
 * @param {Buffer} imageBuffer - Buffer da imagem
 * @returns {object} Resultado da classificação
 */
async function classifyImage(imageBuffer) {
  // Simular processamento de IA
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Classificações possíveis baseadas em análise simulada
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
    },
    {
      type: 'organic',
      subtype: 'food_waste',
      confidence: 0.85,
      recyclable: false,
      ecoPoints: 3,
      instructions: 'Descarte na composteira ou lixeira orgânica.'
    }
  ];
  
  // Selecionar classificação aleatória (em produção, usar IA real)
  const randomIndex = Math.floor(Math.random() * classifications.length);
  const result = classifications[randomIndex];
  
  return {
    success: true,
    classification: result,
    processedAt: new Date().toISOString(),
    processingTime: '0.1s'
  };
}

export default async function handler(request) {
  // Verificar método HTTP
  if (request.method !== 'POST') {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Método não permitido' 
      }, 
      { status: 405 }
    );
  }

  try {
    // Obter IP para rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';

    // Verificar rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Muitas requisições. Tente novamente em 1 minuto.' 
        }, 
        { status: 429 }
      );
    }

    // Parsear dados da requisição
    let requestData;
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dados JSON inválidos' 
        }, 
        { status: 400 }
      );
    }

    const { image, mimeType } = requestData;

    // Validar tipo MIME
    const mimeValidation = validateMimeType(mimeType);
    if (!mimeValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: mimeValidation.error 
        }, 
        { status: 400 }
      );
    }

    // Validar dados da imagem
    const imageValidation = validateImageData(image);
    if (!imageValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: imageValidation.error 
        }, 
        { status: 400 }
      );
    }

    // Verificar assinatura do arquivo
    const signatureValidation = verifyFileSignature(
      imageValidation.buffer, 
      mimeValidation.mimeType
    );
    if (!signatureValidation.valid) {
      return NextResponse.json(
        { 
          success: false, 
          error: signatureValidation.error 
        }, 
        { status: 400 }
      );
    }

    // Gerar hash para cache
    const imageHash = generateImageHash(imageValidation.buffer);
    
    // Verificar cache
    const cached = classificationCache.get(imageHash);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        ...cached.result,
        cached: true
      });
    }

    // Classificar imagem
    const classificationResult = await classifyImage(imageValidation.buffer);

    // Armazenar no cache
    classificationCache.set(imageHash, {
      result: classificationResult,
      timestamp: Date.now()
    });

    // Limpar cache antigo periodicamente
    if (classificationCache.size > 1000) {
      const now = Date.now();
      for (const [key, value] of classificationCache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          classificationCache.delete(key);
        }
      }
    }

    return NextResponse.json({
      success: true,
      ...classificationResult,
      imageSize: imageValidation.size,
      imageHash: imageHash
    });

  } catch (error) {
    console.error('Erro na Edge Function AI Scanner:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor' 
      }, 
      { status: 500 }
    );
  }
}
