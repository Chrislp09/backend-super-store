const express = require('express');
const router = express.Router();
const Producto = require('../models/producto.model');

const createResponse = (data, message = null, code = 200) => {
  return { data, message, code };
};

/// Crear un nuevo producto
router.post('/', async (req, res) => {
  const { title, price, description, image, category, count } = req.body; 

  try {
    const nuevoProducto = new Producto({ title, price, description, image, category, count }); 

    const producto = await nuevoProducto.save(); 

    res.status(201).json(createResponse(producto, 'Producto creado exitosamente', 201)); 
  } catch (error) {
    res.status(400).json(createResponse(null, error.message, 400)); 
  }
});


// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 0;
      let productos;
  
      if (limit === 0) {
        productos = await Producto.find();
      } else {
        productos = await Producto.find().limit(limit);
      }
  
      if (productos.length === 0) {
        return res.status(404).json(createResponse([], 'No se encontraron productos', 404));
      }
  
      const productosConRating = productos.map(producto => {
        return {
          ...producto._doc,
          rating: { rate: producto.rate, count: producto.count }
        };
      });
  
      res.json(createResponse(productosConRating, 'Productos encontrados'));
    } catch (error) {
      res.status(500).json(createResponse(null, 'No se logró obtener respuesta del servidor', 500));
    }
  });  

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json(createResponse(null, 'Producto no encontrado', 404));
    }
    const productosConRating = {
        ...producto._doc,
        rating: {
            rate: producto.rate,
            count: producto.count
        }
    }

    res.json(createResponse(productosConRating, 'Producto encontrado'));
  } catch (error) {
    res.status(500).json(createResponse(null, error.message, 500));
  }
});

// Actualizar un producto por ID
router.put('/:id', async (req, res) => {
  const { title, price, description, image, category, count } = req.body;

  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { title, price, description, image, category, count },
      { new: true }
    );
    if (!producto) {
      return res.status(404).json(createResponse(null, 'Producto no encontrado', 404));
    }
    res.json(createResponse(producto, 'Producto actualizado exitosamente'));
  } catch (error) {
    res.status(400).json(createResponse(null, error.message, 400));
  }
});

// Eliminar un producto por ID
router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json(createResponse(null, 'Producto no encontrado', 404));
    }
    res.json(createResponse(null, 'Producto eliminado correctamente'));
  } catch (error) {
    res.status(500).json(createResponse(null, error.message, 500));
  }
});

module.exports = router;
