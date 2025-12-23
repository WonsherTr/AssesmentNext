# 🎓 Guía de Sustentación - HelpDeskPro

## Preparación para Preguntas Técnicas

Esta guía complementa EXPLICACION_CODIGO.md con ejemplos prácticos y respuestas detalladas para tu sustentación.

---

## 📊 Diagramas de Flujo

### 1. Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              REACT + NEXT.JS (Frontend)              │  │
│  │                                                       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌─────────────────┐   │  │
│  │  │  Pages   │  │Components│  │  Context        │   │  │
│  │  │          │  │          │  │  - AuthContext  │   │  │
│  │  │ /login   │  │  Button  │  │  - ThemeContext │   │  │
│  │  │ /client  │  │  Card    │  │                 │   │  │
│  │  │ /agent   │  │  Badge   │  │  Hooks          │   │  │
│  │  │          │  │          │  │  - useApi.ts    │   │  │
│  │  └──────────┘  └──────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests (Axios)
                            │ Authorization: Bearer <JWT>
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Backend)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  /api/auth/login     → Autenticación                 │  │
│  │  /api/tickets        → CRUD de tickets               │  │
│  │  /api/comments       → CRUD de comentarios           │  │
│  │  /api/users/agents   → Listar agentes                │  │
│  └───────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         Middlewares y Utilidades                     │  │
│  │  - verifyToken()  → Verificar JWT                    │  │
│  │  - dbConnect()    → Conectar a MongoDB               │  │
│  │  - sendEmail()    → Enviar notificaciones            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose ODM
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB (Base de Datos)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Collections:                                         │  │
│  │  - users      → { _id, name, email, password, role } │  │
│  │  - tickets    → { title, description, status, ... }  │  │
│  │  - comments   → { ticketId, author, message }        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2. Flujo de Autenticación Detallado

```
USUARIO                 FRONTEND                 BACKEND                 DATABASE
  │                        │                         │                        │
  │ 1. Ingresa            │                         │                        │
  │ email y password      │                         │                        │
  ├──────────────────────>│                         │                        │
  │                        │                         │                        │
  │                        │ 2. POST /api/auth/login │                        │
  │                        │ { email, password }     │                        │
  │                        ├────────────────────────>│                        │
  │                        │                         │                        │
  │                        │                         │ 3. Buscar usuario      │
  │                        │                         │ User.findOne({ email })│
  │                        │                         ├───────────────────────>│
  │                        │                         │                        │
  │                        │                         │ 4. Usuario encontrado  │
  │                        │                         │<───────────────────────┤
  │                        │                         │                        │
  │                        │                         │ 5. Verificar password  │
  │                        │                         │ bcrypt.compare()       │
  │                        │                         │                        │
  │                        │                         │ 6. Generar JWT token   │
  │                        │                         │ jwt.sign({ userId, role })
  │                        │                         │                        │
  │                        │ 7. Respuesta            │                        │
  │                        │ { token, user }         │                        │
  │                        │<────────────────────────┤                        │
  │                        │                         │                        │
  │                        │ 8. Guardar token        │                        │
  │                        │ localStorage.setItem()  │                        │
  │                        │                         │                        │
  │                        │ 9. Actualizar estado    │                        │
  │                        │ setUser(user)           │                        │
  │                        │ setToken(token)         │                        │
  │                        │                         │                        │
  │ 10. Redirigir según    │                         │                        │
  │ rol (client/agent)     │                         │                        │
  │<───────────────────────┤                         │                        │
```

### 3. Flujo de Creación de Ticket

