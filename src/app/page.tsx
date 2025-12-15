/**
 * PÁGINA PRINCIPAL - Router Automático
 * 
 * Esta es la LANDING PAGE ("/"). Su único propósito es redirigir al usuario
 * al dashboard correcto basado en su rol y estado de autenticación.
 * 
 * FLUJO:
 * 1. Usuario accede a "/" (página inicial)
 * 2. Verifica si está cargando los datos de autenticación
 * 3. Una vez cargado:
 *    - ¿Está logueado? 
 *      - SÍ y es AGENTE → /agent
 *      - SÍ y es CLIENTE → /client
 *      - NO → /login
 * 
 * PREGUNTAS DE SUSTENTACIÓN:
 * - ¿Por qué necesito esta página? Para centralizar la lógica de routing
 * - ¿Cómo determinas el rol? Del token JWT decodificado en useAuth()
 * - ¿Qué muestra mientras carga? Un spinner de carga
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        if (user.role === 'agent') {
          router.push('/agent');
        } else {
          router.push('/client');
        }
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 via-primary-500 to-teal-600 p-[3px] mb-6 shadow-xl shadow-primary-500/40 animate-pulse">
          <div className="w-full h-full rounded-[13px] bg-gradient-to-br from-primary-400/30 to-dark-bg/80 backdrop-blur-sm flex items-center justify-center">
            <svg className="w-10 h-10 drop-shadow-lg" fill="none" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="loadingIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="9" stroke="url(#loadingIconGrad)" strokeWidth="1.8" fill="none" />
              <circle cx="12" cy="12" r="3.5" stroke="url(#loadingIconGrad)" strokeWidth="1.8" fill="none" />
              <path stroke="url(#loadingIconGrad)" strokeWidth="1.8" strokeLinecap="round" d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.64 5.64l1.77 1.77M16.59 16.59l1.77 1.77M5.64 18.36l1.77-1.77M16.59 7.41l1.77-1.77" />
            </svg>
          </div>
        </div>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-dark-border border-t-primary-500 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
