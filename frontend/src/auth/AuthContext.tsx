import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Role, AuthPayload } from '../types';

interface AuthState {
  token: string | null;
  userId: number | null;
  role: Role | null;
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token'),
  );

  let userId: number | null = null;
  let role: Role | null = null;
  let user: { name: string; email: string } | null = null;
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = jwtDecode<AuthPayload>(token);
      if (decoded.exp * 1000 >= Date.now()) {
        userId = decoded.sub;
        role = decoded.role;
        user = { name: decoded.name, email: decoded.email };
        isAuthenticated = true;
      } else {
        // Token expired
        localStorage.removeItem('token');
        if (token === localStorage.getItem('token')) {
            // avoid infinite render loops, though setting state here is tricky. 
            // Better to just not set isAuthenticated to true and let it naturally fail.
        }
      }
    } catch {
      // Invalid token
    }
  }

  // Handle side-effect of token expiration safely
  useEffect(() => {
    if (token && !isAuthenticated) {
        logout();
    }
  }, [token, isAuthenticated]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        role,
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
