const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// ──────────────────────────────────────────────────────────────
//  Piston API  (https://piston.rocks)
//  Free, no API key required. Sandboxes PHP and Node execution.
// ──────────────────────────────────────────────────────────────
const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

const runViaPiston = async (language, version, code) => {
    const response = await fetch(PISTON_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            language,
            version,
            files: [{ content: code }]
        })
    });

    if (!response.ok) {
        throw new Error(`Piston API error: ${response.status}`);
    }

    const result = await response.json();
    const output = (result.run?.stdout || '') + (result.run?.stderr || '');

    if (result.run?.code !== 0 && !output) {
        return `Error: el proceso terminó con código ${result.run?.code}`;
    }
    return output || 'Ejecución completada sin salida.';
};


/* Check only permited tables */
function esConsultaPermitidaW3(queryUsuario)
{ 
    const query = queryUsuario.toLowerCase();
    // Tus 3 tablas exactas
    const tablasPermitidas = ['clientes', 'productos', 'pedidos'];
    
    // Captura lo que vaya después de FROM, JOIN, UPDATE o INTO
    const regexTablas = /(?:from|join|update|into)\s+([a-zA-Z0-9_]+)/g;
    let matches;
    let tablasEncontradas = [];
    
    while ((matches = regexTablas.exec(query)) !== null) {
        tablasEncontradas.push(matches[1]);
    }
    
    // Si encuentra tablas, validamos que pertenezcan estrictamente a tu lista de 3
    if (tablasEncontradas.length > 0) {
        for (let tabla of tablasEncontradas) {
            if (!tablasPermitidas.includes(tabla)) {
                return false; // Intento de acceder a datos reales de tu app
            }
        }
    }
    return true;
}

// ──────────────────────────────────────────────────────────────
//  Main controller
// ──────────────────────────────────────────────────────────────
const runCode = async (req, res) => {
    const { code, lang } = req.body;

    if (!code || !lang) {
        return res.status(400).json({ error: 'Se requieren los campos code y lang.' });
    }

    // ── Node.js  (child_process — Node ya está instalado en Render) ──
    if (lang === 'node') {
        const tempFile = path.join(__dirname, `tmp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.js`);
        try {
            fs.writeFileSync(tempFile, code);
            exec(`node "${tempFile}"`, { timeout: 5000 }, (error, stdout, stderr) => {
                try { fs.unlinkSync(tempFile); } catch (_) {}

                if (error?.killed) {
                    return res.status(200).json({ output: 'Error: tiempo límite excedido (5 s).' });
                }
                return res.status(200).json({ output: (stdout + stderr) || 'Ejecución completada sin salida.' });
            });
        } catch (err) {
            try { fs.unlinkSync(tempFile); } catch (_) {}
            return res.status(500).json({ error: 'Error al crear el archivo temporal.' });
        }
    }

    // ── PHP  (via Piston API — PHP no está instalado en Render) ──
    else if (lang === 'php') {
        try {
            // Ensure <?php tag is present
            let finalCode = code.trim();
            if (!finalCode.startsWith('<?php') && !finalCode.startsWith('<?')) {
                finalCode = '<?php\n' + finalCode;
            }

            const output = await runViaPiston('php', '8.2', finalCode);
            return res.status(200).json({ output });
        } catch (err) {
            console.error('PHP Piston error:', err.message);
            return res.status(500).json({ error: 'Error al conectar con el servidor de ejecución de PHP. Inténtalo de nuevo.' });
        }
    }

    // ── SQL  (PostgreSQL sandbox — always ROLLBACK, changes are never saved) ──
    else if (lang === 'sql')
    {
        if (!esConsultaPermitidaW3(code))
        {
            return res.status(200).json({
                type: 'status',
                output: 'Seguridad: En este entorno de pruebas solo puedes interactuar con las tablas "clientes", "productos" o "pedidos".'
            });
        }

        // Basic guard against destructive DDL
        const dangerous = /\b(DROP\s+TABLE|DROP\s+DATABASE|TRUNCATE|ALTER\s+TABLE)\b/i;
        if (dangerous.test(code)) {
            return res.status(200).json({
                type: 'status',
                output: 'Error: operaciones DROP TABLE, DROP DATABASE, TRUNCATE y ALTER TABLE no están permitidas en el sandbox.'
            });
        }

        let client;
        try {
            client = await pool.connect();
            await client.query('BEGIN');

            // Execute each statement separated by semicolon
            const statements = code.split(';').map(q => q.trim()).filter(q => q.length > 0);
            let lastResult = null;

            for (const stmt of statements) {
                lastResult = await client.query(stmt);
            }

            if (!lastResult) {
                return res.status(200).json({ type: 'status', output: 'No se ejecutaron consultas.' });
            }

            if (lastResult.command === 'SELECT') {
                return res.status(200).json({
                    type: 'table',
                    columns: lastResult.fields.map(f => f.name),
                    rows: lastResult.rows
                });
            } else {
                return res.status(200).json({
                    type: 'status',
                    output: `Consulta OK — ${lastResult.rowCount} fila(s) afectada(s) [${lastResult.command}]`
                });
            }
        } catch (err) {
            return res.status(200).json({ type: 'status', output: `Error SQL: ${err.message}` });
        } finally {
            if (client) {
                try { await client.query('ROLLBACK'); } catch (_) {}
                client.release();
            }
        }
    }

    else {
        return res.status(400).json({ error: `Lenguaje no soportado: ${lang}` });
    }
};

module.exports = { runCode };
