// scripts.js — versión corregida 
// Archivo principal de JavaScript que controla la interactividad del sitio

// ============================================================================
// DATOS GLOBALES Y CONFIGURACIÓN
// ============================================================================

/**
 * Array de objetos que contiene la información de los trámites o concursos disponibles.
 * Cada objeto representa un trámite con su nombre y descripción.
 * @type {Array<{nombre: string, descripcion: string}>}
 */
const tramitesDisponibles = [
    { nombre: "Concurso de merito de registraduria", descripcion: "Ve al avance del proyecto" },
    { nombre: "CNSC", descripcion: ": La página www.cnsc.gov.co es fundamental. Acostúmbrate a revisarla" },
    { nombre: "Portal Único del Estado Colombiano: Trabaje en el Estado", descripcion: "Enlace oficial: https://www.trabajeenelestado.colombia.gov.co/" },
];

/**
 * Índice que indica qué trámite se está mostrando actualmente en el carrusel.
 * @type {number}
 */
let tramiteActualIndice = 0; // Inicia en el primer trámite (índice 0).

// ============================================================================
// FUNCIONES DE NAVEGACIÓN ENTRE PÁGINAS
// ============================================================================

/**
 * Función genérica para redirigir a una URL específica.
 * @param {string} url - La dirección a la que se redirigirá el navegador
 */
function irA(url) {
    window.location.href = url; // Cambia la ubicación de la ventana del navegador.
}

/**
 * Función específica para navegar a la página de noticias.
 * @param {string} url - URL de la página de noticias
 */
function NoticiasIr(url) {
    window.location.href = url; 
}

// ============================================================================
// FUNCIONALIDAD DEL CARRUSEL DE TRÁMITES
// ============================================================================

/**
 * Actualiza la tarjeta del trámite actual con la información correspondiente
 * y aplica animaciones de transición.
 */
function actualizarTramite() {
    // Selecciona los elementos del DOM que se van a actualizar.
    const tarjeta = document.querySelector('.tarjeta-tramite-unica');
    const nombreElemento = document.getElementById('nombreTramite');
    const descripcionElemento = document.getElementById('descripcionTramite');

    // Si alguno de los elementos no existe, la función se detiene para evitar errores.
    if (!tarjeta || !nombreElemento || !descripcionElemento) return; 

    // Añade una clase para la animación de salida (fade out + desplazamiento).
    tarjeta.classList.add('cambiando');

    /**
     * Usa setTimeout para crear un delay que permita que la animación de salida se complete
     * antes de actualizar el contenido y comenzar la animación de entrada.
     */
    setTimeout(() => {
        // Actualiza el texto del nombre y la descripción con los datos del trámite actual.
        nombreElemento.textContent = tramitesDisponibles[tramiteActualIndice].nombre;
        descripcionElemento.textContent = tramitesDisponibles[tramiteActualIndice].descripcion;

        // Quita la clase de salida y añade la de entrada para la animación.
        tarjeta.classList.remove('cambiando');
        tarjeta.classList.add('entrando');

        // Después de 400ms, quita la clase de entrada para que no interfiera con futuras animaciones.
        setTimeout(() => tarjeta.classList.remove('entrando'), 400);
    }, 200); // 200 milisegundos de espera para la animación de salida.
}

/**
 * Avanza al siguiente trámite en el carrusel.
 * Si está en el último trámite, vuelve al primero (comportamiento circular).
 */
function siguientesTramites() {
    // Incrementa el índice. El operador '%' (módulo) asegura que el índice vuelva a 0 si llega al final de la lista.
    tramiteActualIndice = (tramiteActualIndice + 1) % tramitesDisponibles.length; 
    actualizarTramite(); // Actualiza la interfaz con el nuevo trámite
}

/**
 * Retrocede al trámite anterior en el carrusel.
 * Si está en el primer trámite, va al último (comportamiento circular).
 */
function tramitesAnteriores() {
    // Decrementa el índice. Si está en 0, va al último elemento de la lista.
    tramiteActualIndice = (tramiteActualIndice === 0) ? tramitesDisponibles.length - 1 : tramiteActualIndice - 1;
    actualizarTramite(); // Actualiza la interfaz con el nuevo trámite
}

/**
 * Función que se ejecuta al hacer clic en la tarjeta del trámite actual.
 * En una aplicación real, aquí se abriría el formulario o detalles del trámite.
 */
