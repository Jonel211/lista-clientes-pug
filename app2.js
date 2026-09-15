const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Motor de plantillas
app.set('view engine', 'pug');
app.set('views', './views');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Base de datos simulada
let productos = [];
let contadorId = 1;

// Rutas
app.get('/', (req, res) => {
    res.render('index2', { productos });
});

app.get('/nuevo', (req, res) => {
    res.render('form', { producto: {}, accion: '/crear', titulo: 'Crear Producto' });
});

app.post('/crear', (req, res) => {
    const { nombre, precio } = req.body;
    productos.push({ id: contadorId++, nombre, precio });
    res.redirect('/');
});

app.get('/editar/:id', (req, res) => {
    const producto = productos.find(p => p.id == req.params.id);
    if (!producto) return res.send('Producto no encontrado');
    res.render('form', { producto, accion: `/actualizar/${producto.id}`, titulo: 'Editar Producto' });
});

app.post('/actualizar/:id', (req, res) => {
    const { nombre, precio } = req.body;
    const producto = productos.find(p => p.id == req.params.id);
    if (producto) {
        producto.nombre = nombre;
        producto.precio = precio;
    }
    res.redirect('/');
});

app.get('/eliminar/:id', (req, res) => {
    productos = productos.filter(p => p.id != req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
