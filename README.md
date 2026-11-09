# CodeLive - Interactive Programming Learning Platform

CodeLive is an interactive, gamified web platform designed to teach programming languages including HTML, CSS, JavaScript, PHP, Node.js, and SQL. It provides structured learning modules, progressive difficulty levels, automated code evaluations, competitive rankings, and detailed student progress tracking. The platform includes a full-featured administration dashboard, course editor, role-based access control, and multi-language support.

# Prerequisites

Before setting up CodeLive, ensure you have the following installed:

- Docker Desktop and Docker Compose (recommended for full-stack local execution)
- Node.js (v18.0.0 or higher) and npm (v9.0.0 or higher)
- GNU Make
- PostgreSQL (v16 or higher, if running backend without Docker)

# Configuration

1. Clone the repository:
```bash
git clone https://github.com/adrmarqu/codelive.git
cd codelive
```

2. Configure backend environment variables:
Copy the example environment configuration:
```bash
cp sources/backend/.env.example sources/backend/.env
```
Edit sources/backend/.env with your settings:
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://admin:admin@localhost:5432/codelive_db
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=localhost
DB_NAME=codelive_db
DB_PORT=5432
JWT_SECRET=your_super_secret_jwt_key
CORS_ORIGINS=http://localhost:80,http://localhost:5173
```

3. Configure frontend environment variables:
Create sources/frontend/.env.local if custom endpoints are needed:
```env
VITE_API_URL=http://localhost:3000
```

# Execution

### Running with Docker (Recommended)

Build and launch all services:
```bash
make build
```

Seed the database with default administrator and editor accounts:
```bash
make seed
```

Access the application services in your browser:
- Frontend Web App: http://localhost:80
- Backend REST API: http://localhost:3000
- pgAdmin Interface: http://localhost:8080

Stop all running containers:
```bash
make down
```

### Running Locally without Docker

1. Start PostgreSQL and apply the schema:
```bash
psql -U admin -d codelive_db -f sources/db/init.sql
```

2. Start the backend API:
```bash
cd sources/backend
npm install
npm run dev
```

3. Start the frontend SPA:
```bash
cd sources/frontend
npm install
npm run dev
```
Navigate to http://localhost:5173 in your browser.

# Project Structure

```
codelive/
├── Makefile                 # Docker orchestration shortcuts
├── render.yaml              # Render cloud infrastructure blueprint
├── docs/                    # System documentation and component guides
└── sources/
    ├── docker-compose.yml   # Multi-container local stack definition
    ├── db/
    │   └── init.sql         # PostgreSQL schema definition and tables
    ├── frontend/            # React 19 + Vite single page application
    │   ├── vercel.json      # Vercel routing configuration
    │   ├── Dockerfile       # Nginx production container build
    │   ├── package.json     # Frontend dependencies and scripts
    │   └── src/
    │       ├── components/  # Reusable UI components
    │       ├── pages/       # Route view components
    │       ├── services/    # Axios HTTP API services
    │       ├── routes/      # Application route definitions
    │       └── i18n/        # Internationalization dictionaries
    └── backend/             # Node.js + Express 5 REST API
        ├── Dockerfile       # Production Node.js container
        ├── package.json     # Backend dependencies and scripts
        ├── .env.example     # Environment template
        └── src/
            ├── config/      # Database and JWT configurations
            ├── controllers/ # HTTP route controllers
            ├── middleware/  # JWT authentication and RBAC guards
            ├── models/      # PostgreSQL query wrappers
            ├── routes/      # Express API routers
            └── seed/        # Database population scripts
```

# Commands and Scripts

### Makefile Targets

- make build: Build all container images and start the services
- make up: Start containers without rebuilding
- make down: Stop and remove running containers
- make logs: Follow live container output in real time
- make restart: Restart all running service containers
- make clean: Stop containers and wipe database volumes
- make seed: Insert default courses, exercises, and admin accounts

### Frontend Scripts (sources/frontend)

- npm run dev: Start Vite local development server with hot reload
- npm run build: Compile TypeScript and build production bundle
- npm run lint: Run ESLint across frontend sources
- npm run preview: Locally preview the production build

### Backend Scripts (sources/backend)

- npm run dev: Start Express API server in development mode
- npm start: Start Express API server in production mode

# Features

- Interactive Gamified Learning: Bite-sized coding lessons across HTML, CSS, JavaScript, PHP, Node.js, and SQL.
- Real-Time Progress: Level tracking, experience points, and competitive global leaderboard.
- Role-Based Access Control: Granular permissions for guest, user, editor, and admin roles.
- Content Management: In-app editor to create and reorder courses, modules, and coding exercises.
- Internationalization: Multi-language support for Spanish, English, and Catalan via i18next.

# Author Details

Author: Adrià Márquez Nebot
Github: https://github.com/adrmarqu
LinkedIn: https://www.linkedin.com/in/adria-marquez
Portfolio: https://adrmarqu.github.io
