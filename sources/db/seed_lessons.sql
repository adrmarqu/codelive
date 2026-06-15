-- ============================================================
--  CodeLive — Seed de lecciones de prueba (un nivel por curso)
--  Ejecutar DESPUÉS de init.sql.
--  Usa inserciones basadas en SELECT para evitar fallos de claves foráneas y permitir re-ejecución.
-- ============================================================

-- ------------------------------------------------------------
--  1. CREACIÓN DE LECCIONES (Nivel 1 para el módulo 'Introducción' de cada curso)
-- ------------------------------------------------------------

-- HTML
INSERT INTO lessons (level, id_module)
SELECT 1, m.id
FROM modules m JOIN courses c ON m.id_course = c.id
WHERE c.name = 'HTML' AND m.name = 'Introducción'
ON CONFLICT (id_module, level) DO NOTHING;

-- CSS
INSERT INTO lessons (level, id_module)
SELECT 1, m.id
FROM modules m JOIN courses c ON m.id_course = c.id
WHERE c.name = 'CSS' AND m.name = 'Introducción'
ON CONFLICT (id_module, level) DO NOTHING;

-- JavaScript
INSERT INTO lessons (level, id_module)
SELECT 1, m.id
FROM modules m JOIN courses c ON m.id_course = c.id
WHERE c.name = 'JavaScript' AND m.name = 'Introducción'
ON CONFLICT (id_module, level) DO NOTHING;

-- PHP
INSERT INTO lessons (level, id_module)
SELECT 1, m.id
FROM modules m JOIN courses c ON m.id_course = c.id
WHERE c.name = 'PHP' AND m.name = 'Introducción'
ON CONFLICT (id_module, level) DO NOTHING;

-- NodeJS
INSERT INTO lessons (level, id_module)
SELECT 1, m.id
FROM modules m JOIN courses c ON m.id_course = c.id
WHERE c.name = 'NodeJS' AND m.name = 'Introducción'
ON CONFLICT (id_module, level) DO NOTHING;

-- PostgreSQL
INSERT INTO lessons (level, id_module)
SELECT 1, m.id
FROM modules m JOIN courses c ON m.id_course = c.id
WHERE c.name = 'PostgreSQL' AND m.name = 'Introducción'
ON CONFLICT (id_module, level) DO NOTHING;


-- ------------------------------------------------------------
--  2. INSERCIÓN/ACTUALIZACIÓN DE CONTENIDOS DE LECCIONES (LESSON CONTENT)
-- ------------------------------------------------------------

-- HTML
INSERT INTO lesson_content (id_lesson, title, content, code, code_lang)
SELECT 
    l.id,
    'Tu primera página web',
    'HTML (HyperText Markup Language) es el lenguaje con el que se construyen todas las páginas web. No es un lenguaje de programación: es un lenguaje de marcado que define la estructura del contenido.

Un documento HTML está formado por etiquetas. Cada etiqueta abre (<etiqueta>) y cierra (</etiqueta>) un elemento. Los elementos más importantes de cualquier página son <html>, <head>, <body>, <h1> y <p>.

Prueba a modificar el título y el párrafo del ejemplo y pulsa Ejecutar para ver el resultado en tiempo real.',
    E'<html>\n  <head>\n    <title>Mi primera web</title>\n  </head>\n  <body>\n    <h1>¡Hola, mundo!</h1>\n    <p>Esta es mi primera página HTML.</p>\n    <p>Cambia este texto y pulsa <strong>Ejecutar</strong>.</p>\n  </body>\n</html>',
    'html'::prog_lang
FROM lessons l
JOIN modules m ON l.id_module = m.id
JOIN courses c ON m.id_course = c.id
WHERE c.name = 'HTML' AND m.name = 'Introducción' AND l.level = 1
ON CONFLICT (id_lesson) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    code = EXCLUDED.code,
    code_lang = EXCLUDED.code_lang;

-- CSS
INSERT INTO lesson_content (id_lesson, title, content, code, code_lang)
SELECT 
    l.id,
    'Dando estilo con CSS',
    'CSS (Cascading Style Sheets) se usa para darle aspecto visual a los elementos HTML. Sin CSS, todas las páginas web tendrían el mismo aspecto aburrido de texto negro sobre fondo blanco.

Una regla CSS tiene la forma: selector { propiedad: valor; }. El selector indica a qué elemento afecta, y las propiedades definen cómo se verá.

En el ejemplo verás cómo cambiar colores, fuentes y espaciados. Modifica los valores y pulsa Ejecutar para ver los cambios al instante.',
    E'body {\n  background-color: #1a1a2e;\n  font-family: Arial, sans-serif;\n  color: #eee;\n  padding: 30px;\n}\n\nh1 {\n  color: #e94560;\n  font-size: 2rem;\n  border-bottom: 2px solid #e94560;\n  padding-bottom: 10px;\n}\n\np {\n  font-size: 1.1rem;\n  line-height: 1.7;\n  max-width: 600px;\n}',
    'css'::prog_lang
FROM lessons l
JOIN modules m ON l.id_module = m.id
JOIN courses c ON m.id_course = c.id
WHERE c.name = 'CSS' AND m.name = 'Introducción' AND l.level = 1
ON CONFLICT (id_lesson) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    code = EXCLUDED.code,
    code_lang = EXCLUDED.code_lang;

-- JavaScript
INSERT INTO lesson_content (id_lesson, title, content, code, code_lang)
SELECT 
    l.id,
    'Variables y operaciones básicas',
    'JavaScript es el lenguaje de programación de la web. Permite añadir lógica e interactividad a las páginas. A diferencia de HTML y CSS, JavaScript es un lenguaje de programación completo.

