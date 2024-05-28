const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;

const db = require('./config/db.config');

app.use(express.json());
app.use(cors());

const productosRoutes = require('./routes/productos.routes');
const documentUpload = require('./routes/datagestor.routes');
app.use('/api/products', productosRoutes);
app.use('/api/upload', documentUpload);
app.use(bodyParser.json({ limit: '50mb' })); 
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});