// Validaciones y manipulación del formulario de registro

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formRegistro');
  const limpiarBtn = document.getElementById('limpiarFormulario');
  const mensaje = document.getElementById('mensajeRegistro');

  function validarCorreo(correo) {
    return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(correo);
  }

  function validarContrasena(pass) {
    return /[A-Z]/.test(pass) && /[0-9]/.test(pass) && pass.length >= 6 && pass.length <= 18;
  }

  function calcularEdad(fecha) {
    const hoy = new Date();
    const nacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const m = hoy.getMonth() - nacimiento.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }

  function limpiarMensajes() {
    mensaje.innerHTML = '';
    form.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
      el.classList.remove('is-invalid', 'is-valid');
    });
  }

  limpiarBtn.addEventListener('click', function () {
    form.reset();
    limpiarMensajes();
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    limpiarMensajes();
    let valido = true;

    // Campos
    const nombreCompleto = document.getElementById('nombreCompleto');
    const nombreUsuario = document.getElementById('nombreUsuario');
    const correo = document.getElementById('correo');
    const contrasena = document.getElementById('contrasena');
    const repetirContrasena = document.getElementById('repetirContrasena');
    const fechaNacimiento = document.getElementById('fechaNacimiento');

    // Validaciones
    if (!nombreCompleto.value.trim()) {
      nombreCompleto.classList.add('is-invalid');
      valido = false;
    } else {
      nombreCompleto.classList.add('is-valid');
    }
    if (!nombreUsuario.value.trim()) {
      nombreUsuario.classList.add('is-invalid');
      valido = false;
    } else {
      nombreUsuario.classList.add('is-valid');
    }
    if (!correo.value.trim() || !validarCorreo(correo.value)) {
      correo.classList.add('is-invalid');
      valido = false;
    } else {
      correo.classList.add('is-valid');
    }
    if (!contrasena.value.trim() || !validarContrasena(contrasena.value)) {
      contrasena.classList.add('is-invalid');
      valido = false;
    } else {
      contrasena.classList.add('is-valid');
    }
    if (repetirContrasena.value !== contrasena.value || !repetirContrasena.value.trim()) {
      repetirContrasena.classList.add('is-invalid');
      valido = false;
    } else {
      repetirContrasena.classList.add('is-valid');
    }
    if (!fechaNacimiento.value || calcularEdad(fechaNacimiento.value) < 13) {
      fechaNacimiento.classList.add('is-invalid');
      valido = false;
    } else {
      fechaNacimiento.classList.add('is-valid');
    }

    if (valido) {
      mensaje.innerHTML = '<div class="alert alert-success">¡Registro exitoso!</div>';
      form.reset();
      form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
    } else {
      mensaje.innerHTML = '<div class="alert alert-danger">Por favor, corrija los errores e intente nuevamente.</div>';
    }
  });

  // Validación en tiempo real
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', function () {
      if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
        input.classList.remove('is-invalid', 'is-valid');
      }
      mensaje.innerHTML = '';
    });
  });
}); 