function abrirTramiteActual() {
    // Obtiene el trámite actual del array usando el índice global.
    const t = tramitesDisponibles[tramiteActualIndice];
    if (!t) return; // Si no existe el trámite, sale de la función
    
    // Muestra una alerta como marcador de posición. 
    // En una aplicación real, aquí iría la lógica para abrir el trámite.
    alert(`Abriendo: ${t.nombre}\n\n${t.descripcion}\n\nAquí se abriría el formulario del trámite.`);
}

// ============================================================================
// FUNCIONALIDAD DE BÚSQUEDA
// ============================================================================

/**
 * Maneja la búsqueda de trámites basándose en el texto ingresado por el usuario.
 * Filtra los trámites disponibles y muestra los resultados.
 */
function manejarBusqueda() {
    // Obtiene el elemento del input de búsqueda por su ID.
    const input = document.getElementById('inputBusqueda');
    if (!input) return; // Si no existe el input, sale de la función

    // Obtiene el valor, lo convierte a minúsculas y quita espacios en blanco al inicio y final.
    const query = input.value.toLowerCase().trim();
    
    // Si el campo de búsqueda está vacío, quita los resultados y muestra un mensaje de advertencia.
    if (!query) {
        quitarResultadosBusqueda();
        mostrarMensaje("Escribe algo para buscar.", "warning");
        return;
    }

    /**
     * Filtra la lista de trámites:
     * 1. map: Crea una copia de cada trámite añadiendo su índice original
     * 2. filter: Filtra los trámites que contengan la query en nombre o descripción
     */
    const resultados = tramitesDisponibles
        .map((t, idx) => ({ ...t, idx })) // Crea copia con índice original para poder volver a él
        .filter(t => 
            t.nombre.toLowerCase().includes(query) || 
            t.descripcion.toLowerCase().includes(query)
        );

    // Muestra los resultados filtrados en la interfaz
    mostrarResultadosBusqueda(resultados, query);
}

/**
 * Muestra los resultados de búsqueda en una sección especial debajo del carrusel.
 * @param {Array} resultados - Array de trámites que coinciden con la búsqueda
 * @param {string} query - Término de búsqueda utilizado
 */
