# Lista de Tareas (To-Do List App)

Una aplicación web full-stack para gestionar tareas, construida con React + TypeScript en el frontend y Node.js + Express + PostgreSQL en el backend. Esta guía está diseñada para ayudarte a recrear el proyecto desde cero, paso a paso.

## Requisitos Previos

- Node.js (versión 14 o superior)
- PostgreSQL 12+ instalado localmente
- Un editor de código (recomendado: Visual Studio Code)
- Terminal PowerShell (Windows)

## Características

- ✅ Sistema de autenticación completo (registro, login, logout)
- ✅ Protección de rutas mediante JWT (JSON Web Tokens)
- ✅ Tareas privadas por usuario
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Validación de datos en frontend y backend
- ✅ Gestión de sesiones con localStorage

## Estructura del Proyecto

```
todo-list/
├── server/                # Backend
│   ├── config/           # Configuración de la base de datos
│   ├── controllers/      # Lógica de negocio
│   │   ├── authController.js  # Control de autenticación
│   │   └── tasksController.js # Control de tareas
│   ├── middleware/      # Middlewares
│   │   └── auth.js     # Protección de rutas
│   ├── routes/         # Rutas de la API
│   │   ├── auth.js    # Rutas de autenticación
│   │   └── tasks.js   # Rutas de tareas
│   ├── database.sql    # Esquema de la BD
│   └── index.js        # Punto de entrada del servidor
└── src/                 # Frontend
    ├── components/     # Componentes React
    │   ├── Auth.tsx   # Componente principal de auth
    │   ├── LoginForm.tsx    # Formulario de login
    │   ├── RegisterForm.tsx # Formulario de registro
    │   ├── TaskCard.tsx    # Tarjeta de tarea
    │   └── TaskModal.tsx   # Modal de tarea
    ├── services/      # Servicios API
    │   └── api.ts    # Cliente API con autenticación
    └── main.tsx      # Punto de entrada del cliente
```

## Paso a Paso: Creación del Proyecto

### 1. Configuración Inicial

1. Crear el directorio del proyecto:
   ```powershell
   mkdir todo-list
   cd todo-list
   ```

2. Iniciar proyecto Vite con React + TypeScript:
   ```powershell
   npm create vite@latest . -- --template react-ts
   npm install
   ```

3. Instalar dependencias del frontend:
   ```powershell
   npm install axios react-hot-toast lucide-react tailwindcss postcss autoprefixer
   ```

4. Configurar Tailwind CSS:
   ```powershell
   npx tailwindcss init -p
   ```

### 2. Configuración del Backend

1. Crear el directorio del servidor:
   ```powershell
   mkdir server
   cd server
   npm init -y
   ```

3. Instalar dependencias del backend:
   ```powershell
   npm install express pg cors dotenv bcryptjs jsonwebtoken
   npm install nodemon -D
   ```

3. Crear archivo `.env` en la carpeta `server`:
   ```env
   DB_USER=postgres
   DB_HOST=localhost
   DB_NAME=todoapp
   DB_PASSWORD=tu_contraseña
   DB_PORT=5432
   ```

### 3. Configuración de la Base de Datos

1. Crear el archivo `database.sql`:
   ```sql
   -- Users table
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username VARCHAR(50) UNIQUE NOT NULL,
       email VARCHAR(255) UNIQUE NOT NULL,
       password_hash VARCHAR(255) NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
   );

   -- Tasks table with user_id foreign key
   CREATE TABLE tasks (
       id SERIAL PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       description TEXT,
       completed BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
   );
   ```

2. Crear la base de datos:
   ```powershell
   # Usando el psql command
   psql -U postgres -c "CREATE DATABASE todoapp;"
   psql -U postgres -d todoapp -f database.sql
   ```

### 4. Configuración de los Archivos del Servidor

1. `config/database.js`:
   ```javascript
   const { Pool } = require('pg');
   require('dotenv').config();

   const pool = new Pool({
     user: process.env.DB_USER || 'postgres',
     host: process.env.DB_HOST || 'localhost',
     database: process.env.DB_NAME || 'todoapp',
     password: process.env.DB_PASSWORD || 'tu_contraseña',
     port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
   });

   module.exports = pool;
   ```

