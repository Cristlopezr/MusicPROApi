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

controller.getAllProductosPorTipo = async (req, res) => {
  try {
    const productos = await Producto.aggregate([
      {
        $lookup: {
          from: 'tipoProd',
          localField: 'tipoProducto',
          foreignField: '_id',
          as: 'tipoDeProducto',
        },
      },
      { $unwind: '$tipoDeProducto' },
      { $addFields: { 'tipoDeProducto.tipo': { $toLower: '$tipoDeProducto.tipo' } } },
      { $match: { 'tipoDeProducto.tipo': req.params.tipoProducto.slice(0, -1).toLowerCase() } },
    ]);
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
