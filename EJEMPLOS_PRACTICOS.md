# 💻 Ejemplos Prácticos del Código

## Referencia Rápida para Sustentación

Este documento contiene fragmentos de código reales del proyecto con explicaciones detalladas que puedes usar durante tu sustentación.

---

## 📋 Índice de Ejemplos

1. [Componente con Estado y Efecto](#1-componente-con-estado-y-efecto)
2. [Formulario Controlado](#2-formulario-controlado)
3. [Context Provider](#3-context-provider)
4. [Custom Hook (useApi)](#4-custom-hook-useapi)
5. [API Route con Autenticación](#5-api-route-con-autenticación)
6. [Componente Reutilizable](#6-componente-reutilizable)
7. [Navegación y Rutas](#7-navegación-y-rutas)
8. [Manejo de Errores](#8-manejo-de-errores)
9. [Modelo de Base de Datos](#9-modelo-de-base-de-datos)
10. [Renderizado Condicional](#10-renderizado-condicional)

---

## 1. Componente con Estado y Efecto

**Archivo:** `src/app/client/page.tsx`

```tsx
'use client'; // Client Component (se ejecuta en el navegador)

import { useState, useEffect } from 'react';
import { ITicket } from '@/types';
import { getTickets } from '@/hooks/useApi';

export default function ClientDashboard() {
  // ========== ESTADOS ==========
  // Estado para almacenar la lista de tickets
  const [tickets, setTickets] = useState<ITicket[]>([]);
  
  // Estado para indicar si está cargando
  const [isLoading, setIsLoading] = useState(true);
  
  // Estado para mensajes de error
  const [error, setError] = useState('');

  // ========== EFECTOS ==========
  // useEffect se ejecuta cuando el componente se monta
  useEffect(() => {
    loadTickets(); // Llamar función para cargar tickets
  }, []); // Array vacío = solo se ejecuta una vez

  // ========== FUNCIONES ==========
  const loadTickets = async () => {
    try {
      setIsLoading(true); // Mostrar indicador de carga
      
      // Llamar a la API para obtener tickets
      const data = await getTickets();
      
      // Actualizar estado con los tickets obtenidos
      setTickets(data);
      
    } catch (err) {
      // Si hay error, guardarlo en el estado
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      
    } finally {
      // Siempre ocultar indicador de carga
      setIsLoading(false);
    }
  };

  // ========== RENDER CONDICIONAL ==========
  // Si está cargando, mostrar spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="spinner">Cargando...</div>
      </div>
    );
  }

  // ========== RENDER PRINCIPAL ==========
  return (
    <div>
      {/* Mostrar error si existe */}
      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {/* Mostrar mensaje si no hay tickets */}
      {tickets.length === 0 ? (
        <div className="empty-state">
          <p>No tienes tickets</p>
        </div>
      ) : (
        /* Mostrar lista de tickets */
        <div className="grid gap-5">
          {tickets.map((ticket) => (
            <Card key={ticket._id}>
              <h3>{ticket.title}</h3>
              <p>{ticket.description}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

**¿Qué pasa cuando este componente se carga?**

1. El componente se monta
2. Se inicializan los estados: `tickets=[]`, `isLoading=true`, `error=''`
3. `useEffect` se ejecuta automáticamente
4. `loadTickets()` se llama
5. Se hace una petición GET a `/api/tickets`
6. Mientras espera respuesta, el componente muestra el spinner
7. Cuando llega la respuesta, `setTickets(data)` actualiza el estado
8. React detecta el cambio y re-renderiza el componente
9. Ahora se muestra la lista de tickets

---

## 2. Formulario Controlado

**Archivo:** `src/app/login/page.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input, Button } from '@/components';

export default function LoginPage() {
  // ========== HOOKS ==========
  const router = useRouter(); // Para navegar entre páginas
  const { login, isLoading } = useAuth(); // Del Context
  
  // ========== ESTADOS LOCALES ==========
  // Cada input tiene su propio estado
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ========== MANEJADOR DE SUBMIT ==========
  const handleSubmit = async (e: React.FormEvent) => {
    // 1. Prevenir recarga de página
    e.preventDefault();
    
    // 2. Limpiar error previo
    setError('');

    // 3. Validar datos
    if (!email || !password) {
      setError('Please enter email and password');
      return; // Salir de la función
    }

    // 4. Intentar hacer login
    try {
      setIsLoggingIn(true); // Mostrar loading
      
      // Llamar función de login del AuthContext
      await login(email, password);
      
      // Si llega aquí, el login fue exitoso
      // Esperar un poco y redirigir
      setTimeout(() => {
        router.push('/'); // Ir a la página principal
      }, 300);
      
    } catch (err) {
      // Si hay error, mostrarlo
      setIsLoggingIn(false);
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  // ========== RENDER ==========
  return (
    <div>
      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Mostrar error si existe */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Input de email - CONTROLADO */}
        <Input
          label="Email Address"
          type="email"
          value={email} // El valor viene del estado
          onChange={(e) => setEmail(e.target.value)} // Actualizar estado al escribir
          placeholder="your@email.com"
          required
        />

        {/* Input de password - CONTROLADO */}
        <Input
          label="Password"
          type="password"
          value={password} // El valor viene del estado
          onChange={(e) => setPassword(e.target.value)} // Actualizar estado al escribir
          placeholder="••••••••"
          required
        />

        {/* Botón de submit */}
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading || isLoggingIn}
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}
```

**Concepto clave: Componentes Controlados**

```tsx
// ❌ Input NO controlado (NO recomendado)
<input type="text" />
// React no tiene control sobre el valor

// ✅ Input controlado (recomendado)
const [nombre, setNombre] = useState('');
<input 
  value={nombre} 
  onChange={(e) => setNombre(e.target.value)} 
/>
// React controla el valor en todo momento
```

**Flujo del formulario:**

1. Usuario escribe en email → `onChange` se dispara → `setEmail()` actualiza estado
2. Usuario escribe en password → `onChange` se dispara → `setPassword()` actualiza estado
3. Usuario hace clic en "Sign In" → `onSubmit` se dispara → `handleSubmit()` se ejecuta
4. `handleSubmit()` llama a `login(email, password)`
5. Si es exitoso → redirige al dashboard
6. Si falla → muestra mensaje de error

---

## 3. Context Provider

**Archivo:** `src/context/AuthContext.tsx`

```tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IAuthContext, IUserResponse } from '@/types';
import * as api from '@/hooks/useApi';

// ========== 1. CREAR CONTEXTO ==========
// Crear un contexto con tipo IAuthContext o undefined
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// ========== 2. CREAR PROVIDER ==========
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estados del contexto
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ========== FUNCIÓN: LOGOUT ==========
  const logout = useCallback(() => {
    // Limpiar estados
    setUser(null);
    setToken(null);
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  // ========== FUNCIÓN: CARGAR USUARIO ==========
  const loadUser = useCallback(async () => {
    // Obtener token guardado
    const savedToken = localStorage.getItem('token');
    
    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      // Validar token con el backend
      setToken(savedToken);
      const userData = await api.getMe();
      setUser(userData);
      
    } catch (error) {
      console.error('Failed to load user:', error);
      logout(); // Si falla, hacer logout
      
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // ========== EFECTO: CARGAR USUARIO AL MONTAR ==========
  useEffect(() => {
    loadUser(); // Verificar si hay sesión activa
  }, [loadUser]);

  // ========== FUNCIÓN: LOGIN ==========
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Llamar a la API de login
      const response = await api.login(email, password);
      
      // Guardar datos en estado
      setUser(response.user);
      setToken(response.token);
      
      // Guardar en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
    } finally {
      setIsLoading(false);
    }
  };

  // ========== VALOR DEL CONTEXTO ==========
  // Este objeto estará disponible en todos los componentes
  const value: IAuthContext = {
    user,              // Usuario actual
    token,             // JWT token
    isLoading,         // Estado de carga
    login,             // Función de login
    logout,            // Función de logout
    isAuthenticated: !!user && !!token, // Boolean: ¿está autenticado?
  };

  // ========== PROVEER CONTEXTO ==========
  return (
    <AuthContext.Provider value={value}>
      {children} {/* Todos los hijos tendrán acceso al contexto */}
    </AuthContext.Provider>
  );
}

// ========== 3. CREAR HOOK PERSONALIZADO ==========
export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  
  // Verificar que se use dentro del Provider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
```

**Cómo se usa:**

```tsx
// En layout.tsx - Envolver toda la app
<AuthProvider>
  <App />
</AuthProvider>

// En cualquier componente - Usar el hook
function MiComponente() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <>
          <p>Hola, {user?.name}</p>
          <button onClick={logout}>Salir</button>
        </>
      ) : (
        <button onClick={() => login(email, pass)}>Entrar</button>
      )}
    </div>
  );
}
```

---

## 4. Custom Hook (useApi)

**Archivo:** `src/hooks/useApi.ts`

```tsx
import axios from 'axios';
import { ITicket, ITicketCreate, ILoginResponse } from '@/types';

// ========== CREAR INSTANCIA DE AXIOS ==========
const api = axios.create({
  baseURL: '/api', // Base URL para todas las peticiones
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== INTERCEPTOR: AÑADIR TOKEN ==========
// Se ejecuta antes de cada petición
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Obtener token del localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Añadir token al header
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

// ========== INTERCEPTOR: MANEJAR ERRORES ==========
// Se ejecuta después de cada respuesta
api.interceptors.response.use(
  (response) => response, // Si es exitosa, dejarla pasar
  
  (error) => {
    // Extraer mensaje de error
    const message = error.response?.data?.error || 
                    error.message || 
                    'An error occurred';
    
    // Rechazar con mensaje personalizado
    return Promise.reject(new Error(message));
  }
);

// ========== FUNCIONES DE AUTENTICACIÓN ==========

/**
 * Login del usuario
 * @param email - Email del usuario
 * @param password - Contraseña del usuario
 * @returns Usuario y token
 */
export async function login(email: string, password: string): Promise<ILoginResponse> {
  // POST /api/auth/login
  const response = await api.post<IApiResponse<ILoginResponse>>('/auth/login', {
    email,
    password,
  });
  
  // Verificar éxito
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Login failed');
  }
  
  return response.data.data;
}

/**
 * Obtener usuario actual
 * @returns Datos del usuario autenticado
 */
export async function getMe(): Promise<IUserResponse> {
  // GET /api/auth/me
  // El token se añade automáticamente por el interceptor
  const response = await api.get<IApiResponse<IUserResponse>>('/auth/me');
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get user');
  }
  
  return response.data.data;
}

// ========== FUNCIONES DE TICKETS ==========

/**
 * Obtener lista de tickets
 * @param filters - Filtros opcionales (status, priority)
 * @returns Array de tickets
 */
export async function getTickets(filters?: ITicketFilters): Promise<ITicket[]> {
  // Construir query string
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);

  // GET /api/tickets?status=open&priority=high
  const response = await api.get<IApiResponse<ITicket[]>>(
    `/tickets?${params.toString()}`
  );
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get tickets');
  }
  
  return response.data.data;
}

/**
 * Crear nuevo ticket
 * @param data - Datos del ticket
 * @returns Ticket creado
 */
export async function createTicket(data: ITicketCreate): Promise<ITicket> {
  // POST /api/tickets
  const response = await api.post<IApiResponse<ITicket>>('/tickets', data);
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create ticket');
  }
  
  return response.data.data;
}

/**
 * Actualizar ticket existente
 * @param id - ID del ticket
 * @param data - Datos a actualizar
 * @returns Ticket actualizado
 */
export async function updateTicket(id: string, data: ITicketUpdate): Promise<ITicket> {
  // PATCH /api/tickets/[id]
  const response = await api.patch<IApiResponse<ITicket>>(`/tickets/${id}`, data);
  
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update ticket');
  }
  
  return response.data.data;
}

export default api;
```

**Cómo se usa:**

```tsx
import { login, getTickets, createTicket } from '@/hooks/useApi';

async function ejemplos() {
  // Ejemplo 1: Login
  const { user, token } = await login('user@example.com', 'password123');
  
  // Ejemplo 2: Obtener tickets
  const tickets = await getTickets();
  
  // Ejemplo 3: Obtener tickets filtrados
  const openTickets = await getTickets({ status: 'open' });
  
  // Ejemplo 4: Crear ticket
  const newTicket = await createTicket({
    title: 'Problema con el sistema',
    description: 'No puedo acceder a mi cuenta',
    priority: 'high'
  });
}
```

---

## 5. API Route con Autenticación

**Archivo:** `src/app/api/tickets/route.ts`

```tsx
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/config/db';
import { Ticket } from '@/models';
import { verifyToken, getTokenFromHeader } from '@/utils/auth';
import { IApiResponse } from '@/types';

// ========== GET /api/tickets ==========
// Obtener lista de tickets
export async function GET(request: NextRequest) {
  try {
    // ===== 1. VERIFICAR AUTENTICACIÓN =====
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Authentication required' },
        { status: 401 } // Unauthorized
      );
    }

    // Verificar y decodificar el token
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // ===== 2. CONECTAR A LA BASE DE DATOS =====
    await dbConnect();

    // ===== 3. OBTENER PARÁMETROS DE LA URL =====
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // ?status=open
    const priority = searchParams.get('priority'); // ?priority=high

    // ===== 4. CONSTRUIR QUERY SEGÚN EL ROL =====
    const query: any = {};

    // Si el usuario es CLIENTE, solo puede ver sus tickets
    if (payload.role === 'client') {
      query.createdBy = payload.userId;
    } else {
      // Si es AGENTE, puede ver todos los tickets
      // Aplicar filtros si existen
      if (status) query.status = status;
      if (priority) query.priority = priority;
    }

    // ===== 5. CONSULTAR BASE DE DATOS =====
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email role') // Incluir datos del creador
      .populate('assignedTo', 'name email role') // Incluir datos del asignado
      .sort({ createdAt: -1 }) // Ordenar por fecha descendente
      .lean(); // Convertir a objeto plano

    // ===== 6. RETORNAR RESPUESTA =====
    return NextResponse.json(
      { success: true, data: tickets },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Get tickets error:', error);
    
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while fetching tickets' },
      { status: 500 }
    );
  }
}

