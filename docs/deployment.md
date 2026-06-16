# 🚀 Guía de Despliegue — CodeLive

Este documento detalla el proceso completo para desplegar **CodeLive** en un entorno de producción real, usando **Vercel** para el frontend y **Render** para el backend y la base de datos.

---

## 🗺️ Visión General del Despliegue

```
[GitHub Repositorio]
        |
        ├──► Vercel (Frontend - React/Vite) ──► https://codelive-pvo7.vercel.app
        │
        └──► Render Blueprint (render.yaml)
                  ├──► Render Web Service (Backend - Node.js/Express) ──► https://<app>.onrender.com
                  └──► Render PostgreSQL (Base de Datos) ──► Internal connection string
```

---

## 🐳 Entorno Local con Docker (Desarrollo)

Antes de desplegar en producción, verifica que el entorno local funciona correctamente.

### Requisitos
- Docker Desktop instalado y en ejecución.

### Comandos

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd codelive

# 2. Configurar variables de entorno del backend
cp sources/backend/.env.example sources/backend/.env
# Edita el .env con tus valores locales (ver sección de Variables de Entorno)

# 3. Construir y levantar todos los servicios
make build

# 4. (Opcional) Inicializar datos de prueba
make seed
```

| Servicio | URL Local |
|----------|-----------|
| Frontend | http://localhost:80 |
| Backend API | http://localhost:3000 |
| pgAdmin | http://localhost:8080 |

---

## ☁️ Despliegue en Producción

### Paso 1: Desplegar el Backend y la DB en Render

Render permite declarar toda la infraestructura en el archivo `render.yaml` de la raíz del repositorio.

1. Accede a [render.com](https://render.com) e inicia sesión.
2. Ve a **"New" → "Blueprint"** y conecta tu repositorio de GitHub/GitLab.
3. Render detecta automáticamente el archivo `render.yaml` y previsualiza los servicios que creará:
   - 🐘 **Base de datos PostgreSQL** (`codelive-postgres-db`)
   - 🖥️ **Web Service backend** (`codelive-backend`)
4. Haz clic en **"Apply"** para crear la infraestructura.
5. Una vez creados los servicios, añade manualmente las **variables de entorno sensibles** (ver sección correspondiente).

> ⚠️ **Importante**: La variable `DATABASE_URL` es proporcionada automáticamente por Render cuando el servicio web está enlazado a la base de datos PostgreSQL en el mismo Blueprint. No la configures manualmente.

### Paso 2: Desplegar el Frontend en Vercel

1. Accede a [vercel.com](https://vercel.com) e inicia sesión.
2. Haz clic en **"Add New Project"** e importa el repositorio.
3. Configura el proyecto con los siguientes ajustes:
   - **Framework Preset**: Vite
   - **Root Directory**: `sources/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Añade la variable de entorno:
   - `VITE_API_URL` = URL pública de tu backend en Render (ej: `https://codelive-backend.onrender.com`)
5. Haz clic en **"Deploy"**.

> ✅ A partir de aquí, cada push a la rama principal (`main`) disparará un redespliegue automático tanto en Vercel como en Render.

---

## 🔐 Variables de Entorno

### Backend (`sources/backend/.env` / Render Environment)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto en que escucha el servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `production` |
| `DATABASE_URL` | URL completa de conexión a PostgreSQL | *(proporcionada por Render automáticamente)* |
| `DB_USER` | Usuario de la base de datos (dev local) | `admin` |
| `DB_PASSWORD` | Contraseña de la base de datos (dev local) | `admin` |
| `DB_HOST` | Host de la base de datos (dev local) | `db` (Docker) / `localhost` (nativo) |
| `DB_NAME` | Nombre de la base de datos | `codelive_db` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | *(cadena larga y aleatoria)* |
| `CORS_ORIGINS` | Orígenes permitidos por CORS | `https://codelive-pvo7.vercel.app` |

> 🔒 **Seguridad**: Nunca subas el archivo `.env` al repositorio. Está incluido en `.gitignore`.

### Frontend (`sources/frontend/.env.local` / Vercel Environment)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL base del backend | `https://codelive-backend.onrender.com` |

---

## 📦 Arquitectura de Contenedores Docker (Desarrollo Local)

El archivo `sources/docker-compose.yml` orquesta tres servicios:

```yaml
services:
  db:        # PostgreSQL 16 con volumen persistente
  backend:   # Node.js + Express (con hot-reload en desarrollo)
  frontend:  # React + Vite (servido por Nginx en producción)
  pgadmin:   # Interfaz visual para administrar la base de datos
```

### Proceso de Build Multi-Stage (Frontend)
El `Dockerfile` del frontend usa un build multi-stage:
1. **Stage `build`**: instala dependencias con Node.js y compila el proyecto con Vite.
2. **Stage `production`**: copia el directorio `dist/` a una imagen de Nginx ligera, que sirve los archivos estáticos.

### Proceso de Build (Backend)
El `Dockerfile` del backend copia el código fuente y las dependencias de producción (`npm ci --only=production`) a una imagen de Node.js Alpine, minimizando el tamaño de la imagen final.

---

## 🔄 CI/CD y Actualizaciones

Actualmente el despliegue es continuo basado en commits:

- Cada push a `main` → Vercel redeploya el frontend automáticamente.
- Cada push a `main` → Render redeploya el backend automáticamente.

Para cambios en el esquema de base de datos, es necesario:
1. Modificar `sources/db/init.sql`.
2. Aplicar los cambios manualmente en la base de datos de Render (mediante la consola psql de Render o una migración).

> 💡 **Próximo paso recomendado**: Implementar un sistema de migraciones (por ejemplo, con `db-migrate` o `node-pg-migrate`) para gestionar los cambios de esquema de forma controlada.

---

## 🩺 Verificación del Despliegue

Una vez desplegado, verifica que todo funciona correctamente:

```bash
# 1. Comprueba que el backend responde
curl https://<tu-backend>.onrender.com/api/user/me

# 2. Comprueba que la API de cursos es accesible
curl https://<tu-backend>.onrender.com/api/learn/courses

# 3. Abre el frontend en el navegador
open https://codelive-pvo7.vercel.app
```

Si el backend tarda en responder la primera vez, es normal: los servicios gratuitos de Render entran en "sleep" tras períodos de inactividad y tardan ~30 segundos en arrancar.

---

© 2026 CodeLive. Todos los derechos reservados.
