# 🤝 Guía de Contribución — CodeLive

¡Gracias por tu interés en contribuir a **CodeLive**! Este documento describe las convenciones, flujo de trabajo y buenas prácticas para colaborar en el proyecto de forma efectiva y ordenada.

---

## 📋 Antes de Empezar

1. **Lee la documentación**: Familiarízate con la [arquitectura del sistema](./architecture.md), el [esquema de base de datos](./database_schema.md) y la [guía de inicio rápido](./getting_started.md).
2. **Abre un issue primero**: Para cambios significativos (nuevas funcionalidades, refactorizaciones grandes), abre un issue en el repositorio para discutir el enfoque antes de escribir código.
3. **Asegúrate de tener el entorno local funcionando**: Sigue la [guía de inicio rápido](./getting_started.md) para levantar el proyecto.

---

## 🔀 Flujo de Trabajo con Git

### 1. Fork y Clone

```bash
# Haz fork del repositorio desde GitHub
# Luego clona tu fork localmente
git clone https://github.com/<tu-usuario>/codelive.git
cd codelive

# Añade el repositorio original como remote "upstream"
git remote add upstream https://github.com/<org>/codelive.git
```

### 2. Sincronizar con Upstream

Antes de empezar a trabajar, asegúrate de tener la última versión de `main`:

```bash
git checkout main
git fetch upstream
git merge upstream/main
```

### 3. Crear una Rama de Trabajo

Nombra las ramas de forma descriptiva siguiendo este esquema:

```
<tipo>/<descripcion-corta-en-kebab-case>
```

| Tipo | Cuándo usarlo |
|------|---------------|
| `feat/` | Nueva funcionalidad |
| `fix/` | Corrección de un bug |
| `docs/` | Cambios solo en documentación |
| `refactor/` | Mejora de código sin cambio de comportamiento |
| `style/` | Cambios de formato, espaciado, etc. |
| `test/` | Añadir o modificar tests |
| `chore/` | Tareas de mantenimiento (deps, CI, config) |

**Ejemplos:**
```bash
git checkout -b feat/validacion-codigo-alumno
git checkout -b fix/error-login-email-mayusculas
git checkout -b docs/ampliar-api-endpoints
```

### 4. Commits

Usamos el estándar **Conventional Commits**. Cada mensaje de commit debe seguir este formato:

```
<tipo>(<ámbito opcional>): <descripción en imperativo y minúscula>

[cuerpo opcional — explica el "por qué", no el "qué"]

[pie opcional — refs a issues: "Closes #123"]
```

**Ejemplos de commits válidos:**
```
feat(auth): añadir flujo de recuperación de contraseña
fix(ranking): corregir orden incorrecto cuando hay empate de puntuación
docs(api): documentar endpoint POST /api/learn/run
refactor(backend): extraer lógica de validación JWT a middleware propio
chore(deps): actualizar express a v5.1.0
```

### 5. Pull Request

1. Haz push de tu rama a tu fork:
   ```bash
   git push origin feat/mi-nueva-funcionalidad
   ```
2. Abre un **Pull Request** contra la rama `main` del repositorio original.
3. Rellena la plantilla del PR:
   - **¿Qué cambia?** Descripción del cambio.
   - **¿Por qué?** Motivación o issue relacionado.
   - **¿Cómo probarlo?** Pasos para que el revisor pueda verificar el cambio.
   - **Checklist**: Marca las casillas correspondientes.
4. Solicita revisión a un mantenedor.

---

## 🏗️ Estructura del Código

### Backend (`sources/backend/src/`)

```
config/       # Configuración de DB y JWT — solo inicialización, sin lógica de negocio
controllers/  # Un archivo por recurso; aquí va la lógica de cada endpoint
middleware/   # Filtros reutilizables (protect, restrictTo)
models/       # Funciones que ejecutan consultas SQL — sin lógica HTTP
routes/       # Definición de rutas y qué middleware/controller invocan
seed/         # Script de inicialización de datos de prueba
```

**Convención**: Cada módulo de la API (auth, user, learn, edit) tiene su propio archivo en `routes/`, `controllers/` y `models/`. Si añades un nuevo módulo, sigue la misma estructura.

### Frontend (`sources/frontend/src/`)

```
components/   # Componentes reutilizables y atómicos (botones, inputs, cards...)
pages/        # Componentes de página (un directorio por sección)
services/     # Clientes Axios para cada módulo de la API
routes/       # Configuración de react-router-dom y guardas de rutas
i18n/         # Configuración de i18next
```

**Convención**: Los componentes usan PascalCase. Los archivos de servicios y utilidades usan camelCase.

---

## ✍️ Convenciones de Código

### General
- **Idioma del código**: Los nombres de variables, funciones, clases y comentarios de código deben estar en **inglés**.
- **Idioma de la documentación**: Los documentos en `docs/` están en **español**.
- **Sin código comentado**: No dejes bloques de código comentados en los commits. Usa Git para el historial.

### JavaScript / Node.js (Backend)
- Sintaxis **CommonJS** (`require` / `module.exports`) — no usar ES Modules en el backend.
- Usa `async/await` para operaciones asíncronas. Evita callbacks anidados.
- Valida siempre las entradas del usuario antes de procesarlas.
- Centraliza los errores HTTP en el controller usando los códigos de estado correctos:
  - `400` Bad Request, `401` Unauthorized, `403` Forbidden, `404` Not Found, `500` Internal Server Error.

### React / JavaScript (Frontend)
- **Componentes funcionales** con hooks. No usar componentes de clase.
- Un componente por archivo.
- Las llamadas a la API van **siempre** en `services/`, nunca directamente en los componentes.
- Usa el hook `useTranslation` de i18next para todos los textos visibles. No escribas strings hardcodeados en los componentes.

### CSS
- Estilos en archivos `.css` o `.module.css` junto al componente. Evita estilos inline salvo para valores dinámicos.
- Usa variables CSS para colores y tamaños del design system.

### SQL
- Usa **parámetros preparados** (`$1, $2, ...`) siempre que el valor venga del usuario. Nunca concatenes strings SQL.

---

## 🧪 Testing

Actualmente el proyecto no tiene tests automatizados (es un punto del roadmap). Si añades tests:

- **Backend**: usa **Jest** o **Vitest** con supertest para tests de integración.
- **Frontend**: usa **Vitest** con React Testing Library.
- Los tests deben colocarse en un directorio `__tests__/` junto al código que prueban.

---

## 📝 Documentación

Si tu cambio añade o modifica funcionalidades:

- Actualiza el documento relevante en `docs/` (API, arquitectura, schema, features...).
- Si añades un nuevo endpoint, documéntalo en [`api_endpoints.md`](./api_endpoints.md).
- Si modificas el esquema de base de datos, actualiza [`database_schema.md`](./database_schema.md).

---

## 🤔 Preguntas

Si tienes dudas, abre un **issue** en el repositorio con la etiqueta `question` o contacta con el equipo de mantenimiento a través del formulario de la plataforma.

---

© 2026 CodeLive. Todos los derechos reservados.
