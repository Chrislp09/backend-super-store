const mongoose = require('../config/db.config');

const productoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    category: { type: String, required: true},
    rate: { type: Number, default: 0 }, 
    count: { type: Number, default: 0 } 
  });;

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;