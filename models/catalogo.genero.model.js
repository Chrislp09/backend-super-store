const mongoose = require('../config/db.config');

const catalogoGeneroSchema = new mongoose.Schema({
    value: { type: String, required: true },
    text: { type: String, required: true }
}, { collection: 'catalogo_genero' });

const CatalogoGenero = mongoose.model('CatalogoGenero', catalogoGeneroSchema);

module.exports = CatalogoGenero;
