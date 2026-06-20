import React, { createContext, useContext, useState, useCallback } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('cc_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (credentials) => {
    const data = await authApi.login(credentials);
    localStorage.setItem('cc_token', data.token);
    const userObj = { id: data.user_id, role: data.role };
    localStorage.setItem('cc_user', JSON.stringify(userObj));
    setUser(userObj);
    return data;
  }, []);

  const signup = useCallback(async (payload) => {
    const data = await authApi.signup(payload);
    localStorage.setItem('cc_token', data.token);
    const userObj = { id: data.user_id, role: data.role };
    localStorage.setItem('cc_user', JSON.stringify(userObj));
    setUser(userObj);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // token may already be invalid — still clear locally
    }
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
