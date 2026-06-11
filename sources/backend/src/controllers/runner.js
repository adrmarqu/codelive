const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const runCode = async (req, res) => {
    const { code, lang } = req.body;

    if (!code) {
        return res.status(400).json({ error: "No se proporcionó código para ejecutar" });
    }

    if (lang === 'node') {
        const tempFile = path.join(__dirname, `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.js`);
        try {
            fs.writeFileSync(tempFile, code);
            exec(`node ${tempFile}`, { timeout: 3000 }, (error, stdout, stderr) => {
                try { fs.unlinkSync(tempFile); } catch(e) {}

                if (error && error.killed) {
                    return res.status(200).json({ output: "Error: Límite de tiempo excedido (3 segundos)" });
                }
                return res.status(200).json({ output: stdout + stderr });
            });
        } catch (err) {
            try { fs.unlinkSync(tempFile); } catch(e) {}
            return res.status(500).json({ error: "Error al escribir el archivo temporal" });
        }
    } 
    else if (lang === 'php') {
        const tempFile = path.join(__dirname, `temp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.php`);
        try {
            // Prepend <?php tag if missing
            let finalCode = code.trim();
            if (!finalCode.startsWith('<?php') && !finalCode.startsWith('<?')) {
                finalCode = '<?php\n' + finalCode;
            }
            fs.writeFileSync(tempFile, finalCode);

            // Determine correct PHP execution command
            const phpCmd = fs.existsSync('/usr/bin/php82') ? 'php82' 
                         : fs.existsSync('/usr/bin/php83') ? 'php83' 
                         : 'php';

            exec(`${phpCmd} ${tempFile}`, { timeout: 3000 }, (error, stdout, stderr) => {
                try { fs.unlinkSync(tempFile); } catch(e) {}

                if (error && error.killed) {
                    return res.status(200).json({ output: "Error: Límite de tiempo excedido (3 segundos)" });
                }
                return res.status(200).json({ output: stdout + stderr });
            });
        } catch (err) {
            try { fs.unlinkSync(tempFile); } catch(e) {}
            return res.status(500).json({ error: "Error al escribir el archivo temporal" });
        }
    } 
    else if (lang === 'sql') {
        let client;
        try {
            client = await pool.connect();
            await client.query('BEGIN');

            // Split statements by semicolon and filter empty lines
            const queries = code.split(';').map(q => q.trim()).filter(q => q.length > 0);
            let lastResult = null;

            for (const query of queries) {
                lastResult = await client.query(query);
            }

            if (!lastResult) {
                return res.status(200).json({ type: 'status', message: 'No se ejecutaron consultas' });
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
                    message: `Consulta OK, ${lastResult.rowCount} filas afectadas (${lastResult.command})`
                });
            }
        } catch (err) {
            return res.status(200).json({ 
                type: 'status', 
                output: `Error de SQL: ${err.message}` 
            });
        } finally {
            if (client) {
                try {
                    await client.query('ROLLBACK');
                } catch (e) {}
                client.release();
            }
        }
    } 
    else {
        return res.status(400).json({ error: `Lenguaje de ejecución no soportado: ${lang}` });
    }
};

module.exports = { runCode };
