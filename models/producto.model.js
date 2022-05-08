const mongoose = require('mongoose');

const productosSchema = new mongoose.Schema({
  nombre: {
    type: String,
    require: true,
  },
  precio: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('productos', productosSchema);