```
CLIENTE                  FRONTEND                 BACKEND                 DATABASE
  │                        │                         │                        │
  │ 1. Llenar formulario   │                         │                        │
  │ /client/new            │                         │                        │
  ├──────────────────────>│                         │                        │
  │                        │                         │                        │
  │ 2. Clic en "Crear"     │                         │                        │
  ├──────────────────────>│                         │                        │
  │                        │                         │                        │
  │                        │ 3. Validar datos        │                        │
  │                        │ (frontend)              │                        │
  │                        │                         │                        │
  │                        │ 4. POST /api/tickets    │                        │
  │                        │ Headers: {              │                        │
  │                        │   Authorization: Bearer │                        │
  │                        │ }                       │                        │
  │                        │ Body: {                 │                        │
  │                        │   title,                │                        │
  │                        │   description,          │                        │
  │                        │   priority              │                        │
  │                        │ }                       │                        │
  │                        ├────────────────────────>│                        │
  │                        │                         │                        │
  │                        │                         │ 5. Verificar JWT       │
  │                        │                         │ verifyToken(token)     │
  │                        │                         │                        │
  │                        │                         │ 6. Validar datos       │
  │                        │                         │ (backend)              │
  │                        │                         │                        │
  │                        │                         │ 7. Crear ticket        │
  │                        │                         │ Ticket.create({...})   │
  │                        │                         ├───────────────────────>│
  │                        │                         │                        │
  │                        │                         │ 8. Ticket guardado     │
  │                        │                         │<───────────────────────┤
  │                        │                         │                        │
  │                        │                         │ 9. Enviar email        │
  │                        │                         │ sendTicketCreatedEmail()│
  │                        │                         │                        │
  │                        │ 10. Respuesta           │                        │
  │                        │ { success: true,        │                        │
  │                        │   data: ticket }        │                        │
  │                        │<────────────────────────┤                        │
  │                        │                         │                        │
  │                        │ 11. Mostrar mensaje     │                        │
  │                        │ "Ticket creado"         │                        │
  │                        │                         │                        │
  │                        │ 12. Redirigir           │                        │
  │                        │ router.push('/client')  │                        │
  │                        │                         │                        │
  │ 13. Ver ticket en lista│                         │                        │
  │<───────────────────────┤                         │                        │
```

### 4. Ciclo de Vida de un Componente React

```
┌─────────────────────────────────────────────────────────────┐
│                    COMPONENTE REACT                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            │
            ┌───────────────▼──────────────┐
            │   1. MONTAJE (Mount)         │
            │   - Se crea el componente    │
            │   - Se ejecuta constructor   │
            │   - Se ejecuta render()      │
            └───────────────┬──────────────┘
                            │
                            │
            ┌───────────────▼──────────────┐
            │   2. useEffect() se ejecuta  │
            │   - Con [] (array vacío)     │
            │   - Solo UNA vez al montar   │
            │                              │
            │   useEffect(() => {          │
            │     loadData();              │
            │   }, []);                    │
            └───────────────┬──────────────┘
                            │
                            │
            ┌───────────────▼──────────────┐
            │   3. ACTUALIZACIÓN           │
            │   - Cambia el estado         │
            │   - Cambian las props        │
            │   - Se ejecuta render()      │
            │   - React actualiza el DOM   │
            └───────────────┬──────────────┘
                            │
                            │
            ┌───────────────▼──────────────┐
            │   4. useEffect() con deps    │
            │   - Se ejecuta cuando        │
            │     cambian dependencias     │
            │                              │
            │   useEffect(() => {          │
            │     updateData();            │
            │   }, [filter, page]);        │
            └───────────────┬──────────────┘
                            │
                            │
            ┌───────────────▼──────────────┐
            │   5. DESMONTAJE (Unmount)    │
            │   - Se destruye componente   │
            │   - Cleanup de useEffect     │
            │                              │
            │   useEffect(() => {          │
            │     return () => {           │
            │       cleanup();             │
            │     };                       │
            │   }, []);                    │
            └──────────────────────────────┘

EJEMPLO EN EL PROYECTO:

function ClientDashboard() {
  const [tickets, setTickets] = useState([]); // 1. Estado inicial

  useEffect(() => {
    // 2. Al montar: cargar tickets
    loadTickets();
    
    return () => {
      // 5. Al desmontar: cancelar peticiones
      cancelRequests();
    };
  }, []); // Solo al montar

  useEffect(() => {
    // 4. Cuando cambia statusFilter: recargar
    loadTickets();
  }, [statusFilter]); // Cuando cambia statusFilter

  const loadTickets = async () => {
    const data = await getTickets();
    setTickets(data); // 3. Actualizar estado → re-render
  };

  return <div>{/* render */}</div>;
}
```

---

## 💬 Respuestas Detalladas a Preguntas Comunes

### Pregunta: "Explica cómo funciona useState"

**Respuesta estructurada:**

