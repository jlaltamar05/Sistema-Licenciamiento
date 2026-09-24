// Controlador de LICENCIAS. Este sistema NO administra compañías en
// general (nombre, documento, dirección, etc. — eso sigue siendo del
// Sistema Administrativo) — solo puede LEER todas las compañías con
// sus estadísticas de licencia, y EDITAR únicamente los 3 campos de
// licenciamiento de cada una.

const supabase = require('../db/supabaseClient');

async function panelLicencias(req, res) {
  const { data: companias, error } = await supabase
    .from('companias')
    .select('id, nombre, activa, tipo_licencia, limite_usuarios, fecha_vencimiento_demo')
    .order('nombre');

  if (error) return res.status(500).json({ error: error.message });

  const resultado = await Promise.all(companias.map(async (c) => {
    const { count } = await supabase
      .from('usuarios')
      .select('id', { count: 'exact', head: true })
      .eq('compania_id', c.id)
      .eq('activo', true);

    const activos = count || 0;
    let diasRestantes = null;
    let vencido = false;

    if (c.tipo_licencia === 'demo' && c.fecha_vencimiento_demo) {
      const hoy = new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00');
      const vencimiento = new Date(c.fecha_vencimiento_demo + 'T00:00:00');
      diasRestantes = Math.round((vencimiento - hoy) / (1000 * 60 * 60 * 24));
      vencido = diasRestantes < 0;
    }

    return {
      ...c,
      usuarios_activos: activos,
      disponibles: c.limite_usuarios === null || c.limite_usuarios === undefined ? null : Math.max(c.limite_usuarios - activos, 0),
      dias_restantes: diasRestantes,
      vencido,
    };
  }));

  resultado.sort((a, b) => {
    if (a.vencido !== b.vencido) return a.vencido ? -1 : 1;
    if (a.dias_restantes !== null && b.dias_restantes !== null) return a.dias_restantes - b.dias_restantes;
    if (a.dias_restantes !== null) return -1;
    if (b.dias_restantes !== null) return 1;
    return a.nombre.localeCompare(b.nombre);
  });

  res.json(resultado);
}

async function actualizarLicencia(req, res) {
  const { id } = req.params;
  const { tipo_licencia, limite_usuarios, fecha_vencimiento_demo } = req.body;

  if (!['normal', 'demo'].includes(tipo_licencia)) {
    return res.status(400).json({ error: 'Tipo de licencia no válido.' });
  }

  const { data, error } = await supabase
    .from('companias')
    .update({
      tipo_licencia,
      limite_usuarios: limite_usuarios === '' || limite_usuarios === undefined ? null : limite_usuarios,
      fecha_vencimiento_demo: tipo_licencia === 'demo' ? (fecha_vencimiento_demo || null) : null,
    })
    .eq('id', id)
    .select('id, nombre, tipo_licencia, limite_usuarios, fecha_vencimiento_demo')
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
}

module.exports = { panelLicencias, actualizarLicencia };
