const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'pug');
app.set('views', './views/stack'); 
app.use(express.static('public'));

// Memoria temporal
let clientes = [];

// RUTAS PRINCIPALES 
app.get('/', (req, res) => res.render('index'));
app.get('/inicio', (req, res) => res.render('index')); 

// RUTAS DE VENTAS 
app.get('/ventas/caja', (req, res) => res.render('ventas/caja'));

app.get('/ventas/cliente', (req, res) => {
    res.render('ventas/list', { clientes: clientes });
});

app.get('/add', (req, res) => res.render('ventas/add'));

app.post('/add', (req, res) => {
    // 1. Le asignamos un ID único al cliente antes de guardarlo
    const nuevoCliente = req.body;
    nuevoCliente.id = Date.now().toString(); 
    
    clientes.push(nuevoCliente); 
    res.redirect('/ventas/cliente'); 
});

// 2. Ruta para mostrar el formulario de Editar Cliente (con el ID)
app.get('/edit/:id', (req, res) => {
    const idParametro = req.params.id;
    const clienteEncontrado = clientes.find(c => c.id === idParametro);
    
    if (clienteEncontrado) {
        res.render('ventas/edit', { cliente: clienteEncontrado });
    } else {
        res.redirect('/ventas/cliente');
    }
});

// 3. Ruta para procesar la actualización y guardarla en memoria
app.post('/edit/:id', (req, res) => {
    const idParametro = req.params.id;
    const indice = clientes.findIndex(c => c.id === idParametro);
    
    if (indice !== -1) {
        clientes[indice] = {
            id: idParametro,
            nombre: req.body.nombre,
            apellidos: req.body.apellidos,
            dni: req.body.dni,
            telefono: req.body.telefono
        };
    }
    res.redirect('/ventas/cliente');
});

// RUTAS DE COMPRAS Y ALMACÉN
app.get('/compras/proveedores', (req, res) => res.render('compras/proveedores'));
app.get('/almacen/productos', (req, res) => res.render('almacen/productos'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