2. `routes/tasks.js`:
   ```javascript
   const express = require('express');
   const router = express.Router();
   const {
     getAllTasks,
     createTask,
     updateTask,
     deleteTask
   } = require('../controllers/tasksController');

   router.get('/', getAllTasks);
   router.post('/', createTask);
   router.put('/:id', updateTask);
   router.delete('/:id', deleteTask);

   module.exports = router;
   ```

3. `index.js`:
   ```javascript
   const express = require('express');
   const cors = require('cors');
   require('dotenv').config();
   const tasksRouter = require('./routes/tasks');

   const app = express();
   const PORT = process.env.PORT || 3000;

   app.use(cors());
   app.use(express.json());
   app.use('/api/tasks', tasksRouter);

   app.listen(PORT, () => {
     console.log(`Server running on http://localhost:${PORT}`);
   });
   ```

### 5. Configuración del Frontend

1. Crear el servicio API (`src/services/api.ts`):
   ```typescript
   import axios from 'axios';

   const api = axios.create({
     baseURL: 'http://localhost:3000/api'
   });

   export interface Task {
     id: number;
     title: string;
     description: string;
     completed: boolean;
     created_at: string;
     updated_at: string;
   }

   export const getTasks = () => api.get<{success: boolean; data: Task[]}>('/tasks');
   export const createTask = (task: Partial<Task>) => api.post('/tasks', task);
   export const updateTask = (id: number, task: Partial<Task>) => api.put(`/tasks/${id}`, task);
   export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
   ```

### 6. Ejecutar el Proyecto

1. Iniciar el servidor (en una terminal):
   ```powershell
   cd server
   npm run dev
   ```

2. Iniciar el cliente (en otra terminal):
   ```powershell
   npm run dev
   ```

## Solución de Problemas Comunes

1. Error "EADDRINUSE" (puerto 3000 en uso):
   ```powershell
   # Encontrar el proceso usando el puerto
   netstat -ano | findstr ":3000"
   # Matar el proceso
   taskkill /PID <número_PID> /F
   ```

2. Error de conexión a la base de datos:
   - Verifica que PostgreSQL esté corriendo
   - Revisa las credenciales en el archivo `.env`
   - Asegúrate de que la base de datos existe

3. Error CORS:
   - Verifica que `app.use(cors())` esté en `index.js`
   - Comprueba que los puertos coincidan con la configuración

## Pruebas desde PowerShell

1. Probar el servidor:
   ```powershell
   Invoke-RestMethod -Method Get -Uri http://localhost:3000/api/tasks
   ```

2. Crear una tarea:
   ```powershell
   $body = @{
     title = "Nueva tarea"
     description = "Descripción de la tarea"
   } | ConvertTo-Json

   Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -Body $body -ContentType 'application/json'
   ```

## Tecnologías Utilizadas

### Frontend
- React 18 con TypeScript
- Vite (bundler)
- TailwindCSS
- Axios con interceptors para JWT
- React Hot Toast (notificaciones)
- LocalStorage para persistencia de sesión
- Formularios validados
- Protección de rutas por autenticación

### Backend
- Node.js con Express
- PostgreSQL
- node-postgres (pg)
- JWT para autenticación
- bcryptjs para encriptación
- Middleware de autenticación
- CORS configurado
- dotenv para variables de entorno

## Sistema de Autenticación

### Registro de Usuarios
- Ruta: `POST /api/auth/register`
- Campos requeridos:
  - username (único)
  - email (único)
  - password (mínimo 6 caracteres)
- Respuesta: Token JWT y datos del usuario

### Inicio de Sesión
- Ruta: `POST /api/auth/login`
- Campos requeridos:
  - email
  - password
- Respuesta: Token JWT y datos del usuario

### Protección de Rutas
- Middleware de autenticación que verifica el token JWT
- Header requerido: `Authorization: Bearer <token>`
- Todas las rutas de tareas están protegidas
- Cada usuario solo puede ver y modificar sus propias tareas

### Manejo de Sesión (Frontend)
- Token JWT almacenado en localStorage
- Interceptor de Axios para incluir el token en cada petición
- Redirección automática al login si el token expira
- Cierre de sesión limpia el localStorage

### Seguridad
- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración de 24 horas
- Validación de datos en ambos lados
- Manejo de errores detallado

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la versión de producción