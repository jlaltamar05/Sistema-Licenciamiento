// Controlador de AUTENTICACIÓN (login) — propio de este sistema, pero
// valida contra la MISMA tabla "usuarios" compartida. Solo el rol
// "administrador" puede entrar aquí — es un sistema de control, no
// de trabajo diario.

const supabase = require('../db/supabaseClient');
const { verificarPassword } = require('../utils/passwordUtil');
const { generarToken } = require('../utils/tokenUtil');

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y contraseña son obligatorios' });
  }

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !usuario) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  if (!usuario.activo) {
    return res.status(401).json({ error: 'Este usuario está desactivado' });
  }

  if (!verificarPassword(password, usuario.password_hash)) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  if (usuario.rol !== 'administrador') {
    return res.status(403).json({ error: 'Este sistema es solo para el administrador general.' });
  }

  const token = generarToken({
    usuario_id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
    compania_id: usuario.compania_id,
  });

  res.json({
    token: token,
    usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
  });
}

module.exports = { login };
