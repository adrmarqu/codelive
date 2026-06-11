require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const pool = require('./config/db');

const app = express();

// Secure backend with Helmet headers
app.use(helmet());

// Dynamic CORS configurations
const allowedOrigins = process.env.CORS_ORIGINS || 'https://codelive-pvo7.vercel.app,http://localhost:5173,http://localhost:80,http://localhost:3000';

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

/* Routes */
const learnRoutes = require('./routes/learn.js');
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const editRoutes = require('./routes/edit.js');

/* Check routes */
app.get('/', (req, res) =>
{
    res.status(200).json({ status: "alive", message: "Backend funcionando correctamente" });
});
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/edit', editRoutes);
app.use('/api/learn', learnRoutes);


/* pool.query('SELECT NOW()')
  .then(() => console.log('🐘 Conectado exitosamente a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err)); */

pool.connect((err, client, release) =>
{
  if (err)
    return console.error('❌ Error al conectar a PostgreSQL:', err.message);

  console.log('🐘 Conectado exitosamente a PostgreSQL');
  release();
});

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