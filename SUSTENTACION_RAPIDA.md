# GUÍA RÁPIDA - SUSTENTACIÓN (Resumen de 1 página)

## PROYECTO: HelpDeskPro - Ticket Management System

### TECNOLOGÍAS
- **Frontend**: Next.js 14 + React + TypeScript
- **Backend**: Next.js API Routes (mismo proyecto)
- **BD**: MongoDB + Mongoose
- **Estilos**: Tailwind CSS (tema oscuro turquesa)
- **Autenticación**: JWT + bcryptjs
- **HTTP**: Axios

---

## ESTRUCTURA CARPETAS

```
src/
├── app/          → Routing y páginas (Next.js App Router)
├── api/          → Endpoints REST (/api/...)
├── components/   → Componentes React reutilizables
├── context/      → Estado global (AuthContext, ThemeContext)
├── hooks/        → useApi (servicios HTTP)
├── models/       → User, Ticket, Comment (Mongoose)
├── types/        → Tipos TypeScript
└── utils/        → auth.ts (JWT, bcrypt), email.ts
```

---

## FLUJOS PRINCIPALES

### 1. LOGIN
```
Cliente (login/page.tsx) 
  → Envía email+password a /api/auth/login
  → Servidor busca usuario en BD + compara contraseña
  → Retorna { user, token }
  → Cliente guarda en localStorage + AuthContext
  → Redirige a /client o /agent (según role)
```

### 2. VER TICKETS
```
Cliente abre /client 
  → useEffect llama getTickets() (useApi.ts)
  → Axios interceptor añade JWT al header
  → Servidor verifica JWT en /api/tickets
  → Si cliente: filtra por createdBy
  → Si agente: retorna todos
  → Cliente renderiza tabla
```

### 3. CREAR USUARIO (Solo Agentes)
```
Agente abre modal "Create User"
  → Envía POST a /api/users
  → Servidor valida que sea agente (desde JWT)
  → Hasea contraseña con bcryptjs (sal 12)
  → Crea usuario en MongoDB
  → Retorna { user }
```

---

## CONCEPTOS CLAVE

### Next.js App Router
- **Carpetas = Rutas**: `src/app/login/page.tsx` → `/login`
- **[id] = Parámetro**: `src/app/ticket/[id]/page.tsx` → `/ticket/123`
- **api/route.ts = Endpoint**: `src/app/api/users/route.ts` → `/api/users`

### Server vs Client Components
- **Server** (por defecto): Sin `'use client'`, acceso a BD, variables secretas
- **Client**: Con `'use client'`, hooks, event listeners, NO acceso a BD

### JWT (JSON Web Token)
```
Header.Payload.Signature
eyJhbGc...(header).eyJ1c2...(payload).SflKxw..(firma)

Payload contiene: { userId, email, role }
Expira en 7 días
Firma solo válida si JWT_SECRET es correcto
```

### bcryptjs (Hash de contraseñas)
```
hashPassword(password) → "$2a$12$salt+hash" (irreversible)
comparePassword(inputPassword, hash) → true/false
Sal 12 = 2^12 iteraciones (seguro)
```

### Mongoose
```
User, Ticket, Comment modelos
Índices en Ticket para queries rápidas
.populate() reemplaza ObjectId con datos reales
```

---

## VALIDACIÓN Y SEGURIDAD

| Punto | Implementación |
|-------|----------------|
| **Email único** | `unique: true` en schema + validación en POST |
| **Contraseña segura** | bcryptjs hash + nunca retornada en JSON |
| **JWT expiración** | 7 días, verifyToken() rechaza expirados |
| **Control de roles** | Verifico `user.role` en servidor antes de acciones |
| **Clientes ven solo sus tickets** | Filtro por `createdBy: userId` en query |
| **Token automático** | Axios interceptor añade Authorization header |

---

## PREGUNTAS ESPERADAS

**P: ¿Cómo funciona la autenticación?**
- Login: POST email+password → servidor valida → retorna JWT
- Futuras peticiones: cliente envía JWT en Authorization header
- Servidor: verifica JWT con jwt.verify(token, SECRET)

**P: ¿Por qué bcryptjs y no guardar contraseña directa?**
- Si roban la BD, no pueden obtener contraseña original
- Es irreversible: solo comparamos hashes

**P: ¿Cómo previene que un cliente vea tickets de otro?**
- En `/api/tickets`, si role='client' filtro por `createdBy: userId`
- Si querían ver otros, necesitarían otro userId en JWT (imposible sin SECRET)

**P: ¿Qué pasa si JWT expiró?**
- `jwt.verify()` lanza error → retorno 401
- Cliente limpia token → redirige a login

**P: ¿Dónde se valida email y contraseña?**
- **Lógica**: en `/api/auth/login` (servidor, seguro)
- **UX**: También validamos en cliente (pero NO es lo importante)

**P: ¿Por qué 'use client' en login pero no en api/route.ts?**
- login/page.tsx: Cliente, necesita useState/hooks → 'use client'
- api/route.ts: Servidor, maneja BD → NO lleva 'use client'

**P: ¿Cómo funciona el Axios interceptor?**
- Antes de CADA petición: busca token en localStorage → lo añade a Authorization header
- Después de respuesta: si error → extrae mensaje y rechaza promise

**P: ¿Qué es una API Route?**
- Archivo `src/app/api/[path]/route.ts`
- Exportas funciones: `GET()`, `POST()`, `PATCH()`, `DELETE()`
- Next.js automáticamente crea endpoints en `/api/[path]`

**P: ¿Por qué roles client y agent?**
- **client**: Crea tickets, ve solo los suyos
- **agent**: Ve todos los tickets, puede editar, puede crear clientes

---

## COMANDOS ÚTILES

```bash
npm run dev              # Desarrollo
npm run build            # Compilar
npm start                # Producción

# En mongosh
db.users.find()         # Ver usuarios
db.tickets.find()       # Ver tickets
db.users.countDocuments()  # Contar
```

---

## RESPUESTA GENERAL PARA SUSTENTACIÓN

> "**HelpDeskPro** es un sistema de gestión de tickets construido con **Next.js 14** (App Router), MongoDB y TypeScript. El **flujo de autenticación** utiliza JWT: el cliente envía email+password a `/api/auth/login`, el servidor valida y retorna un token firmado, el cliente lo almacena en localStorage e incluye en cada petición (interceptor Axios). Las contraseñas se encriptan con **bcryptjs** (irreversible), y el control de acceso se implementa verificando el JWT en cada endpoint API. Los **clientes** ven solo sus tickets, los **agentes** ven todos y pueden crear usuarios. El frontend es totalmente tipado con TypeScript, usa React Context para estado global, y Tailwind CSS para estilos con tema oscuro."

---

## CHECKLIST PRE-SUSTENTACIÓN

- [ ] Entiendo cómo funciona App Router (carpetas = rutas)
- [ ] Sé diferenciar Server Components de Client Components
- [ ] Explico JWT: qué es, cómo se verifica, cuándo expira
- [ ] Entiendo bcryptjs: salt, hash irreversible, comparePassword
- [ ] Sé cómo se valida autenticación en cada endpoint
- [ ] Explico el flujo completo de login
- [ ] Conozco las diferencias entre roles (client vs agent)
- [ ] Puedo leer código en los archivos sin dudas
- [ ] Entiendo por qué cada tecnología se usa
- [ ] Puedo responder preguntas sobre seguridad
