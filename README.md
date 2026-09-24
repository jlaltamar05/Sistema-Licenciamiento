# Sistema de Licenciamiento

Tercer sistema, separado del Administrativo y del Contable — su
propio servidor, su propio repositorio, su propio despliegue en
Render. Los tres comparten la **misma base de datos de Supabase**.

Solo el rol `administrador` puede entrar — el login rechaza
cualquier otro usuario, aunque la contraseña sea correcta.

## Qué hace

- **Consola de Licencias**: todas las compañías, ordenadas con lo
  más urgente arriba (demos vencidos primero), con edición rápida de
  tipo de licencia / límite de usuarios / fecha de vencimiento.
- **Usuarios Conectados**: quién ha tenido actividad en los últimos
  5 minutos, en cualquier compañía.

## Qué NO hace (a propósito)

- No crea ni edita compañías en general (nombre, dirección, etc.) —
  eso sigue siendo del Sistema Administrativo.
- No **aplica** el bloqueo de licencia vencida ni el límite de
  usuarios — eso lo hace cada sistema por su cuenta (Administrativo y
  Contable), leyendo directo la misma tabla `companias`. Este sistema
  es solo para **consultar y configurar**, no el que hace cumplir la
  regla.

## Puesta en marcha en tu computadora

1. `npm install`
2. Copia `.env.example` como `.env` con la misma `SUPABASE_KEY`.
3. `npm run dev` — corre en el puerto 3002 (Administrativo usa 3000,
   Contable usa 3001, así que los tres pueden correr a la vez en tu
   compu sin chocar).
4. Abre `http://localhost:3002`.

## Publicarlo

Igual que el Sistema Contable: repositorio de GitHub nuevo y
distinto, servicio de Render nuevo, con las mismas variables
`SUPABASE_URL` / `SUPABASE_KEY`.
