// Utilitários de Validação - EcoWaste Green V6.4
// Compatível com Vite/React (sem dependências de servidor)

// Configurações de validação
const VALIDATION_CONFIG = {
  email: { maxLength: 254, minLength: 5 },
  password: { minLength: 8, maxLength: 128 },
  name: { minLength: 2, maxLength: 100 },
  text: { maxLength: 1000 },
  description: { maxLength: 5000 }
};

// Padrões de validação
const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s\-\(\)]{10,15}$/,
  name: /^[a-zA-ZÀ-ÿ\s\-'\.]{2,100}$/,
  username: /^[a-zA-Z0-9_]{3,30}$/
};

/**
 * Sanitiza string
 */
export function sanitizeString(input, options = {}) {
  if (typeof input !== 'string') return '';

  let sanitized = input;
  
  // Remover caracteres de controle
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Limitar tamanho
  const maxLength = options.maxLength || 1000;
  sanitized = sanitized.slice(0, maxLength);
  
  // Trim espaços
  sanitized = sanitized.trim();
  
  // Escapar HTML básico
  if (!options.allowHtml) {
    sanitized = sanitized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  return sanitized;
}

/**
 * Valida email
 */
export function validateEmail(email) {
  const result = { valid: false, errors: [] };

  if (!email || typeof email !== 'string') {
    result.errors.push('Email é obrigatório');
    return result;
  }

  const sanitized = sanitizeString(email.toLowerCase().trim());

  if (sanitized.length < VALIDATION_CONFIG.email.minLength) {
    result.errors.push(`Email deve ter pelo menos ${VALIDATION_CONFIG.email.minLength} caracteres`);
  }

  if (sanitized.length > VALIDATION_CONFIG.email.maxLength) {
    result.errors.push(`Email deve ter no máximo ${VALIDATION_CONFIG.email.maxLength} caracteres`);
  }

  if (!PATTERNS.email.test(sanitized)) {
    result.errors.push('Formato de email inválido');
  }

  result.valid = result.errors.length === 0;
  result.sanitized = sanitized;

  return result;
}

/**
 * Valida senha
 */
export function validatePassword(password) {
  const result = { valid: false, errors: [] };

  if (!password || typeof password !== 'string') {
    result.errors.push('Senha é obrigatória');
    return result;
  }

  if (password.length < VALIDATION_CONFIG.password.minLength) {
    result.errors.push(`Senha deve ter pelo menos ${VALIDATION_CONFIG.password.minLength} caracteres`);
  }

  if (password.length > VALIDATION_CONFIG.password.maxLength) {
    result.errors.push(`Senha deve ter no máximo ${VALIDATION_CONFIG.password.maxLength} caracteres`);
  }

  // Verificar complexidade
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasLowerCase) result.errors.push('Senha deve conter pelo menos uma letra minúscula');
  if (!hasUpperCase) result.errors.push('Senha deve conter pelo menos uma letra maiúscula');
  if (!hasNumbers) result.errors.push('Senha deve conter pelo menos um número');
  if (!hasSpecialChar) result.errors.push('Senha deve conter pelo menos um caractere especial');

  result.valid = result.errors.length === 0;
  return result;
}

/**
 * Valida nome
 */
export function validateName(name) {
  const result = { valid: false, errors: [] };

  if (!name || typeof name !== 'string') {
    result.errors.push('Nome é obrigatório');
    return result;
  }

  const sanitized = sanitizeString(name.trim());

  if (sanitized.length < VALIDATION_CONFIG.name.minLength) {
    result.errors.push(`Nome deve ter pelo menos ${VALIDATION_CONFIG.name.minLength} caracteres`);
  }

  if (sanitized.length > VALIDATION_CONFIG.name.maxLength) {
    result.errors.push(`Nome deve ter no máximo ${VALIDATION_CONFIG.name.maxLength} caracteres`);
  }

  if (!PATTERNS.name.test(sanitized)) {
    result.errors.push('Nome contém caracteres inválidos');
  }

  result.valid = result.errors.length === 0;
  result.sanitized = sanitized;

  return result;
}

/**
 * Valida texto
 */
export function validateText(text, options = {}) {
  const result = { valid: false, errors: [] };

  if (!text || typeof text !== 'string') {
    if (options.required !== false) {
      result.errors.push('Texto é obrigatório');
      return result;
    } else {
      result.valid = true;
      result.sanitized = '';
      return result;
    }
  }

  const maxLength = options.maxLength || VALIDATION_CONFIG.text.maxLength;
  const sanitized = sanitizeString(text, { 
    maxLength,
    allowHtml: options.allowHtml || false
  });

  if (sanitized.length > maxLength) {
    result.errors.push(`Texto deve ter no máximo ${maxLength} caracteres`);
  }

  result.valid = result.errors.length === 0;
  result.sanitized = sanitized;

  return result;
}

/**
 * Valida schema completo
 */
export function validateSchema(data, schema) {
  const result = { valid: true, errors: {}, sanitized: {} };

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    let fieldResult;

    switch (rules.type) {
      case 'email':
        fieldResult = validateEmail(value);
        break;
      case 'password':
        fieldResult = validatePassword(value);
        break;
      case 'name':
        fieldResult = validateName(value);
        break;
      case 'text':
        fieldResult = validateText(value, rules);
        break;
      default:
        fieldResult = { valid: true, sanitized: sanitizeString(value || '') };
    }

    if (!fieldResult.valid) {
      result.valid = false;
      result.errors[field] = fieldResult.errors;
    }

    if (fieldResult.sanitized !== undefined) {
      result.sanitized[field] = fieldResult.sanitized;
    }
  }

  return result;
}