// ========== POST /api/tickets ==========
// Crear nuevo ticket
export async function POST(request: NextRequest) {
  try {
    // ===== 1. VERIFICAR AUTENTICACIÓN =====
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // ===== 2. OBTENER DATOS DEL BODY =====
    const { title, description, priority = 'medium' } = await request.json();

    // ===== 3. VALIDAR DATOS =====
    if (!title || !description) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Title and description are required' },
        { status: 400 } // Bad Request
      );
    }

    if (title.length < 5) {
      return NextResponse.json<IApiResponse<null>>(
        { success: false, error: 'Title must be at least 5 characters' },
        { status: 400 }
      );
    }

    // ===== 4. CONECTAR A LA BASE DE DATOS =====
    await dbConnect();

    // ===== 5. CREAR TICKET =====
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: payload.userId, // Del token JWT
      status: 'open',
    });

    // ===== 6. POBLAR REFERENCIAS =====
    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('createdBy', 'name email role')
      .lean();

    // ===== 7. RETORNAR TICKET CREADO =====
    return NextResponse.json(
      { 
        success: true, 
        data: populatedTicket,
        message: 'Ticket created successfully'
      },
      { status: 201 } // Created
    );
    
  } catch (error) {
    console.error('Create ticket error:', error);
    
    return NextResponse.json<IApiResponse<null>>(
      { success: false, error: 'An error occurred while creating the ticket' },
      { status: 500 }
    );
  }
}
```

**Flujo de la petición:**

```
FRONTEND                     API ROUTE                    DATABASE
   │                             │                            │
   │ GET /api/tickets            │                            │
   │ Headers: {                  │                            │
   │   Authorization: Bearer XXX │                            │
   │ }                           │                            │
   ├────────────────────────────>│                            │
   │                             │                            │
   │                             │ 1. Verificar token         │
   │                             │                            │
   │                             │ 2. Conectar a DB           │
   │                             ├───────────────────────────>│
   │                             │                            │
   │                             │ 3. Ticket.find(query)      │
   │                             │                            │
   │                             │<───────────────────────────┤
   │                             │ 4. Tickets encontrados     │
   │                             │                            │
   │ 5. Respuesta { tickets }    │                            │
   │<────────────────────────────┤                            │
