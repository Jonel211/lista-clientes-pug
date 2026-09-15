const express = require('express');
const app = express();
const PORT = 3000;

// Configuración
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static('public'));

// Rutas
app.get('/', (req, res) => res.render('index'));
app.get('/inicio', (req, res) => res.render('inicio'));
app.get('/nosotros', (req, res) => res.render('nosotros'));
app.get('/contactenos', (req, res) => res.render('contactenos'));
app.get('/servicios', (req, res) => res.render('servicios'));
app.get('/productos', (req, res) => res.render('productos'));

// Servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
