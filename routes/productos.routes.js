const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const controller = require('../controllers/productos.controller');

router.get('/', controller.getAllProductos);

router.get('/:tipoProducto', controller.getAllProductosPorTipo);

router.get('/producto/:id', controller.findOneProducto, controller.getOneProducto);
module.exports = router;

router.post('/', controller.createProducto);

router.put('/:id', controller.findOneProducto, controller.updateProducto);

router.delete('/:id', controller.findOneProducto, controller.deleteProducto);
