// ============================================
// ===== CLAVES DE LOCALSTORAGE =====
// ============================================
const CLAVE = 'reservasDistritoAlpha';
const CLAVE_ADMINS = 'adminsDistritoAlpha';

// ============================================
// ===== ADMIN POR DEFECTO =====
// ============================================
const ADMIN_DEFECTO = {
  nombre: 'distritoalpha',
  correo: 'admin@distritoalpha.com',
  telefono: '3175883432',
  password: 'alpha2026'
};

const PASS_MAESTRA = 'admin2026';

// ============================================
// ===== LOCALSTORAGE ADMINS =====
// ============================================
function obtenerAdmins() {
  const datos = localStorage.getItem(CLAVE_ADMINS);
  return datos ? JSON.parse(datos) : [];
}

function guardarAdmins(admins) {
  localStorage.setItem(CLAVE_ADMINS, JSON.stringify(admins));
}

function inicializarAdmins() {
  const admins = obtenerAdmins();
  if (admins.length === 0) {
    admins.push(ADMIN_DEFECTO);
    guardarAdmins(admins);
  }
}

// ============================================
// ===== LOCALSTORAGE RESERVAS =====
// ============================================
function obtenerReservas() {
  const datos = localStorage.getItem(CLAVE);
  return datos ? JSON.parse(datos) : [];
}

function guardarReservas(reservas) {
  localStorage.setItem(CLAVE, JSON.stringify(reservas));
}

// ============================================
// ===== MENÚ HAMBURGUESA =====
// ============================================
function toggleMenu() {
  const nav = document.getElementById('menuNav');
  const btn = document.querySelector('.menu-toggle');
  if (!nav || !btn) return;

  nav.classList.toggle('abierto');
  btn.classList.toggle('abierto');
}

// ============================================
// ===== NAVEGACIÓN =====
// ============================================
function mostrarSeccion(id) {
  const secciones = ['inicio', 'servicios', 'equipo', 'reservar', 'ubicacion', 'resenas'];

  if (id === 'inicio') {
    secciones.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = '';
    });
  } else {
    secciones.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = 'none';
    });
    const activa = document.getElementById(id);
    if (activa) activa.style.display = '';
  }

  document.querySelectorAll('nav a').forEach(a => a.classList.remove('activo'));
  const linkActivo = document.querySelector('nav a[data-seccion="' + id + '"]');
  if (linkActivo) linkActivo.classList.add('activo');

  const nav = document.getElementById('menuNav');
  const menuBtn = document.querySelector('.menu-toggle');
  if (nav) nav.classList.remove('abierto');
  if (menuBtn) menuBtn.classList.remove('abierto');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function reservarCon(nombreBarbero) {
  mostrarSeccion('reservar');
  const selectBarbero = document.getElementById('barbero');
  if (selectBarbero) {
    for (let i = 0; i < selectBarbero.options.length; i++) {
      if (selectBarbero.options[i].value === nombreBarbero) {
        selectBarbero.selectedIndex = i;
        break;
      }
    }
  }
  setTimeout(function() {
    const nombre = document.getElementById('nombre');
    if (nombre) nombre.focus();
  }, 400);
}

// ============================================
// ===== RENDERIZAR CITAS =====
// ============================================
function renderizarCitas() {
  const reservas = obtenerReservas();
  const lista = document.getElementById('listaCitas');
  const contador = document.getElementById('contador');
  if (!lista || !contador) return;

  contador.textContent = reservas.length + (reservas.length === 1 ? ' cita' : ' citas');

  if (reservas.length === 0) {
    lista.innerHTML = '<div class="vacio">No hay citas reservadas todavía.</div>';
    return;
  }

  reservas.sort(function(a, b) {
    return (a.fecha + a.hora).localeCompare(b.fecha + b.hora);
  });

  let html = '';
  reservas.forEach(function(r) {
    html += '<div class="cita">';
    html += '<div class="cita-info">';
    html += '<strong>' + r.nombre + '</strong> — ' + r.servicio;
    html += '<span>Barbero: ' + (r.barbero || 'Sin preferencia') + '</span>';
    html += '<span>Teléfono: ' + r.telefono + '</span>';
    html += '<span>Fecha: ' + r.fecha + ' a las ' + r.hora + '</span>';
    html += '<span>Reservada: ' + r.creada + '</span>';
    html += '</div>';
    html += '<button class="btn-eliminar" onclick="eliminarCita(' + r.id + ')">Eliminar</button>';
    html += '</div>';
  });
  lista.innerHTML = html;
}

