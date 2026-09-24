require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Cliente = require('./models/Cliente');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración y middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'pug');
app.set('views', './views/stack'); 
app.use(express.static('public'));

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/data')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// RUTAS PRINCIPALES 
app.get('/', (req, res) => res.render('index'));
app.get('/inicio', (req, res) => res.render('index')); 

// RUTAS DE VENTAS 
app.get('/ventas/caja', (req, res) => res.render('ventas/caja'));

app.get('/ventas/cliente', async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.render('ventas/list', { clientes: clientes });
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/add', (req, res) => res.render('ventas/add'));

app.post('/add', async (req, res) => {
    try {
        const { nombre, apellidos, dni, telefono } = req.body;
        await Cliente.create({ nombre, apellidos, dni, telefono });
        res.redirect('/ventas/cliente'); 
    } catch (error) {
        console.error('Error al añadir cliente:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// Ruta para mostrar el formulario de Editar Cliente
app.get('/edit/:id', async (req, res) => {
    try {
        const idParametro = req.params.id;
        const clienteEncontrado = await Cliente.findById(idParametro);
        
        if (clienteEncontrado) {
            res.render('ventas/edit', { cliente: clienteEncontrado });
        } else {
            res.redirect('/ventas/cliente');
        }
    } catch (error) {
        console.error('Error al buscar cliente:', error);
        res.redirect('/ventas/cliente');
    }
});

// Ruta para procesar la actualización
app.post('/edit/:id', async (req, res) => {
    try {
        const idParametro = req.params.id;
        const { nombre, apellidos, dni, telefono } = req.body;
        
        await Cliente.findByIdAndUpdate(idParametro, {
            nombre,
            apellidos,
            dni,
            telefono
        });
        
        res.redirect('/ventas/cliente');
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).send('Error interno del servidor');
    }
});

// RUTAS DE COMPRAS Y ALMACÉN
app.get('/compras/proveedores', (req, res) => res.render('compras/proveedores'));
app.get('/almacen/productos', (req, res) => res.render('almacen/productos'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
