// Función para manejar la búsqueda (por ahora solo muestra un mensaje)
function buscar() {
    // Obtener el valor del campo de búsqueda
    const query = document.getElementById('search').value;

    // Si no hay texto en el campo, alertamos al usuario
    if (!query) {
        alert('Por favor, ingresa un término de búsqueda.');
    } else {
        // De lo contrario, mostramos un mensaje de búsqueda (esto puede ser ampliado)
        alert(`Buscando: ${query}`);
    }
}
class Carrusel {
    constructor() {
        this.carrusel = document.querySelector('.carrusel');
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.indicadores = document.querySelectorAll('.indicador');
        this.currentIndex = 0;
        this.intervalId = null;
        this.autoPlayDelay = 5000; // 5 segundos

        this.init();
    }

    init() {
        // Event listeners para botones
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());

        // Event listeners para indicadores
        this.indicadores.forEach(indicador => {
            indicador.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.goToSlide(index);
            });
        });

        // Auto-play
        this.startAutoPlay();

        // Pausar auto-play al hacer hover
        this.carrusel.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.carrusel.addEventListener('mouseleave', () => this.startAutoPlay());

        // Touch events para móviles
        this.setupTouchEvents();
    }

    updateSlide() {
        // Mover el carrusel
        this.carrusel.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        
        // Actualizar indicadores
        this.indicadores.forEach((indicador, index) => {
            indicador.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateSlide();
        this.restartAutoPlay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateSlide();
        this.restartAutoPlay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateSlide();
        this.restartAutoPlay();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.intervalId = setInterval(() => this.nextSlide(), this.autoPlayDelay);
    }

    stopAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    setupTouchEvents() {
        let startX, endX;

        this.carrusel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            this.stopAutoPlay();
        });

        this.carrusel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            this.handleSwipe(startX, endX);
            this.startAutoPlay();
            
        });
    }

    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const swipeThreshold = 50;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide(); // Swipe izquierda
            } else {
                this.prevSlide(); // Swipe derecha
            }
        }
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new Carrusel();
});