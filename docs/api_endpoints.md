# Referencia de la API REST — CodeLive

Este documento detalla todos los endpoints disponibles en la API del servidor de **CodeLive**, organizados por módulos. El prefijo global de todas las rutas es `/api`.

---

## 🔐 Módulo de Autenticación (`/api/auth`)

Rutas públicas utilizadas para la gestión de accesos y la recuperación de cuentas.

### 1. Iniciar Sesión
- **Método**: `POST`
- **Ruta**: `/login`
- **Cuerpo (JSON)**:
  ```json
  {
    "email": "user@example.com",
    "password": "mi_password_segura"
  }
  ```
- **Respuesta Exitosa (200)**: Devuelve el JSON Web Token (JWT) y el perfil básico del usuario.

### 2. Registrarse
- **Método**: `POST`
- **Ruta**: `/signin`
- **Cuerpo (JSON)**:
  ```json
  {
    "username": "nuevo_usuario",
    "email": "new@example.com",
    "password": "password_segura",
    "repeat_password": "password_segura"
  }
  ```
- **Respuesta Exitosa (201)**: Registra el usuario en la base de datos y devuelve el token de sesión.

### 3. Solicitar Recuperación de Contraseña
- **Método**: `POST`
- **Ruta**: `/recover`
- **Cuerpo (JSON)**:
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Respuesta Exitosa (200)**: Genera y registra un token temporal de restablecimiento en la base de datos (y opcionalmente envía un email).

### 4. Validar Token de Recuperación
- **Método**: `GET`
- **Ruta**: `/recover/validate/:token`
- **Parámetros**: `:token` (el hash único recibido).
- **Respuesta Exitosa (200)**: Confirma si el token sigue siendo válido y no ha expirado.

### 5. Restablecer Contraseña
- **Método**: `POST`
- **Ruta**: `/recover/reset`
- **Cuerpo (JSON)**:
  ```json
  {
    "token": "token_recibido",
    "pass": "nueva_password_segura",
    "rep": "nueva_password_segura"
  }
  ```
- **Respuesta Exitosa (200)**: Actualiza el password del usuario correspondiente en la base de datos y marca el token como utilizado.

---

## 👤 Módulo de Usuario y Perfil (`/api/user`)

Todas estas rutas (a excepción de las de contacto) requieren la cabecera `Authorization: Bearer <JWT>`.

### 1. Estado de Sesión del Cliente
- **Método**: `GET`
- **Ruta**: `/me`
- **Respuesta**: Información del usuario actual si está autenticado, o rol `guest` en caso contrario.

### 2. Obtener Datos del Perfil
- **Método**: `GET`
- **Ruta**: `/profile`
- **Respuesta (200)**: Retorna el username, email, rol y fecha de creación del perfil.

### 3. Modificar Nombre de Usuario
- **Método**: `PUT`
- **Ruta**: `/profile/username`
- **Cuerpo (JSON)**: `{ "username": "nuevo_nombre" }`

### 4. Modificar Correo Electrónico
- **Método**: `PUT`
- **Ruta**: `/profile/email`
- **Cuerpo (JSON)**: `{ "email": "nuevo@correo.com" }`

### 5. Modificar Contraseña
- **Método**: `PUT`
- **Ruta**: `/profile/password`
- **Cuerpo (JSON)**:
  ```json
  {
    "oldPassword": "password_actual",
    "newPassword": "nueva_password_segura"
  }
  ```

### 6. Eliminar Cuenta
- **Método**: `DELETE`
- **Ruta**: `/profile`
- **Respuesta**: Elimina al usuario de la base de datos (con efecto cascada sobre sus progresos y mensajes).

### 7. Consultar Progreso Propio
- **Método**: `GET`
- **Ruta**: `/progress`
- **Respuesta (200)**: Array de IDs de niveles completados por el usuario actual: `[1, 2, 5, ...]`.

### 8. Consultar Ranking Global
- **Método**: `GET`
- **Ruta**: `/ranking`
- **Respuesta (200)**: Lista ordenada de usuarios junto con el número total de niveles completados por cada uno.

### 9. Enviar Mensaje de Contacto (Público / Autenticado)
- **Métodos**: 
  - `POST` / `/contact/guest` (Para usuarios no registrados. Requiere `email_guest` y `comment`).
  - `POST` / `/contact/:userRole` (Para usuarios registrados. Requiere token en cabecera y `comment`).

### 10. Operaciones de Administración (Solo Administrador)
- `GET /contact`: Devuelve el buzón con todos los mensajes de contacto.
- `GET /list`: Lista todos los usuarios registrados.
- `PUT /list/:id/role`: Cambia el rol de un usuario (`user`, `editor` o `admin`).
- `DELETE /list/:id`: Elimina a cualquier usuario por su ID de base de datos.

---

## 📖 Módulo de Aprendizaje (`/api/learn`)

Rutas para la navegación de contenidos didácticos y simulación en vivo de código.

### 1. Listar Cursos
- **Método**: `GET`
- **Ruta**: `/courses`
- **Respuesta**: Lista de todos los cursos disponibles (HTML, CSS, JS, etc.).

### 2. Módulos de un Curso
- **Método**: `GET`
- **Ruta**: `/modules/:courseId`

### 3. Niveles de un Módulo
- **Método**: `GET`
- **Ruta**: `/levels/:moduleId`

### 4. Contenido de una Lección
- **Método**: `GET`
- **Ruta**: `/lesson/:levelId`
- **Respuesta**: Título, cuerpo explicativo de la lección, código de base e idioma/tecnología del código.

### 5. Registrar Nivel Completado
- **Método**: `POST`
- **Ruta**: `/progress/:levelId`
- **Respuesta**: Almacena el progreso del usuario actual.

### 6. Sandbox / Ejecución de Código en Servidor
- **Método**: `POST`
- **Ruta**: `/run`
- **Cuerpo (JSON)**:
  ```json
  {
    "code": "SELECT * FROM users;",
    "lang": "sql"
  }
  ```
- **Respuesta**: Salida de consola estructurada en texto plano o filas/columnas formateadas para base de datos.

---

## 🛠️ Módulo de Edición (`/api/edit`)

Rutas protegidas para **editores** y **administradores** destinadas al mantenimiento del currículo académico.

### 1. Gestión de Cursos
- `GET /edit/courses`: Listar todos los cursos.
- `POST /edit/courses`: Crear un nuevo curso.
- `PUT /edit/courses/:courseId`: Modificar el nombre de un curso.
- `DELETE /edit/courses/:courseId`: Eliminar curso e hijos en cascada.

### 2. Gestión de Módulos (Temas)
- `GET /edit/modules/:courseId`: Obtener módulos asociados a un curso.
- `POST /edit/modules/:courseId`: Añadir un módulo al curso.
- `PUT /edit/modules/:moduleId`: Editar nombre de un módulo.
- `DELETE /edit/modules/:moduleId`: Eliminar módulo.

### 3. Gestión de Niveles (Lecciones)
- `GET /edit/levels/:moduleId`: Obtener niveles de un módulo.
- `POST /edit/levels/:moduleId`: Crear un nuevo nivel vacío (autoincrementando el número).
- `PUT /edit/levels/swap/:moduleId`: Intercambiar la posición y orden secuencial entre dos niveles del mismo módulo.
- `DELETE /edit/levels/:levelId`: Eliminar nivel.

### 4. Gestión del Contenido de Lecciones
- `GET /edit/lesson/:levelId`: Obtener el texto, código inicial y lenguaje de una lección.
- `POST /edit/lesson/:levelId`: Guardar o actualizar los datos del contenido de la lección.
