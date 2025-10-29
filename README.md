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

# To-Do List — Guía de instalación y ejecución (Windows / PowerShell)

Este repositorio contiene una aplicación "To-Do List" con backend en Node/Express + PostgreSQL y frontend en React (Vite + TypeScript).

Este README está pensado para recrear el proyecto desde cero en clase (Windows PowerShell). Incluye todos los comandos, archivos clave, scripts y soluciones a errores comunes.

---

## Requisitos previos

- Node.js v18+ y npm
- PostgreSQL (server local) con un usuario (ej. `postgres`)
- PowerShell (Windows)
- (Opcional) Git y VS Code

---

## Estructura final del proyecto

to-do-List/
- server/
  - index.js
  - package.json
  - .env
  - config/database.js
  - controllers/tasksController.js
  - routes/tasks.js
  - database.sql
  - test-db.js
- frontend/  (o `src/` si prefieres)
  - package.json (creado por Vite)
  - src/
    - main.tsx
    - App.tsx
    - services/api.ts
    - components/TaskCard.tsx
    - components/TaskModal.tsx
- README.md

---

## Paso a paso: crear el proyecto (PowerShell)

Estas instrucciones asumen que trabajarás bajo `C:\Users\<tu_usuario>\...`. Adapta las rutas según necesites.

1) Crear carpeta del proyecto

```powershell
cd C:\Users\<tu_usuario>\Downloads\ciclo 6\DWA
mkdir "to-do-List"
cd "to-do-List"
```

2) Configurar backend (API con Express + PostgreSQL)

```powershell
mkdir server
cd server
npm init -y
npm install express pg cors dotenv
npm install -D nodemon
```

3) Crear archivos del backend

Crea los archivos siguientes en `server/` con el contenido apropiado (más abajo en este README se incluye el contenido listo para copiar):

- `package.json` (asegúrate de tener los scripts `start` y `dev`)
- `.env` (variables de conexión a la BD)
- `config/database.js` (pool de `pg` leyendo `.env`)
- `index.js` (servidor Express)
- `routes/tasks.js` (router)
- `controllers/tasksController.js` (lógica CRUD usando `pg`)
- `database.sql` (creación de tabla `tasks`)
- `test-db.js` (script opcional para probar conexión a la BD)

4) Crear la base de datos y la tabla en PostgreSQL

Abre PowerShell y ejecuta (te pedirá la contraseña del usuario postgres):

```powershell
# Si no tienes la DB creada
psql -U postgres -W -c "CREATE DATABASE todo_list;"

# ejecutar script SQL (desde la carpeta server):
psql -U postgres -d todo_list -f "$(Resolve-Path .\database.sql)"
```

> Alternativa: usa pgAdmin para crear la base de datos y correr el SQL desde el Query Tool.

5) Contenidos de archivos (cópialos en los archivos creados)

A continuación están los contenidos que debes pegar exactamente en los archivos dentro de `server/`.

### server/package.json

```json
{
  "name": "todo-list-server",
  "version": "1.0.0",
  "main": "index.js",
  "type": "commonjs",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

### server/.env (NO subir a git)

```
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=todo_list
DB_PASSWORD=TU_CONTRASEÑA
DB_PORT=5432
```

Cambia `TU_CONTRASEÑA` por la contraseña correcta.

### server/config/database.js

```js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'todo_list',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

module.exports = pool;
```

### server/index.js

```js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### server/routes/tasks.js

```js
const express = require('express');
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/tasksController');

const router = express.Router();

router.get('/', getAllTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
```

### server/controllers/tasksController.js

Copia la versión final que gestiona `completed` (boolean) y mapea `status` a `completed`.

```js
const pool = require('../config/database');

const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El título es obligatorio'
      });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description?.trim() || '']
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, completed } = req.body;

    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El título no puede estar vacío'
      });
    }

    let completedValue;
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ success: false, message: 'completed debe ser booleano' });
      }
      completedValue = completed;
    } else if (status !== undefined) {
      if (!['pendiente', 'completada'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'El estado debe ser "pendiente" o "completada"'
        });
      }
      completedValue = status === 'completada';
    }

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (title !== undefined) {
      updateFields.push(`title = $${paramCount}`);
      values.push(title.trim());
      paramCount++;
    }
    if (description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(description.trim());
      paramCount++;
    }
    if (completedValue !== undefined) {
      updateFields.push(`completed = $${paramCount}`);
      values.push(completedValue);
      paramCount++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos para actualizar' });
    }

    values.push(id);
    const query = `UPDATE tasks SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramCount} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada' });
    }

    res.json({ success: true, message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
};
```

g) `server/database.sql`

```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

h) `server/test-db.js` (útil en clase para demostrar que la DB está bien)

