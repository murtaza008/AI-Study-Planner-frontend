import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, login as loginApi, register as registerApi, logout as logoutApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await getMe();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(loading); // Just to keep the state for now
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const { data } = await loginApi(credentials);
    setUser(data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await registerApi(userData);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await logoutApi();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