function eliminarCita(id) {
  if (!confirm('¿Eliminar esta cita?')) return;
  const reservas = obtenerReservas().filter(function(r) { return r.id !== id; });
  guardarReservas(reservas);
  renderizarCitas();
}

function borrarTodas() {
  if (!confirm('¿Borrar TODAS las citas? Esta acción no se puede deshacer.')) return;
  localStorage.removeItem(CLAVE);
  renderizarCitas();
}

// ============================================
// ===== MOSTRAR SOLO UNA PANTALLA =====
// ============================================
function pantallaSolo(cual) {
  const sitio = document.getElementById('sitioWeb');
  const login = document.getElementById('loginModal');
  const panel = document.getElementById('adminPanel');
  const admins = document.getElementById('pantallaAdmins');

  if (sitio) sitio.style.display = 'none';
  if (login) { login.style.display = 'none'; login.classList.remove('activo'); }
  if (panel) { panel.style.display = 'none'; panel.classList.remove('activo'); }
  if (admins) { admins.style.display = 'none'; admins.classList.remove('activo'); }

  if (cual === 'login' && login) {
    login.style.display = 'flex';
    login.classList.add('activo');
  }
  if (cual === 'panel' && panel) {
    panel.style.display = 'block';
    panel.classList.add('activo');
  }
  if (cual === 'admins' && admins) {
    admins.style.display = 'block';
    admins.classList.add('activo');
  }

  document.body.style.overflow = 'hidden';
  window.scrollTo({ top: 0 });
}

function restaurarSitio() {
  const sitio = document.getElementById('sitioWeb');
  const login = document.getElementById('loginModal');
  const panel = document.getElementById('adminPanel');
  const admins = document.getElementById('pantallaAdmins');

  if (sitio) sitio.style.display = '';
  if (login) { login.style.display = 'none'; login.classList.remove('activo'); }
  if (panel) { panel.style.display = 'none'; panel.classList.remove('activo'); }
  if (admins) { admins.style.display = 'none'; admins.classList.remove('activo'); }

  document.body.style.overflow = '';
  window.scrollTo({ top: 0 });
}

// ============================================
// ===== LOGIN =====
// ============================================
function abrirLogin() {
  if (sessionStorage.getItem('adminLogueado') === 'true') {
    entrarAlPanel();
    return;
  }

  pantallaSolo('login');
  mostrarLogin();

  const form = document.getElementById('loginForm');
  if (form) form.reset();

  const err = document.getElementById('loginError');
  if (err) err.style.display = 'none';

  const pass = document.getElementById('loginPass');
  if (pass) pass.type = 'password';

  setTimeout(function() {
    const user = document.getElementById('loginUser');
    if (user) user.focus();
  }, 300);
}

function cerrarLogin() {
  restaurarSitio();
}

function entrarAlPanel() {
  pantallaSolo('panel');
  renderizarCitas();
}

function intentarLogin(e) {
  e.preventDefault();

  const user = document.getElementById('loginUser').value.trim().toLowerCase();
  const pass = document.getElementById('loginPass').value;

  const admins = obtenerAdmins();

  let adminEncontrado = null;
  for (let i = 0; i < admins.length; i++) {
    if (admins[i].nombre.toLowerCase() === user && admins[i].password === pass) {
      adminEncontrado = admins[i];
      break;
    }
  }

  if (adminEncontrado) {
    sessionStorage.setItem('adminLogueado', 'true');
    sessionStorage.setItem('adminNombre', adminEncontrado.nombre);
    entrarAlPanel();
  } else {
    const err = document.getElementById('loginError');
    if (err) {
      err.style.display = 'block';
      err.classList.add('mostrar');
      setTimeout(function() {
        err.style.display = 'none';
        err.classList.remove('mostrar');
      }, 3500);
    }
  }
}

