const usuario = obtenerUsuarioSesion();
document.getElementById('inicio-bienvenida').textContent = usuario ? 'Bienvenido, ' + usuario.nombre : '';
