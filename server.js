require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', () => console.error(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const productosRouter = require('./routes/productos.routes');
app.use('/productos', productosRouter);
app.listen(3000, () => console.log('Server Started'));