```tsx
// useState es un Hook de React que permite agregar estado a componentes funcionales

// 1. SINTAXIS BÁSICA
const [valor, setValor] = useState(valorInicial);
//     ↑       ↑                      ↑
//   estado  función para           valor inicial
//           cambiar estado

// 2. EJEMPLO SIMPLE
function Contador() {
  const [numero, setNumero] = useState(0);
  
  // Estado inicial: numero = 0
  
  const incrementar = () => {
    setNumero(numero + 1); // Actualiza el estado
    // React re-renderiza el componente automáticamente
  };
  
  return (
    <div>
      <p>Contador: {numero}</p>
      <button onClick={incrementar}>+1</button>
    </div>
  );
}

// 3. EN MI PROYECTO - ClientDashboard
export default function ClientDashboard() {
  // Estado para lista de tickets
  const [tickets, setTickets] = useState<ITicket[]>([]);
  // Valor inicial: array vacío []
  
  // Estado para indicador de carga
  const [isLoading, setIsLoading] = useState(true);
  // Valor inicial: true
  
  // Estado para mensajes de error
  const [error, setError] = useState('');
  // Valor inicial: string vacío ''
  
  const loadTickets = async () => {
    try {
      setIsLoading(true); // Actualizar estado a true
      const data = await getTickets(); // Llamar API
      setTickets(data); // Actualizar tickets con datos del servidor
    } catch (err) {
      setError('Error al cargar'); // Actualizar error
    } finally {
      setIsLoading(false); // Actualizar loading a false
    }
  };
  
  // El componente se re-renderiza cada vez que cambia algún estado
}

// 4. REGLAS IMPORTANTES
// ❌ NO hacer:
setNumero(numero + 1);
setNumero(numero + 1); // No funciona como esperas (sigue siendo 1)

// ✅ SI hacer:
setNumero(prevNumero => prevNumero + 1);
setNumero(prevNumero => prevNumero + 1); // Correcto (será 2)
```

**Puntos clave para mencionar:**
- useState devuelve un array con 2 elementos: [estado, función]
- El estado es inmutable: no se modifica directamente, se usa la función
- Cuando cambia el estado, React re-renderiza el componente
- Cada llamada a useState crea un estado independiente

---

### Pregunta: "¿Qué es useEffect y cuándo se ejecuta?"

**Respuesta estructurada:**

```tsx
// useEffect ejecuta código en momentos específicos del ciclo de vida

// 1. SINTAXIS
useEffect(() => {
  // Código a ejecutar
  
  return () => {
    // Cleanup (limpieza) opcional
  };
}, [dependencias]); // Array de dependencias

// 2. CASOS DE USO

// CASO 1: Ejecutar solo al montar (equivalente a componentDidMount)
useEffect(() => {
  console.log('Componente montado');
  cargarDatosIniciales();
}, []); // Array vacío = solo una vez

// CASO 2: Ejecutar al montar y desmontar
useEffect(() => {
  console.log('Componente montado');
  
  return () => {
    console.log('Componente desmontado');
    limpiarRecursos();
  };
}, []);

// CASO 3: Ejecutar cuando cambia una variable
useEffect(() => {
  console.log('El filtro cambió a:', filter);
  cargarTicketsFiltrados(filter);
}, [filter]); // Se ejecuta cuando 'filter' cambia

// CASO 4: Ejecutar en cada render (generalmente NO recomendado)
useEffect(() => {
  console.log('Componente renderizado');
}); // Sin array de dependencias

// 3. EN MI PROYECTO

// Ejemplo 1: Cargar tickets al montar
function ClientDashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets(); // Se ejecuta solo al montar
  }, []); // ← Array vacío

  const loadTickets = async () => {
    const data = await getTickets();
    setTickets(data);
  };
}

// Ejemplo 2: Recargar cuando cambian filtros
function AgentDashboard() {
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    // Se ejecuta al montar Y cada vez que cambian los filtros
    loadTickets();
  }, [statusFilter, priorityFilter]); // ← Dependencias
}

// Ejemplo 3: Cleanup con temporizador
function AutoSave() {
  const [data, setData] = useState({});

  useEffect(() => {
    // Guardar automáticamente cada 30 segundos
    const timer = setInterval(() => {
      saveData(data);
    }, 30000);

    // Cleanup: cancelar timer al desmontar
    return () => {
      clearInterval(timer);
    };
  }, [data]); // Se re-crea el timer si cambia data
}
```

