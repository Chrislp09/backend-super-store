const mongoose = require('../config/db.config');

const datagestorSchema = new mongoose.Schema({
  genero: { type: String},
  edad_cumplida: { type: Number},
  estado_marital: { type: String },
  nombre: { type: String, required: false },
  apellido: { type: String, required: false },
});

const Datagestor = mongoose.model('recopilacion_datos', datagestorSchema);

module.exports = Datagestor;