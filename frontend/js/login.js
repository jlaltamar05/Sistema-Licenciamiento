// Lógica de la página de login del Sistema de Licenciamiento.

document.getElementById('form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  try {
    const respuesta = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(datos.error || 'No se pudo iniciar sesión.', 'error');
      return;
    }

    guardarSesion(datos.token, datos.usuario);
    window.location.href = 'inicio.html';
  } catch (err) {
    mostrarMensaje('No se pudo conectar con el servidor. ¿Está corriendo "npm run dev"?', 'error');
  }
});

document.getElementById('boton-ver-login-password').addEventListener('click', () => {
  const campo = document.getElementById('login-password');
  campo.type = campo.type === 'password' ? 'text' : 'password';
});
