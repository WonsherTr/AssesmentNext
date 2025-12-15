/**
 * AUTH CONTEXT - Estado Global de Autenticación
 * 
 * Este contexto mantiene el estado de autenticación de toda la aplicación.
 * Permite que cualquier componente acceda a los datos del usuario sin pasar props.
 * 
 * VENTAJAS:
 * - Centraliza lógica de login/logout
 * - Persiste sesión entre recargas (localStorage)
 * - Proporciona hook useAuth() reutilizable
 * 
 * FLUJO:
 * 1. App carga → loadUser() busca token en localStorage
 * 2. Si existe → valida en /api/auth/me
 * 3. Usuario logueado → disponible en todo la app via useAuth()
 * 4. Recargar página → sesión se recupera automáticamente
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { IAuthContext, IUserResponse } from '@/types';
import * as api from '@/hooks/useApi';

const AuthContext = createContext<IAuthContext | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  /**
   * Recupera usuario si existe token previo (al cargar la app)
   * 
   * IMPORTANTE: Este efecto ejecuta al montar el componente
   * y busca si hay sesión guardada en localStorage
   */
  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      setToken(savedToken);
      const userData = await api.getMe();  // Valida token en backend
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();  // Si token es inválido/expirado, limpia todo
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  /**
   * Realiza el login del usuario
   * 
   * PASOS:
   * 1. Envía email + password a /api/auth/login
   * 2. Recibe { user, token } del servidor
   * 3. Guarda ambos en estado Y localStorage
   * 4. Ahora useAuth() devuelve isAuthenticated: true
   */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
    } finally {
      setIsLoading(false);
    }
  };

  const value: IAuthContext = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
