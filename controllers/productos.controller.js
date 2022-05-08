const res = require('express/lib/response');
const Producto = require('../models/producto.model');
const controller = {};

//Leer todos los productos
controller.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.send(err.message);
  }
};

//Leer un producto
controller.getOneProducto = (req, res) => {
  res.status(200).json(res.producto);
};

//Crear un producto
controller.createProducto = async (req, res) => {
  const producto = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    tipoProducto: req.body.tipoProducto,
  });

  try {
    const newProducto = await producto.save();
    res.status(201).json(newProducto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Editar un producto
controller.updateProducto = async (req, res) => {
  const producto = res.producto;
  producto.nombre = req.body.nombre;
  producto.precio = req.body.precio;
  producto.tipoProducto = req.body.tipoProducto;
  try {
    const updatedProducto = await producto.save();
    res.json(updatedProducto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

//Eliminar un producto
controller.deleteProducto = async (req, res) => {
  try {
    await res.producto.remove();
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Leer los productos por tipo
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

//Encontrar un producto
controller.findOneProducto = async function (req, res, next) {
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
