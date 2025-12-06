import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount verify token with backend. If verification fails, clear stored auth
    const verify = async () => {
      const token =
        localStorage.getItem('access_token') ||
        localStorage.getItem('token') ||
        localStorage.getItem('auth_token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await authService.getProfile();
        // profile may be { user: { ... } } or the user object itself depending on backend
        const resolvedUser = profile?.user ?? profile;
        if (resolvedUser) setUser(resolvedUser);
      } catch (err) {
        console.warn('Token verification failed — clearing stored auth', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);

      const token = response?.access || response?.token || response?.access_token || response?.auth_token;
      const refresh = response?.refresh || response?.refresh_token;
      const userFromResp = response?.user || response?.data || response?.profile || null;

      if (token) {
        localStorage.setItem('access_token', token);
      }
      if (refresh) {
        localStorage.setItem('refresh_token', refresh);
      }
      if (userFromResp) {
        localStorage.setItem('user', JSON.stringify(userFromResp));
        setUser(userFromResp);
      }

      return { token, user: userFromResp, raw: response };
    } catch (error) {
      throw error;
    }
    
  };

  const register = async (userData) => {
    const response = await authService.register(userData);

    const token = response?.access || response?.token || response?.access_token || response?.auth_token;
    const refresh = response?.refresh || response?.refresh_token;
    const userFromResp = response?.user || response?.data || response?.profile || null;

    if (token) localStorage.setItem('access_token', token);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    if (userFromResp) {
      localStorage.setItem('user', JSON.stringify(userFromResp));
      setUser(userFromResp);
    }

    return { token, user: userFromResp, raw: response };
  };

  
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
