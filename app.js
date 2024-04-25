const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const db = require('./config/db.config');

app.use(express.json());
app.use(cors());

const productosRoutes = require('./routes/productos.routes');
app.use('/api/products', productosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});