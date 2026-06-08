const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https//www.codelive.com'
  ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/* Routes */
/* 
const learnRoutes = require('./routes/learn.js');
const otherRoutes = require('./routes/others.js'); */
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const editRoutes = require('./routes/edit.js');

/* Check routes */
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/edit', editRoutes);
/* 
app.use('/api/auth', authRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/others', otherRoutes); */


pool.query('SELECT NOW()')
  .then(() => console.log('🐘 Conectado exitosamente a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));


/* Listen */

app.use((err, req, res, next) => {
    console.error("ERROR CRÍTICO:", err.stack);
    res.status(500).send('Algo salió muy mal!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () =>
{
    console.log(`💻 Servidor corriendo en el puerto ${PORT}`);
});