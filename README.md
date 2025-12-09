# HelpDeskPro - Ticket Management System

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)

## 📋 Descripción

HelpDeskPro es un sistema completo de gestión de tickets de soporte construido con Next.js 14, TypeScript y MongoDB. Permite la gestión eficiente de tickets con control de acceso basado en roles para clientes y agentes.

### Características Principales

- ✅ **Autenticación basada en roles** (Cliente/Agente)
- ✅ **Gestión de tickets** con seguimiento de estado y prioridad
- ✅ **Sistema de comentarios** para discusiones en tickets
- ✅ **Notificaciones por email** para eventos de tickets
- ✅ **Dashboard de agentes** con filtros y estadísticas
- ✅ **Portal de clientes** para envío y seguimiento de tickets
- ✅ **Tema oscuro/claro** con toggle de cambio
- ✅ **Componentes UI reutilizables** con efectos glassmorphism

---

## 🏗️ Arquitectura del Proyecto

```
HelpDeskPro/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # 🔵 BACKEND - API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts    # POST - Autenticación
│   │   │   │   └── me/route.ts       # GET - Obtener usuario actual
│   │   │   ├── tickets/
│   │   │   │   ├── route.ts          # GET/POST - Listar/Crear tickets
│   │   │   │   └── [id]/route.ts     # GET/PATCH/DELETE - Ticket individual
│   │   │   ├── comments/
│   │   │   │   └── route.ts          # GET/POST - Comentarios
│   │   │   ├── users/
│   │   │   │   └── agents/route.ts   # GET - Listar agentes
│   │   │   └── cron/
│   │   │       └── reminder/route.ts # POST - Enviar recordatorios
│   │   │
│   │   ├── agent/                    # 🟢 FRONTEND - Portal Agente
│   │   │   ├── layout.tsx            # Layout con header
│   │   │   ├── page.tsx              # Dashboard con tabla de tickets
│   │   │   └── ticket/[id]/page.tsx  # Gestión de ticket individual
│   │   │
│   │   ├── client/                   # 🟢 FRONTEND - Portal Cliente
│   │   │   ├── layout.tsx            # Layout con header
│   │   │   ├── page.tsx              # Lista de mis tickets
│   │   │   ├── new/page.tsx          # Crear nuevo ticket
│   │   │   └── ticket/[id]/page.tsx  # Ver detalle de ticket
│   │   │
│   │   ├── login/page.tsx            # 🟢 FRONTEND - Login
│   │   ├── page.tsx                  # Redirect según rol
│   │   ├── layout.tsx                # Root layout con providers
│   │   └── globals.css               # Estilos globales y animaciones
│   │
│   ├── components/                   # 🎨 COMPONENTES UI
│   │   ├── common/
│   │   │   ├── Badge.tsx             # Badges de status/priority
│   │   │   ├── Button.tsx            # Botón con variantes
│   │   │   ├── Card.tsx              # Card con glassmorphism
│   │   │   ├── LoadingOverlay.tsx    # Overlay de carga
│   │   │   └── ThemeToggle.tsx       # Toggle tema claro/oscuro
│   │   ├── forms/
│   │   │   └── Input.tsx             # Input, Textarea, Select
│   │   └── index.ts                  # Exportaciones centralizadas
│   │
│   ├── context/                      # 🔄 CONTEXTOS REACT
│   │   ├── AuthContext.tsx           # Autenticación global
│   │   └── ThemeContext.tsx          # Tema claro/oscuro
│   │
│   ├── models/                       # 🗄️ MODELOS MONGOOSE
│   │   ├── User.ts                   # Modelo de usuario
│   │   ├── Ticket.ts                 # Modelo de ticket
│   │   ├── Comment.ts                # Modelo de comentario
│   │   └── index.ts                  # Exportaciones
│   │
│   ├── hooks/
│   │   └── useApi.ts                 # Funciones de API (fetch)
│   │
│   ├── types/
│   │   └── index.ts                  # Interfaces TypeScript
│   │
│   ├── utils/
│   │   ├── auth.ts                   # Funciones JWT
│   │   └── email.ts                  # Configuración Nodemailer
│   │
│   └── config/
│       └── db.ts                     # Conexión MongoDB
│
├── tailwind.config.ts                # Configuración Tailwind + colores
├── package.json
└── .env.local                        # Variables de entorno
```

