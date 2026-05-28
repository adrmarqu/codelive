const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codelive';

mongoose.connect(MONGO_URI)
  .then(() => console.log('🍃 Conectado exitosamente a MongoDB'))
  .catch(err => console.error('❌ Error al conectar a MongoDB:', err));

app.get('/', (req, res) => {
  res.send('🚀 Servidor de CodeLive funcionando perfectamente');
});

app.listen(PORT, () => {
  console.log(`💻 Servidor corriendo en el puerto ${PORT}`);
});