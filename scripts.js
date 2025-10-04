// scripts.js — versión corregida y completa

// Datos de trámites
const tramitesDisponibles = [
    { nombre: "Concurso de merito de registraduria", descripcion: "Ve al avance del proyecto" },
    { nombre: "CNSC", descripcion: ": La página www.cnsc.gov.co es fundamental. Acostúmbrate a revisarla" },
    { nombre: "Portal Único del Estado Colombiano: Trabaje en el Estado", descripcion: "Enlace oficial: https://www.trabajeenelestado.colombia.gov.co/" },
    
];

let tramiteActualIndice = 0;


function irA(url) {
    window.location.href = url; 
}
    
function NoticiasIr(url) {
    window.location.href = url; 
}

/* -------------------- CARRUSEL / TRÁMITE ACTUAL -------------------- */
function actualizarTramite() {
    const tarjeta = document.querySelector('.tarjeta-tramite-unica');
    const nombreElemento = document.getElementById('nombreTramite');
    const descripcionElemento = document.getElementById('descripcionTramite');

    if (!tarjeta || !nombreElemento || !descripcionElemento) return;

    tarjeta.classList.add('cambiando');

    setTimeout(() => {
        nombreElemento.textContent = tramitesDisponibles[tramiteActualIndice].nombre;
        descripcionElemento.textContent = tramitesDisponibles[tramiteActualIndice].descripcion;

        tarjeta.classList.remove('cambiando');
        tarjeta.classList.add('entrando');

        setTimeout(() => tarjeta.classList.remove('entrando'), 400);
    }, 200);
}

function siguientesTramites() {
    tramiteActualIndice = (tramiteActualIndice + 1) % tramitesDisponibles.length;
    actualizarTramite();
}

function tramitesAnteriores() {
    tramiteActualIndice = (tramiteActualIndice === 0) ? tramitesDisponibles.length - 1 : tramiteActualIndice - 1;
    actualizarTramite();
}

function abrirTramiteActual() {
    const t = tramitesDisponibles[tramiteActualIndice];
    if (!t) return;
    alert(`Abriendo: ${t.nombre}\n\n${t.descripcion}\n\nAquí se abriría el formulario del trámite.`);
}

/* -------------------- BÚSQUEDA (integrada) -------------------- */
function manejarBusqueda() {
    const input = document.getElementById('inputBusqueda');
    if (!input) return;

    const query = input.value.toLowerCase().trim();
    // Si vacío -> quitar resultados y avisar
    if (!query) {
        quitarResultadosBusqueda();
        mostrarMensaje("Escribe algo para buscar.", "warning");
        return;
    }

    const resultados = tramitesDisponibles
        .map((t, idx) => ({ ...t, idx }))
        .filter(t => t.nombre.toLowerCase().includes(query) || t.descripcion.toLowerCase().includes(query));

    mostrarResultadosBusqueda(resultados, query);
}

