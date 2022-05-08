const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const controller = require('../controllers/productos.controller');

router.get('/', controller.getAllProductos);

router.get('/:tipoProducto', controller.getAllProductosPorTipo);

router.get('/:id', controller.getOne, controller.getOneProducto);
module.exports = router;
