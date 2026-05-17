import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sl_token'));
  const [isLoading, setIsLoading] = useState(true);

  const persistAuth = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('sl_token', authToken);
    localStorage.setItem('sl_user', JSON.stringify(userData));
  }, []);

  const clearAuth = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sl_token');
    localStorage.removeItem('sl_user');
  }, []);

  // On mount, verify the stored token is still valid
  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        setUser(res.data);
      } catch {
        clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    persistAuth(res.data.user, res.data.token);
    return res;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    persistAuth(res.data.user, res.data.token);
    return res;
  };

  const logout = () => {
    clearAuth();
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
