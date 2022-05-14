const mongoose = require('mongoose');

const prod_sucursalesSchema = new mongoose.Schema({
  stock: {
    type: Number,
    required: true,
  },
  producto: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  sucursal: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('prod_sucursales', prod_sucursalesSchema);
