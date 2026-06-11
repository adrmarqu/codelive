-- ============================================================
--  CodeLive — Database initialization script
--  Run this file to reset and seed the entire database.
--  WARNING: All existing data will be deleted.
-- ============================================================


-- ------------------------------------------------------------
--  1. DROP existing objects (tables and types)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS
    password_resets,
    progress,
    lesson_content,
    contact,
    lessons,
    modules,
    courses,
    users,
    "session"
CASCADE;

DROP TYPE IF EXISTS user_rol, prog_lang CASCADE;


-- ------------------------------------------------------------
--  2. ENUM types
-- ------------------------------------------------------------

-- Roles de usuario
CREATE TYPE user_rol AS ENUM ('user', 'editor', 'admin');

CREATE TYPE prog_lang AS ENUM ('html', 'css', 'js', 'php', 'node', 'sql');


-- ------------------------------------------------------------
--  3. TABLES
-- ------------------------------------------------------------

CREATE TABLE users
(
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50)  UNIQUE NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    rol             user_rol    DEFAULT 'user',
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─── Courses ────────────────────────────────────────────────
CREATE TABLE courses
(
    id      SERIAL PRIMARY KEY,
    name    VARCHAR(50) UNIQUE NOT NULL
);

-- ─── Modules (chapters inside a course) ─────────────────────
CREATE TABLE modules
(
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    id_course   INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    UNIQUE(name, id_course)
);

-- ─── Lessons (individual levels inside a module) ────────────
CREATE TABLE lessons
(
    id          SERIAL PRIMARY KEY,
    level       INT NOT NULL,
    id_module   INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,

    UNIQUE(id_module, level)
);

-- ─── Lesson content (the actual text, code and metadata) ────
CREATE TABLE lesson_content
(
    id          SERIAL PRIMARY KEY,
    id_lesson   INT UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title       VARCHAR(100) NOT NULL,
    content     TEXT NOT NULL,
    code        TEXT,
    code_lang   prog_lang,

    CONSTRAINT chk_code_lang CHECK (
        (code IS NULL AND code_lang IS NULL) OR
        (code IS NOT NULL AND code_lang IS NOT NULL)
    )
);

-- ─── Progress (which lessons a user has completed) ──────────
CREATE TABLE progress
(
    id              SERIAL PRIMARY KEY,
    id_user         INT NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    id_lesson       INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(id_user, id_lesson)
);

-- ─── Contact messages ───────────────────────────────────────
CREATE TABLE contact
(
    id              SERIAL PRIMARY KEY,
    id_user         INT REFERENCES users(id) ON DELETE CASCADE,
    email_guest     VARCHAR(100),
    comment         TEXT NOT NULL,
    send_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_contact_author CHECK (
        (id_user IS NOT NULL AND email_guest IS NULL) OR
        (id_user IS NULL     AND email_guest IS NOT NULL)
    )
);

-- ─── Password reset tokens ───────────────────────────────────
CREATE TABLE password_resets
(
    id          SERIAL PRIMARY KEY,
    id_user     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255) UNIQUE NOT NULL,
    expires_at  TIMESTAMPTZ NOT NULL,
    used        BOOLEAN     DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─── Session store (connect-pg-simple) ──────────────────────
CREATE TABLE IF NOT EXISTS "session"
(
    "sid"       VARCHAR        NOT NULL PRIMARY KEY,
    "sess"      JSON           NOT NULL,
    "expire"    TIMESTAMPTZ(6) NOT NULL
);


-- ------------------------------------------------------------
--  4. INDEXES
-- ------------------------------------------------------------

CREATE INDEX idx_modules_course          ON modules(id_course);
CREATE INDEX idx_lessons_module          ON lessons(id_module);
CREATE INDEX idx_lesson_content_lesson   ON lesson_content(id_lesson);
CREATE INDEX idx_progress_user           ON progress(id_user);
CREATE INDEX idx_progress_lesson         ON progress(id_lesson);
CREATE INDEX idx_password_resets_token   ON password_resets(token);
CREATE INDEX idx_password_resets_user    ON password_resets(id_user);
CREATE INDEX "IDX_session_expire"        ON "session"("expire");


-- ------------------------------------------------------------
--  5. SEED DATA
-- ------------------------------------------------------------

-- ─── Courses ────────────────────────────────────────────────
INSERT INTO courses (name) VALUES
    ('HTML'),
    ('CSS'),
    ('JavaScript'),
    ('PHP'),
    ('NodeJS'),
    ('PostgreSQL');


-- ─── Modules ────────────────────────────────────────────────
-- HTML (course id = 1)
INSERT INTO modules (name, id_course) VALUES
    ('Introducción',        1),
    ('Etiquetas básicas',   1),
    ('Formularios',         1),
    ('Multimedia',          1),
    ('HTML semántico',      1);

-- CSS (course id = 2)
INSERT INTO modules (name, id_course) VALUES
    ('Introducción',        2),
    ('Selectores',          2),
    ('Box Model',           2),
    ('Flexbox',             2),
    ('Grid',                2),
    ('Animaciones',         2);

-- JavaScript (course id = 3)
INSERT INTO modules (name, id_course) VALUES
    ('Introducción',        3),
    ('Variables y tipos',   3),
    ('Funciones',           3),
    ('DOM',                 3),
    ('Async / Await',       3),
    ('ES6+',                3);

-- PHP (course id = 4)
INSERT INTO modules (name, id_course) VALUES
    ('Introducción',        4),
    ('Variables y arrays',  4),
    ('Funciones',           4),
    ('Programación orientada a objetos', 4),
    ('PHP y MySQL',         4);

-- NodeJS (course id = 5)
INSERT INTO modules (name, id_course) VALUES
    ('Introducción',        5),
    ('Express',             5),
    ('API REST',            5),
    ('Autenticación',       5),
    ('WebSockets',          5);

-- MySQL (course id = 6)
INSERT INTO modules (name, id_course) VALUES
    ('Introducción',        6),
    ('SELECT',              6),
    ('INSERT, UPDATE y DELETE', 6),
    ('JOINs',               6),
    ('Índices y rendimiento', 6);


-- ─── Default admin / editor roles ───────────────────────────
-- These UPDATE statements run after users register via the app.
-- They are harmless if the users do not yet exist.
UPDATE users SET rol = 'admin'  WHERE username = 'admin';
UPDATE users SET rol = 'editor' WHERE username = 'editor';