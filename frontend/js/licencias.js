function escaparHtml(texto) {
  if (texto === null || texto === undefined) return '';
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

let companias = [];

async function cargarLicencias() {
  try {
    companias = await llamarApi('/companias/licencias');
    dibujarTabla();
  } catch (err) {
    mostrarMensaje(err.message, 'error');
  }
}

function badgeVencimiento(c) {
  if (c.tipo_licencia !== 'demo' || !c.fecha_vencimiento_demo) return '—';
  if (c.vencido) return '<span class="badge-dias vencido">Vencido hace ' + Math.abs(c.dias_restantes) + ' día(s)</span>';
  if (c.dias_restantes <= 5) return '<span class="badge-dias urgente">Vence en ' + c.dias_restantes + ' día(s)</span>';
  return '<span class="badge-dias normal">' + formatearFecha(c.fecha_vencimiento_demo) + '</span>';
}

function dibujarTabla() {
  const tbody = document.getElementById('tabla-licencias');
  if (companias.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="estado-vacio">No hay compañías registradas.</td></tr>';
    return;
  }

  tbody.innerHTML = companias.map((c) => {
    const claseFila = c.vencido ? 'fila-vencida' : (c.dias_restantes !== null && c.dias_restantes <= 5 ? 'fila-por-vencer' : '');
    return '<tr class="' + claseFila + '">' +
      '<td>' + escaparHtml(c.nombre) + '</td>' +
      '<td><span class="etiqueta-estado ' + (c.tipo_licencia === 'demo' ? 'pendiente' : 'activo') + '">' + (c.tipo_licencia === 'demo' ? 'Demo' : 'Normal') + '</span></td>' +
      '<td>' + c.usuarios_activos + '</td>' +
      '<td>' + (c.limite_usuarios === null || c.limite_usuarios === undefined ? 'Sin límite' : c.limite_usuarios) + '</td>' +
      '<td>' + (c.disponibles === null ? '—' : c.disponibles) + '</td>' +
      '<td>' + badgeVencimiento(c) + '</td>' +
      '<td class="celda-acciones"><button type="button" class="boton boton-secundario" data-id="' + c.id + '">Editar licencia</button></td>' +
      '</tr>';
  }).join('');
}

document.getElementById('tabla-licencias').addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-id]');
  if (!boton) return;
  const compania = companias.find((c) => c.id === boton.dataset.id);
  if (compania) abrirModalEdicion(compania);
});

function abrirModalEdicion(compania) {
  document.getElementById('modal-licencia-titulo').textContent = 'Licencia — ' + compania.nombre;
  document.getElementById('licencia-compania-id').value = compania.id;
  document.getElementById('licencia-tipo').value = compania.tipo_licencia || 'normal';
  document.getElementById('licencia-limite').value = compania.limite_usuarios ?? '';
  document.getElementById('licencia-vencimiento').value = compania.fecha_vencimiento_demo || '';
  actualizarVisibilidadVencimiento();
  document.getElementById('modal-licencia').style.display = 'block';
}
document.getElementById('boton-cerrar-modal-licencia').addEventListener('click', () => {
  document.getElementById('modal-licencia').style.display = 'none';
});

function actualizarVisibilidadVencimiento() {
  document.getElementById('campo-licencia-vencimiento').style.display = document.getElementById('licencia-tipo').value === 'demo' ? 'block' : 'none';
}
document.getElementById('licencia-tipo').addEventListener('change', actualizarVisibilidadVencimiento);

document.getElementById('form-licencia').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const id = document.getElementById('licencia-compania-id').value;
  const tipo = document.getElementById('licencia-tipo').value;

  const cuerpo = {
    tipo_licencia: tipo,
    limite_usuarios: document.getElementById('licencia-limite').value === '' ? null : Number(document.getElementById('licencia-limite').value),
    fecha_vencimiento_demo: tipo === 'demo' ? (document.getElementById('licencia-vencimiento').value || null) : null,
  };

  try {
    await llamarApi('/companias/' + id + '/licencia', { method: 'PUT', body: JSON.stringify(cuerpo) });
    mostrarMensaje('Licencia actualizada.', 'exito');
    document.getElementById('modal-licencia').style.display = 'none';
    cargarLicencias();
  } catch (err) {
    mostrarMensaje(err.message, 'error');
  }
});

cargarLicencias();
