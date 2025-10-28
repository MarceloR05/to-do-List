# To-Do List App

Una aplicación completa de lista de tareas con backend Node.js + Express y frontend React + Vite.

## Características

- ✅ CRUD completo de tareas (Crear, Leer, Actualizar, Eliminar)
- ✅ Base de datos PostgreSQL (Supabase)
- ✅ Backend REST API con Express
- ✅ Frontend React con TypeScript
- ✅ Diseño moderno con TailwindCSS
- ✅ Notificaciones toast
- ✅ Filtros por estado (Todas, Pendientes, Completadas)
- ✅ Validación de datos
- ✅ Interfaz responsive

## Tecnologías

### Backend
- Node.js
- Express
- Supabase (PostgreSQL)
- CORS

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios
- React Hot Toast
- Lucide React (iconos)

## Estructura del Proyecto

```
project/
├── server/                 # Backend
│   ├── config/
│   │   └── supabase.js    # Configuración de Supabase
│   ├── controllers/
│   │   └── tasksController.js  # Lógica de negocio
│   ├── routes/
│   │   └── tasks.js       # Rutas de la API
│   └── index.js           # Servidor Express
├── src/                   # Frontend
│   ├── components/
│   │   ├── TaskCard.tsx   # Componente de tarjeta de tarea
│   │   └── TaskModal.tsx  # Modal para crear/editar
│   ├── services/
│   │   └── api.ts         # Cliente API
│   ├── App.tsx            # Componente principal
│   └── main.tsx           # Punto de entrada
└── .env                   # Variables de entorno
```

## Instalación

1. **Clonar el repositorio e instalar dependencias:**

```bash
npm install
```

2. **Configurar variables de entorno:**

Las credenciales de Supabase ya están configuradas en el archivo `.env`.

## Uso

### Iniciar el Backend

En una terminal, ejecuta:

```bash
npm run server
```

El servidor estará disponible en `http://localhost:3000`

### Iniciar el Frontend

En otra terminal, ejecuta:

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## API Endpoints

### GET /api/tasks
Obtiene todas las tareas ordenadas por fecha de creación (más reciente primero).

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Título de la tarea",
      "description": "Descripción opcional",
      "status": "pendiente",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/tasks
Crea una nueva tarea.

**Body:**
```json
{
  "title": "Nueva tarea",
  "description": "Descripción opcional"
}
```

**Validación:**
- `title` es obligatorio y no puede estar vacío

### PUT /api/tasks/:id
Actualiza una tarea existente.

**Body:**
```json
{
  "title": "Título actualizado",
  "description": "Nueva descripción",
  "status": "completada"
}
```

**Validación:**
- `title` no puede estar vacío si se proporciona
- `status` debe ser "pendiente" o "completada"

### DELETE /api/tasks/:id
Elimina una tarea.

## Scripts Disponibles

- `npm run dev` - Inicia el frontend en modo desarrollo
- `npm run server` - Inicia el servidor backend
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter
- `npm run typecheck` - Verifica los tipos de TypeScript

## Características de la Base de Datos

### Tabla `tasks`

- `id` (uuid) - Identificador único
- `title` (text) - Título de la tarea (obligatorio)
- `description` (text) - Descripción opcional
- `status` (text) - Estado: "pendiente" o "completada" (default: "pendiente")
- `created_at` (timestamptz) - Fecha de creación
- `updated_at` (timestamptz) - Fecha de última actualización (se actualiza automáticamente)

### Seguridad

- Row Level Security (RLS) habilitado
- Políticas de acceso público configuradas para demo
- Índices para mejor rendimiento en consultas

## Funcionalidades de la Interfaz

1. **Dashboard de estadísticas** - Muestra total de tareas, pendientes y completadas
2. **Filtros** - Filtra tareas por estado (Todas, Pendientes, Completadas)
3. **Crear tarea** - Modal para agregar nuevas tareas
4. **Editar tarea** - Modificar título y descripción
5. **Marcar como completada** - Toggle de estado con un click
6. **Eliminar tarea** - Con confirmación de seguridad
7. **Notificaciones** - Feedback visual para todas las acciones
8. **Estados vacíos** - Mensajes útiles cuando no hay tareas

## Mejoras Futuras

- Autenticación de usuarios
- Categorías y etiquetas
- Fechas de vencimiento
- Prioridades
- Búsqueda de tareas
- Modo oscuro
- Tests unitarios e integración

## Licencia

MIT
