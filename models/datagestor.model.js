const mongoose = require('../config/db.config');

const datagestorSchema = new mongoose.Schema({
    edad_cumplida: { type: Number, required: false },
    genero: { type: String, required: false },
    estado_marital: { type: String, required: false },
    nombre: { type: String, required: false },
    apellido: { type: String, required: false }
}, { collection: 'recopilacion_datos' });

const Datagestor = mongoose.model('Datagestor', datagestorSchema);

module.exports = Datagestor;
