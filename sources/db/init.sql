CREATE TYPE user_rol AS ENUM ('user', 'editor', 'admin');
CREATE TYPE lesson_type AS ENUM ('theory', 'game');
CREATE TYPE lang_type AS ENUM ('en', 'ca', 'es');
CREATE TYPE prog_lang AS ENUM ('html', 'css', 'js', 'php', 'node', 'sql');

CREATE TABLE users
(
    id              SERIAL PRIMARY KEY,
    username        VARCHAR(50) NOT NULL,
    email           VARCHAR(100) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    rol             user_rol DEFAULT 'user',
    active          BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    id_course       INT REFERENCES courses(id) ON DELETE CASCADE,

    UNIQUE(name, id_course)
);

CREATE TABLE lessons
(
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(150) NOT NULL,
    level           INT NOT NULL, 
    id_module       INT REFERENCES modules(id) ON DELETE CASCADE,

    UNIQUE(id_module, level),
    UNIQUE(id_module, name)
);

CREATE TABLE content
(
    id              SERIAL PRIMARY KEY,
    id_lesson       INT REFERENCES lessons(id) ON DELETE CASCADE,
    type            lesson_type NOT NULL,
    lang            lang_type NOT NULL,
    title           VARCHAR(50) NOT NULL
    content         TEXT NOT NULL,
    code            TEXT,
    code_language   prog_lang,

    UNIQUE (id_lesson, lang)
);

CREATE TABLE progress
(
    id              SERIAL PRIMARY KEY,
    id_user         INT REFERENCES users(id) ON DELETE CASCADE,
    id_lesson       INT REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(id_user, id_lesson)
);

CREATE TABLE contact
(
    id              SERIAL PRIMARY KEY,
    id_user         INT REFERENCES users(id) ON DELETE CASCADE,
    comment         TEXT NOT NULL,
    send_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_lesson_lang ON content(id_lesson, lang);
CREATE INDEX idx_modules_course ON modules(id_course);
CREATE INDEX idx_lessons_module ON lessons(id_module);
CREATE INDEX idx_progress_user ON progress(id_user);

CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL PRIMARY KEY,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

CREATE INDEX "IDX_session_expire" ON "session" ("expire");