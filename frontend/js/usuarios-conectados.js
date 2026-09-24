function escaparHtml(texto) {
  if (texto === null || texto === undefined) return '';
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function minutosDesde(fechaISO) {
  return Math.max(0, Math.round((Date.now() - new Date(fechaISO).getTime()) / 60000));
}

async function cargarConectados() {
  try {
    const conectados = await llamarApi('/usuarios/conectados');
    dibujarTabla(conectados);
  } catch (err) {
    mostrarMensaje(err.message, 'error');
  }
}

function dibujarTabla(conectados) {
  const tbody = document.getElementById('tabla-conectados');
  if (conectados.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="estado-vacio">Nadie ha tenido actividad en los últimos 5 minutos.</td></tr>';
    return;
  }

  tbody.innerHTML = conectados.map((u) => {
    const minutos = minutosDesde(u.ultima_actividad);
    const texto = minutos === 0 ? 'Ahora mismo' : (minutos === 1 ? 'Hace 1 minuto' : 'Hace ' + minutos + ' minutos');
    return '<tr>' +
      '<td>' + escaparHtml(u.nombre) + '</td>' +
      '<td>' + escaparHtml(u.email) + '</td>' +
      '<td>' + escaparHtml(u.rol) + '</td>' +
      '<td>' + escaparHtml(u.companias ? u.companias.nombre : '—') + '</td>' +
      '<td><span class="etiqueta-estado activo">' + texto + '</span></td>' +
      '</tr>';
  }).join('');
}

cargarConectados();
setInterval(cargarConectados, 20000);
