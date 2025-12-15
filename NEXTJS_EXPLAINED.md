# Next.js 14 - Explicación Completa para Sustentación

## ¿QUÉ ES NEXT.JS?

Next.js es un **framework React** que proporciona:
- ✅ Routing automático (basado en carpetas)
- ✅ API routes (crear backend en la misma app)
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Optimización automática (imágenes, fuentes, etc)

---

## APP ROUTER (Next.js 14+)

En Next.js 14, **las carpetas definen automáticamente las rutas**:

```
src/app/
├── page.tsx                 → /
├── layout.tsx               → Layout ROOT (todas las páginas)
│
├── login/
│   └── page.tsx             → /login
│
├── client/
│   ├── layout.tsx           → Layout específico para cliente
│   ├── page.tsx             → /client
│   ├── new/
│   │   └── page.tsx         → /client/new
│   └── ticket/
│       └── [id]/
│           └── page.tsx     → /client/ticket/:id
│
├── agent/
│   ├── page.tsx             → /agent
│   └── ticket/
│       └── [id]/
│           └── page.tsx     → /agent/ticket/:id
│
└── api/
    ├── auth/
    │   ├── login/
    │   │   └── route.ts     → POST /api/auth/login
    │   └── me/
    │       └── route.ts     → GET /api/auth/me
    ├── tickets/
    │   ├── route.ts         → GET/POST /api/tickets
    │   └── [id]/
    │       └── route.ts     → GET/PATCH/DELETE /api/tickets/:id
    └── users/
        ├── route.ts         → GET/POST /api/users
        └── agents/
            └── route.ts     → GET /api/users/agents
```

### CARACTERÍSTICAS DEL APP ROUTER

#### 1. **`page.tsx`** - Página visible
```tsx
export default function ClientDashboard() {
  return <h1>Dashboard del Cliente</h1>;
}
```

#### 2. **`layout.tsx`** - Envuelve todas las páginas en esa carpeta
```tsx
export default function ClientLayout({ children }) {
  return (
    <div className="client-wrapper">
      <Sidebar />
      {children}  {/* Aquí va la página actual */}
    </div>
  );
}
```

#### 3. **`[id]`** - Parámetros dinámicos
```
/client/ticket/123456 → [id] = "123456"
```
```tsx
export default function TicketDetail({ params }: { params: { id: string } }) {
  return <h1>Ticket {params.id}</h1>;
}
```

#### 4. **`api/route.ts`** - Endpoint API
```tsx
export async function GET(request: Request) {
  return Response.json({ data: [...] });
}

export async function POST(request: Request) {
  const data = await request.json();
  // Procesar datos
  return Response.json({ success: true }, { status: 201 });
}
```

---

## COMPONENTES: SERVER vs CLIENT

### **Server Components** (por defecto)
```tsx
// No necesita 'use client'
export default async function ServerComponent() {
  const data = await fetch('http://api.example.com/data');
  return <div>{data}</div>;
}
```

**Características:**
- ✅ Acceso a BD directamente
- ✅ Variables de entorno secretas
- ✅ No puede usar hooks (useState, useEffect)
- ✅ Se ejecuta SOLO en el servidor
- ✅ Seguro (no expone credenciales)

### **Client Components** (con 'use client')
```tsx
'use client';

import { useState } from 'react';

export default function ClientComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**Características:**
- ✅ Usa hooks (useState, useEffect, useContext)
- ✅ Event listeners (onclick, onChange)
- ✅ Se ejecuta en el navegador
- ❌ No puede acceder a BD directamente
- ❌ No puede usar variables de entorno secretas

---

## FLUJO DE PETICIONES EN NUESTRA APP

### LOGIN (Cliente → Servidor)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Cliente abre /login (Client Component)                   │
│    'use client' está en login/page.tsx                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Usuario ingresa email + password                         │
│    Hace POST a /api/auth/login (API Route)                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Servidor (route.ts):                                     │
│    - Valida email + password                                │
│    - Busca en MongoDB                                       │
│    - Compara contraseña con bcryptjs                        │
│    - Genera JWT                                             │
│    - Retorna { user, token }                                │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Cliente recibe respuesta:                                │
│    - Guarda token en localStorage                           │
│    - Guarda usuario en AuthContext                          │
│    - Redirige a /client o /agent (según rol)               │
└─────────────────────────────────────────────────────────────┘
```