// ============================================
// ===== REGISTRO ADMINS =====
// ============================================
function registrarAdmin(e) {
  e.preventDefault();

  const nombre = document.getElementById('regNombre').value.trim();
  const correo = document.getElementById('regCorreo').value.trim().toLowerCase();
  const telefono = document.getElementById('regTelefono').value.trim();
  const pass = document.getElementById('regPass').value;

  const err = document.getElementById('registroError');
  const ok = document.getElementById('registroExito');

  err.style.display = 'none';
  err.classList.remove('mostrar');
  ok.style.display = 'none';
  ok.classList.remove('mostrar');

  if (nombre.length < 3) {
    mostrarError(err, 'El nombre debe tener al menos 3 caracteres');
    return;
  }

  if (correo.indexOf('@') === -1 || correo.indexOf('.') === -1) {
    mostrarError(err, 'Ingresa un correo válido');
    return;
  }

  if (telefono.length < 7) {
    mostrarError(err, 'Ingresa un teléfono válido');
    return;
  }

  if (pass.length < 6) {
    mostrarError(err, 'La contraseña debe tener al menos 6 caracteres');
    return;
  }

  const admins = obtenerAdmins();
  let existe = false;
  for (let i = 0; i < admins.length; i++) {
    if (admins[i].nombre.toLowerCase() === nombre.toLowerCase()) {
      existe = true;
      break;
    }
  }

  if (existe) {
    mostrarError(err, 'Ya existe un administrador con ese nombre');
    return;
  }

  admins.push({
    nombre: nombre,
    correo: correo,
    telefono: telefono,
    password: pass
  });
  guardarAdmins(admins);

  ok.textContent = 'Cuenta creada con éxito. Ya puedes iniciar sesión.';
  ok.style.display = 'block';
  ok.classList.add('mostrar');

  document.getElementById('registroForm').reset();

  setTimeout(function() {
    mostrarLogin();
    const user = document.getElementById('loginUser');
    if (user) {
      user.value = nombre;
      user.focus();
    }
  }, 2500);
}

function mostrarError(el, mensaje) {
  el.textContent = mensaje;
  el.style.display = 'block';
  el.classList.add('mostrar');
  setTimeout(function() {
    el.style.display = 'none';
    el.classList.remove('mostrar');
  }, 3500);
}

function mostrarRegistro() {
  const login = document.getElementById('vistaLogin');
  const reg = document.getElementById('vistaRegistro');
  if (login) login.style.display = 'none';
  if (reg) reg.style.display = 'block';
}

function mostrarLogin() {
  const login = document.getElementById('vistaLogin');
  const reg = document.getElementById('vistaRegistro');
  if (login) login.style.display = 'block';
  if (reg) reg.style.display = 'none';
}

function cerrarSesion() {
  if (!confirm('¿Cerrar sesión?')) return;
  sessionStorage.removeItem('adminLogueado');
  sessionStorage.removeItem('adminNombre');
  restaurarSitio();
  mostrarSeccion('inicio');
}

