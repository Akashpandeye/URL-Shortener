"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { getToken, setToken, removeToken } from "@/lib/api";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  useEffect(() => {
    const stored = getToken();
    if (stored) setTokenState(stored);
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
