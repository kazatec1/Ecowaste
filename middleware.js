// middleware.js - Versão compatível com Vite
// Implementar rate limiting no lado do cliente ou via API routes

export const rateLimitConfig = {
  general: {
    windowSeconds: 60,
    maxRequests: 100
  },
  api: {
    windowSeconds: 60,
    maxRequests: 30
  }
};

// Implementar via interceptors do axios ou fetch
export const applyRateLimit = (endpoint) => {
  // Lógica de rate limiting no cliente
  const key = `rateLimit_${endpoint}`;
  const now = Date.now();
  const stored = localStorage.getItem(key);
  
  if (stored) {
    const { count, timestamp } = JSON.parse(stored);
    if (now - timestamp < 60000 && count >= 30) {
      throw new Error('Rate limit exceeded');
    }
  }
  
  // Atualizar contador
  const current = stored ? JSON.parse(stored) : { count: 0, timestamp: now };
  if (now - current.timestamp >= 60000) {
    current.count = 1;
    current.timestamp = now;
  } else {
    current.count++;
  }
  
  localStorage.setItem(key, JSON.stringify(current));
};