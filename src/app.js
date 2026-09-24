// Configuración central de la app Express del SISTEMA DE
// LICENCIAMIENTO. Tercer sistema, aparte del Administrativo y del
// Contable — su propio servidor, su propio repositorio — comparten
// la misma base de datos de Supabase.
//
// No usa companiaActual: aquí el administrador ve TODAS las
// compañías a la vez, no trabaja "dentro" de una en particular.

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth.routes');
const companiasRoutes = require('./routes/companias.routes');
const usuariosRoutes = require('./routes/usuarios.routes');

const exigirSesion = require('./middleware/exigirSesion');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);

app.use(exigirSesion);

app.use('/companias', companiasRoutes);
app.use('/usuarios', usuariosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

module.exports = app;
