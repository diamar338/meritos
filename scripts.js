// Función para mostrar alertas básicas
function mostrarAlerta(seccion) {
    alert(`Has hecho clic en: ${seccion}`);
}

// Datos de los trámites disponibles
const tramitesDisponibles = [
    {
        nombre: "Certificado de Residencia",
        descripcion: "Solicita tu certificado de residencia en línea"
    },
    {
        nombre: "Licencia de Conducir",
        descripcion: "Renueva o solicita tu licencia de conducir"
    },
    {
        nombre: "Registro Civil",
        descripcion: "Obtén certificados de nacimiento y matrimonio"
    },
    {
        nombre: "Permiso de Construcción",
        descripcion: "Solicita permisos para obras y construcciones"
    },
    {
        nombre: "Certificado de Antecedentes",
        descripcion: "Solicita tu certificado de antecedentes penales"
    },
    {
        nombre: "Registro Mercantil",
        descripcion: "Registra tu empresa o negocio"
    }
];

// Variable para el trámite actual
let tramiteActualIndice = 0;

// Función para actualizar el trámite mostrado con animación
function actualizarTramite() {
    const tarjeta = document.querySelector('.tarjeta-tramite-unica');
    const nombreElemento = document.getElementById('nombreTramite');
    const descripcionElemento = document.getElementById('descripcionTramite');
    
    // Agregar clase de salida
    tarjeta.classList.add('cambiando');
    
    setTimeout(() => {
        // Actualizar contenido
        nombreElemento.textContent = tramitesDisponibles[tramiteActualIndice].nombre;
        descripcionElemento.textContent = tramitesDisponibles[tramiteActualIndice].descripcion;
        
        // Quitar clase de salida y agregar clase de entrada
        tarjeta.classList.remove('cambiando');
        tarjeta.classList.add('entrando');
        
        // Quitar clase de entrada después de la animación
        setTimeout(() => {
            tarjeta.classList.remove('entrando');
        }, 400);
    }, 200);
}

// Función para mostrar siguiente trámite
function siguientesTramites() {
    tramiteActualIndice = (tramiteActualIndice + 1) % tramitesDisponibles.length;
    actualizarTramite();
}

// Función para mostrar trámite anterior
function tramitesAnteriores() {
    tramiteActualIndice = tramiteActualIndice === 0 ? tramitesDisponibles.length - 1 : tramiteActualIndice - 1;
    actualizarTramite();
}

// Función para abrir el trámite actual
function abrirTramiteActual() {
    const tramiteActual = tramitesDisponibles[tramiteActualIndice];
    alert(`Abriendo: ${tramiteActual.nombre}\n\n${tramiteActual.descripcion}\n\nAquí se abriría el formulario del trámite.`);
}

// Función para mostrar la guía
function mostrarGuia() {
    alert('Aquí se mostraría la guía completa con instrucciones paso a paso para realizar tus trámites.');
}

// Función para manejar la suscripción al boletín
function suscribirBoletin(evento) {
    evento.preventDefault(); // Prevenir que se recargue la página
    
    const formulario = evento.target;
    const inputCorreo = formulario.querySelector('.input-correo');
    const correo = inputCorreo.value.trim();
    
    if (correo) {
        // Mostrar mensaje de éxito
        mostrarMensaje(`¡Gracias! Te has suscrito con el correo: ${correo}`, 'success');
        
        // Limpiar el formulario
        inputCorreo.value = '';
        
        // Agregar efecto visual al botón
        const boton = formulario.querySelector('.boton-suscribir');
        const textoOriginal = boton.textContent;
        boton.textContent = '✓ Suscrito';
        boton.style.backgroundColor = '#16a34a';
        
        setTimeout(() => {
            boton.textContent = textoOriginal;
            boton.style.backgroundColor = '#2563eb';
        }, 2000);
    }
}

// Función para manejar la búsqueda
function manejarBusqueda() {
    const inputBusqueda = document.getElementById('inputBusqueda');
    const terminoBusqueda = inputBusqueda.value.trim();
    
    if (terminoBusqueda) {
        mostrarMensaje(`Buscando: ${terminoBusqueda}`, 'info');
        // Aquí podrías agregar la lógica de búsqueda real
    } else {
        mostrarMensaje('Por favor ingresa un término de búsqueda', 'warning');
    }
}

// Eventos que se ejecutan cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
    
    // Agregar evento de búsqueda al presionar Enter
    const inputBusqueda = document.getElementById('inputBusqueda');
    inputBusqueda.addEventListener('keypress', function(evento) {
        if (evento.key === 'Enter') {
            manejarBusqueda();
        }
    });
    
    // Agregar funcionalidad al icono de usuario
    const iconoUsuario = document.querySelector('.icono-usuario');
    iconoUsuario.addEventListener('click', function() {
        mostrarMensaje('Aquí se abriría el menú de usuario o login', 'info');
    });
    
    // Inicializar el primer trámite
    actualizarTramite();
    
    // Agregar navegación con teclado
    document.addEventListener('keydown', function(evento) {
        if (evento.key === 'ArrowLeft') {
            tramitesAnteriores();
        } else if (evento.key === 'ArrowRight') {
            siguientesTramites();
        } else if (evento.key === 'Enter' && evento.target.closest('.tarjeta-tramite-unica')) {
            abrirTramiteActual();
        }
    });
});

// Función para mostrar mensajes de estado mejorada
function mostrarMensaje(mensaje, tipo = 'info') {
    // Tipos: 'info', 'success', 'warning', 'error'
    const colores = {
        info: '#2563eb',
        success: '#16a34a',
        warning: '#d97706',
        error: '#dc2626'
    };
    
    const iconos = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    
    // Crear elemento de mensaje
    const elementoMensaje = document.createElement('div');
    elementoMensaje.innerHTML = `${iconos[tipo]} ${mensaje}`;
    elementoMensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${colores[tipo]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        font-size: 14px;
        max-width: 300px;
        animation: deslizarEntrada 0.3s ease-out;
    `;
    
    // Agregar estilos de animación si no existen
    if (!document.getElementById('estilos-mensaje')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-mensaje';
        estilos.textContent = `
            @keyframes deslizarEntrada {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes deslizarSalida {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(estilos);
    }
    
    // Agregar al documento
    document.body.appendChild(elementoMensaje);
    
    // Remover después de 3 segundos con animación
    setTimeout(() => {
        elementoMensaje.style.animation = 'deslizarSalida 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(elementoMensaje)) {
                document.body.removeChild(elementoMensaje);
            }
        }, 300);
    }, 3000);
}