function mostrarResultadosBusqueda(resultados, query) {
    // Crear o seleccionar la sección de resultados
    let seccionResultados = document.getElementById('resultadosBusqueda');
    if (!seccionResultados) {
        seccionResultados = document.createElement('section');
        seccionResultados.id = 'resultadosBusqueda';
        seccionResultados.className = 'seccion-tramites';
        seccionResultados.innerHTML = `<h2 class="titulo-tramites">Resultados de Búsqueda</h2><div id="contenedorResultados"></div>`;
        // Insertar después de la primera sección de trámites
        const seccionTramites = document.querySelector('.seccion-tramites');
        if (seccionTramites && seccionTramites.parentNode) {
            seccionTramites.parentNode.insertBefore(seccionResultados, seccionTramites.nextSibling);
        } else {
            // si no existe, añadir al main
            const main = document.querySelector('main');
            if (main) main.appendChild(seccionResultados);
            else document.body.appendChild(seccionResultados);
        }
    }

    const contenedor = document.getElementById('contenedorResultados');
    contenedor.innerHTML = ''; // limpiar

    if (resultados.length === 0) {
        mostrarMensaje(`No se encontraron resultados para: "${query}"`, "error");
        seccionResultados.style.display = 'none';
        return;
    }

    seccionResultados.style.display = 'block';

    resultados.forEach(r => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-tramite-unica resultado-busqueda';
        tarjeta.style.cursor = 'pointer';
        tarjeta.innerHTML = `<span>${r.nombre}</span><p>${r.descripcion}</p>`;
        // Al dar click en un resultado, colocamos el carrusel en ese trámite
        tarjeta.addEventListener('click', () => {
            tramiteActualIndice = r.idx;
            actualizarTramite();
            // Opcional: remover resultados y hacer scroll suave al carrusel
            quitarResultadosBusqueda();
            document.querySelector('.tarjeta-tramite-unica')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        contenedor.appendChild(tarjeta);
    });
}

function quitarResultadosBusqueda() {
    const seccionResultados = document.getElementById('resultadosBusqueda');
    if (seccionResultados && seccionResultados.parentNode) {
        seccionResultados.parentNode.removeChild(seccionResultados);
    }
}

/* -------------------- LIMPIAR BÚSQUEDA -------------------- */
function limpiarBusqueda() {
    const input = document.getElementById('inputBusqueda');
    if (input) input.value = '';
    quitarResultadosBusqueda();
}

/* -------------------- SUSCRIPCIÓN AL BOLETÍN -------------------- */
function suscribirBoletin(evento) {
    evento.preventDefault();
    const inputCorreo = evento.target.querySelector('.input-correo');
    if (!inputCorreo) return;
    const correo = inputCorreo.value.trim();
    if (!correo) {
        mostrarMensaje('Por favor ingresa un correo válido.', 'warning');
        return;
    }
    mostrarMensaje(`¡Gracias! Te has suscrito con el correo: ${correo}`, 'success');
    inputCorreo.value = '';
}

/* -------------------- MENSAJES (toasts) -------------------- */
function mostrarMensaje(mensaje, tipo = 'info') {
    const colores = { info: '#2563eb', success: '#16a34a', warning: '#d97706', error: '#dc2626' };
    const iconos = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const elemento = document.createElement('div');
    elemento.innerHTML = `${iconos[tipo]} ${mensaje}`;
    elemento.style.cssText = `
        position: fixed; top: 20px; right: 20px;
        background-color: ${colores[tipo]}; color: white;
        padding: 12px 16px; border-radius: 8px; z-index: 10000;
        box-shadow: 0 6px 22px rgba(0,0,0,0.15); font-size: 14px;
        animation: aparecer 0.25s ease-out;
    `;
    document.body.appendChild(elemento);

    setTimeout(() => {
        elemento.style.transition = 'opacity 0.3s, transform 0.3s';
        elemento.style.opacity = '0';
        elemento.style.transform = 'translateX(20px)';
        setTimeout(() => elemento.remove(), 300);
    }, 2500);
}

// Inyectar keyframes si no existen para evitar dependencia externa
if (!document.getElementById('estilos-mensaje')) {
    const style = document.createElement('style');
    style.id = 'estilos-mensaje';
    style.textContent = `
        @keyframes aparecer { from { transform: translateY(-8px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
    `;
    document.head.appendChild(style);
}

/* -------------------- EVENTOS AL CARGAR -------------------- */
document.addEventListener('DOMContentLoaded', () => {
    actualizarTramite();

    const inputBusqueda = document.getElementById('inputBusqueda');
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', e => {
            if (e.key === 'Enter') manejarBusqueda();
        });
        inputBusqueda.addEventListener('input', () => {
            if (inputBusqueda.value.trim() === '') quitarResultadosBusqueda();
        });
    }

    // Icono usuario (si existe)
    const iconoUsuario = document.querySelector('.icono-usuario');
    if (iconoUsuario) iconoUsuario.addEventListener('click', () => mostrarMensaje('Aquí se abriría el menú de usuario o login', 'info'));

    // Navegación por teclado
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') tramitesAnteriores();
        else if (e.key === 'ArrowRight') siguientesTramites();
    });
});

/* -------------------- FUNCIONES EXTERNAS (expuestas a HTML inline) -------------------- */
/* Es necesario exponerlas porque tu HTML usa onclick/onSubmit inline */
window.siguientesTramites = siguientesTramites;
window.tramitesAnteriores = tramitesAnteriores;
window.abrirTramiteActual = abrirTramiteActual;
window.manejarBusqueda = manejarBusqueda;
window.limpiarBusqueda = limpiarBusqueda;
window.suscribirBoletin = suscribirBoletin;
