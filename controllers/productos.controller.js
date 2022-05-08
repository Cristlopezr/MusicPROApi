const res = require('express/lib/response');
const Producto = require('../models/producto.model');
const controller = {};

controller.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.send(err.message);
  }
};

controller.getOneProducto = async (req, res) => {
  try {
    res.send(res.producto.nombre);
  } catch (err) {
    res.send(err.message);
  }
};

controller.getOne = async function (req, res, next) {
  let producto;
  try {
    producto = await Producto.findById(req.params.id);
    if (producto == null) {
      return res.status(404).json({ message: 'No se ha encontrado el producto' });
    }
  } catch (err) {
    return res.status(500).send(err.message);
  }
  res.producto = producto;
  next();
};
module.exports = controller;
