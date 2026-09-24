// Controlador de USUARIOS CONECTADOS — quién ha tenido actividad en
// los últimos 5 minutos, en cualquier compañía.
//
// OJO: el registro de "última actividad" en sí lo sigue escribiendo
// el Sistema Administrativo (y el Contable, si se le agrega) cada vez
// que alguien hace algo ahí — aquí solo se LEE esa columna, que ya
// vive en la tabla "usuarios" compartida.

const supabase = require('../db/supabaseClient');

async function usuariosConectados(req, res) {
  const haceCincoMinutos = new Date(Date.now() - 5 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, rol, ultima_actividad, companias ( nombre )')
    .gte('ultima_actividad', haceCincoMinutos)
    .order('ultima_actividad', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

module.exports = { usuariosConectados };
