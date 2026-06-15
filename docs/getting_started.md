# Guía de Inicio Rápido — CodeLive

Este documento proporciona instrucciones detalladas para configurar y ejecutar el entorno de desarrollo de **CodeLive** en tu máquina local.

---

## 📋 Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- **Docker** y **Docker Compose** (recomendado para simplificar la base de datos).
- **Node.js** (versión 18 o superior) y **npm** (si ejecutas el desarrollo sin Docker).
- Un cliente de base de datos como pgAdmin o DBeaver (opcional).

---

## 🐳 Método A: Desarrollo con Docker (Recomendado)

Docker automatiza la creación de la base de datos PostgreSQL, el backend en Node.js y el frontend en React.

### 1. Variables de Entorno del Backend
Copia el archivo de ejemplo en la raíz de `sources/backend/`:
```bash
cp sources/backend/.env.example sources/backend/.env
```
Abre el archivo `sources/backend/.env` y asegúrate de que tiene las configuraciones para desarrollo:
```env
PORT=3000
NODE_ENV=development
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=db
DB_NAME=codelive_db
DB_PORT=5432
JWT_SECRET=tu_clave_secreta_super_segura_para_desarrollo
CORS_ORIGINS=http://localhost,http://localhost:80,http://localhost:5173
```
> ⚠️ **Nota Importante**: Al usar Docker Compose, el host de la base de datos debe ser `db` (el nombre del servicio en `docker-compose.yml`), no `localhost`.

### 2. Construcción y Lanzamiento
Utiliza el `Makefile` en la raíz del proyecto para agilizar los comandos de Docker:
```bash
# Construye las imágenes y levanta los servicios
make build

# Inicializa las tablas y crea los usuarios iniciales (admin y editor)
make seed
```

### 3. URLs del Entorno Local
Una vez levantado:
- **Frontend App**: [http://localhost](http://localhost) (Puerto 80)
- **Backend API**: [http://localhost:3000](http://localhost:3000)
- **pgAdmin**: [http://localhost:8080](http://localhost:8080) (Usuario: `admin@codelive.com`, Contraseña: `admin`)

### 4. Otros comandos útiles del Makefile
- Ver logs en tiempo real: `make logs`
- Detener los contenedores: `make down`
- Reiniciar el entorno: `make restart`
- Limpiar datos y base de datos por completo: `make clean`

---

## 💻 Método B: Desarrollo Nativo sin Docker

Si prefieres ejecutar el código directamente en tu sistema local:

### 1. Base de Datos PostgreSQL
1. Crea una base de datos vacía llamada `codelive_db` en tu instalación local de PostgreSQL.
2. Ejecuta el script SQL en `sources/db/init.sql` para crear las tablas y las filas semilla iniciales.

### 2. Configurar y Ejecutar el Backend
1. Navega al directorio del backend:
   ```bash
   cd sources/backend
   ```
2. Copia y edita las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   *Establece `DB_HOST=localhost` en tu archivo `.env`.*
3. Instala las dependencias y arranca en modo desarrollo:
   ```bash
   npm install
   npm run dev
   ```
   El backend estará escuchando en [http://localhost:3000](http://localhost:3000).

### 3. Configurar y Ejecutar el Frontend
1. Abre una nueva terminal y navega al directorio del frontend:
   ```bash
   cd sources/frontend
   ```
2. Instala las dependencias de node:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   El frontend estará disponible en [http://localhost:5173](http://localhost:5173).

---

## 👥 Credenciales de Prueba Iniciales

Una vez completada la siembra (`make seed` o la importación de `init.sql`), dispones de dos usuarios preconfigurados:

| Usuario | Contraseña | Rol / Permisos |
|---------|------------|----------------|
| `admin` | `admin123` | **Administrador** (gestión y control completo) |
| `editor` | `editor123` | **Editor** (edición de cursos, módulos y lecciones) |

*Puedes registrar nuevos alumnos con el rol predeterminado `user` desde la interfaz de registro de la aplicación.*