```

---

## 6. Componente Reutilizable

**Archivo:** `src/components/common/Badge.tsx`

```tsx
'use client';

import React from 'react';
import { TicketStatus, TicketPriority } from '@/types';

// ========== STATUS BADGE ==========

interface StatusBadgeProps {
  status: TicketStatus;
}

// Mapa de estilos para cada estado
const statusConfig: Record<TicketStatus, { label: string; className: string }> = {
  open: {
    label: 'Open',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  },
  in_progress: {
    label: 'In Progress',
    className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  resolved: {
    label: 'Resolved',
    className: 'bg-green-500/20 text-green-400 border-green-500/30',
  },
  closed: {
    label: 'Closed',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`
      inline-flex items-center
      px-2.5 py-0.5
      rounded-full
      text-xs font-medium
      border
      ${config.className}
    `}>
      {config.label}
    </span>
  );
}

// ========== PRIORITY BADGE ==========

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const priorityConfig: Record<TicketPriority, { label: string; className: string; icon: string }> = {
  low: {
    label: 'Low',
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    icon: '▼',
  },
  medium: {
    label: 'Medium',
    className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: '■',
  },
  high: {
    label: 'High',
    className: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: '▲',
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={`
      inline-flex items-center gap-1
      px-2.5 py-0.5
      rounded-full
      text-xs font-medium
      border
      ${config.className}
    `}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}
```

**Cómo se usa:**

```tsx
import { StatusBadge, PriorityBadge } from '@/components';

function TicketCard({ ticket }) {
  return (
    <div>
      <h3>{ticket.title}</h3>
      
      {/* Simplemente pasar el valor */}
      <StatusBadge status={ticket.status} />
      <PriorityBadge priority={ticket.priority} />
    </div>
  );
}

// Ejemplos:
<StatusBadge status="open" />        // Azul "Open"
<StatusBadge status="resolved" />    // Verde "Resolved"
<PriorityBadge priority="high" />    // Rojo "▲ High"
<PriorityBadge priority="low" />     // Gris "▼ Low"
```

---

## 7. Navegación y Rutas

```tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function NavigationExamples() {
  const router = useRouter();

  // ========== MÉTODO 1: Link Component (Recomendado) ==========
  // Prefetch automático, mejor SEO
  const linkExamples = (
    <>
      {/* Ruta estática */}
      <Link href="/client/new">
        <Button>Crear Ticket</Button>
      </Link>

      {/* Ruta dinámica */}
      <Link href={`/client/ticket/${ticketId}`}>
        Ver Ticket
      </Link>

      {/* Con clase CSS */}
      <Link href="/agent" className="nav-link">
        Dashboard Agente
      </Link>
    </>
  );

  // ========== MÉTODO 2: useRouter (Programático) ==========
  // Usar cuando necesitas navegar después de una acción
  const routerExamples = () => {
    // Navegar a una ruta
    router.push('/client');

    // Navegar con reemplazo (no crea entrada en historial)
    router.replace('/login');

    // Volver atrás
    router.back();

    // Avanzar
    router.forward();

    // Recargar datos de la ruta actual
    router.refresh();
  };

  // ========== EJEMPLO REAL: Después de crear ticket ==========
  const handleCreateTicket = async (data: ITicketCreate) => {
    try {
      const ticket = await createTicket(data);
      
      // Navegar al ticket creado
      router.push(`/client/ticket/${ticket._id}`);
      
    } catch (error) {
      console.error(error);
    }
  };

  // ========== EJEMPLO REAL: Logout ==========
  const handleLogout = () => {
    logout(); // Limpiar sesión
    router.push('/login'); // Redirigir a login
  };

  return <div>{linkExamples}</div>;
}
```

---

## 8. Manejo de Errores

```tsx
// ========== ESTRATEGIA COMPLETA DE MANEJO DE ERRORES ==========

// 1. EN COMPONENTES
function ClientDashboard() {
  const [error, setError] = useState('');

  const loadTickets = async () => {
    try {
      const data = await getTickets();
      setTickets(data);
      setError(''); // Limpiar error previo
      
    } catch (err) {
      // Capturar y mostrar error
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      
    } finally {
      setIsLoading(false); // Siempre ejecutar
    }
  };

  return (
    <div>
      {/* Mostrar error si existe */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5">
              {/* Ícono de error */}
            </svg>
            <span>{error}</span>
            <button onClick={() => setError('')}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}

// 2. EN AXIOS (Interceptor global)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extraer mensaje de error
    const message = error.response?.data?.error || 
                    error.response?.data?.message ||
                    error.message || 
                    'An error occurred';
    
    // Rechazar con Error personalizado
    return Promise.reject(new Error(message));
  }
);

// 3. EN API ROUTES
export async function GET(request: NextRequest) {
  try {
    // Validación de autenticación
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validación de datos
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Operación exitosa
    return NextResponse.json(
      { success: true, data: tickets },
      { status: 200 }
    );
    
  } catch (error) {
    // Log del error
    console.error('Get tickets error:', error);
    
    // Respuesta de error genérica
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 4. TIPOS DE ERRORES
// 400 - Bad Request: Datos inválidos
// 401 - Unauthorized: No autenticado
// 403 - Forbidden: Sin permisos
// 404 - Not Found: Recurso no encontrado
// 500 - Internal Server Error: Error del servidor
```

---

## 9. Modelo de Base de Datos

**Archivo:** `src/models/Ticket.ts`

```tsx
import mongoose, { Schema, Document } from 'mongoose';
import { TicketStatus, TicketPriority } from '@/types';

// ========== INTERFACE DEL DOCUMENTO ==========
export interface ITicketDocument extends Document {
  title: string;
  description: string;
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId | null;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
}

// ========== DEFINIR ESQUEMA ==========
const TicketSchema = new Schema<ITicketDocument>(
  {
    // Campo: title
    title: {
      type: String,
      required: [true, 'Title is required'], // Mensaje de error
      trim: true, // Eliminar espacios
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    
    // Campo: description
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    
    // Campo: createdBy (referencia a User)
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Nombre del modelo relacionado
      required: [true, 'Creator is required'],
    },
    
    // Campo: assignedTo (opcional)
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Valor por defecto
    },
    
    // Campo: status (enum)
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      required: true,
    },
    
    // Campo: priority (enum)
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      required: true,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// ========== CREAR ÍNDICES ==========
// Mejoran el rendimiento de las consultas
TicketSchema.index({ createdBy: 1 }); // Índice ascendente
TicketSchema.index({ assignedTo: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });
TicketSchema.index({ createdAt: -1 }); // Índice descendente

// ========== CREAR MODELO ==========
const Ticket = mongoose.models.Ticket || 
               mongoose.model<ITicketDocument>('Ticket', TicketSchema);

export default Ticket;
```

**Cómo se usa:**

```tsx
import Ticket from '@/models/Ticket';

// ===== CREAR =====
const ticket = await Ticket.create({
  title: 'Nuevo ticket',
  description: 'Descripción del problema',
  createdBy: userId,
  priority: 'high'
});

// ===== BUSCAR TODOS =====
const tickets = await Ticket.find();

// ===== BUSCAR CON FILTROS =====
const openTickets = await Ticket.find({ status: 'open' });

// ===== BUSCAR UNO =====
const ticket = await Ticket.findById(ticketId);

// ===== BUSCAR Y POBLAR REFERENCIAS =====
const ticket = await Ticket.findById(ticketId)
  .populate('createdBy', 'name email') // Incluir datos del User
  .populate('assignedTo', 'name email');

// ===== ACTUALIZAR =====
const updated = await Ticket.findByIdAndUpdate(
  ticketId,
  { status: 'resolved' },
  { new: true } // Retornar documento actualizado
);

// ===== ELIMINAR =====
await Ticket.findByIdAndDelete(ticketId);
```

---

## 10. Renderizado Condicional

```tsx
function TicketList({ tickets, isLoading, error }) {
  // ========== CASO 1: Loading ==========
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="spinner" />
      </div>
    );
  }

  // ========== CASO 2: Error ==========
  if (error) {
    return (
      <div className="error-banner">
        <p>{error}</p>
        <button onClick={retry}>Reintentar</button>
      </div>
    );
  }

  // ========== CASO 3: Sin datos ==========
  if (tickets.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay tickets</p>
        <Link href="/client/new">
          <Button>Crear Primer Ticket</Button>
        </Link>
      </div>
    );
  }

  // ========== CASO 4: Con datos ==========
  return (
    <div>
      {/* Renderizado condicional en línea */}
      {tickets.map((ticket) => (
        <Card key={ticket._id}>
          <h3>{ticket.title}</h3>
          
          {/* Mostrar asignado solo si existe */}
          {ticket.assignedTo && (
            <p>Asignado a: {ticket.assignedTo.name}</p>
          )}
          
          {/* Operador ternario */}
          <StatusBadge status={ticket.status} />
          
          {/* Renderizado condicional con &&  */}
          {ticket.priority === 'high' && (
            <span className="urgent-badge">¡Urgente!</span>
          )}
          
          {/* Múltiples condiciones */}
          {ticket.status === 'open' ? (
            <Button variant="primary">Resolver</Button>
          ) : ticket.status === 'in_progress' ? (
            <Button variant="warning">En Progreso</Button>
          ) : (
            <Button variant="secondary">Cerrar</Button>
          )}
        </Card>
      ))}
    </div>
  );
}
```

---

## 📝 Resumen de Conceptos Clave

| Concepto | Qué es | Dónde se usa en el proyecto |
|----------|--------|---------------------------|
| **useState** | Hook para manejar estado local | Todos los componentes con datos que cambian |
| **useEffect** | Hook para efectos secundarios | Cargar datos al montar componentes |
| **Context** | Compartir datos globalmente | AuthContext, ThemeContext |
| **Custom Hook** | Lógica reutilizable | useApi.ts para llamadas a API |
| **Props** | Datos pasados a componentes | Button, Badge, Card, etc. |
| **API Routes** | Backend en Next.js | /api/auth, /api/tickets, etc. |
| **Mongoose** | ODM para MongoDB | Modelos de User, Ticket, Comment |
| **JWT** | Autenticación con tokens | verifyToken, login |
| **Interceptors** | Modificar peticiones/respuestas | Añadir token, manejar errores |
| **TypeScript** | Tipado estático | Interfaces, types en todo el código |

---

**¡Usa estos ejemplos durante tu sustentación para demostrar que entiendes el código! 🚀**
