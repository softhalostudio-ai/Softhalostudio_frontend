import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('adminToken', newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
  };

  const getAuthHeader = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token, getAuthHeader, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
