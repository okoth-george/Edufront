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
    // Check if user is logged in on mount
    //check for the specific 'access' token key you used 
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try{
        setUser(JSON.parse(userData));
      } catch (error){
        console.error("Failed to parse user data",error);
        localStorage.clear();
      }
      
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try{
      const response = await authService.login(email, password);
    if (response.access) {
      //store both tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      //store user data
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
    return response;

    } catch (error){
      throw error;
    }
    
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    if (response.token) {
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token',response.refresh)
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
    return response;
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
