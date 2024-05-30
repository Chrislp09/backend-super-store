const mongoose = require('../config/db.config');

const catalogoEstatusMaritalSchema = new mongoose.Schema({
    value: { type: String, required: true },
    text: { type: String, required: true }
}, { collection: 'catalogo_estado_marital' });

const CatalogoEstatusMarital = mongoose.model('CatalogoEstatusMarital', catalogoEstatusMaritalSchema);

module.exports = CatalogoEstatusMarital;
