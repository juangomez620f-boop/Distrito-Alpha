// ===== CLAVE DE LOCALSTORAGE =====
const CLAVE = 'reservasDistritoAlpha';

// ===== NAVEGACIÓN SUAVE =====
function irA(id) {
  const seccion = document.getElementById(id);
  if (seccion) seccion.scrollIntoView({ behavior: 'smooth' });
}

// ===== MOSTRAR SOLO UNA SECCIÓN =====
function mostrarSeccion(id) {
  const secciones = ['inicio', 'servicios', 'equipo', 'reservar', 'ubicacion', 'resenas'];

  if (id === 'inicio') {
    secciones.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = '';
    });
    const admin = document.getElementById('adminPanel');
    if (admin) admin.classList.remove('activo');
  } else {
    secciones.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = 'none';
    });
    const activa = document.getElementById(id);
    if (activa) activa.style.display = '';

    const admin = document.getElementById('adminPanel');
    if (admin) admin.classList.remove('activo');
  }

  document.querySelectorAll('nav a').forEach(a => a.classList.remove('activo'));
  const linkActivo = document.querySelector(`nav a[data-seccion="${id}"]`);
  if (linkActivo) linkActivo.classList.add('activo');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== RESERVAR CON UN BARBERO ESPECÍFICO =====
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
  setTimeout(() => {
    const nombre = document.getElementById('nombre');
    if (nombre) nombre.focus();
  }, 400);
}

// ===== LOCALSTORAGE =====
function obtenerReservas() {
  const datos = localStorage.getItem(CLAVE);
  return datos ? JSON.parse(datos) : [];
}
function guardarReservas(reservas) {
  localStorage.setItem(CLAVE, JSON.stringify(reservas));
}

// ===== FORMULARIO =====
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
      setTimeout(() => aviso.classList.remove('mostrar'), 4000);
    }

    this.reset();
    renderizarCitas();
  });
}

// ===== RENDERIZAR CITAS =====
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

  reservas.sort((a, b) => (a.fecha + a.hora).localeCompare(b.fecha + b.hora));

  lista.innerHTML = reservas.map(r => `
    <div class="cita">
      <div class="cita-info">
        <strong>${r.nombre}</strong> — ${r.servicio}
        <span>💈 Barbero: ${r.barbero || 'Sin preferencia'}</span>
        <span>📞 ${r.telefono}</span>
        <span>📅 ${r.fecha} a las ${r.hora}</span>
        <span>🕐 Reservada: ${r.creada}</span>
      </div>
      <button class="btn-eliminar" onclick="eliminarCita(${r.id})">Eliminar</button>
    </div>
  `).join('');
}

function eliminarCita(id) {
  if (!confirm('¿Eliminar esta cita?')) return;
  const reservas = obtenerReservas().filter(r => r.id !== id);
  guardarReservas(reservas);
  renderizarCitas();
}

function borrarTodas() {
  if (!confirm('¿Borrar TODAS las citas? Esta acción no se puede deshacer.')) return;
  localStorage.removeItem(CLAVE);
  renderizarCitas();
}

function toggleAdmin() {
  const panel = document.getElementById('adminPanel');
  if (!panel) return;
  panel.classList.toggle('activo');
  if (panel.classList.contains('activo')) {
    renderizarCitas();
    panel.scrollIntoView({ behavior: 'smooth' });
  }
}

// ===== INICIALIZAR AL CARGAR =====
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let actual = 0;
    const INTERVALO = 4000;
    setInterval(() => {
      slides[actual].classList.remove('activo');
      actual = (actual + 1) % slides.length;
      slides[actual].classList.add('activo');
    }, INTERVALO);
  }

  mostrarSeccion('inicio');
  renderizarCitas();
});

// ============================================
// ===== ALPHA IA - CHAT FLOTANTE =====
// ============================================

let fotoActual = null;
const historialAlpha = [];

// Abrir/cerrar chat
function toggleAlphaChat() {
  const chat = document.getElementById('alphaChat');
  const btn = document.getElementById('alphaBtn');
  if (!chat || !btn) return;

  chat.classList.toggle('abierto');

  if (chat.classList.contains('abierto')) {
    btn.style.display = 'none';
    setTimeout(() => document.getElementById('alphaTexto').focus(), 300);
  } else {
    btn.style.display = 'flex';
  }
}

// Preview de foto
function previewFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fotoActual = e.target.result.split(',')[1];
    document.getElementById('alphaPreviewImg').src = e.target.result;
    document.getElementById('alphaPreview').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

// Cancelar foto
function cancelarFoto() {
  fotoActual = null;
  const preview = document.getElementById('alphaPreview');
  if (preview) preview.style.display = 'none';
  const archivo = document.getElementById('alphaArchivo');
  if (archivo) archivo.value = '';
}

// Agregar mensaje al chat
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

// Enviar mensaje
async function enviarMensaje() {
  const input = document.getElementById('alphaTexto');
  const texto = input.value.trim();

  if (!texto && !fotoActual) return;

  // Mostrar mensajes del usuario
  if (texto) agregarMensaje(texto, 'user');
  if (fotoActual) agregarMensaje('📷 Foto enviada', 'user');

  // Guardar en historial
  historialAlpha.push({ role: 'user', text: texto });

  // Limpiar input
  input.value = '';
  const fotoEnviada = fotoActual;
  cancelarFoto();

  // Indicador "escribiendo"
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
      agregarMensaje('⚠️ ' + data.error, 'bot');
    } else {
      const respuesta = data.respuesta || 'No obtuve respuesta.';
      agregarMensaje(respuesta, 'bot');
      historialAlpha.push({ role: 'assistant', text: respuesta });
    }

  } catch (error) {
    if (escribiendo) escribiendo.remove();
    console.error(error);
    agregarMensaje('⚠️ Hubo un error al conectar con Alpha IA. Intenta de nuevo.', 'bot');
  }
}

// ===== CERRAR CHAT AL HACER CLIC FUERA =====
document.addEventListener('click', function (e) {
  const chat = document.getElementById('alphaChat');
  const btn = document.getElementById('alphaBtn');
  if (!chat || !btn) return;

  if (chat.classList.contains('abierto') &&
      !chat.contains(e.target) &&
      !btn.contains(e.target)) {
    chat.classList.remove('abierto');
    btn.style.display = 'flex';
  }
});