function togglePassword() {
  const input = document.getElementById('loginPass');
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

// ============================================
// ===== GESTIÓN DE ADMINISTRADORES =====
// ============================================
function abrirAdmins() {
  pantallaSolo('admins');

  const vistaPass = document.getElementById('adminsVistaPass');
  const vistaLista = document.getElementById('adminsVistaLista');
  if (vistaPass) vistaPass.style.display = 'block';
  if (vistaLista) vistaLista.style.display = 'none';

  const input = document.getElementById('passMaestra');
  if (input) {
    input.value = '';
    input.type = 'password';
  }

  const err = document.getElementById('passMaestraError');
  if (err) err.style.display = 'none';

  setTimeout(function() {
    if (input) input.focus();
  }, 300);
}

function cerrarAdmins() {
  pantallaSolo('panel');
  renderizarCitas();
}

function verificarPassMaestra(e) {
  e.preventDefault();
  const input = document.getElementById('passMaestra');
  const err = document.getElementById('passMaestraError');

  if (!input || !err) return;

  if (input.value === PASS_MAESTRA) {
    const vistaPass = document.getElementById('adminsVistaPass');
    const vistaLista = document.getElementById('adminsVistaLista');
    if (vistaPass) vistaPass.style.display = 'none';
    if (vistaLista) vistaLista.style.display = 'block';

    renderizarAdmins();
  } else {
    err.style.display = 'block';
    setTimeout(function() { err.style.display = 'none'; }, 3500);
  }
}

function renderizarAdmins() {
  const lista = document.getElementById('listaAdmins');
  if (!lista) return;

  const admins = obtenerAdmins();
  const adminActual = sessionStorage.getItem('adminNombre') || '';

  if (admins.length === 0) {
    lista.innerHTML = '<div class="vacio">No hay administradores registrados.</div>';
    return;
  }

  let html = '';
  admins.forEach(function(a, index) {
    const esAdminPorDefecto = a.nombre.toLowerCase() === 'distritoalpha';
    const esTuCuenta = a.nombre.toLowerCase() === adminActual.toLowerCase();
    const noSePuedeBorrar = esAdminPorDefecto || esTuCuenta;

    let badge = '';
    if (esTuCuenta) {
      badge = '<span class="badge-tu">TÚ</span>';
    } else if (esAdminPorDefecto) {
      badge = '<span class="badge-protegido">PROTEGIDO</span>';
    }

    html += '<div class="admin-item ' + (noSePuedeBorrar ? 'protegido' : '') + '">';
    html += '<div class="admin-item-info">';
    html += '<strong>' + a.nombre + badge + '</strong>';
    html += '<span>Correo: ' + a.correo + '</span>';
    html += '<span>Teléfono: ' + a.telefono + '</span>';
    html += '</div>';
    html += '<button class="btn-borrar-admin" onclick="borrarAdmin(' + index + ')" ' + (noSePuedeBorrar ? 'disabled' : '') + '>';
    html += (noSePuedeBorrar ? 'No se puede' : 'Eliminar');
    html += '</button>';
    html += '</div>';
  });
  lista.innerHTML = html;
}

function borrarAdmin(index) {
  const admins = obtenerAdmins();
  const admin = admins[index];

  if (!admin) return;

  if (admin.nombre.toLowerCase() === 'distritoalpha') {
    alert('No puedes eliminar la cuenta de administrador principal.');
    return;
  }

  const adminActual = sessionStorage.getItem('adminNombre') || '';
  if (admin.nombre.toLowerCase() === adminActual.toLowerCase()) {
    alert('No puedes eliminar tu propia cuenta mientras estás logueado.');
    return;
  }

  if (!confirm('¿Eliminar la cuenta de "' + admin.nombre + '"?')) return;

  admins.splice(index, 1);
  guardarAdmins(admins);

  renderizarAdmins();
}

// ============================================
// ===== ALPHA IA =====
// ============================================
let fotoActual = null;
const historialAlpha = [];

function toggleAlphaChat() {
  const chat = document.getElementById('alphaChat');
  const btn = document.getElementById('alphaBtn');
  if (!chat || !btn) return;

  chat.classList.toggle('abierto');

  if (chat.classList.contains('abierto')) {
    btn.style.display = 'none';
    setTimeout(function() {
      const t = document.getElementById('alphaTexto');
      if (t) t.focus();
    }, 300);
  } else {
    btn.style.display = 'flex';
  }
}

function previewFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    fotoActual = e.target.result.split(',')[1];
    document.getElementById('alphaPreviewImg').src = e.target.result;
    document.getElementById('alphaPreview').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function cancelarFoto() {
  fotoActual = null;
  const preview = document.getElementById('alphaPreview');
  if (preview) preview.style.display = 'none';
  const archivo = document.getElementById('alphaArchivo');
  if (archivo) archivo.value = '';
}

function agregarMensaje(texto, tipo) {
  const cont = document.getElementById('alphaMensajes');
  if (!cont) return null;
  const div = document.createElement('div');
  div.className = 'alpha-mensaje ' + tipo;
  div.innerHTML = texto.replace(/\n/g, '<br>');
  cont.appendChild(div);
  cont.scrollTop = cont.scrollHeight;
  return div;
}

async function enviarMensaje() {
  const input = document.getElementById('alphaTexto');
  const texto = input.value.trim();

  if (!texto && !fotoActual) return;

  if (texto) agregarMensaje(texto, 'user');
  if (fotoActual) agregarMensaje('Foto enviada', 'user');

  historialAlpha.push({ role: 'user', text: texto });

  input.value = '';
  const fotoEnviada = fotoActual;
  cancelarFoto();

  const escribiendo = agregarMensaje('Alpha IA está escribiendo', 'bot escribiendo');

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensaje: texto,
        imageBase64: fotoEnviada,
        historial: historialAlpha.slice(-6)
      })
    });

    const data = await response.json();
    if (escribiendo) escribiendo.remove();

    if (data.error) {
      agregarMensaje('Error: ' + data.error, 'bot');
    } else {
      const respuesta = data.respuesta || 'No obtuve respuesta.';
      agregarMensaje(respuesta, 'bot');
      historialAlpha.push({ role: 'assistant', text: respuesta });
    }

  } catch (error) {
    if (escribiendo) escribiendo.remove();
    console.error(error);
    agregarMensaje('Hubo un error al conectar con Alpha IA. Intenta de nuevo.', 'bot');
  }
}

