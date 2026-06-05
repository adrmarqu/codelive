const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function seedAdmin() {
    try {
        console.log('--- Iniciando script de inicialización ---');
        
        const adminExists = await pool.query('SELECT * FROM users WHERE rol = $1', ['admin']);

        if (adminExists.rowCount === 0) {
            console.log('Usuario no encontrado, creando admin...');
            const hash = await bcrypt.hash('Admin123', 10);
            await pool.query(
                'INSERT INTO users (username, email, password_hash, rol, active) VALUES ($1, $2, $3, $4, $5)',
                ['admin', 'admin@admin.com', hash, 'admin', true]
            );
            console.log('✅ Usuario admin creado exitosamente.');
        } else {
            console.log('ℹ️ El usuario admin ya existe, no se realizaron cambios.');
        }
    } catch (error) {
        console.error('❌ Error crítico en el seed:', error);
    } finally {
        console.log('--- Finalizando script ---');
        process.exit(); // Esto es clave para que el proceso libere la terminal
    }
};

async function seedEditor() {
    try {
        console.log('--- Iniciando script de inicialización ---');
        
        const adminExists = await pool.query('SELECT * FROM users WHERE rol = $1', ['admin']);

        if (adminExists.rowCount === 0) {
            console.log('Usuario no encontrado, creando admin...');
            const hash = await bcrypt.hash('Editor123', 10);
            await pool.query(
                'INSERT INTO users (username, email, password_hash, rol, active) VALUES ($1, $2, $3, $4, $5)',
                ['editor', 'editor@editor.com', hash, 'editor', true]
            );
            console.log('✅ Usuario editor creado exitosamente.');
        } else {
            console.log('ℹ️ El usuario editor ya existe, no se realizaron cambios.');
        }
    } catch (error) {
        console.error('❌ Error crítico en el seed:', error);
    } finally {
        console.log('--- Finalizando script ---');
        process.exit(); // Esto es clave para que el proceso libere la terminal
    }
};

seedAdmin();
seedEditor();