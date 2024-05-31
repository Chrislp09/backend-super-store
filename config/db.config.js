require('dotenv').config();
const config =  require('../config/config');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
let ambiente = config.env;
const URI = config[ambiente].apiRoot;

mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})
  .then(() => {
    console.log('Conexión a MongoDB establecida');
    console.log('Base de datos conectada:', mongoose.connection.db.databaseName);
    // Realiza una operación básica para confirmar la conexión
    return mongoose.connection.db.admin().ping();
  })
  .then((result) => {
    console.log('Ping result:', result);
  })
  .catch(error => console.error('Error al conectar a MongoDB:', error));

module.exports = mongoose;