### VER TICKETS (Cliente → Servidor)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Cliente abre /client                                     │
│    useEffect() → await getTickets()                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Axios interceptor (useApi.ts):                           │
│    - Obtiene token de localStorage                          │
│    - Añade: Authorization: Bearer <token>                   │
│    - Hace GET /api/tickets                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Servidor (tickets/route.ts):                             │
│    - Obtiene token del header Authorization                 │
│    - Verifica JWT con jwt.verify()                          │
│    - Si cliente → filtra por createdBy: userId              │
│    - Si agente → retorna todos                              │
│    - Retorna lista de tickets                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Cliente recibe tickets:                                  │
│    - setTickets(data)                                       │
│    - Renderiza tabla/cards                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## METADATA Y SEO

```tsx
// src/app/layout.tsx
export const metadata = {
  title: 'HelpDeskPro',
  description: 'Ticket management system'
};
```

Genera:
```html
<head>
  <title>HelpDeskPro</title>
  <meta name="description" content="Ticket management system" />
</head>
```

Puedes sobrescribir por página:
```tsx
// src/app/login/page.tsx
export const metadata = {
  title: 'Login - HelpDeskPro',
};
```

---

## DEPLOYMENT CON NEXT.JS

### En Vercel (recomendado)
```bash
npm install -g vercel
vercel
```

**Ventajas:**
- ✅ Gratis para proyectos pequeños
- ✅ Auto-deploy desde GitHub
- ✅ Serverless (sin servidor que mantener)
- ✅ Optimizaciones automáticas

### En tu propio servidor
```bash
npm run build
npm start
```

---

## PREGUNTAS COMUNES DE SUSTENTACIÓN

### P: ¿Qué es App Router?
R: Sistema de Next.js 14+ donde las **carpetas definen automáticamente las rutas**. Cada `page.tsx` es una página, cada `api/route.ts` es un endpoint.

### P: ¿Cuál es la diferencia entre page.tsx y layout.tsx?
R: 
- `page.tsx`: La página visible para esa ruta
- `layout.tsx`: Envuelve TODAS las páginas de esa carpeta y sus subcarpetas

### P: ¿Por qué 'use client' en login pero no en api/route.ts?
R: 
- `login/page.tsx` necesita hooks (useState) → debe ser client
- `api/route.ts` es código del servidor → nunca es client

### P: ¿Cómo obtiene el servidor el token del cliente?
R: El cliente lo envía en el header `Authorization: Bearer <token>`. El servidor lo extrae y verifica con `jwt.verify()`.

### P: ¿Qué pasa si el JWT expiró?
R: `jwt.verify()` lanza error, el servidor retorna 401, el cliente limpia localStorage y redirige a login.

### P: ¿Por qué necesito next.config.js?
R: Para configuraciones especiales. En nuestro caso, decirle que Mongoose y Nodemailer no se empaquetin para el navegador.

### P: ¿Qué es serverComponentsExternalPackages?
R: Le dice a Next.js que estas librerías solo se usan en el servidor, no las empaquete para el navegador.

---

## ESTRUCTURA FINAL

```
HelpDeskPro/
├── src/
│   ├── app/                  ← Rutas (routing)
│   │   ├── layout.tsx        ← Layout ROOT
│   │   ├── page.tsx          ← Home (/)
│   │   ├── login/            ← Ruta /login
│   │   ├── client/           ← Ruta /client
│   │   ├── agent/            ← Ruta /agent
│   │   └── api/              ← Backend REST API
│   ├── components/           ← Componentes reutilizables
│   ├── context/              ← Estado global (React Context)
│   ├── hooks/                ← Custom hooks (useApi)
│   ├── models/               ← Mongoose models
│   ├── types/                ← TypeScript types
│   └── utils/                ← Utilidades (auth, email)
├── public/                   ← Archivos estáticos
├── next.config.js            ← Config de Next.js
├── tsconfig.json             ← Config de TypeScript
├── tailwind.config.ts        ← Config de Tailwind
└── package.json              ← Dependencias
```

---

## COMANDOS ÚTILES

```bash
npm run dev          # Desarrollo en localhost:3000
npm run build        # Compilar para producción
npm start            # Ejecutar compilado (producción)
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript
```

---

## RESUMEN PARA SUSTENTACIÓN

> **Next.js 14** es un framework React con **App Router**, donde **las carpetas definen rutas automáticamente**. Las páginas dentro de `src/app/` se convierten en rutas, y los archivos `route.ts` crean endpoints API. **Server components** tienen acceso a la BD, **client components** usan hooks. El servidor maneja autenticación (JWT), el cliente almacena tokens en localStorage e incluye JWT en cada petición que el servidor verifica.