function mostrarResultadosBusqueda(resultados, query) {
    // Busca si ya existe una sección para los resultados.
    let seccionResultados = document.getElementById('resultadosBusqueda');
    
    // Si no existe, la crea dinámicamente.
    if (!seccionResultados) {
        seccionResultados = document.createElement('section');
        seccionResultados.id = 'resultadosBusqueda';
        seccionResultados.className = 'seccion-tramites';
        seccionResultados.innerHTML = `<h2 class="titulo-tramites">Resultados de Búsqueda</h2><div id="contenedorResultados"></div>`;
        
        // Intenta insertar la nueva sección después de la sección principal de trámites.
        const seccionTramites = document.querySelector('.seccion-tramites');
        if (seccionTramites && seccionTramites.parentNode) {
            seccionTramites.parentNode.insertBefore(seccionResultados, seccionTramites.nextSibling);
        } else {
            // Si no encuentra la sección de trámites, la añade al 'main' o al 'body'.
            const main = document.querySelector('main');
            if (main) main.appendChild(seccionResultados);
            else document.body.appendChild(seccionResultados);
        }
    }

    // Obtiene el contenedor donde se mostrarán los resultados individuales
    const contenedor = document.getElementById('contenedorResultados');
    contenedor.innerHTML = ''; // Limpia resultados anteriores.

    // Si no hay resultados, muestra un mensaje de error y oculta la sección.
    if (resultados.length === 0) {
        mostrarMensaje(`No se encontraron resultados para: "${query}"`, "error");
        seccionResultados.style.display = 'none'; // Oculta la sección de resultados
        return;
    }

    // Si hay resultados, se asegura de que la sección sea visible.
    seccionResultados.style.display = 'block';

    // Itera sobre cada resultado para crear su tarjeta visual.
    resultados.forEach(r => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-tramite-unica resultado-busqueda';
        tarjeta.style.cursor = 'pointer'; // Indica que es clickeable
        tarjeta.innerHTML = `<span>${r.nombre}</span><p>${r.descripcion}</p>`;
        
        // Añade un evento de clic a la tarjeta del resultado.
        tarjeta.addEventListener('click', () => {
            // Al hacer clic, el carrusel principal se actualiza para mostrar este trámite.
            tramiteActualIndice = r.idx;
            actualizarTramite();
            // Se quitan los resultados de búsqueda y la página se desplaza suavemente hasta el carrusel.
            quitarResultadosBusqueda();
            document.querySelector('.tarjeta-tramite-unica')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        contenedor.appendChild(tarjeta);
    });
}

/**
 * Elimina la sección de resultados de búsqueda del DOM.
 * Se llama cuando se limpia la búsqueda o cuando se cierra los resultados.
 */
function quitarResultadosBusqueda() {
    // Busca la sección de resultados.
    const seccionResultados = document.getElementById('resultadosBusqueda');
    // Si existe, la elimina del DOM.
    if (seccionResultados && seccionResultados.parentNode) {
        seccionResultados.parentNode.removeChild(seccionResultados);
    }
}

// ============================================================================
// FUNCIÓN PARA LIMPIAR LA BÚSQUEDA
// ============================================================================

/**
 * Limpia el campo de búsqueda y remueve los resultados de búsqueda mostrados.
 * Restaura la vista normal del carrusel de trámites.
 */
function limpiarBusqueda() {
    const input = document.getElementById('inputBusqueda');
    if (input) input.value = ''; // Borra el texto del input
    quitarResultadosBusqueda(); // Elimina la sección de resultados de búsqueda
}

// ============================================================================
// FUNCIONALIDAD DE SUSCRIPCIÓN AL BOLETÍN
// ============================================================================

/**
 * Maneja el envío del formulario de suscripción al boletín.
 * Previene el envío tradicional del formulario y muestra un mensaje de confirmación.
 * @param {Event} evento - El evento de envío del formulario
 */
function suscribirBoletin(evento) {
    evento.preventDefault(); // Evita que el formulario se envíe de la manera tradicional (recargando la página)
    
    // Obtiene el input del correo del formulario que disparó el evento
    const inputCorreo = evento.target.querySelector('.input-correo');
    if (!inputCorreo) return; // Si no encuentra el input, sale de la función
    
    const correo = inputCorreo.value.trim(); // Obtiene y limpia el valor del correo
    
    // Validación: verifica que el campo no esté vacío
    if (!correo) {
        mostrarMensaje('Por favor ingresa un correo válido.', 'warning');
        return;
    }
    
    // Muestra mensaje de éxito y limpia el campo
    mostrarMensaje(`¡Gracias! Te has suscrito con el correo: ${correo}`, 'success');
    inputCorreo.value = ''; // Limpia el campo del correo para futuras suscripciones
}

// ============================================================================
// SISTEMA DE NOTIFICACIONES (TOASTS)
// ============================================================================

/**
 * Muestra un mensaje flotante (toast) en la esquina superior derecha de la pantalla.
 * Los mensajes desaparecen automáticamente después de un tiempo.
 * @param {string} mensaje - El texto del mensaje a mostrar
 * @param {string} tipo - El tipo de mensaje: 'info', 'success', 'warning', 'error'
 */
function mostrarMensaje(mensaje, tipo = 'info') {
    // Define colores e íconos para cada tipo de mensaje
    const colores = { 
        info: '#2563eb',     // Azul para información
        success: '#16a34a',  // Verde para éxito
        warning: '#d97706',  // Amarillo/naranja para advertencias
        error: '#dc2626'     // Rojo para errores
    };
    
    const iconos = { 
        info: 'ℹ️', 
        success: '✅', 
        warning: '⚠️', 
        error: '❌' 
    };
    
    // Crea un nuevo elemento 'div' para el mensaje toast
    const elemento = document.createElement('div');
    elemento.innerHTML = `${iconos[tipo]} ${mensaje}`; // Combina ícono y mensaje
    
    // Aplica estilos CSS directamente al elemento para posicionamiento y apariencia
    elemento.style.cssText = `
        position: fixed; top: 20px; right: 20px; /* Posición fija en esquina superior derecha */
        background-color: ${colores[tipo]}; color: white; /* Color según tipo */
        padding: 12px 16px; border-radius: 8px; z-index: 10000; /* Espaciado y elevación */
        box-shadow: 0 6px 22px rgba(0,0,0,0.15); font-size: 14px; /* Sombra y tamaño de texto */
        animation: aparecer 0.25s ease-out; /* Animación de entrada */
    `;
    
    document.body.appendChild(elemento); // Añade el mensaje al DOM

    /**
     * Configura un temporizador para que el mensaje desaparezca automáticamente
     * después de 2.5 segundos con una animación de salida
     */
    setTimeout(() => {
        elemento.style.transition = 'opacity 0.3s, transform 0.3s'; // Transición suave para salida
        elemento.style.opacity = '0'; // Hace invisible gradualmente
        elemento.style.transform = 'translateX(20px)'; // Desplaza hacia la derecha al desaparecer
        
        // Espera a que termine la animación de desaparición para eliminar el elemento del DOM
        setTimeout(() => elemento.remove(), 300);
    }, 2500); // El mensaje es visible por 2.5 segundos
}

/**
 * Inyecta los keyframes para la animación de aparición del mensaje si no existen.
 * Esto evita tener que definirlos en el archivo CSS principal.
 */
if (!document.getElementById('estilos-mensaje')) {
    const style = document.createElement('style');
    style.id = 'estilos-mensaje';
    style.textContent = `
        /* Define la animación de entrada para los mensajes toast */
        @keyframes aparecer { 
            from { 
                transform: translateY(-8px); /* Comienza 8px más arriba */
                opacity: 0 /* Comienza invisible */
            } 
            to { 
                transform: translateY(0); /* Termina en posición normal */
                opacity: 1 /* Termina completamente visible */
            } 
        }
    `;
    document.head.appendChild(style); // Añade los estilos al head del documento
}

// ============================================================================
// CONFIGURACIÓN DE EVENTOS AL CARGAR LA PÁGINA
// ============================================================================

/**
 * Evento que se ejecuta cuando el documento HTML ha sido completamente cargado y parseado.
 * Aquí se inicializan todos los listeners y configuraciones necesarias.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa el carrusel con el primer trámite al cargar la página
    actualizarTramite();

    // ============================================================================
    // CONFIGURACIÓN DE LA BÚSQUEDA
    // ============================================================================
    
    const inputBusqueda = document.getElementById('inputBusqueda');
    if (inputBusqueda) {
        /**
         * Listener para la tecla Enter en el campo de búsqueda
         * Permite ejecutar la búsqueda presionando Enter
         */
        inputBusqueda.addEventListener('keypress', e => {
            if (e.key === 'Enter') manejarBusqueda();
        });
        
        /**
         * Listener para cambios en el input de búsqueda
         * Si el usuario borra el texto, limpia automáticamente los resultados
         */
        inputBusqueda.addEventListener('input', () => {
            if (inputBusqueda.value.trim() === '') quitarResultadosBusqueda();
        });
    }

    // ============================================================================
    // CONFIGURACIÓN DEL ICONO DE USUARIO
    // ============================================================================
    
    const iconoUsuario = document.querySelector('.icono-usuario');
    if (iconoUsuario) {
        /**
         * Listener para el clic en el icono de usuario
         * En una implementación real, aquí se abriría un menú de login/perfil
         */
        iconoUsuario.addEventListener('click', () => {
            mostrarMensaje('Aquí se abriría el menú de usuario o login', 'info');
        });
    }

    // ============================================================================
    // NAVEGACIÓN POR TECLADO DEL CARRUSEL
    // ============================================================================
    
    /**
     * Permite navegar por el carrusel usando las flechas del teclado
     * Flecha izquierda: trámite anterior
     * Flecha derecha: siguiente trámite
     */
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') tramitesAnteriores();
        else if (e.key === 'ArrowRight') siguientesTramites();
    });
});

// ============================================================================
// EXPOSICIÓN DE FUNCIONES AL ÁMBITO GLOBAL (window)
// ============================================================================

/**
 * Es necesario exponer estas funciones al objeto global (window) porque 
 * el HTML usa atributos 'onclick' y 'onsubmit' inline.
 * 
 * Esto permite que las funciones sean llamadas directamente desde el HTML:
 * Ejemplo: <button onclick="siguientesTramites()">Siguiente</button>
 * 
 * Nota: En proyectos más grandes y modernos, se prefiere usar addEventListener
 * en el JavaScript en lugar de atributos inline en el HTML.
 */

// Función para avanzar al siguiente trámite en el carrusel
window.siguientesTramites = siguientesTramites;

// Función para retroceder al trámite anterior en el carrusel
window.tramitesAnteriores = tramitesAnteriores;

// Función para abrir el trámite actualmente mostrado
window.abrirTramiteActual = abrirTramiteActual;

// Función principal que maneja la lógica de búsqueda
window.manejarBusqueda = manejarBusqueda;

// Función para limpiar el campo de búsqueda y resultados
window.limpiarBusqueda = limpiarBusqueda;

// Función para manejar la suscripción al boletín informativo
window.suscribirBoletin = suscribirBoletin;