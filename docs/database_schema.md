# Esquema de Base de Datos — CodeLive

Este documento describe la base de datos relacional de **CodeLive**, implementada en PostgreSQL 16. El esquema inicial y los datos semilla se definen en [init.sql](file:///Users/adria/Desktop/42Barcelona/codelive/sources/db/init.sql).

La base de datos de la página web está en render.

---

## 📊 Tipos de Datos Personalizados (ENUM)

### 1. `user_rol`
Define los niveles de acceso de los usuarios del sistema:
- `'user'`: Perfil por defecto de estudiante.
- `'editor'`: Permisos de edición de lecciones y cursos.
- `'admin'`: Permisos de administración total del sistema.

### 2. `prog_lang`
Define las tecnologías soportadas para la ejecución e interactividad de código:
- `'html'`, `'css'`, `'js'`, `'php'`, `'node'`, `'sql'`

---

## 🗄️ Diccionario de Tablas

### 1. `users`
Almacena las credenciales y el rol de cada usuario registrado.
- `id` (SERIAL, PK): Identificador único autoincremental.
- `username` (VARCHAR(50), UNIQUE, NOT NULL): Nombre visible de usuario.
- `email` (VARCHAR(100), UNIQUE, NOT NULL): Correo electrónico.
- `password_hash` (VARCHAR(255), NOT NULL): Hash Bcrypt de la contraseña.
- `rol` (user_rol, Default `'user'`): Rol del usuario.
- `created_at` (TIMESTAMPTZ, Default `CURRENT_TIMESTAMP`): Fecha y hora de registro.

### 2. `courses`
Define los cursos temáticos de la plataforma (por ejemplo: HTML, CSS, JavaScript).
- `id` (SERIAL, PK): Identificador único del curso.
- `name` (VARCHAR(50), UNIQUE, NOT NULL): Nombre único del curso.

### 3. `modules`
Representa los bloques temáticos o capítulos que componen un curso.
- `id` (SERIAL, PK): Identificador del módulo.
- `name` (VARCHAR(150), NOT NULL): Nombre del módulo.
- `id_course` (INT, FK -> `courses.id`, ON DELETE CASCADE): Curso al que pertenece.
- *Clave única compuesta*: `UNIQUE(name, id_course)` (no puede haber dos módulos con el mismo nombre en el mismo curso).

### 4. `lessons`
Representa las lecciones o niveles numerados dentro de un módulo.
- `id` (SERIAL, PK): Identificador de la lección.
- `level` (INT, NOT NULL): Secuencia/Número de lección (ej: 1, 2, 3).
- `id_module` (INT, FK -> `modules.id`, ON DELETE CASCADE): Módulo al que pertenece.
- *Clave única compuesta*: `UNIQUE(id_module, level)` (no puede haber dos niveles número 1 en el mismo módulo).

### 5. `lesson_content`
Contiene la teoría, el código de partida y la información técnica asociada a una lección.
- `id` (SERIAL, PK): Identificador único del contenido.
- `id_lesson` (INT, UNIQUE, FK -> `lessons.id`, ON DELETE CASCADE): Lección a la que se asocia.
- `title` (VARCHAR(100), NOT NULL): Título de la lección.
- `content` (TEXT, NOT NULL): Contenido textual / Explicación teórica.
- `code` (TEXT, Nullable): Código de partida para el playground interactivo.
- `code_lang` (prog_lang, Nullable): Tecnología de dicho código.
- *Restricción (CHECK constraint)*: `chk_code_lang` — Asegura que si hay código definido, debe haber un lenguaje asociado, y viceversa.

### 6. `progress`
Registra qué lecciones ha completado satisfactoriamente cada alumno.
- `id` (SERIAL, PK): Identificador único de progreso.
- `id_user` (INT, FK -> `users.id`, ON DELETE CASCADE): Alumno.
- `id_lesson` (INT, FK -> `lessons.id`, ON DELETE CASCADE): Lección completada.
- `completed_at` (TIMESTAMPTZ, Default `CURRENT_TIMESTAMP`): Momento de finalización.
- *Clave única compuesta*: `UNIQUE(id_user, id_lesson)`.

### 7. `contact`
Almacena las sugerencias o preguntas enviadas por los usuarios.
- `id` (SERIAL, PK): Identificador del mensaje.
- `id_user` (INT, FK -> `users.id`, ON DELETE CASCADE, Nullable): Usuario registrado (si estaba logueado).
- `email_guest` (VARCHAR(100), Nullable): Correo en caso de ser un mensaje anónimo/invitado.
- `comment` (TEXT, NOT NULL): Contenido del mensaje.
- `send_at` (TIMESTAMPTZ, Default `CURRENT_TIMESTAMP`).
- *Restricción (CHECK constraint)*: `chk_contact_author` — Garantiza que el mensaje tiene o bien un autor registrado (`id_user`), o bien un correo electrónico de contacto (`email_guest`), pero no ambos ni ninguno.

### 8. `password_resets`
Tokens temporales para la recuperación y cambio de contraseñas.
- `id` (SERIAL, PK): Identificador único.
- `id_user` (INT, FK -> `users.id`, ON DELETE CASCADE): Usuario que solicitó restablecer.
- `token` (VARCHAR(255), UNIQUE, NOT NULL): Hash seguro enviado al usuario.
- `expires_at` (TIMESTAMPTZ, NOT NULL): Caducidad del token.
- `used` (BOOLEAN, Default `FALSE`).
- `created_at` (TIMESTAMPTZ, Default `CURRENT_TIMESTAMP`).

### 9. `session`
Almacenamiento nativo de sesiones express para el control de autenticación estatal (por `connect-pg-simple`).
- `sid` (VARCHAR, PK): Identificador de sesión.
- `sess` (JSON, NOT NULL): Datos serializados.
- `expire` (TIMESTAMPTZ(6), NOT NULL): Tiempo de caducidad.

---

## ⚡ Índices de Rendimiento

Para optimizar las consultas comunes y las relaciones JOIN en las operaciones del día a día, se han definido los siguientes índices explícitos:

- `idx_modules_course` en `modules(id_course)` (Cargar temarios de un curso).
- `idx_lessons_module` en `lessons(id_module)` (Listar lecciones de un módulo).
- `idx_lesson_content_lesson` en `lesson_content(id_lesson)` (Acceder a la teoría de una lección).
- `idx_progress_user` en `progress(id_user)` (Calcular porcentaje de avance o ranking).
- `idx_progress_lesson` en `progress(id_lesson)` (Saber qué alumnos han completado una lección concreta).
- `idx_password_resets_token` en `password_resets(token)` (Validación instantánea del token de correo).
- `idx_password_resets_user` en `password_resets(id_user)`.
- `IDX_session_expire` en `session(expire)` (Limpieza automática de sesiones caducadas).
