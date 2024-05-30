const mongoose = require('../config/db.config');

const catalogoValidarEdadSchema = new mongoose.Schema({
    value: { type: String, required: true },
    text: { type: String, required: true }
}, { collection: 'catalogo_validacion_edad' });

const CatalogoValidarEdad = mongoose.model('CatalogoValidarEdad', catalogoValidarEdadSchema);

module.exports = CatalogoValidarEdad;
