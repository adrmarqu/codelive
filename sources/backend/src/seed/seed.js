require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function seedAdmin() {
    try {
        console.log('--- Iniciando semilla Admin ---');
        
        const adminExists = await pool.query('SELECT * FROM users WHERE rol = $1', ['admin']);

        if (adminExists.rowCount === 0) {
            console.log('Admin no encontrado, creando admin...');
            const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123', 10);
            await pool.query(
                'INSERT INTO users (username, email, password_hash, rol) VALUES ($1, $2, $3, $4)',
                ['admin', 'admin@admin.com', hash, 'admin']
            );
            console.log('✅ Usuario admin creado exitosamente.');
        } else {
            console.log('ℹ️ El usuario admin ya existe, no se realizaron cambios.');
        }
    } catch (error) {
        console.error('❌ Error crítico al crear admin:', error);
    }
}

async function seedEditor() {
    try {
        console.log('--- Iniciando semilla Editor ---');
        
        const editorExists = await pool.query('SELECT * FROM users WHERE rol = $1', ['editor']);

        if (editorExists.rowCount === 0) {
            console.log('Editor no encontrado, creando editor...');
            const hash = await bcrypt.hash(process.env.EDITOR_PASSWORD || 'Editor123', 10);
            await pool.query(
                'INSERT INTO users (username, email, password_hash, rol) VALUES ($1, $2, $3, $4)',
                ['editor', 'editor@editor.com', hash, 'editor']
            );
            console.log('✅ Usuario editor creado exitosamente.');
        } else {
            console.log('ℹ️ El usuario editor ya existe, no se realizaron cambios.');
        }
    } catch (error) {
        console.error('❌ Error crítico al crear editor:', error);
    }
}

async function runSeed() {
    try {
        await seedAdmin();
        await seedEditor();
    } catch (err) {
        console.error('Error general en la siembra:', err);
    } finally {
        console.log('--- Finalizando script de inicialización ---');
        process.exit();
    }
}

runSeed();