```js
const pool = require('./config/database');

(async () => {
  try {
    console.log('Testing DB connection...');
    const now = await pool.query('SELECT NOW()');
    console.log('DB time:', now.rows[0]);
    const r = await pool.query("SELECT to_regclass('public.tasks') as exists");
    console.log('tasks table exists:', r.rows[0].exists);
    const sample = await pool.query('SELECT * FROM tasks LIMIT 1');
    console.log('sample rows:', sample.rows);
    process.exit(0);
  } catch (err) {
    console.error('DB test error:', err.message);
    process.exit(1);
  }
})();
```

5) Frontend: crear app Vite + React + TypeScript

A) Crear app con Vite (en la raíz del repo)

```powershell
cd ..  # desde inside server, subir
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install axios react-hot-toast lucide-react
```

B) Archivos claves (fundamentales que ya tienes):
- `frontend/src/services/api.ts` — interfaz Task usa `completed: boolean`. (Ya tenemos versión en repo; adapta baseURL `http://localhost:3000/api`).
- `frontend/src/App.tsx` — implementa `handleToggleStatus` que envía `{ completed: !task.completed }`.
- `frontend/src/components/TaskCard.tsx` y `TaskModal.tsx` — UI para toggle, editar y crear.

(Ten en cuenta: en tu repo actual los archivos están en `src/` raíz; si usas carpeta `frontend/`, coloca archivos bajo `frontend/src/`.)

6) Ejecutar todo (en la clase, paso a paso)

A) Preparar la base de datos (ejecuta SQL)
- Con psql (PowerShell):
```powershell
# crear DB (si no existe)
psql -U postgres -W -c "CREATE DATABASE todo_list;" 

# ejecutar script
psql -U postgres -d todo_list -f "C:\ruta\a\to-do-List\server\database.sql"
```
B) Backend (terminal A)
```powershell
cd "C:\ruta\a\to-do-List\server"
npm install         # instala dependencias si no lo hiciste
# ejecutar servidor
npm run dev         # usa nodemon
# o: node index.js
# Deberías ver: Server running on http://localhost:3000
```

C) Probar DB (opcional, terminal B)
```powershell
cd "C:\ruta\a\to-do-List\server"
node test-db.js
```

D) Frontend (terminal C)
```powershell
cd "C:\ruta\a\to-do-List\frontend"
npm run dev
# Abre la URL que Vite muestre (p.ej. http://localhost:5173)
```

7) Probar manualmente endpoints (PowerShell)
- Health:
```powershell
Invoke-RestMethod -Method Get -Uri http://127.0.0.1:3000/api/health
```
- Crear:
```powershell
$body = @{ title = 'Demo clase'; description = 'Desde PowerShell' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/api/tasks -Body $body -ContentType 'application/json'
```
- Toggle estado (PUT):
```powershell
$body = @{ completed = $true } | ConvertTo-Json
Invoke-RestMethod -Method Put -Uri http://127.0.0.1:3000/api/tasks/1 -Body $body -ContentType 'application/json'
```
- Listar:
```powershell
Invoke-RestMethod -Method Get -Uri http://127.0.0.1:3000/api/tasks
```

8) Errores comunes (y soluciones rápidas)

- EADDRINUSE (puerto 3000 en uso):
  - `netstat -ano | findstr ":3000"` → anota PID
  - `taskkill /PID <PID> /F` o `Stop-Process -Id <PID> -Force`
- JSON parse errors en PowerShell al usar curl:
  - Usa `Invoke-RestMethod` con `ConvertTo-Json`, o `curl.exe` (no el alias de PowerShell) con comillas simples para el cuerpo JSON.
- DB connection refused: revisa `.env`, que PostgreSQL esté corriendo y credenciales sean correctas. Ejecuta `node test-db.js` para comprobar.
- "no existe la columna status": usa `{ completed: true }` o actualiza frontend para enviar `completed`.
- CORS: si frontend y backend en distintos puertos, `app.use(cors())` está presente en `index.js`.

9) Limpieza y ajustes finales (recomendado antes de la clase)
- Elimina referencias a Supabase si quedan archivos (`server/config/supabase.js`) y borra/archiva migraciones Supabase que no uses.
- Quitar logs de debug en `tasksController.js` si los añadiste.
- Opcional: añadir un README.md con estos pasos para los alumnos.

10) Material de apoyo para la clase (opcional, te preparo)
- Un `README.md` con los comandos listos (este archivo ya fue generado)
- Un pequeño script `setup.ps1` que:
  - crea carpetas,
  - instala deps,
  - crea DB y ejecuta database.sql (si el usuario tiene permisos).
  (Puedo generarlo si lo pides.)

¿Quieres que:
1) genere un `README.md` listo para la clase con todos estos comandos y atajos, o
2) elimine ahora los console.log de debug en `server/controllers/tasksController.js`, o
3) genere un pequeño `setup.ps1` que automatice la creación inicial (instalación deps, ejecución SQL)? 

Dime cuál prefieres y lo genero inmediatamente.
