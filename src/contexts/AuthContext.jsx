import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('ecowastegreen_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('ecowastegreen_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo validation
    if (!email || !password) {
      throw new Error('Email e senha são obrigatórios');
    }
    
    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    const userData = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      level: 1,
      xp: 0,
      ecoCoins: 100,
      totalRecycled: 0,
      badges: ['newcomer'],
      joinedAt: new Date().toISOString(),
      language: 'pt-BR',
      currency: 'BRL'
    };

    localStorage.setItem('ecowastegreen_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const register = async (name, email, password) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!name || !email || !password) {
      throw new Error('Todos os campos são obrigatórios');
    }
    
    if (password.length < 6) {
      throw new Error('Senha deve ter pelo menos 6 caracteres');
    }

    const userData = {
      id: Date.now().toString(),
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      level: 1,
      xp: 0,
      ecoCoins: 100,
      totalRecycled: 0,
      badges: ['newcomer'],
      joinedAt: new Date().toISOString(),
      language: 'pt-BR',
      currency: 'BRL'
    };

    localStorage.setItem('ecowastegreen_user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('ecowastegreen_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('ecowastegreen_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const addXP = (amount) => {
    const newXP = user.xp + amount;
    const xpPerLevel = 100;
    const newLevel = Math.floor(newXP / xpPerLevel) + 1;
    
    updateUser({
      xp: newXP,
      level: newLevel
    });
  };

  const addEcoCoins = (amount) => {
    updateUser({
      ecoCoins: user.ecoCoins + amount
    });
  };

  const addBadge = (badge) => {
    if (!user.badges.includes(badge)) {
      updateUser({
        badges: [...user.badges, badge]
      });
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    addXP,
    addEcoCoins,
    addBadge
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