**Tabla de comparación:**

| Array de dependencias | Cuándo se ejecuta |
|----------------------|-------------------|
| `[]` (vacío) | Solo al montar |
| `[var1, var2]` | Al montar y cuando cambia var1 o var2 |
| Sin array | En cada render (casi nunca usar) |

---

### Pregunta: "Explica cómo funciona el Context API"

**Respuesta estructurada:**

```tsx
// Context API resuelve el problema de "prop drilling"
// (pasar props a través de muchos niveles)

// PROBLEMA: Prop Drilling
function App() {
  const [user, setUser] = useState(null);
  
  return <Dashboard user={user} setUser={setUser} />;
}

function Dashboard({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;
}

function Sidebar({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  // Finalmente usamos user aquí
  return <div>{user.name}</div>;
}

// SOLUCIÓN: Context API

// PASO 1: Crear el contexto (AuthContext.tsx)
import { createContext, useContext, useState } from 'react';

// Crear contexto
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// PASO 2: Crear el Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estados
  const [user, setUser] = useState<IUserResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // Funciones
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
  
  // Valor que se compartirá
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };
  
  // Provider envuelve los hijos
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// PASO 3: Crear hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}

// PASO 4: Envolver la app con el Provider (layout.tsx)
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

// PASO 5: Usar el contexto en cualquier componente
function UserMenu() {
  const { user, logout } = useAuth(); // ← Acceso directo
  
  if (!user) return null;
  
  return (
    <div>
      <p>Bienvenido, {user.name}</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
}

function AnotherComponent() {
  const { isAuthenticated } = useAuth(); // ← También aquí
  
  return <div>{isAuthenticated ? 'Autenticado' : 'No autenticado'}</div>;
}
```

**Ventajas del Context API:**
1. ✅ No necesitas pasar props por muchos niveles
2. ✅ Cualquier componente puede acceder a los datos
3. ✅ Centraliza la lógica en un solo lugar
4. ✅ Facilita el mantenimiento

**En mi proyecto tengo dos contextos:**
1. **AuthContext**: Maneja autenticación (user, token, login, logout)
2. **ThemeContext**: Maneja tema (theme, toggleTheme)

---

### Pregunta: "¿Cómo funciona el sistema de rutas en Next.js?"

**Respuesta:**

```
// Next.js usa "File-based Routing" (enrutamiento basado en archivos)
// La estructura de carpetas define las rutas automáticamente

ESTRUCTURA DE CARPETAS → RUTAS

src/app/
├── page.tsx                    → / (raíz)
├── layout.tsx                  → Layout para todas las páginas
│
├── login/
│   └── page.tsx                → /login
│
├── client/
│   ├── layout.tsx              → Layout solo para /client/*
│   ├── page.tsx                → /client
│   │
│   ├── new/
│   │   └── page.tsx            → /client/new
│   │
│   └── ticket/
│       └── [id]/
│           └── page.tsx        → /client/ticket/123 (dinámico)
│
├── agent/
│   ├── layout.tsx              → Layout solo para /agent/*
│   ├── page.tsx                → /agent
│   │
│   └── ticket/
│       └── [id]/
│           └── page.tsx        → /agent/ticket/456 (dinámico)
│
└── api/                        ← BACKEND (API Routes)
    ├── auth/
    │   ├── login/
    │   │   └── route.ts        → POST /api/auth/login
    │   └── me/
    │       └── route.ts        → GET /api/auth/me
    │
    └── tickets/
        ├── route.ts            → GET/POST /api/tickets
        └── [id]/
            └── route.ts        → GET/PATCH/DELETE /api/tickets/:id

// EJEMPLO 1: Página estática
// Archivo: src/app/login/page.tsx
export default function LoginPage() {
  return <div>Login</div>;
}
// Ruta: http://localhost:3000/login

// EJEMPLO 2: Ruta dinámica
// Archivo: src/app/client/ticket/[id]/page.tsx
export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticketId = params.id; // Obtener el ID de la URL
  
  return <div>Ticket ID: {ticketId}</div>;
}
// Ruta: http://localhost:3000/client/ticket/abc123
// params.id = "abc123"

// EJEMPLO 3: Layout compartido
// Archivo: src/app/client/layout.tsx
export default function ClientLayout({ children }) {
  return (
    <div>
      <ClientHeader /> {/* Header solo para clientes */}
      <main>{children}</main> {/* Contenido de la página */}
      <ClientFooter /> {/* Footer solo para clientes */}
    </div>
  );
}
// Este layout envuelve /client, /client/new, /client/ticket/[id]

// EJEMPLO 4: API Route
// Archivo: src/app/api/tickets/route.ts
export async function GET(request: NextRequest) {
  // Manejar GET /api/tickets
  const tickets = await Ticket.find();
  return NextResponse.json({ data: tickets });
}

export async function POST(request: NextRequest) {
  // Manejar POST /api/tickets
  const body = await request.json();
  const ticket = await Ticket.create(body);
  return NextResponse.json({ data: ticket });
}

// EJEMPLO 5: API Route dinámica
// Archivo: src/app/api/tickets/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const ticketId = params.id; // Obtener ID de la URL
  const ticket = await Ticket.findById(ticketId);
  return NextResponse.json({ data: ticket });
}
```