Con console.log() puedes imprimir mensajes en la consola. Las variables se declaran con let (valor cambiable) o const (valor fijo). Los template literals (comillas invertidas `) permiten incrustar variables directamente en texto.

Modifica el código y pulsa Ejecutar. Verás la salida en el panel de la derecha.',
    E'const nombre = "CodeLive";\nconst version = 2.0;\n\nconsole.log("Bienvenido a " + nombre);\nconsole.log(`Versión: ${version}`);\n\nlet a = 10;\nlet b = 3;\nconsole.log(`${a} + ${b} = ${a + b}`);\nconsole.log(`${a} * ${b} = ${a * b}`);\nconsole.log(`${a} % ${b} = ${a % b}`);\n\nconst frutas = ["manzana", "plátano", "cereza"];\nfrutas.forEach(f => console.log("Fruta:", f));',
    'js'::prog_lang
FROM lessons l
JOIN modules m ON l.id_module = m.id
JOIN courses c ON m.id_course = c.id
WHERE c.name = 'JavaScript' AND m.name = 'Introducción' AND l.level = 1
ON CONFLICT (id_lesson) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    code = EXCLUDED.code,
    code_lang = EXCLUDED.code_lang;

-- PHP
INSERT INTO lesson_content (id_lesson, title, content, code, code_lang)
SELECT 
    l.id,
    'Introducción a PHP',
    'PHP es un lenguaje de programación del lado del servidor. Mientras que JavaScript se ejecuta en el navegador del usuario, PHP se ejecuta en el servidor y devuelve el resultado al navegador.

El código PHP se escribe entre etiquetas <?php y ?>. La función echo imprime texto. Las variables siempre empiezan con el signo $ y no necesitan declarar su tipo.

Modifica el código y pulsa Ejecutar. El resultado aparecerá en el terminal de la derecha (el código se ejecuta en un servidor remoto).',
    E'<?php\n$nombre = "CodeLive";\n$version = 2.0;\n\necho "Bienvenido a " . $nombre . "\\n";\necho "Versión: " . $version . "\\n\\n";\n\n$a = 10;\n$b = 3;\necho "$a + $b = " . ($a + $b) . "\\n";\necho "$a * $b = " . ($a * $b) . "\\n";\necho "$a % $b = " . ($a % $b) . "\\n\\n";\n\n$frutas = ["manzana", "plátano", "cereza"];\nforeach ($frutas as $fruta) {\n    echo "Fruta: $fruta\\n";\n}',
    'php'::prog_lang
FROM lessons l
JOIN modules m ON l.id_module = m.id
JOIN courses c ON m.id_course = c.id
WHERE c.name = 'PHP' AND m.name = 'Introducción' AND l.level = 1
ON CONFLICT (id_lesson) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    code = EXCLUDED.code,
    code_lang = EXCLUDED.code_lang;

-- NodeJS
INSERT INTO lesson_content (id_lesson, title, content, code, code_lang)
SELECT 
    l.id,
    'Tu primer script con Node.js',
    'Node.js permite ejecutar JavaScript fuera del navegador, directamente en el servidor o en tu terminal. Fue creado en 2009 y revolucionó el desarrollo web al llevar JavaScript al backend.

Con Node tienes acceso a módulos propios del sistema operativo como fs (sistema de archivos), path, os y más. El objeto process contiene información sobre el entorno de ejecución.

Pulsa Ejecutar para ver la salida en el terminal. Prueba a añadir más console.log() o a modificar el array.',
    E'console.log("Hola desde Node.js!");\nconsole.log("Versión de Node:", process.version);\nconsole.log("Sistema operativo:", process.platform);\n\nconst numeros = [1, 2, 3, 4, 5];\nconst dobles   = numeros.map(n => n * 2);\nconst pares    = numeros.filter(n => n % 2 === 0);\nconst suma     = numeros.reduce((acc, n) => acc + n, 0);\n\nconsole.log("\\nNúmeros:", numeros);\nconsole.log("Dobles: ", dobles);\nconsole.log("Pares:  ", pares);\nconsole.log("Suma:   ", suma);\n\nfunction saludar(nombre) {\n    return `¡Hola, ${nombre}! Bienvenido a Node.js.`;\n}\nconsole.log("\\n" + saludar("desarrollador"));',
    'node'::prog_lang
FROM lessons l
JOIN modules m ON l.id_module = m.id
JOIN courses c ON m.id_course = c.id
WHERE c.name = 'NodeJS' AND m.name = 'Introducción' AND l.level = 1
ON CONFLICT (id_lesson) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    code = EXCLUDED.code,
    code_lang = EXCLUDED.code_lang;

-- PostgreSQL / SQL
INSERT INTO lesson_content (id_lesson, title, content, code, code_lang)
SELECT 
    l.id,
    'Tu primera consulta SQL',
    'SQL (Structured Query Language) es el lenguaje estándar para gestionar bases de datos relacionales. Se usa en prácticamente todos los sistemas que almacenan datos.

La instrucción más usada es SELECT, que permite consultar datos de una tabla. La sintaxis básica es: SELECT columnas FROM tabla.

En este entorno de práctica tienes acceso a las tablas "clientes", "productos" y "pedidos". Prueba a añadir un WHERE, un ORDER BY o un LIMIT.',
    E'-- Consulta los clientes registrados en el sandbox\nSELECT * FROM clientes ORDER BY fecha_registro DESC;',
    'sql'::prog_lang
FROM lessons l
JOIN modules m ON l.id_module = m.id
JOIN courses c ON m.id_course = c.id
WHERE c.name = 'PostgreSQL' AND m.name = 'Introducción' AND l.level = 1
ON CONFLICT (id_lesson) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    code = EXCLUDED.code,
    code_lang = EXCLUDED.code_lang;