---

## 🔵 BACKEND - API Endpoints

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/me` | Obtener usuario autenticado |

### Tickets
| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| GET | `/api/tickets` | Listar tickets | Client: propios, Agent: todos |
| POST | `/api/tickets` | Crear ticket | Client |
| GET | `/api/tickets/[id]` | Obtener ticket | Client: propios, Agent: todos |
| PATCH | `/api/tickets/[id]` | Actualizar ticket | Agent: status/priority, Client: title/desc |
| DELETE | `/api/tickets/[id]` | Eliminar ticket | Agent |

### Comentarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/comments?ticketId=X` | Obtener comentarios de un ticket |
| POST | `/api/comments` | Agregar comentario |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/users/agents` | Listar agentes disponibles |

---

## 🟢 FRONTEND - Páginas

### Portal Cliente (`/client`)
- **Dashboard**: Lista de tickets del usuario con opciones de filtrado
- **Nuevo Ticket**: Formulario para crear tickets
- **Detalle Ticket**: Ver información y agregar comentarios

### Portal Agente (`/agent`)
- **Dashboard**: Tabla con todos los tickets, estadísticas y edición rápida
- **Gestión Ticket**: Cambiar status, prioridad, asignar agente, comentar

---

## 🎨 COMPONENTES UI

### Badge (`StatusBadge`, `PriorityBadge`)
```tsx
<StatusBadge status="open" />
<PriorityBadge priority="high" />
```

### Button
```tsx
<Button variant="primary" size="lg" isLoading={false}>
  Click me
</Button>
// Variantes: primary, secondary, ghost, danger
```

### Card
```tsx
<Card hoverable glow>
  <CardHeader>Título</CardHeader>
  <CardBody>Contenido</CardBody>
</Card>
```

### ThemeToggle
```tsx
<ThemeToggle /> // Toggle entre tema claro y oscuro
```

---

## 🗄️ MODELOS DE DATOS

### User
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  role: 'client' | 'agent',
  createdAt: Date,
  updatedAt: Date
}
```

### Ticket
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  status: 'open' | 'in_progress' | 'resolved' | 'closed',
  priority: 'low' | 'medium' | 'high',
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User) | null,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```typescript
{
  _id: ObjectId,
  ticketId: ObjectId (ref: Ticket),
  author: ObjectId (ref: User),
  message: string,
  createdAt: Date
}
```

---

## 🚀 Instalación y Ejecución

### 1. Clonar e instalar dependencias
```bash
git clone <repo>
cd AssesmentNext
npm install
```

### 2. Configurar variables de entorno
Crear archivo `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@helpdesk.com
```

### 3. Poblar base de datos (opcional)
```bash
npx ts-node src/scripts/seed.ts
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```

### 5. Acceder a la aplicación
- URL: http://localhost:3000
- **Cliente**: client@helpdesk.com / client123
- **Agente**: agent@helpdesk.com / agent123

---

## 🛠️ Tech Stack

| Tecnología | Uso |
|------------|-----|
| **Next.js 14** | Framework full-stack con App Router |
| **TypeScript** | Tipado estático |
| **MongoDB + Mongoose** | Base de datos y ODM |
| **Tailwind CSS** | Estilos con tema oscuro personalizado |
| **JWT + bcryptjs** | Autenticación segura |
| **Nodemailer** | Notificaciones por email |
| **React Context** | Estado global (Auth, Theme) |

---

## 📝 Licencia

MIT License
