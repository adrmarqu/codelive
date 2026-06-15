-- =============================================================================
--  CodeLive — Plantilla de Inserción de Contenidos (Módulos, Lecciones y Detalles)
--  Usa esta plantilla para añadir tus propios contenidos a la base de datos de CodeLive.
-- =============================================================================

-- -----------------------------------------------------------------------------
--  1. INSERCIÓN DE UN NUEVO MÓDULO (Capítulo)
-- -----------------------------------------------------------------------------
-- Para insertar un módulo, primero buscamos el ID del curso al que pertenece 
-- mediante su nombre (ej. 'HTML', 'CSS', 'JavaScript', 'PHP', 'NodeJS', 'PostgreSQL').
-- Esto evita tener que saber el ID autoincremental de la base de datos.

INSERT INTO modules (name, id_course)
VALUES (
    'Estructuras de Control', -- Nombre del nuevo módulo
    (SELECT id FROM courses WHERE name = 'JavaScript') -- Nombre del curso existente
)
ON CONFLICT (name, id_course) DO NOTHING;


-- -----------------------------------------------------------------------------
--  2. INSERCIÓN DE UNA NUEVA LECCIÓN (Nivel)
-- -----------------------------------------------------------------------------
-- Para insertar una lección, especificamos su nivel (número correlativo)
-- y buscamos el ID del módulo correspondiente por su nombre y curso.

INSERT INTO lessons (level, id_module)
VALUES (
    1, -- Número de nivel (Ej. Nivel 1)
    (
        SELECT m.id 
        FROM modules m 
        JOIN courses c ON m.id_course = c.id
        WHERE c.name = 'JavaScript' AND m.name = 'Estructuras de Control'
    )
)
ON CONFLICT (id_module, level) DO NOTHING;


-- -----------------------------------------------------------------------------
--  3. INSERCIÓN DEL CONTENIDO DETALLADO DE LA LECCIÓN
-- -----------------------------------------------------------------------------
-- Para insertar el contenido práctico (título, texto explicativo, código base),
-- buscamos el ID de la lección que acabamos de crear basándonos en el nivel, módulo y curso.
-- El tipo de lenguaje de código debe ser uno de los definidos en el enum prog_lang:
-- ('html', 'css', 'js', 'php', 'node', 'sql')

INSERT INTO lesson_content (id_lesson, title, content, code, code_lang)
VALUES (
    -- Subconsulta para localizar el ID de la lección exacta
    (
        SELECT l.id 
        FROM lessons l
        JOIN modules m ON l.id_module = m.id
        JOIN courses c ON m.id_course = c.id
        WHERE c.name = 'JavaScript' 
          AND m.name = 'Estructuras de Control' 
          AND l.level = 1
    ),
    'El Condicional IF', -- Título de la lección
    'Los condicionales te permiten ejecutar diferentes bloques de código según se cumpla o no una condición. La estructura básica en JavaScript es:
    
if (condicion) {
    // código a ejecutar si es verdadero
} else {
    // código a ejecutar si es falso
}

Prueba a cambiar el valor de la variable "edad" para ver los diferentes resultados en la consola de salida.', -- Explicación del nivel
    E'const edad = 18;\n\nif (edad >= 18) {\n    console.log("¡Eres mayor de edad!");\n} else {\n    console.log("Eres menor de edad.");\n}', -- Código base (usando escape E'...' para saltos de línea)
    'js'::prog_lang -- Lenguaje de programación (cast al enum prog_lang)
)
ON CONFLICT (id_lesson) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    code = EXCLUDED.code,
    code_lang = EXCLUDED.code_lang;
