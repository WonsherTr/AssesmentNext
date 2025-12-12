# HelpDeskPro - Ticket Management System

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)

## Description

HelpDeskPro is a complete support ticket management system built with Next.js 14, TypeScript and MongoDB. It enables efficient ticket management with role-based access control for clients and agents.

---

## 📚 Documentación para Sustentación / Documentation for Presentation

**¿Necesitas prepararte para la sustentación?** Tenemos documentación completa en español:

### 🎯 Empieza aquí / Start here:
👉 **[LEEME_SUSTENTACION.md](./LEEME_SUSTENTACION.md)** - Guía maestra con índice de toda la documentación

### 📖 Documentos disponibles / Available documents:
1. **[EXPLICACION_CODIGO.md](./EXPLICACION_CODIGO.md)** (31KB) - React desde cero con ejemplos del proyecto
2. **[GUIA_SUSTENTACION.md](./GUIA_SUSTENTACION.md)** (38KB) - Diagramas de flujo y preparación
3. **[EJEMPLOS_PRACTICOS.md](./EJEMPLOS_PRACTICOS.md)** (35KB) - Código real con explicaciones
4. **[RESUMEN_SUSTENTACION.md](./RESUMEN_SUSTENTACION.md)** (16KB) - Resumen ejecutivo y FAQ

Estos documentos explican:
- ✅ Conceptos de React desde cero (componentes, hooks, context)
- ✅ Arquitectura del proyecto y flujos de datos
- ✅ Explicación línea por línea del código
- ✅ Preguntas frecuentes con respuestas detalladas
- ✅ Diagramas y flujos visuales
- ✅ Plan de estudio y checklist de preparación

### Main Features

- Role-based authentication (Client/Agent)
- Ticket management with status and priority tracking
- Comment system for ticket discussions
- Email notifications for ticket events
- Agent dashboard with filters and statistics
- Client portal for ticket submission and tracking
- Dark/light theme toggle
- Reusable UI components with glassmorphism effects

---

## Project Architecture

```
HelpDeskPro/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # BACKEND - API Routes
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts    # POST - Authentication
│   │   │   │   └── me/route.ts       # GET - Get current user
│   │   │   ├── tickets/
│   │   │   │   ├── route.ts          # GET/POST - List/Create tickets
│   │   │   │   └── [id]/route.ts     # GET/PATCH/DELETE - Single ticket
│   │   │   ├── comments/
│   │   │   │   └── route.ts          # GET/POST - Comments
│   │   │   ├── users/
│   │   │   │   └── agents/route.ts   # GET - List agents
│   │   │   └── cron/
│   │   │       └── reminder/route.ts # POST - Send reminders
│   │   │
│   │   ├── agent/                    # FRONTEND - Agent Portal
│   │   │   ├── layout.tsx            # Layout with header
│   │   │   ├── page.tsx              # Dashboard with ticket table
│   │   │   └── ticket/[id]/page.tsx  # Individual ticket management
│   │   │
│   │   ├── client/                   # FRONTEND - Client Portal
│   │   │   ├── layout.tsx            # Layout with header
│   │   │   ├── page.tsx              # My tickets list
│   │   │   ├── new/page.tsx          # Create new ticket
│   │   │   └── ticket/[id]/page.tsx  # Ticket detail view
│   │   │
│   │   ├── login/page.tsx            # FRONTEND - Login
│   │   ├── page.tsx                  # Redirect based on role
│   │   ├── layout.tsx                # Root layout with providers
│   │   └── globals.css               # Global styles and animations
│   │
│   ├── components/                   # UI COMPONENTS
│   │   ├── common/
│   │   │   ├── Badge.tsx             # Status/priority badges
│   │   │   ├── Button.tsx            # Button with variants
│   │   │   ├── Card.tsx              # Card with glassmorphism
│   │   │   ├── LoadingOverlay.tsx    # Loading overlay
│   │   │   └── ThemeToggle.tsx       # Dark/light theme toggle
│   │   ├── forms/
│   │   │   └── Input.tsx             # Input, Textarea, Select
│   │   └── index.ts                  # Centralized exports
│   │
│   ├── context/                      # REACT CONTEXTS
│   │   ├── AuthContext.tsx           # Global authentication
│   │   └── ThemeContext.tsx          # Dark/light theme
│   │
│   ├── models/                       # MONGOOSE MODELS
│   │   ├── User.ts                   # User model
│   │   ├── Ticket.ts                 # Ticket model
│   │   ├── Comment.ts                # Comment model
│   │   └── index.ts                  # Exports
│   │
│   ├── hooks/
│   │   └── useApi.ts                 # API functions (fetch)
│   │
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   │
│   ├── utils/
│   │   ├── auth.ts                   # JWT functions
│   │   └── email.ts                  # Nodemailer configuration
│   │
│   └── config/
│       └── db.ts                     # MongoDB connection
│
├── tailwind.config.ts                # Tailwind configuration + colors
├── package.json
└── .env.local                        # Environment variables
```

