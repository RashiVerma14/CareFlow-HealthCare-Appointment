import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, userApi } from '../api/services.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  useEffect(() => {
    const handleLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const saveSession = (jwtToken, student = null) => {
    localStorage.setItem('token', jwtToken);
    if (student) {
      localStorage.setItem('user', JSON.stringify(student));
    } else {
      localStorage.removeItem('user');
    }
    setToken(jwtToken);
    setUser(student);
  };

  const register = async (formData) => {
    const { data } = await authApi.register(formData);
    return data;
  };

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    const jwtToken = data.token || data.jwt || data.accessToken;

    if (!jwtToken) {
      throw new Error('Login response does not contain a JWT token.');
    }

    saveSession(jwtToken, { email: credentials.email });

    try {
      const profileResponse = await userApi.profile();
      saveSession(jwtToken, profileResponse.data || { email: credentials.email });
    } catch {
      saveSession(jwtToken, { email: credentials.email });
    }

    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      token,
      user,
      register,
      login,
      logout,
      setUser
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
