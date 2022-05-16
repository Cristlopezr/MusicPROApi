const { default: mongoose } = require('mongoose');
const Producto = require('../models/producto.model');
const Prod_Sucursales = require('../models/prod_sucursal.model');
const controller = {};

//Leer todos los productos
controller.getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

//Leer un producto
controller.getOneProducto = async (req, res) => {
  try {
    const producto = await Prod_Sucursales.aggregate([
      {
        $lookup: {
          from: 'productos',
          localField: 'producto',
          foreignField: '_id',
          as: 'producto',
        },
      },
      { $unwind: '$producto' },
      { $match: { 'producto._id': res.producto._id } },
      {
        $lookup: {
          from: 'sucursales',
          localField: 'sucursal',
          foreignField: '_id',
          as: 'sucursal',
        },
      },
      { $unwind: '$sucursal' },
    ]);
    let sucursales = [];
    producto.forEach((producto) => {
      const {
        sucursal: { nombre },
        stock,
      } = producto;
      sucursales.push({ nombre, stock });
    });
    const prod = res.producto.toObject();
    prod.sucursales = sucursales;
    res.status(200).json(prod);
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

//Crear un producto
controller.createProducto = async (req, res) => {
  const producto = new Producto({
    nombre: req.body.nombre,
    precio: req.body.precio,
    marca: req.body.marca,
    descripcion: req.body.descripcion,
  });

  try {
    const newProducto = await producto.save();
    res.status(201).json(newProducto);
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
};

//Editar un producto
controller.updateProducto = async (req, res) => {
  //Join productos/sucursales/prod_sucursales
  try {
    const producto = await Prod_Sucursales.aggregate([
      {
        $lookup: {
          from: 'productos',
          localField: 'producto',
          foreignField: '_id',
          as: 'producto',
        },
      },
      { $unwind: '$producto' },
      { $match: { 'producto._id': res.producto._id } },
      {
        $lookup: {
          from: 'sucursales',
          localField: 'sucursal',
          foreignField: '_id',
          as: 'sucursal',
        },
      },
      { $unwind: '$sucursal' },
      { $match: { 'sucursal._id': mongoose.Types.ObjectId(req.body.sucursal) } },
    ]);
    //Encuentra documento prod_sucursales
    const prod_sucursal = await Prod_Sucursales.findById(producto[0]._id);

    //Si la cantidad a vender no supera el stock, lo actualiza
    if (req.body.cantidad <= prod_sucursal.stock) {
      prod_sucursal.stock = prod_sucursal.stock - req.body.cantidad;
    } else {
      res.status(400).json({ mensaje: 'La cantidad es mayor que el stock' });
      return;
    }

    //Guarda la información
    await prod_sucursal.save();

    //Muestra la información
    date = new Date();
    const updatedProducto = res.producto.toObject();
    updatedProducto.cant_vendida = req.body.cantidad;
    updatedProducto.cant_total = prod_sucursal.stock;
    updatedProducto.fecha = String(date.getDate()).padStart(2, '0') + '/' + String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
    updatedProducto.sucursal = producto[0].sucursal;
    res.json(updatedProducto);
  } catch (err) {
    res.status(400).json({ mensaje: err.message });
  }
};

//Eliminar un producto
controller.deleteProducto = async (req, res) => {
  try {
    await res.producto.remove();
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ mensaje: err.message });
  }
};

//Encontrar un producto
controller.findOneProducto = async function (req, res, next) {
  let producto;
  try {
    producto = await Producto.findById(req.params.id);
    if (producto == null) {
      return res.status(404).json({ mensaje: 'No se ha encontrado el producto' });
    }
  } catch (err) {
    return res.status(500).json({ mensaje: err.message });
  }
  res.producto = producto;
  next();
};

/* //Leer los productos por tipo
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
}; */

module.exports = controller;
