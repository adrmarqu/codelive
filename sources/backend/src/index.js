const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use(session({
    secret: 'tu_secreto_muy_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
    }
}));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codelive';

/* MongoDB */
mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 Conectado exitosamente a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

/* Routes */
/* const authRoutes = require('./routes/auth');
const editRoutes = require('./routes/edit');
const learnRoutes = require('./routes/learn');
const otherRoutes = require('./routes/others'); */
const userRoutes = require('./routes/user.js');
  
/* Check routes */
app.use('/api/user', userRoutes);
/* app.use('/api/auth', authRoutes);
app.use('/api/edit', editRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/others', otherRoutes); */

/* Listen */
app.listen(PORT, '0.0.0.0', () =>
{
    console.log(`💻 Servidor corriendo en el puerto ${PORT}`);
});