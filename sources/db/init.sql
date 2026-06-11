DROP TABLE IF EXISTS password_resets, progress, content, lesson_content, contact, lessons, modules, courses, users, "session" CASCADE;
DROP TYPE IF EXISTS user_rol, lesson_type, lang_type, prog_lang CASCADE;

CREATE TYPE user_rol AS ENUM ('user', 'editor', 'admin');
CREATE TYPE prog_lang AS ENUM ('html', 'css', 'js', 'php', 'node', 'sql');

CREATE TABLE users
(
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50) UNIQUE NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    rol             user_rol DEFAULT 'user',
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses
(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE modules
(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    id_course       INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,

    UNIQUE(name, id_course)
);

CREATE TABLE lessons
(
    id              SERIAL PRIMARY KEY,
    level           INT NOT NULL, 
    id_module       INT NOT NULL REFERENCES modules(id) ON DELETE CASCADE,

    UNIQUE(id_module, level)
);

CREATE TABLE lesson_content
(
    id              SERIAL PRIMARY KEY,
    id_lesson       INT UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title           VARCHAR(50) NOT NULL,
    content         TEXT NOT NULL,
    code            TEXT,
    code_lang       prog_lang,

    CONSTRAINT chk_code_lang CHECK (
        (code IS NULL AND code_lang IS NULL) OR
        (code IS NOT NULL AND code_lang IS NOT NULL)
    )
);

CREATE TABLE progress
(
    id              SERIAL PRIMARY KEY,
    id_user         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    id_lesson       INT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(id_user, id_lesson)
);

CREATE TABLE contact
(
    id              SERIAL PRIMARY KEY,
    id_user         INT REFERENCES users(id) ON DELETE CASCADE,
    email_guest     VARCHAR(100),
    comment         TEXT NOT NULL,
    send_at         TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_contact_author CHECK (
        (id_user IS NOT NULL AND email_guest IS NULL) OR
        (id_user IS NULL AND email_guest IS NOT NULL)
    )
);

CREATE TABLE password_resets
(
    id              SERIAL PRIMARY KEY,
    id_user         INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token           VARCHAR(255) UNIQUE NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    used            BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_user ON password_resets(id_user);

CREATE INDEX idx_content_lesson_lang ON lesson_content(id_lesson);
CREATE INDEX idx_modules_course ON modules(id_course);
CREATE INDEX idx_lessons_module ON lessons(id_module);
CREATE INDEX idx_progress_user ON progress(id_user);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL PRIMARY KEY,
  "sess" json NOT NULL,
  "expire" timestamptz(6) NOT NULL
);

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

INSERT INTO courses (name) VALUES ('HTML'), ('CSS'), ('JavaScript');
INSERT INTO courses (name) VALUES ('PHP'), ('NodeJS'), ('MySQL');

UPDATE users SET rol = 'admin' WHERE username='admin';
UPDATE users SET rol = 'editor' WHERE username='editor';