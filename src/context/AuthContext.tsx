'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '../lib/api';

interface UserType {
  id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
}

interface AuthContextType {
  token: string | null;
  user: UserType | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 USER FETCH FUNCTION
  const fetchUser = async (token: string) => {
    try {
      const res = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      setToken(token);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  // 🔁 APP AÇILANDA
  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // 🔐 LOGIN
  const login = async (newToken: string) => {
    localStorage.setItem('token', newToken);
    await fetchUser(newToken);
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
};