const mongoose = require('mongoose');

const boletasSchema = new mongoose.Schema({
  cant_vendida: {
    type: Number,
    required: true,
  },
  cant_total: {
    type: Number,
    required: true,
  },
  fecha: {
    type: String,
    required: true,
  },
  hora: {
    type: String,
    required: true,
  },
  sucursal: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model('boletas', boletasSchema);
