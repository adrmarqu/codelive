# 📚 Documentación de CodeLive

> **CodeLive** es una plataforma web interactiva y gamificada para el aprendizaje de programación web, diseñada para que cualquier persona pueda aprender HTML, CSS, JavaScript, PHP, Node.js y SQL de forma progresiva, práctica y motivadora.

🌐 **Aplicación en producción**: [https://codelive-pvo7.vercel.app/](https://codelive-pvo7.vercel.app/)

---

## 🎯 Objetivos del Proyecto

CodeLive nació con una misión clara: **democratizar el aprendizaje de la programación web** eliminando las barreras de entrada habituales (entornos complejos, curvas de aprendizaje abruptas, falta de feedback inmediato). Los objetivos principales son:

### 1. 🧠 Aprendizaje Progresivo y Estructurado
Ofrecer un currículo organizado en **cursos → módulos → niveles**, de manera que el alumno avance desde los fundamentos hasta conceptos avanzados sin saltos bruscos. Cada lección incluye explicación teórica y un entorno interactivo donde aplicar lo aprendido al instante.

### 2. ⚡ Feedback Inmediato sin Configuración
El estudiante no necesita instalar ningún entorno local. Gracias al **sandbox de código integrado**, puede ejecutar HTML, CSS y JavaScript directamente en el navegador, y enviar SQL o Node.js al servidor para ver la respuesta en tiempo real, todo dentro de la misma plataforma.

### 3. 🎮 Gamificación como Motor de Motivación
Cada lección completada suma puntos y posiciones en el **ranking global**. El progreso queda guardado en la cuenta del usuario, permitiendo retomar en cualquier momento y en cualquier dispositivo, fomentando la constancia y la competición sana entre alumnos.

### 4. 🌍 Accesibilidad e Internacionalización
La plataforma soporta múltiples idiomas (**Español, Inglés y Catalán**) para llegar al mayor número posible de estudiantes. La interfaz es responsive y funciona correctamente en dispositivos móviles y de escritorio.

### 5. 🛡️ Sistema de Roles y Gestión de Contenidos
Cualquier miembro del equipo docente puede actuar como **editor** y crear o actualizar lecciones directamente desde la plataforma, sin tocar código. Los **administradores** tienen visibilidad completa de usuarios, progresos y mensajes de contacto.

### 6. 🏗️ Arquitectura Escalable y Desplegable
El proyecto está diseñado para correr tanto en local con Docker como en producción en Vercel + Render, con separación total entre frontend y backend, facilitando el mantenimiento independiente de ambas capas.

---

## 🗂️ Índice de la Documentación

| Documento | Descripción |
|-----------|-------------|
| 📖 **[Inicio Rápido](./getting_started.md)** | Cómo levantar el proyecto en local (Docker o nativo) |
| 🏛️ **[Arquitectura del Sistema](./architecture.md)** | Diseño técnico, capas, roles y sistema de ejecución de código |
| 🗄️ **[Esquema de Base de Datos](./database_schema.md)** | Tablas, relaciones, índices y tipos personalizados de PostgreSQL |
| 🔌 **[Referencia de la API REST](./api_endpoints.md)** | Todos los endpoints organizados por módulo (Auth, User, Learn, Edit) |
| ✨ **[Funcionalidades del Producto](./features.md)** | Descripción detallada de cada feature visible por el usuario |
| 🚀 **[Guía de Despliegue](./deployment.md)** | Despliegue completo en Vercel, Render y configuración de variables |
| 🗺️ **[Roadmap](./roadmap.md)** | Estado actual del proyecto y funcionalidades planeadas |
| 🤝 **[Guía de Contribución](./contributing.md)** | Convenciones de código, flujo de trabajo con Git y buenas prácticas |

---

## 🏗️ Stack Tecnológico (Resumen)

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React + Vite | 19 / 8 |
| Enrutamiento | react-router-dom | v7 |
| Backend | Node.js + Express | 5 (CommonJS) |
| Base de datos | PostgreSQL | 16 |
| Autenticación | JWT + bcrypt | — |
| i18n | i18next | ES / EN / CA |
| Contenedores | Docker + Docker Compose | — |
| Despliegue Frontend | Vercel | — |
| Despliegue Backend | Render | — |

---

## 👥 Roles del Sistema

| Rol | Descripción |
|-----|-------------|
| `guest` | Usuario no registrado. Puede ver el Home, realizar lecciones y contactar. |
| `user` | Alumno registrado. Accede a su perfil, progreso y ranking. |
| `editor` | Puede crear y editar cursos, módulos y lecciones. |
| `admin` | Control total: gestión de usuarios, buzón de contacto y edición. |

---

## 🌍 Idiomas Soportados

- 🇪🇸 **Español** (`es`) — Idioma predeterminado
- 🇬🇧 **Inglés** (`en`)
- 🇨🇦 **Catalán** (`ca`)

---

## 🔗 Enlaces Rápidos

- 🌐 [Aplicación en producción](https://codelive-pvo7.vercel.app/)
- 📦 [Repositorio en GitHub](https://github.com)
- 🐘 [Backend API en Render](https://render.com)

---

© 2026 CodeLive. Todos los derechos reservados.