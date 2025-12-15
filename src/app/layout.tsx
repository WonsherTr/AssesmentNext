/**
 * NEXT.JS 14 - ROOT LAYOUT
 * 
 * Este es el Layout ROOT de toda la aplicación (nivel más alto).
 * Todo componente en src/app/ es HIJO de este layout.
 * 
 * CARACTERÍSTICAS NEXT.JS:
 * 1. APP ROUTER: Las carpetas definen rutas automáticamente
 *    - src/app/page.tsx           → /
 *    - src/app/login/page.tsx     → /login
 *    - src/app/agent/page.tsx     → /agent
 *    - src/app/client/page.tsx    → /client
 * 
 * 2. METADATA: Definimos título y descripción (SEO)
 *    - Aparece en pestaña del navegador
 *    - Importante para SEO
 * 
 * 3. FONT OPTIMIZATION: Importamos fuente de Google
 *    - Next.js la auto-optimiza
 *    - No requiere petición extra
 * 
 * 4. PROVIDERS: Aquí colocamos proveedores globales
 *    - AuthProvider: Estado de autenticación (contexto)
 *    - ThemeProvider: Estado del tema oscuro/claro
 *    - Ambos envuelven toda la app
 * 
 * FLUJO:
 * RootLayout
 * ├── ThemeProvider (tema oscuro/claro)
 * │   └── AuthProvider (autenticación global)
 * │       └── children (todas las páginas)
 * 
 * PREGUNTAS DE SUSTENTACIÓN:
 * - ¿Qué es App Router? Sistema de routing basado en carpetas de Next.js 14+
 * - ¿Por qué metadata aquí? Se aplica a toda la app
 * - ¿Qué es un Provider? Componente que proporciona contexto a todos sus hijos
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

const inter = Inter({ subsets: ['latin'] });

/**
 * METADATA - SEO y Titulo de Página
 * 
 * En Next.js 14, usamos el objeto metadata en layouts
 * Se convierte automáticamente en:
 * - <title> en <head>
 * - <meta name="description">
 * 
 * IMPORTANTE: Si usas metadata en page.tsx, sobreescribe la del layout
 * (permite título único por página)
 */
export const metadata: Metadata = {
  title: 'HelpDeskPro - Ticket Management System',
  description: 'A comprehensive ticket management system for efficient support management',
};

/**
 * ROOT LAYOUT COMPONENT
 * 
 * ESTRUCTURA HTML:
 * <html lang="en">        ← Root HTML
 *   <body>                ← Body global
 *     <ThemeProvider>     ← Detecta/aplica tema
 *       <AuthProvider>    ← Carga autenticación
 *         {children}      ← Página actual
 *       </AuthProvider>
 *     </ThemeProvider>
 *   </body>
 * </html>
 * 
 * IMPORTANTE:
 * - Cualquier className aquí aplica a TODAS las páginas
 * - inter.className aplica la fuente Inter a todo el texto
 * - Providers deben envolver {children} para funcionar
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
