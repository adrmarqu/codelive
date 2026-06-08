# 🚀 CodeLive — Plataforma Interactiva de Aprendizaje de Programación

> Aprende HTML, CSS, JavaScript, PHP, Node.js y SQL de forma gamificada con niveles, rankings y seguimiento de progreso.

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19 + Vite 8 + react-router-dom |
| Backend | Node.js + Express 5 (CommonJS) |
| Base de datos | PostgreSQL 16 |
| Autenticación | JWT (jsonwebtoken + bcrypt) |
| i18n | i18next (ES / EN / CA) |
| Despliegue | Vercel (frontend) + Render (backend + DB) |

---

## 📁 Estructura del Proyecto

```
codelive/
├── render.yaml              # Bluepint de despliegue en Render
├── Makefile                 # Comandos Docker rápidos
├── docs/                   # Documentación de páginas y componentes
└── sources/
    ├── docker-compose.yml   # Entorno de desarrollo local
    ├── db/
    │   └── init.sql         # Esquema inicial de PostgreSQL
    ├── frontend/            # React + Vite SPA
    │   ├── vercel.json      # Config de despliegue Vercel
    │   ├── Dockerfile       # Multi-stage build (nginx)
    │   └── src/
    │       ├── components/  # Componentes reutilizables
    │       ├── pages/       # Páginas por sección
    │       ├── services/    # Clientes API (Axios)
    │       ├── routes/      # Definición de rutas
    │       └── i18n/        # Configuración de idiomas
    └── backend/             # Node.js + Express API
        ├── .env.example     # Variables de entorno necesarias
        ├── Dockerfile       # Imagen de producción
        └── src/
            ├── config/      # DB, JWT
            ├── controllers/ # Lógica de negocio
            ├── middleware/  # Auth (protect + restrictTo)
            ├── models/      # Consultas SQL
            ├── routes/      # Rutas de la API
            └── seed/        # Script de inicialización
```

---

## ⚡ Desarrollo Local (Docker)

### Requisitos
- Docker Desktop instalado y en ejecución

### Pasos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd codelive

# 2. Copiar y configurar variables de entorno
cp sources/backend/.env.example sources/backend/.env
# Edita sources/backend/.env con tus valores

# 3. Levantar todos los servicios
make build   # Construye y arranca los contenedores
make open    # Abre el frontend y backend en el navegador

# 4. (Opcional) Crear usuarios admin/editor iniciales
make seed
```

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:3000 |
| pgAdmin | http://localhost:8080 |

### Comandos Makefile disponibles

```bash
make build    # Construir y arrancar contenedores
make up       # Arrancar sin reconstruir
make down     # Parar contenedores
make logs     # Ver logs en tiempo real
make restart  # Reiniciar todos los servicios
make clean    # Parar y eliminar volúmenes (borra la DB)
make seed     # Crear usuarios admin y editor iniciales
```

---

## 🌐 Despliegue en Producción

### Frontend → Vercel

1. Importa el repositorio en [vercel.com](https://vercel.com)
2. Configura:
   - **Root Directory**: `sources/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Añade la variable de entorno:
   - `VITE_API_URL` = URL pública de tu backend en Render

### Backend + DB → Render

1. Conecta el repositorio en [render.com](https://render.com)
2. Render detecta automáticamente el `render.yaml` en la raíz
3. Haz clic en **"New Blueprint Instance"**
4. Render creará automáticamente:
   - 🐘 Base de datos PostgreSQL (`codelive-postgres-db`)
   - 🖥️ Servicio web backend (`codelive-backend`)
5. Añade manualmente las variables de entorno sensibles:
   - `JWT_SECRET` = una cadena larga y segura
   - `CORS_ORIGINS` = URL de tu frontend en Vercel (ej: `https://codelive.vercel.app`)

---

## 🔐 Variables de Entorno

### Backend (`sources/backend/.env`)

```env
PORT=3000
NODE_ENV=development

# Base de datos (usa DATABASE_URL en producción - Render lo provee automáticamente)
DATABASE_URL=postgres://admin:admin@localhost:5432/codelive_db

# Credenciales individuales (para desarrollo local)
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=localhost
DB_NAME=codelive_db
DB_PORT=5432

# Seguridad
JWT_SECRET=cambia_esto_por_una_clave_muy_larga_y_segura

# CORS
CORS_ORIGINS=http://localhost:5173,https://tu-dominio.vercel.app
```

### Frontend (`sources/frontend/.env.local`)

```env
VITE_API_URL=http://localhost:3000
```

---

## 👥 Roles de Usuario

| Rol | Acceso |
|-----|--------|
| `guest` | Home, Dashboard (lectura), Login, Signin, Terms |
| `user` | + Perfil, Progreso, Ranking, Niveles de aprendizaje |
| `editor` | + Crear/editar contenido (cursos, módulos, niveles) |
| `admin` | Acceso total + Lista de usuarios + Mensajes de contacto |

---

## 🌍 Idiomas Soportados

- 🇪🇸 Español (`es`) — predeterminado
- 🇬🇧 Inglés (`en`)
- 🇨🇦 Catalán (`ca`) — próximamente

Los archivos de traducción están en `sources/frontend/public/locales/{lang}/translation.json`.

---

## 📋 API Endpoints

### Auth (`/api/auth`)
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/signin` | Registrarse |

### Usuario (`/api/user`) 🔒
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/user/me` | Datos del usuario autenticado |

### Edición (`/api/edit`) 🔒 Editor/Admin
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/edit/courses` | Listar / crear cursos |
| PUT/DELETE | `/api/edit/courses/:id` | Editar / eliminar curso |
| GET/POST | `/api/edit/modules/:courseId` | Módulos de un curso |
| PUT/DELETE | `/api/edit/modules/:id` | Editar / eliminar módulo |
| GET/POST | `/api/edit/levels/:moduleId` | Niveles de un módulo |
| PUT | `/api/edit/levels/swap/:moduleId` | Intercambiar orden de niveles |
| DELETE | `/api/edit/levels/:id` | Eliminar nivel |
| GET/POST/PUT | `/api/edit/lesson/:levelId` | Contenido de un nivel |

---

## 🤝 Contribución

1. Haz fork del repositorio
2. Crea una rama: `git checkout -b feature/mi-mejora`
3. Haz tus cambios y commitea: `git commit -m "feat: descripción"`
4. Push y abre un Pull Request

---

© 2026 CodeLive. Todos los derechos reservados.