// ============================================
// ===== EVENTOS GLOBALES =====
// ============================================
document.addEventListener('click', function (e) {
  const nav = document.getElementById('menuNav');
  const menuBtn = document.querySelector('.menu-toggle');
  if (nav && menuBtn && nav.classList.contains('abierto') &&
      !nav.contains(e.target) && !menuBtn.contains(e.target)) {
    nav.classList.remove('abierto');
    menuBtn.classList.remove('abierto');
  }

  const chat = document.getElementById('alphaChat');
  const chatBtn = document.getElementById('alphaBtn');
  if (chat && chatBtn && chat.classList.contains('abierto') &&
      !chat.contains(e.target) && !chatBtn.contains(e.target)) {
    chat.classList.remove('abierto');
    chatBtn.style.display = 'flex';
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    const login = document.getElementById('loginModal');
    if (login && login.style.display === 'flex') {
      cerrarLogin();
    }
  }
});

// ============================================
// ===== FORMULARIO DE RESERVA =====
// ============================================
const formReserva = document.getElementById('formReserva');
if (formReserva) {
  formReserva.addEventListener('submit', function (e) {
    e.preventDefault();

    const nuevaReserva = {
      id: Date.now(),
      nombre: document.getElementById('nombre').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      servicio: document.getElementById('servicio').value,
      barbero: document.getElementById('barbero').value || 'Sin preferencia',
      fecha: document.getElementById('fecha').value,
      hora: document.getElementById('hora').value,
      creada: new Date().toLocaleString('es-CO')
    };

    const reservas = obtenerReservas();
    reservas.push(nuevaReserva);
    guardarReservas(reservas);

    const aviso = document.getElementById('aviso');
    if (aviso) {
      aviso.classList.add('mostrar');
      setTimeout(function() { aviso.classList.remove('mostrar'); }, 4000);
    }

    this.reset();
    renderizarCitas();
  });
}

// ============================================
// ===== SPLASH SCREEN =====
// ============================================
window.addEventListener('load', function() {
  const splash = document.getElementById('splash');
  if (!splash) return;

  setTimeout(function() {
    splash.classList.add('oculto');
    setTimeout(function() { splash.remove(); }, 1000);
  }, 1500);
});

// ============================================
// ===== INICIALIZAR =====
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  inicializarAdmins();

  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let actual = 0;
    const INTERVALO = 6000;
    setInterval(function() {
      slides[actual].classList.remove('activo');
      actual = (actual + 1) % slides.length;
      slides[actual].classList.add('activo');
    }, INTERVALO);
  }

  mostrarSeccion('inicio');
  renderizarCitas();
});