**Navegación entre rutas:**

```tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function MiComponente() {
  const router = useRouter();
  
  // Método 1: Usando Link (recomendado)
  return (
    <>
      <Link href="/client/new">
        <Button>Crear Ticket</Button>
      </Link>
      
      <Link href={`/client/ticket/${ticketId}`}>
        <Button>Ver Ticket</Button>
      </Link>
    </>
  );
  
  // Método 2: Usando router (programático)
  const handleClick = () => {
    router.push('/client'); // Navegar
    router.back(); // Volver atrás
    router.refresh(); // Recargar datos
  };
}
```

---

### Pregunta: "¿Cómo manejas los errores en la aplicación?"

**Respuesta:**

```tsx
// ESTRATEGIA DE MANEJO DE ERRORES EN MI PROYECTO

// 1. FRONTEND: Try-Catch en componentes
export default function ClientDashboard() {
  const [error, setError] = useState('');
  
  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const data = await getTickets();
      setTickets(data);
      setError(''); // Limpiar error previo
    } catch (err) {
      // Capturar error y mostrar mensaje al usuario
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setIsLoading(false); // Siempre se ejecuta
    }
  };
  
  return (
    <div>
      {/* Mostrar error si existe */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}
      
      {/* Resto del contenido */}
    </div>
  );
}

// 2. API: Interceptor de Axios
// Archivo: useApi.ts

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, dejarla pasar
  (error) => {
    // Si hay error, extraer mensaje y rechazar promesa
    const message = error.response?.data?.error || 
                    error.message || 
                    'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// 3. BACKEND: Try-Catch en API Routes
export async function GET(request: NextRequest) {
  try {
    // Intentar procesar la petición
    const tickets = await Ticket.find();
    
    return NextResponse.json(
      { success: true, data: tickets },
      { status: 200 }
    );
  } catch (error) {
    // Capturar error y loguear
    console.error('Get tickets error:', error);
    
    // Retornar respuesta de error
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tickets' },
      { status: 500 }
    );
  }
}

// 4. VALIDACIÓN DE DATOS
export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    
    // Validar datos antes de procesar
    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 } // Bad Request
      );
    }
    
    if (title.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Title must be at least 5 characters' },
        { status: 400 }
      );
    }
    
    // Procesar si validación pasa
    const ticket = await Ticket.create({ title, description });
    
    return NextResponse.json(
      { success: true, data: ticket },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 5. ERRORES DE AUTENTICACIÓN
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 } // Unauthorized
      );
    }
    
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Continuar con la lógica...
  } catch (error) {
    // ...
  }
}

// 6. ERRORES DE PERMISOS
if (payload.role !== 'agent') {
  return NextResponse.json(
    { success: false, error: 'Permission denied' },
    { status: 403 } // Forbidden
  );
}
```

**Códigos de estado HTTP usados:**
- `200`: OK (éxito)
- `201`: Created (recurso creado)
- `400`: Bad Request (datos inválidos)
- `401`: Unauthorized (no autenticado)
- `403`: Forbidden (sin permisos)
- `404`: Not Found (no encontrado)
- `500`: Internal Server Error (error del servidor)

---

