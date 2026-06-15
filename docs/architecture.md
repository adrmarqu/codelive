# Arquitectura del Sistema — CodeLive

Este documento describe la arquitectura técnica de **CodeLive**, una plataforma web interactiva y gamificada para el aprendizaje de lenguajes y tecnologías de desarrollo web.

---

## 🗺️ Vista de Arquitectura General

CodeLive sigue un patrón clásico de **Arquitectura de Tres Capas** con desacoplamiento total entre el frontend y el backend:

```mermaid
graph TD
    User[Navegador de Usuario] <-->|HTTPS / JSON / JWT| FE[Frontend: React + Vite]
    FE <-->|API REST / CORS| BE[Backend: Node.js + Express]
    BE <-->|pg Client / SQL| DB[(Base de Datos: PostgreSQL)]
    
    subgraph Cliente (Navegador)
        FE
        IFrame[Iframe Sandbox / HTML-CSS-JS Runner] <--> FE
    end
    
    subgraph Servidor
        BE
        DB
    end
```

### 1. Frontend (Capa de Presentación)
- **Tecnología**: Single Page Application (SPA) construida con React 19 y Vite 8.
- **Enrutamiento**: Controlado en el cliente mediante `react-router-dom` (v7).
- **Internacionalización**: Configurada con `i18next` para ofrecer soporte multiidioma en Español (`es`), Inglés (`en`) y Catalán (`ca`).
- **Despliegue**: Optimizado para entornos estáticos y servido mediante Nginx en contenedor Docker o a través de Vercel.

### 2. Backend (Capa de Lógica de Negocio)
- **Tecnología**: Servidor REST construido con Node.js y Express 5 utilizando la sintaxis de CommonJS (`require`).
- **Seguridad**: Cabeceras seguras configuradas a través de `helmet` y control estricto de CORS para permitir solicitudes del frontend.
- **Autenticación**: Basada en tokens JSON Web Token (JWT) almacenados en el cliente.
- **Despliegue**: Servidor stateless preparado para escalar en Render.

### 3. Base de Datos (Capa de Datos)
- **Tecnología**: PostgreSQL 16.
- **Conexión**: Gestionada mediante un pool de conexiones con el driver `pg`.
- **Estructura**: Tablas relacionales con restricciones de integridad referencial, borrados en cascada e índices optimizados para búsquedas frecuentes (como tokens de restablecimiento y progreso de usuarios).

---

## 📂 Estructura del Repositorio

La raíz del repositorio contiene la configuración del despliegue y herramientas globales de desarrollo, mientras que el código fuente reside en `sources/`:

```
codelive/
├── render.yaml              # Declaración de infraestructura en Render (Blueprint)
├── Makefile                 # Automatización de tareas locales (Docker)
├── docs/                    # Documentación técnica del proyecto
└── sources/
    ├── docker-compose.yml   # Orquestación de contenedores de desarrollo local
    ├── db/
    │   └── init.sql         # Esquema de tablas y datos semilla de la base de datos
    ├── frontend/            # Código fuente de React + Vite
    │   ├── src/
    │   │   ├── components/  # Componentes globales y comunes (Botones, Inputs, etc.)
    │   │   ├── pages/       # Vistas de la aplicación estructuradas por módulos
    │   │   ├── services/    # Clientes de red (Axios) para interactuar con la API
    │   │   ├── routes/      # Configuración y guardas de rutas del cliente
    │   │   └── i18n/        # Configuración de localización e idiomas
    │   └── Dockerfile       # Compilación multi-stage con servidor final Nginx
    └── backend/             # Código fuente del servidor Express
        ├── src/
        │   ├── config/      # Configuraciones de JWT y conexión a base de datos
        │   ├── controllers/ # Lógica controladora de las peticiones REST
        │   ├── middleware/  # Filtros de autenticación y autorización por roles
        │   ├── models/      # Consultas raw y operaciones a PostgreSQL
        │   ├── routes/      # Enrutadores Express para modular la API
        │   └── seed/        # Script de inicialización de base de datos local
        └── Dockerfile       # Imagen de producción del backend
```

---

## 🛡️ Control de Acceso y Roles

El sistema implementa control de acceso basado en roles (RBAC) a nivel de rutas tanto en el frontend como en el backend. 

### Roles Disponibles
1. **`guest` (Invitado)**: Usuario no autenticado. Tiene acceso exclusivo a la landing page, el formulario de contacto, páginas de inicio de sesión/registro y realizar lecciones.
2. **`user` (Alumno)**: Usuario registrado. Puede ver su panel, realizar lecciones, guardar progresos y ver el ranking global.
3. **`editor` (Creador de contenidos)**: Tiene los mismo que 'user' y además puede crear, modificar o eliminar cursos, módulos y niveles didácticos.
4. **`admin` (Administrador)**: Acceso a la suite completa de edición, lectura de los mensajes de contacto entrantes y control total del sistema.

### Flujo de Autenticación
```
[Cliente] -(POST /api/auth/login)-> [Backend API]
    |                                   |
    |                               Genera JWT firmado
    |<---(Respuesta 200 + Token)--------|
    |
 Guarda Token en LocalStorage
    |
[Cliente] --(GET /api/user/me + Authorization: Bearer <token>)--> [Backend API]
                                                                      |
                                                               Valida Firma JWT
                                                                      |
                                                                Busca en DB
                                                                      |
                                                         (Respuesta 200 + Rol/Perfil)
```

---

## 🏃 Sistema de Ejecución de Código ("Try It Yourself")

Una de las características clave de CodeLive es su entorno interactivo de pruebas de código. El comportamiento varía según la tecnología evaluada:

### Ejecución en Cliente (HTML / CSS / JavaScript)
Para evitar saturar el servidor y proporcionar retroalimentación instantánea:
- **Mecanismo**: El código escrito por el estudiante se inyecta directamente dentro de un `<iframe>` HTML.
- **Aislamiento**: El iframe utiliza el atributo `sandbox="allow-scripts"` para evitar accesos indebidos a cookies o almacenamiento local del dominio principal.
- **Redirección de Consola (JS)**: La ejecución de JavaScript intercepta `console.log` y `console.error` para formatear y volcar los resultados en un componente de simulación de terminal integrado en el propio contenedor.

### Ejecución en Servidor (PHP / Node.js / SQL)
Para lenguajes que requieren interpretación o bases de datos relacionales:
1. El cliente envía el código fuente y el identificador de lenguaje al endpoint `/api/learn/run`.
2. El backend recibe y procesa el código:
   - Para **SQL**: Ejecuta la consulta dentro de una transacción en un entorno controlado y devuelve los resultados en formato JSON de filas y columnas, listos para que el frontend los dibuje en forma de tabla.
   - Para otros lenguajes de servidor, el backend evalúa de forma aislada las entradas devolviendo el output en texto plano.
