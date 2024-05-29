const mongoose = require('../config/db.config');

const datagestorSchema = new mongoose.Schema({
  /* numeracion: { type: Number, required: true, unique: true }, */
  genero: { type: String, required: false},
  edad_cumplida: { type: Number, required: false},
  estado_marital: { type: String, required: false },
  nombre: { type: String, required: false },
  apellido: { type: String, required: false },
});

const Datagestor = mongoose.model('recopilacion_datos', datagestorSchema);

module.exports = Datagestor;