## 🎯 Checklist de Preparación

Antes de tu sustentación, asegúrate de poder explicar:

### Conceptos de React ✓
- [ ] ¿Qué es un componente?
- [ ] ¿Qué son las props?
- [ ] ¿Qué es el estado (state)?
- [ ] ¿Qué es useState?
- [ ] ¿Qué es useEffect?
- [ ] ¿Qué es Context API?
- [ ] ¿Qué es un custom hook?
- [ ] ¿Qué es JSX?

### Conceptos de Next.js ✓
- [ ] ¿Qué es Next.js?
- [ ] ¿Cómo funciona el enrutamiento?
- [ ] ¿Qué son las API Routes?
- [ ] ¿Qué es un layout?
- [ ] ¿Qué son los componentes cliente vs servidor?
- [ ] ¿Cómo funciona el renderizado?

### Tu Proyecto ✓
- [ ] Arquitectura general
- [ ] Flujo de autenticación
- [ ] Sistema de roles
- [ ] CRUD de tickets
- [ ] Sistema de comentarios
- [ ] Estructura de carpetas
- [ ] Base de datos (MongoDB)
- [ ] Componentes principales

### Código Específico ✓
- [ ] AuthContext.tsx
- [ ] ThemeContext.tsx
- [ ] useApi.ts
- [ ] Login page
- [ ] Client dashboard
- [ ] Agent dashboard
- [ ] Button component
- [ ] API Routes principales

---

## 📝 Ejemplos de Preguntas y Respuestas

### P: "Muéstrame un componente y explícalo línea por línea"

**R:** Voy a explicar el componente Button:

```tsx
// 1. Imports necesarios
import React, { ButtonHTMLAttributes, ReactNode } from 'react';

// 2. Tipos de TypeScript para las variantes
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// 3. Interface que define las props del componente
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;       // Contenido del botón
  variant?: ButtonVariant;   // Opcional: estilo del botón
  size?: ButtonSize;         // Opcional: tamaño del botón
  isLoading?: boolean;       // Opcional: estado de carga
  fullWidth?: boolean;       // Opcional: ancho completo
}

// 4. Objetos con estilos CSS para cada variante
const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

// 5. Componente principal
export default function Button({
  children,                    // Contenido del botón
  variant = 'primary',         // Valor por defecto
  size = 'md',                 // Valor por defecto
  isLoading = false,           // Valor por defecto
  fullWidth = false,           // Valor por defecto
  disabled,                    // Del HTML button
  className = '',              // Clases CSS adicionales
  ...props                     // Resto de props del botón HTML
}: ButtonProps) {
  // 6. Estilos base que todos los botones tendrán
  const baseStyles = 'inline-flex items-center justify-center rounded-lg';
  
  // 7. Retornar JSX (HTML)
  return (
    <button
      className={`
        ${baseStyles}                  // Estilos base
        ${variantStyles[variant]}      // Estilos según variante
        ${sizeStyles[size]}            // Estilos según tamaño
        ${fullWidth ? 'w-full' : ''}   // Ancho completo si fullWidth=true
        ${className}                   // Clases adicionales
      `}
      disabled={disabled || isLoading} // Desactivar si está cargando
      {...props}                       // Pasar resto de props (onClick, etc.)
    >
      {/* 8. Mostrar spinner si está cargando */}
      {isLoading && (
        <svg className="animate-spin h-4 w-4 mr-2">
          {/* SVG del spinner */}
        </svg>
      )}
      
      {/* 9. Mostrar contenido del botón */}
      {children}
    </button>
  );
}
```

**Uso del componente:**
```tsx
<Button>Click me</Button>
<Button variant="danger" size="lg" isLoading={true}>
  Guardando...
</Button>
```

---

## 🚀 Consejos Finales

1. **Practica explicar en voz alta**: Explica el código a un amigo o frente al espejo
2. **Ten ejemplos concretos**: No solo teoría, muestra código
3. **Conoce el flujo completo**: Desde que el usuario hace clic hasta que ve la respuesta
4. **Sé honesto**: Si no sabes algo, di "No lo sé, pero puedo investigarlo"
5. **Muestra entusiasmo**: Demuestra que entiendes y te gusta lo que hiciste

---

**¡Mucho éxito en tu sustentación! 🎉**