---

## BACKEND - API Endpoints

### Authentication
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get authenticated user |

### Tickets
| Method | Route | Description | Roles |
|--------|-------|-------------|-------|
| GET | `/api/tickets` | List tickets | Client: own, Agent: all |
| POST | `/api/tickets` | Create ticket | Client |
| GET | `/api/tickets/[id]` | Get ticket | Client: own, Agent: all |
| PATCH | `/api/tickets/[id]` | Update ticket | Agent: status/priority, Client: title/desc |
| DELETE | `/api/tickets/[id]` | Delete ticket | Agent |

### Comments
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/comments?ticketId=X` | Get ticket comments |
| POST | `/api/comments` | Add comment |

### Users
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/users/agents` | List available agents |

---

## FRONTEND - Pages

### Client Portal (/client)
- **Dashboard**: User ticket list with filtering options
- **New Ticket**: Form to create tickets
- **Ticket Detail**: View information and add comments

### Agent Portal (/agent)
- **Dashboard**: Table with all tickets, statistics and quick edit
- **Ticket Management**: Change status, priority, assign agent, comment

---

## UI COMPONENTS

### Badge (StatusBadge, PriorityBadge)
```tsx
<StatusBadge status="open" />
<PriorityBadge priority="high" />
```

### Button
```tsx
<Button variant="primary" size="lg" isLoading={false}>
  Click me
</Button>
// Variants: primary, secondary, ghost, danger
```

### Card
```tsx
<Card hoverable glow>
  <CardHeader>Title</CardHeader>
  <CardBody>Content</CardBody>
</Card>
```

### ThemeToggle
```tsx
<ThemeToggle /> // Toggle between light and dark theme
```

---

## DATA MODELS

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

## Installation and Setup

### 1. Clone and install dependencies
```bash
git clone <repo>
cd AssesmentNext
npm install
```

### 2. Configure environment variables
Create .env.local file:
```env
MONGODB_URI=mongodb://localhost:27017/helpdesk
JWT_SECRET=your-secret-key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@helpdesk.com
```

### 3. Seed database (optional)
```bash
npx ts-node src/scripts/seed.ts
```

### 4. Run in development
```bash
npm run dev
```

### 5. Access the application
- URL: http://localhost:3000
- **Client**: client@helpdesk.com / client123
- **Agent**: agent@helpdesk.com / agent123

---

## Tech Stack

| Technology | Use |
|------------|-----|
| **Next.js 14** | Full-stack framework with App Router |
| **TypeScript** | Static typing |
| **MongoDB + Mongoose** | Database and ODM |
| **Tailwind CSS** | Styles with custom dark theme |
| **JWT + bcryptjs** | Secure authentication |
| **Nodemailer** | Email notifications |
| **React Context** | Global state (Auth, Theme) |

---

## Screenshots

### Login
![Login](./screenshots/login.png)

### Client Portal - Ticket List
![Client Dashboard](./screenshots/client-dashboard.png)

### Client Portal - Create Ticket
![Create Ticket](./screenshots/create-ticket.png)

### Agent Portal - Dashboard
![Agent Dashboard](./screenshots/agent-dashboard.png)

### Ticket Detail with Comments
![Ticket Detail](./screenshots/ticket-detail.png)

---

## Coder Information

| Field | Value |
|-------|-------|
| **Name** | Carlos Barraza Polo |
| **Clan** | Macondo |
| **Email** | barrazapolo6@gmail.com |
| **ID** | 1002153744 |

---

## License

MIT License
