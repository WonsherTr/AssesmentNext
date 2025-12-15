/**
 * NEXT.JS - CLIENT COMPONENT (Página de Login)
 * 
 * 'use client' INDICA QUE ESTE COMPONENTE:
 * ✅ Se ejecuta en el NAVEGADOR (cliente)
 * ✅ Puede usar hooks (useState, useEffect, useContext)
 * ✅ Puede tener event listeners (onclick, onchange)
 * ❌ NO puede acceder a la BD directamente
 * ❌ NO puede usar variables de entorno secretas
 * 
 * FLUJO:
 * 1. Usuario abre /login
 * 2. Next.js renderiza este componente en el navegador
 * 3. Usuario ingresa email + password
 * 4. handleSubmit() → llama login() del AuthContext
 * 5. AuthContext hace POST a /api/auth/login
 * 6. Si OK → guarda token + usuario → redirige a /
 * 
 * IMPORTS NEXT.JS:
 * - useRouter: Redirigir programáticamente
 *   (NO es window.location, es de Next.js)
 * - useAuth: Hook personalizado del contexto
 * 
 * PREGUNTAS DE SUSTENTACIÓN:
 * - ¿Por qué 'use client'? Porque necesito useState y useRouter
 * - ¿Puedo hacer query a BD aquí? No, eso se hace en /api/auth/login
 * - ¿Dónde se valida la contraseña? En el servidor (/api/auth/login)
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, ThemeToggle, LoadingOverlay } from '@/components';

export default function LoginPage() {
  const router = useRouter();  // Hook de Next.js para redirigir
  const { login, isLoading } = useAuth();  // AuthContext global
  
  // Estados locales (solo para esta página)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  /**
   * MANEJADOR DE SUBMIT
   * 
   * PASOS:
   * 1. Evita recarga de página (e.preventDefault())
   * 2. Valida que email y password no estén vacíos
   * 3. Llama login(email, password) del AuthContext
   * 4. AuthContext hace POST a /api/auth/login
   * 5. Si OK → router.push('/') redirige a home
   * 6. Home → detecta que está autenticado → redirige a /client o /agent
   * 
   * IMPORTANTE:
   * - La validación REAL ocurre en /api/auth/login
   * - Aquí solo prevenimos enviar vacío
   * - El servidor valida email único, contraseña correcta, etc
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    try {
      setIsLoggingIn(true);
      await login(email, password);  // Hace POST a /api/auth/login
      setTimeout(() => {
        router.push('/');  // Redirige a home (que luego redirige a /client o /agent)
      }, 300);
      }, 300);
    } catch (err) {
      setIsLoggingIn(false);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <>
      {isLoggingIn && <LoadingOverlay message="Signing in..." />}
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-primary-500 to-teal-600 p-[3px] mb-4 shadow-xl shadow-primary-500/40">
              <div className="w-full h-full rounded-[13px] bg-gradient-to-br from-primary-400/30 to-dark-bg/80 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-10 h-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="loginIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="9" stroke="url(#loginIconGrad)" strokeWidth="1.8" fill="none" />
                  <circle cx="12" cy="12" r="3.5" stroke="url(#loginIconGrad)" strokeWidth="1.8" fill="none" />
                  <path stroke="url(#loginIconGrad)" strokeWidth="1.8" strokeLinecap="round" d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.64 5.64l1.77 1.77M16.59 16.59l1.77 1.77M5.64 18.36l1.77-1.77M16.59 7.41l1.77-1.77" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gradient">HelpDeskPro</h1>
            <p className="mt-3 text-gray-400">Sign in to your account</p>
          </div>

          <div className="glass rounded-2xl p-8 glow-cyan-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-100">Welcome Back</h2>
              <p className="text-gray-400 mt-1">Enter your credentials to continue</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                size="lg"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-dark-border/30">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-gray-300 font-medium">Demo Accounts</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-dark-bg/50 rounded-xl p-3 border border-dark-border/20">
                  <p className="text-xs text-primary-400 font-medium mb-1">Client</p>
                  <p className="text-xs text-gray-400">client@helpdesk.com</p>
                  <p className="text-xs text-gray-500">client123</p>
                </div>
                <div className="bg-dark-bg/50 rounded-xl p-3 border border-dark-border/20">
                  <p className="text-xs text-primary-400 font-medium mb-1">Agent</p>
                  <p className="text-xs text-gray-400">agent@helpdesk.com</p>
                  <p className="text-xs text-gray-500">agent123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
