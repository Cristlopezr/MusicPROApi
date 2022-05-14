const express = require('express');
const router = express.Router();
const controller = require('../controllers/productos.controller');

router.get('/', controller.getAllProductos);

router.get('/:id', controller.findOneProducto, controller.getOneProducto);

router.post('/', controller.createProducto);

router.put('/:id', controller.findOneProducto, controller.updateProducto);

router.delete('/:id', controller.findOneProducto, controller.deleteProducto);

/* router.get('/:tipoProducto', controller.getAllProductosPorTipo); */

module.exports = router;
