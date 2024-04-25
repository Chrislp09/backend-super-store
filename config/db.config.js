const mongoose = require('mongoose');

const URI = 'mongodb://localhost:27017/super-store-db';

mongoose.connect(URI)
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch(error => console.error('Error al conectar a MongoDB:', error));

module.exports = mongoose;
