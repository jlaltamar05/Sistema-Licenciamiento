// Barra lateral del Sistema de Licenciamiento. Sin selector de
// compañía (el administrador ve todas a la vez) y sin categorías —
// solo dos pantallas.

const MODULOS_NAV = [
  { id: 'licencias', nombre: 'Consola de Licencias', href: 'licencias.html' },
  { id: 'usuarios-conectados', nombre: 'Usuarios Conectados', href: 'usuarios-conectados.html' },
];

function dibujarBarraLateral() {
  exigirSesionEnPagina();

  const contenedor = document.getElementById('barra-lateral');
  if (!contenedor) return;

  const usuarioActual = obtenerUsuarioSesion();
  const moduloActivo = document.body.dataset.modulo;

  const itemsHtml = MODULOS_NAV.map((m) => (
    '<li><a href="' + m.href + '" class="' + (m.id === moduloActivo ? 'activo' : '') + '">' + m.nombre + '</a></li>'
  )).join('');

  const bloqueUsuario = usuarioActual
    ? '<div style="margin-bottom: 14px; padding: 8px 10px; background: var(--azul-noche-suave); border-radius: var(--radio, 6px);">' +
      '<div style="font-size: 10px; color: #9fabc4; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Conectado como</div>' +
      '<div style="color: white; font-size: 13px; font-weight: 600;">' + usuarioActual.nombre + '</div></div>'
    : '';

  contenedor.innerHTML =
    '<div class="marca">Sistema de Licenciamiento<span>Control de licencias de todas las compañías</span></div>' +
    bloqueUsuario +
    '<ul class="menu-raiz">' + itemsHtml + '</ul>' +
    '<div style="margin-top: 20px; padding-top: 14px; border-top: 1px solid var(--azul-noche-suave);">' +
    '<button type="button" id="boton-cerrar-sesion" class="boton boton-secundario" style="width: 100%;">Cerrar sesión</button></div>';

  document.getElementById('boton-cerrar-sesion').addEventListener('click', cerrarSesion);
}

document.addEventListener('DOMContentLoaded', dibujarBarraLateral);
