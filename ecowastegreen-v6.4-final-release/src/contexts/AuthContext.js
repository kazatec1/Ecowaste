import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionToken, setSessionToken] = useState(null);

  // Verificar sessão ao inicializar
  useEffect(() => {
    checkSession();
  }, []);

  // Função para verificar sessão válida
  const checkSession = async () => {
    try {
      setLoading(true);
      
      // Verificar se existe um token de sessão válido via cookie HttpOnly
      const response = await fetch('/api/auth/verify-session', {
        method: 'GET',
        credentials: 'include', // Incluir cookies HttpOnly
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setSessionToken(userData.sessionToken);
      } else {
        // Sessão inválida ou expirada
        setUser(null);
        setSessionToken(null);
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      setUser(null);
      setSessionToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Fazer chamada segura para API de login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include', // Incluir cookies HttpOnly
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no login');
      }

      const userData = await response.json();
      
      // O servidor deve definir um cookie HttpOnly com o token de sessão
      // Não armazenamos tokens sensíveis no cliente
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        // Não incluir tokens ou dados sensíveis aqui
      });
      
      setSessionToken(userData.sessionToken);
      
      return userData;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      // Validação básica no frontend (validação principal deve ser no backend)
      if (!name || !email || !password) {
        throw new Error('Todos os campos são obrigatórios');
      }

      if (password.length < 8) {
        throw new Error('A senha deve ter pelo menos 8 caracteres');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro no registro');
      }

      const userData = await response.json();
      
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      });
      
      setSessionToken(userData.sessionToken);
      
      return userData;
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Invalidar sessão no servidor
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Limpar estado local independentemente do resultado da API
      setUser(null);
      setSessionToken(null);
    }
  };

  // Função para fazer chamadas autenticadas à API
  const authenticatedFetch = async (url, options = {}) => {
    const defaultOptions = {
      credentials: 'include', // Incluir cookies HttpOnly
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    // Se receber 401, a sessão expirou
    if (response.status === 401) {
      setUser(null);
      setSessionToken(null);
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    return response;
  };

  // Função para atualizar dados do usuário
  const updateUser = async (userData) => {
    try {
      const response = await authenticatedFetch('/api/user/update', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        return updatedUser;
      } else {
        throw new Error('Erro ao atualizar dados do usuário');
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      throw error;
    }
  };

  // Função para verificar se o usuário tem uma permissão específica
  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const value = {
    user,
    loading,
    sessionToken,
    login,
    register,
    logout,
    checkSession,
    authenticatedFetch,
    updateUser,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
