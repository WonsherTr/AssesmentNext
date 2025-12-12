# 📚 Explicación Completa del Código - HelpDeskPro
## Guía para Aprender React desde Cero

Esta guía te ayudará a entender cada parte del código del proyecto HelpDeskPro, explicando conceptos fundamentales de React y Next.js como si estuvieras aprendiéndolos desde cero.

---

## 📑 Tabla de Contenidos
1. [¿Qué es React?](#qué-es-react)
2. [¿Qué es Next.js?](#qué-es-nextjs)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Conceptos Fundamentales de React](#conceptos-fundamentales-de-react)
5. [Explicación Detallada del Código](#explicación-detallada-del-código)
6. [Flujo de la Aplicación](#flujo-de-la-aplicación)
7. [Preguntas Frecuentes para Sustentación](#preguntas-frecuentes-para-sustentación)

---

## 🚀 ¿Qué es React?

**React** es una biblioteca de JavaScript para construir interfaces de usuario (UI). Fue creada por Facebook y se basa en el concepto de **componentes reutilizables**.

### Conceptos Clave:
- **Componentes**: Piezas de código reutilizables que representan partes de la UI
- **JSX**: Sintaxis que permite escribir HTML dentro de JavaScript
- **Estado (State)**: Datos que pueden cambiar en tu aplicación
- **Props**: Datos que se pasan de un componente padre a un hijo
- **Hooks**: Funciones especiales que permiten usar características de React

---

## 🌐 ¿Qué es Next.js?

**Next.js** es un framework construido sobre React que añade características adicionales:
- **Renderizado del lado del servidor (SSR)**: Las páginas se generan en el servidor
- **Enrutamiento basado en archivos**: Las rutas se crean automáticamente según la estructura de carpetas
- **API Routes**: Puedes crear APIs backend directamente en el proyecto
- **Optimización automática**: Mejora el rendimiento sin configuración adicional

### En este proyecto usamos:
- **App Router** (Next.js 14): Nueva forma de manejar rutas y layouts
- **React Server Components**: Componentes que se ejecutan solo en el servidor
- **Client Components**: Componentes interactivos que se ejecutan en el navegador

---

## 🏗️ Arquitectura del Proyecto

```
HelpDeskPro/
├── src/
│   ├── app/                    # PÁGINAS Y RUTAS
│   │   ├── layout.tsx          # Layout principal (envuelve toda la app)
│   │   ├── page.tsx            # Página de inicio (/)
│   │   ├── login/              # Ruta /login
│   │   ├── client/             # Rutas para clientes (/client/*)
│   │   ├── agent/              # Rutas para agentes (/agent/*)
│   │   └── api/                # BACKEND - API Routes
│   │
│   ├── components/             # COMPONENTES REUTILIZABLES
│   │   ├── common/             # Componentes comunes (Button, Card, etc.)
│   │   └── forms/              # Componentes de formularios
│   │
│   ├── context/                # ESTADO GLOBAL
│   │   ├── AuthContext.tsx     # Manejo de autenticación
│   │   └── ThemeContext.tsx    # Manejo de tema (claro/oscuro)
│   │
│   ├── hooks/                  # LÓGICA REUTILIZABLE
│   │   └── useApi.ts           # Funciones para llamar APIs
│   │
│   ├── models/                 # MODELOS DE BASE DE DATOS
│   │   ├── User.ts             # Esquema de usuarios
│   │   ├── Ticket.ts           # Esquema de tickets
│   │   └── Comment.ts          # Esquema de comentarios
│   │
│   └── types/                  # TIPOS DE TYPESCRIPT
│       └── index.ts            # Definiciones de tipos
```

---

## 💡 Conceptos Fundamentales de React

### 1. Componentes

Un **componente** es una función que retorna JSX (HTML dentro de JavaScript).

#### Ejemplo Simple:
```tsx
// Componente básico
function MiBoton() {
  return <button>Haz clic</button>;
}
```

#### En nuestro proyecto (Button.tsx):
```tsx
export default function Button({ children, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`${baseStyles} ${variantStyles[variant]}`}>
      {children}
    </button>
  );
}
```

**¿Qué hace?**
- Recibe `children` (el contenido del botón) y `variant` (el estilo)
- Retorna un botón HTML con clases CSS dinámicas
- Es reutilizable: puedes usarlo en cualquier parte del proyecto

### 2. Props (Propiedades)

**Props** son datos que se pasan de un componente padre a un hijo.

#### Ejemplo:
```tsx
// Componente hijo
function Saludo({ nombre }: { nombre: string }) {
  return <h1>Hola, {nombre}!</h1>;
}

// Componente padre
function App() {
  return <Saludo nombre="Carlos" />; // Salida: "Hola, Carlos!"
}
```

#### En nuestro proyecto:
```tsx
// Pasamos props al componente Badge
<StatusBadge status="open" />
<PriorityBadge priority="high" />
```

### 3. Estado (State)

El **estado** son datos que pueden cambiar con el tiempo. Cuando el estado cambia, React re-renderiza el componente.

#### Ejemplo con useState:
```tsx
import { useState } from 'react';

function Contador() {
  // Declaramos estado: [valor, función para cambiar el valor]
  const [numero, setNumero] = useState(0);

  return (
    <div>
      <p>Contador: {numero}</p>
      <button onClick={() => setNumero(numero + 1)}>
        Incrementar
      </button>
    </div>
  );
}
```

#### En nuestro proyecto (ClientDashboard):
```tsx
export default function ClientDashboard() {
  // Estado para almacenar los tickets
  const [tickets, setTickets] = useState<ITicket[]>([]);
  // Estado para saber si está cargando
  const [isLoading, setIsLoading] = useState(true);
  // Estado para errores
  const [error, setError] = useState('');

  // ... resto del código
}
```

### 4. Efectos (useEffect)

**useEffect** ejecuta código cuando el componente se monta o cuando cambian ciertas dependencias.

#### Ejemplo:
```tsx
useEffect(() => {
  // Este código se ejecuta cuando el componente se monta
  console.log('El componente se cargó');
  
  // Cleanup (limpieza) cuando el componente se desmonta
  return () => {
    console.log('El componente se va a desmontar');
  };
}, []); // [] = solo se ejecuta una vez al montar
```

#### En nuestro proyecto (ClientDashboard):
```tsx
useEffect(() => {
  loadTickets(); // Cargar tickets al montar el componente
}, []); // Array vacío = solo se ejecuta una vez

const loadTickets = async () => {
  try {
    setIsLoading(true);
    const data = await getTickets(); // Llamada a la API
    setTickets(data); // Guardar tickets en el estado
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error');
  } finally {
    setIsLoading(false);
  }
};
```

### 5. Context (Contexto)

**Context** permite compartir datos entre componentes sin pasar props manualmente en cada nivel.

#### ¿Por qué usar Context?

Sin Context:
```tsx
// Malo: Pasar datos por muchos niveles
<App user={user}>
  <Dashboard user={user}>
    <Profile user={user}>
      <Avatar user={user} />
    </Profile>
  </Dashboard>
</App>
```

Con Context:
```tsx
// Bueno: Los datos están disponibles en cualquier componente
<AuthProvider>
  <App />
</AuthProvider>

// Cualquier componente puede acceder al usuario:
function Avatar() {
  const { user } = useAuth();
  return <img src={user.avatar} />;
}
```

#### En nuestro proyecto (AuthContext.tsx):
```tsx
// 1. Crear el contexto
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// 2. Crear el Provider (proveedor de datos)
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await api.login(email, password);
    setUser(response.user);
    setToken(response.token);
    localStorage.setItem('token', response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Crear hook personalizado para usar el contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
```

**¿Cómo se usa?**
```tsx
// En cualquier componente:
function MiComponente() {
  const { user, login, logout } = useAuth();
  
  return (
    <div>
      {user ? (
        <p>Bienvenido, {user.name}</p>
      ) : (
        <button onClick={() => login(email, password)}>Login</button>
      )}
    </div>
  );
}
```

### 6. Hooks Personalizados

Los **custom hooks** son funciones que usan otros hooks de React y encapsulan lógica reutilizable.

#### En nuestro proyecto (useApi.ts):
```tsx
// useApi.ts - Funciones para interactuar con el backend
export async function getTickets(): Promise<ITicket[]> {
  const response = await api.get('/tickets');
  return response.data.data;
}

export async function createTicket(data: ITicketCreate): Promise<ITicket> {
  const response = await api.post('/tickets', data);
  return response.data.data;
}
```

**Uso:**
```tsx
import { getTickets, createTicket } from '@/hooks/useApi';

function MiComponente() {
  const cargarTickets = async () => {
    const tickets = await getTickets();
    console.log(tickets);
  };
}
```

---

## 🔍 Explicación Detallada del Código

### 1. Layout Principal (src/app/layout.tsx)

```tsx
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

**¿Qué hace?**
1. **RootLayout**: Es el componente raíz que envuelve toda la aplicación
2. **ThemeProvider**: Proporciona el tema (claro/oscuro) a todos los componentes
3. **AuthProvider**: Proporciona la autenticación a todos los componentes
4. **children**: Son las páginas que se renderizan dentro del layout

**Flujo:**
```
RootLayout
  └── ThemeProvider (maneja tema claro/oscuro)
      └── AuthProvider (maneja autenticación)
          └── children (páginas de la app)
```

### 2. Página de Login (src/app/login/page.tsx)

```tsx
'use client'; // Indica que es un Client Component (interactivo)

export default function LoginPage() {
  const router = useRouter(); // Para navegar entre páginas
  const { login, isLoading } = useAuth(); // Obtener función de login del contexto
  
  // Estados locales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir recarga de página
    
    try {
      await login(email, password); // Llamar al login del contexto
      router.push('/'); // Redirigir a la página principal
    } catch (err) {
      setError('Login fallido');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />
      <Button type="submit" isLoading={isLoading}>
        Iniciar Sesión
      </Button>
    </form>
  );
}
```

**¿Qué sucede paso a paso?**
1. El usuario escribe email y password → se guardan en el estado
2. El usuario hace clic en "Iniciar Sesión" → se llama a `handleSubmit`
3. `handleSubmit` llama a `login()` del AuthContext
4. `login()` hace una petición POST a `/api/auth/login`
5. Si es exitoso, guarda el token y el usuario en localStorage
6. Redirige al usuario a la página principal

### 3. Dashboard del Cliente (src/app/client/page.tsx)

```tsx
export default function ClientDashboard() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar tickets al montar el componente
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await getTickets(); // Llamada a la API
      setTickets(data); // Guardar en el estado
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mientras carga, mostrar spinner
  if (isLoading) {
    return <div className="spinner">Cargando...</div>;
  }

  // Si no hay tickets, mostrar mensaje
  if (tickets.length === 0) {
    return (
      <div>
        <p>No tienes tickets</p>
        <Link href="/client/new">
          <Button>Crear Primer Ticket</Button>
        </Link>
      </div>
    );
  }

  // Mostrar lista de tickets
  return (
    <div>
      {tickets.map((ticket) => (
        <Card key={ticket._id}>
          <h3>{ticket.title}</h3>
          <p>{ticket.description}</p>
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </Card>
      ))}
    </div>
  );
}
```

**Flujo de renderizado:**
1. Componente se monta → `useEffect` se ejecuta
2. `loadTickets()` se llama → `isLoading = true`
3. Hace petición GET a `/api/tickets`
4. Recibe respuesta → guarda tickets en el estado → `isLoading = false`
5. React re-renderiza el componente con los nuevos datos
6. Se muestra la lista de tickets

### 4. Componente Button (src/components/common/Button.tsx)

```tsx
interface ButtonProps {
  children: ReactNode;      // Contenido del botón
  variant?: ButtonVariant;  // Estilo (primary, secondary, etc.)
  size?: ButtonSize;        // Tamaño (sm, md, lg)
  isLoading?: boolean;      // Mostrar spinner de carga
  fullWidth?: boolean;      // Ocupar todo el ancho
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  ...props // Resto de props del botón HTML
}: ButtonProps) {
  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
```

**¿Cómo se usa?**
```tsx
// Ejemplo 1: Botón simple
<Button>Guardar</Button>

// Ejemplo 2: Botón con variante
<Button variant="danger">Eliminar</Button>

// Ejemplo 3: Botón con estado de carga
<Button isLoading={isSaving}>Guardando...</Button>

// Ejemplo 4: Botón completo
<Button
  variant="primary"
  size="lg"
  fullWidth
  isLoading={isLoading}
  onClick={() => console.log('Click')}
>
  Enviar Formulario
</Button>
```

### 5. API Routes (Backend)

#### GET /api/tickets (src/app/api/tickets/route.ts)

```tsx
export async function GET(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const token = getTokenFromHeader(request.headers.get('authorization'));
    const payload = verifyToken(token); // Decodificar JWT
    
    // 2. Conectar a la base de datos
    await dbConnect();
    
    // 3. Construir query según el rol
    const query: any = {};
    
    // Si es cliente, solo ver sus propios tickets
    if (payload.role === 'client') {
      query.createdBy = payload.userId;
    }
    
    // 4. Obtener tickets de la base de datos
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email role') // Incluir datos del creador
      .populate('assignedTo', 'name email role') // Incluir datos del asignado
      .sort({ createdAt: -1 }); // Ordenar por fecha descendente
    
    // 5. Retornar respuesta
    return NextResponse.json({ success: true, data: tickets });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 });
  }
}
```

#### POST /api/tickets (Crear ticket)

```tsx
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const payload = verifyToken(token);
    
    // 2. Obtener datos del body
    const { title, description, priority } = await request.json();
    
    // 3. Validar datos
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Datos requeridos' },
        { status: 400 }
      );
    }
    
    // 4. Crear ticket en la base de datos
    const ticket = await Ticket.create({
      title,
      description,
      priority,
      createdBy: payload.userId,
      status: 'open',
    });
    
    // 5. Enviar email de notificación
    await sendTicketCreatedEmail(user, ticket);
    
    // 6. Retornar ticket creado
    return NextResponse.json(
      { success: true, data: ticket },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Error' }, { status: 500 });
  }
}
```

### 6. Modelos de Base de Datos (Mongoose)

#### Modelo de Ticket (src/models/Ticket.ts)

```tsx
const TicketSchema = new Schema({
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    minlength: [5, 'El título debe tener al menos 5 caracteres'],
    maxlength: [100, 'El título no puede exceder 100 caracteres'],
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referencia al modelo User
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

// Crear índices para mejorar rendimiento de consultas
TicketSchema.index({ createdBy: 1 });
TicketSchema.index({ status: 1 });
TicketSchema.index({ priority: 1 });

const Ticket = mongoose.model('Ticket', TicketSchema);
```

**¿Qué hace?**
- Define la estructura de un ticket en MongoDB
- Valida que los datos cumplan ciertas reglas
- Crea relaciones con otros modelos (User)
- Agrega timestamps automáticos

---

## 🔄 Flujo de la Aplicación

### Flujo de Login

```
1. Usuario ingresa email y password
   ↓
2. handleSubmit() se ejecuta
   ↓
3. login(email, password) del AuthContext
   ↓
4. POST /api/auth/login
   ↓
5. Backend verifica credenciales en MongoDB
   ↓
6. Backend genera JWT token
   ↓
7. Frontend guarda token en localStorage
   ↓
8. Frontend guarda usuario en el estado de AuthContext
   ↓
9. Router redirige según el rol (client o agent)
```

### Flujo de Crear Ticket

```
1. Usuario llena formulario en /client/new
   ↓
2. Usuario hace clic en "Crear Ticket"
   ↓
3. handleSubmit() valida datos
   ↓
4. createTicket() del useApi
   ↓
5. POST /api/tickets con token en header
   ↓
6. Backend verifica token
   ↓
7. Backend crea ticket en MongoDB
   ↓
8. Backend envía email de notificación
   ↓
9. Frontend recibe ticket creado
   ↓
10. Router redirige a /client
```

### Flujo de Cargar Tickets

```
1. Componente ClientDashboard se monta
   ↓
2. useEffect() se ejecuta
   ↓
3. loadTickets() se llama
   ↓
4. getTickets() del useApi
   ↓
5. GET /api/tickets con token en header
   ↓
6. Backend verifica token y rol
   ↓
7. Backend filtra tickets según el rol
   ↓
8. Backend retorna tickets con datos poblados
   ↓
9. Frontend guarda tickets en el estado
   ↓
10. React re-renderiza la lista de tickets
```

---

## 📝 Preguntas Frecuentes para Sustentación

### 1. ¿Qué es React y por qué lo usaste?

**Respuesta:**
React es una biblioteca de JavaScript para construir interfaces de usuario mediante componentes reutilizables. Lo elegí porque:
- Permite crear componentes reutilizables (como Button, Card)
- Facilita el manejo del estado de la aplicación
- Tiene un gran ecosistema y comunidad
- Es ampliamente usado en la industria

### 2. ¿Qué son los componentes?

**Respuesta:**
Los componentes son piezas de código reutilizables que representan partes de la interfaz de usuario. Por ejemplo, en mi proyecto tengo:
- `Button`: Un botón reutilizable con diferentes estilos
- `Card`: Una tarjeta para mostrar información
- `StatusBadge`: Una insignia para mostrar el estado de un ticket

Ejemplo:
```tsx
// Definir componente
function Button({ children }) {
  return <button>{children}</button>;
}

// Usar componente
<Button>Guardar</Button>
```

### 3. ¿Qué es el estado (state)?

**Respuesta:**
El estado son datos que pueden cambiar con el tiempo. Cuando el estado cambia, React actualiza automáticamente la interfaz. En mi proyecto uso estado para:
- `tickets`: Lista de tickets que cambia cuando cargo datos del servidor
- `isLoading`: Indica si estamos cargando datos
- `error`: Almacena mensajes de error

Ejemplo del proyecto:
```tsx
const [tickets, setTickets] = useState<ITicket[]>([]);

// Actualizar estado
setTickets(nuevosTickets); // React re-renderiza automáticamente
```

### 4. ¿Qué son las props?

**Respuesta:**
Las props (propiedades) son datos que se pasan de un componente padre a un hijo. Son como parámetros de una función. En mi proyecto:

```tsx
// Componente hijo recibe props
function StatusBadge({ status }: { status: string }) {
  return <span className={getColorForStatus(status)}>{status}</span>;
}

// Componente padre pasa props
<StatusBadge status="open" />
<StatusBadge status="closed" />
```

### 5. ¿Qué es useEffect?

**Respuesta:**
`useEffect` ejecuta código en momentos específicos del ciclo de vida del componente. En mi proyecto lo uso para:
- Cargar datos cuando el componente se monta
- Actualizar datos cuando cambian filtros

Ejemplo:
```tsx
useEffect(() => {
  loadTickets(); // Se ejecuta al montar el componente
}, []); // [] = solo se ejecuta una vez
```

### 6. ¿Qué es el Context API?

**Respuesta:**
Context API permite compartir datos entre componentes sin pasar props manualmente. En mi proyecto tengo dos contextos:

1. **AuthContext**: Comparte datos de autenticación (usuario, token, login, logout)
2. **ThemeContext**: Comparte el tema (claro/oscuro)

Ejemplo:
```tsx
// Crear contexto
const AuthContext = createContext();

// Proveer datos
<AuthContext.Provider value={{ user, login, logout }}>
  <App />
</AuthContext.Provider>

// Usar datos en cualquier componente
const { user, login } = useAuth();
```

### 7. ¿Qué es Next.js y por qué lo usaste?

**Respuesta:**
Next.js es un framework construido sobre React que añade:
- **Enrutamiento automático**: Las carpetas se convierten en rutas
- **API Routes**: Puedo crear backend en la misma aplicación
- **Optimización**: Mejora el rendimiento automáticamente
- **SSR**: Renderizado del lado del servidor

Estructura de rutas en mi proyecto:
```
app/
  login/page.tsx       → /login
  client/page.tsx      → /client
  client/new/page.tsx  → /client/new
  agent/page.tsx       → /agent
  api/tickets/route.ts → /api/tickets (backend)
```

### 8. ¿Cómo funciona la autenticación?

**Respuesta:**
La autenticación en mi proyecto usa JWT (JSON Web Tokens):

1. Usuario envía email y password
2. Backend verifica en la base de datos
3. Si es correcto, genera un JWT token
4. Frontend guarda el token en localStorage
5. Cada petición incluye el token en el header
6. Backend verifica el token antes de procesar la petición

```tsx
// Login
const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  setUser(user);
};

// Interceptor añade token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 9. ¿Cómo se comunica el frontend con el backend?

**Respuesta:**
Uso Axios para hacer peticiones HTTP:

```tsx
// GET - Obtener tickets
const tickets = await api.get('/api/tickets');

// POST - Crear ticket
const newTicket = await api.post('/api/tickets', {
  title: 'Mi ticket',
  description: 'Descripción',
  priority: 'high'
});

// PATCH - Actualizar ticket
const updated = await api.patch(`/api/tickets/${id}`, {
  status: 'resolved'
});

// DELETE - Eliminar ticket
await api.delete(`/api/tickets/${id}`);
```

### 10. ¿Qué es TypeScript y por qué lo usaste?

**Respuesta:**
TypeScript es JavaScript con tipos. Me ayuda a:
- Detectar errores antes de ejecutar el código
- Tener autocompletado en el editor
- Documentar el código automáticamente

Ejemplo:
```tsx
// Sin TypeScript (JavaScript)
function createTicket(data) {
  // ¿Qué propiedades tiene data? No lo sé
  return api.post('/tickets', data);
}

// Con TypeScript
interface ITicketCreate {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

function createTicket(data: ITicketCreate) {
  // TypeScript me asegura que data tiene title, description y priority
  return api.post('/tickets', data);
}
```

### 11. ¿Cómo funciona el sistema de roles?

**Respuesta:**
Mi aplicación tiene dos roles: **client** y **agent**

**Cliente puede:**
- Ver solo sus propios tickets
- Crear nuevos tickets
- Agregar comentarios
- Ver el detalle de sus tickets

**Agente puede:**
- Ver todos los tickets
- Cambiar estado y prioridad
- Asignar tickets a otros agentes
- Eliminar tickets
- Crear usuarios

El backend verifica el rol en cada petición:
```tsx
// En el backend
if (payload.role === 'client') {
  // Cliente solo puede ver sus tickets
  query.createdBy = payload.userId;
} else if (payload.role === 'agent') {
  // Agente puede ver todos los tickets
  // No aplicar filtro de creador
}
```

### 12. ¿Qué es MongoDB y Mongoose?

**Respuesta:**
- **MongoDB**: Base de datos NoSQL que guarda datos en formato JSON
- **Mongoose**: Biblioteca que facilita trabajar con MongoDB desde Node.js

Ejemplo de uso:
```tsx
// Definir esquema
const TicketSchema = new Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed']
  }
});

// Crear modelo
const Ticket = mongoose.model('Ticket', TicketSchema);

// Usar modelo
const tickets = await Ticket.find({ status: 'open' });
const newTicket = await Ticket.create({ title: 'Nuevo', description: 'Desc' });
```

### 13. ¿Cómo funciona el sistema de comentarios?

**Respuesta:**
Los comentarios están relacionados con los tickets:

1. Cada comentario tiene una referencia al ticket (`ticketId`)
2. Cuando se carga un ticket, se cargan también sus comentarios
3. Se pueden agregar nuevos comentarios desde el frontend

```tsx
// Cargar comentarios
const comments = await getCommentsByTicket(ticketId);

// Crear comentario
const newComment = await createComment({
  ticketId: ticket._id,
  message: 'Este es mi comentario'
});
```

### 14. ¿Cómo funciona el tema claro/oscuro?

**Respuesta:**
Uso Context API para manejar el tema:

```tsx
// ThemeContext.tsx
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Agregar/quitar clase del HTML
    if (newTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

En CSS (Tailwind):
```css
/* Tema oscuro (por defecto) */
.bg-dark-bg { background: #0f1419; }

/* Tema claro */
.light .bg-dark-bg { background: #ffffff; }
```

### 15. ¿Qué mejoras harías al proyecto?

**Respuesta:**
Algunas mejoras que implementaría:
1. **Pruebas unitarias**: Testing con Jest y React Testing Library
2. **Paginación**: Cargar tickets en páginas para mejor rendimiento
3. **Búsqueda**: Buscar tickets por título o descripción
4. **Notificaciones en tiempo real**: Usar WebSockets para actualizaciones en vivo
5. **Carga de archivos**: Permitir adjuntar archivos a los tickets
6. **Historial de cambios**: Registrar todos los cambios de estado
7. **Estadísticas avanzadas**: Gráficos y reportes
8. **Modo offline**: Usar Service Workers para funcionar sin internet

---

## 🎯 Consejos para la Sustentación

### Prepárate para explicar:

1. **Arquitectura general**: Cómo se conectan frontend, backend y base de datos
2. **Flujo de autenticación**: Desde login hasta verificación de token
3. **Manejo de estado**: useState, useEffect, Context API
4. **API Routes**: Cómo funcionan las rutas del backend
5. **Componentes reutilizables**: Por qué son importantes
6. **TypeScript**: Beneficios en tu proyecto
7. **Next.js**: Ventajas sobre React puro

### Muestra conocimiento de:

- Conceptos de React (componentes, props, state, hooks)
- Seguridad (JWT, bcrypt, validación de datos)
- Buenas prácticas (código limpio, componentización, manejo de errores)
- Base de datos (MongoDB, relaciones, índices)
- UI/UX (tema oscuro/claro, feedback visual, responsive design)

### Ten ejemplos concretos:

- "Aquí uso useState para manejar el estado de los tickets"
- "Este useEffect carga datos cuando el componente se monta"
- "El AuthContext permite que cualquier componente acceda al usuario"
- "Este API Route verifica el token antes de procesar la petición"

---

## 📚 Glosario de Términos

- **Component**: Pieza reutilizable de UI
- **Props**: Datos pasados a un componente
- **State**: Datos que pueden cambiar
- **Hook**: Función especial de React (useState, useEffect, etc.)
- **Context**: Forma de compartir datos globalmente
- **JSX**: HTML dentro de JavaScript
- **SSR**: Server-Side Rendering (renderizado en el servidor)
- **API Route**: Endpoint del backend en Next.js
- **JWT**: JSON Web Token (para autenticación)
- **ODM**: Object-Document Mapper (Mongoose)
- **Middleware**: Función que se ejecuta antes de procesar una petición
- **Interceptor**: Modifica peticiones/respuestas automáticamente

---

## 🚀 Resumen Ejecutivo

HelpDeskPro es un sistema completo de gestión de tickets construido con:
- **Frontend**: React + Next.js + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Base de Datos**: MongoDB + Mongoose
- **Autenticación**: JWT + bcrypt
- **Notificaciones**: Nodemailer

**Características principales:**
- Sistema de roles (Cliente/Agente)
- Gestión completa de tickets
- Sistema de comentarios
- Notificaciones por email
- Tema claro/oscuro
- Interfaz responsive

**Conceptos de React aplicados:**
- Componentes funcionales
- Hooks (useState, useEffect, useContext, custom hooks)
- Context API (AuthContext, ThemeContext)
- Props y composición de componentes
- Manejo de eventos y formularios
- Ciclo de vida de componentes

---

**¡Éxito en tu sustentación! 🎉**

Si tienes dudas sobre alguna parte del código, repasa esta guía y ejecuta ejemplos en tu mente o en papel. Entender el flujo de datos es clave.
