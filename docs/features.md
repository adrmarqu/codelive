# ✨ Funcionalidades del Producto — CodeLive

Este documento describe en detalle cada una de las funcionalidades visibles para el usuario en la plataforma **CodeLive**, organizadas por área de la aplicación.

---

## 🏠 Landing Page y Navegación General

### Hero Section
La página de inicio presenta una visión clara de la propuesta de valor: aprender a programar de forma interactiva. Incluye una llamada a la acción para registrarse o explorar los cursos disponibles.

### Barra de Navegación
- Acceso rápido a las secciones principales: Inicio, Dashboard, Ranking, Perfil.
- Selector de idioma en tiempo real (ES / EN / CA) sin recargar la página.
- Indicador de sesión: muestra el nombre de usuario si está autenticado o botones de Login/Registro en caso contrario.

---

## 🔐 Autenticación y Gestión de Cuenta

### Registro de Usuario
- Formulario con validación en cliente y servidor: nombre de usuario único, email válido, contraseñas coincidentes y de longitud mínima.
- Al registrarse, el usuario recibe automáticamente el rol `user` y queda autenticado con un JWT.

### Inicio de Sesión
- Autenticación por email y contraseña.
- El token JWT se almacena en `localStorage` y se envía en cada petición protegida.

### Recuperación de Contraseña
- El usuario solicita un enlace de recuperación introduciendo su email.
- Se genera un token temporal único que caduca en un tiempo determinado.
- El token se valida antes de permitir el cambio de contraseña.

### Gestión del Perfil
Desde la página de perfil, el usuario puede:
- **Cambiar el nombre de usuario** visible en el ranking.
- **Cambiar el email** de su cuenta.
- **Cambiar la contraseña** (requiere confirmar la contraseña actual).
- **Eliminar la cuenta** de forma permanente (con confirmación explícita).

---

## 📚 Sistema de Aprendizaje

### Catálogo de Cursos
- Lista de todos los cursos disponibles con su nombre y tecnología asociada (HTML, CSS, JS, PHP, Node.js, SQL).
- Cada curso muestra visualmente el progreso del usuario (porcentaje de lecciones completadas).

### Módulos y Niveles
- Al entrar en un curso, se despliega su estructura en módulos temáticos.
- Cada módulo contiene un conjunto ordenado de niveles (lecciones numeradas).
- Los niveles completados se marcan visualmente para facilitar la navegación.

### Página de Lección
Cada lección tiene una estructura fija de dos partes:

#### 1. Bloque Teórico
- Título de la lección.
- Contenido explicativo en texto enriquecido con ejemplos de código con resaltado de sintaxis.
- Explicación paso a paso del concepto a aprender.

#### 2. Editor de Código Interactivo ("Try It Yourself")
- Editor de código con resaltado de sintaxis para la tecnología de la lección.
- Código de partida pre-cargado para que el alumno pueda empezar a modificar directamente.
- **Botón "Ejecutar"**: lanza el código y muestra el resultado.
- **Panel de Salida**: renderiza el HTML/CSS/JS en un iframe aislado, o muestra el output de consola / filas de SQL en tabla formateada.
- **Botón "Completar Lección"**: registra la lección como completada en la cuenta del usuario y desbloquea la siguiente.

---

## 🏆 Progreso y Ranking

### Panel de Progreso Personal
- Vista global del porcentaje de avance en cada curso.
- Número total de lecciones completadas.

### Ranking Global
- Tabla con los usuarios ordenados por número de lecciones completadas.
- Destaca la posición del usuario actual en la clasificación.
- Se actualiza en tiempo real con cada lección completada.

---

## 🛠️ Panel de Edición de Contenidos (Editor / Admin)

Accesible solo para usuarios con rol `editor` o `admin`. Permite mantener el currículo académico sin necesidad de acceder al código fuente.

### Gestión de Cursos
- Crear un nuevo curso con nombre y tecnología asociada.
- Editar el nombre de un curso existente.
- Eliminar un curso (con borrado en cascada de todos sus módulos, lecciones y contenidos).

### Gestión de Módulos
- Añadir módulos temáticos a un curso.
- Editar el nombre de un módulo.
- Eliminar un módulo.

### Gestión de Niveles (Lecciones)
- Crear nuevos niveles dentro de un módulo (se numeran automáticamente).
- **Reordenar niveles**: intercambiar la posición de dos lecciones en el módulo con un solo clic.
- Eliminar un nivel.

### Editor de Contenido de Lección
- Editor visual para el título y el cuerpo teórico de la lección.
- Campo para el código de partida del playground.
- Selector de lenguaje/tecnología del código.
- Guardado y actualización en tiempo real.

---

## 👑 Panel de Administración (Solo Admin)

### Lista de Usuarios
- Tabla con todos los usuarios registrados: nombre, email, rol y fecha de registro.
- **Cambiar el rol** de cualquier usuario (`user`, `editor`, `admin`) con un menú desplegable.
- **Eliminar** a cualquier usuario de la plataforma.

### Buzón de Mensajes de Contacto
- Lista cronológica de todos los mensajes recibidos a través del formulario de contacto.
- Distingue entre mensajes de usuarios registrados y mensajes de invitados (con email de contacto).

---

## 📬 Formulario de Contacto

Disponible para todos los visitantes (autenticados o no):
- Los usuarios **invitados** deben indicar su email de contacto.
- Los usuarios **registrados** envían el mensaje asociado automáticamente a su cuenta.
- Los mensajes se almacenan en la base de datos y son visibles desde el panel de administración.

---

## 🌐 Internacionalización (i18n)

- Todo el texto de la interfaz está externalizado en archivos de traducción JSON.
- El usuario puede cambiar el idioma desde cualquier página sin perder su estado de navegación.
- Las traducciones se cargan de forma lazy para no penalizar el rendimiento inicial.

---

© 2026 CodeLive. Todos los derechos reservados.
