# 🗺️ Roadmap de CodeLive

Este documento describe el estado actual del proyecto y las funcionalidades planeadas para futuras versiones. Se organiza en fases de desarrollo.

---

## ✅ Versión Actual — v1.0 (Completado)

Las siguientes funcionalidades están implementadas y en producción:

### Core de la Plataforma
- [x] Sistema de autenticación completo (registro, login, JWT)
- [x] Recuperación de contraseña con token temporal
- [x] Gestión de perfil de usuario (cambio de username, email, password, eliminación de cuenta)
- [x] Sistema de roles: `guest`, `user`, `editor`, `admin`
- [x] Control de acceso basado en roles (RBAC) en frontend y backend

### Contenido y Aprendizaje
- [x] Estructura jerárquica de contenidos: Cursos → Módulos → Niveles
- [x] Lecciones con bloque teórico y editor de código interactivo
- [x] Sandbox de ejecución en cliente (HTML, CSS, JavaScript con iframe aislado)
- [x] Sandbox de ejecución en servidor (SQL con respuesta tabular)
- [x] Registro de progreso por usuario y lección
- [x] Ranking global por lecciones completadas

### Panel de Edición
- [x] CRUD completo de cursos, módulos y niveles
- [x] Editor de contenido de lecciones (título, teoría, código base, lenguaje)
- [x] Reordenamiento de niveles dentro de un módulo

### Administración
- [x] Lista de usuarios con cambio de rol y eliminación
- [x] Buzón de mensajes de contacto (usuarios registrados e invitados)

### Infraestructura
- [x] Entorno de desarrollo con Docker Compose
- [x] Despliegue en Vercel (frontend) y Render (backend + DB)
- [x] Internacionalización con i18next (ES / EN / CA parcial)
- [x] Esquema de base de datos relacional en PostgreSQL 16

---

## 🚧 En Progreso — v1.1

- [ ] **Traducción completa al Catalán (`ca`)** — Los archivos de i18n están preparados, pendiente de completar el contenido.
- [ ] **Lecciones de PHP y Node.js en el sandbox** — La arquitectura de `/api/learn/run` está preparada, pendiente de la integración de los intérpretes.
- [ ] **Mejoras de accesibilidad (a11y)** — Revisión de contraste, navegación por teclado y roles ARIA.

---

## 📋 Planificado — v1.2

### Mejoras de Aprendizaje
- [ ] **Sistema de "pistas"**: El alumno puede solicitar una ayuda paso a paso si se queda bloqueado en una lección, sin ver la solución completa.
- [ ] **Validación automática de código**: Comprobar si el código del alumno produce el resultado esperado (tests automatizados por lección).
- [ ] **Lecciones de revisión**: Lecciones de repaso generadas automáticamente a partir de los temas donde el alumno ha tenido más dificultades.
- [ ] **Certificados de finalización**: Generación y descarga de un certificado al completar un curso.

### Mejoras de Gamificación
- [ ] **Sistema de logros (badges)**: Medallas por hitos (primera lección, completar un módulo, posición en ranking, racha de días).
- [ ] **Rachas diarias**: Contador de días consecutivos con al menos una lección completada.
- [ ] **Niveles de experiencia (XP)**: Los alumnos suben de nivel global a medida que acumulan XP.

### Mejoras de Comunidad
- [ ] **Foro o sección de preguntas por lección**: Los alumnos pueden dejar dudas y comentarios en cada lección.
- [ ] **Valoración de lecciones**: Sistema de like/dislike para identificar lecciones con contenido mejorable.

---

## 🔭 Visión a Largo Plazo — v2.0

- [ ] **Rutas de aprendizaje personalizadas**: El sistema sugiere el siguiente curso o módulo según el perfil y progreso del alumno.
- [ ] **Editor colaborativo en tiempo real**: Varios usuarios pueden editar y ejecutar código en la misma sesión simultáneamente (tipo CodePen Live).
- [ ] **Integración con GitHub**: El alumno puede importar o exportar sus proyectos de prácticas directamente a un repositorio.
- [ ] **API pública**: Exponer una API documentada (OpenAPI/Swagger) para que terceros puedan integrar o extender la plataforma.
- [ ] **Sistema de migraciones de base de datos**: Adoptar una herramienta formal (como `node-pg-migrate`) para gestionar cambios de esquema de forma segura.
- [ ] **App móvil**: Aplicación nativa (React Native) para iOS y Android, con modo offline para leer lecciones sin conexión.
- [ ] **Soporte multitenancy**: Permitir a instituciones educativas crear sus propios catálogos de cursos privados bajo la misma plataforma.

---

## 🐛 Bugs Conocidos y Mejoras Técnicas Pendientes

| Prioridad | Descripción |
|-----------|-------------|
| 🔴 Alta | Los servicios gratuitos de Render entran en "sleep" — considerar plan de pago o implementar un "keep-alive" periódico. |
| 🟡 Media | La validación del lado del cliente podría ser más robusta con una librería como `zod` o `yup`. |
| 🟡 Media | Implementar rate limiting en los endpoints de autenticación para prevenir ataques de fuerza bruta. |
| 🟢 Baja | Añadir tests automatizados (unitarios e integración) para el backend con Jest o Vitest. |
| 🟢 Baja | Configurar un pipeline de CI (GitHub Actions) que ejecute los tests en cada PR. |

---

© 2026 CodeLive. Todos los derechos reservados.
