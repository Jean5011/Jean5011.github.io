document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener los elementos del carrusel
    const carousel = document.querySelector('.projects-carousel');
    const leftBtn = document.querySelector('.left-btn');
    const rightBtn = document.querySelector('.right-btn');
    const projectCard = document.querySelector('.project-card');

    // Comprobación de seguridad
    if (!carousel || !leftBtn || !rightBtn || !projectCard) {
        console.error("Faltan elementos del carrusel en el DOM.");
        return;
    }

    // 2. Calcular el desplazamiento
    // Obtenemos el ancho de una tarjeta y le sumamos el 'gap' (20px)
    // Esto asegura que el desplazamiento sea preciso.
    const scrollAmount = projectCard.offsetWidth + 20;

    // 3. Función para moverse a la izquierda
    leftBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: -scrollAmount, // Mover hacia la izquierda (atrás)
            behavior: 'smooth'   // Animación suave
        });
    });

    // 4. Función para moverse a la derecha
    rightBtn.addEventListener('click', () => {
        carousel.scrollBy({
            left: scrollAmount,  // Mover hacia la derecha (adelante)
            behavior: 'smooth'   // Animación suave
        });
    });
});



// --- FUNCIONALIDAD PARA EL ENVÍO DE FORMULARIO CON AJAX/FORMSPREE ---

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');
    // Asegúrate de que el formulario exista
    if (!form) return; 

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío tradicional
        
        const statusMessage = document.createElement('p');
        statusMessage.className = 'form-submission-status';
        statusMessage.style.textAlign = 'center';
        statusMessage.style.marginTop = '15px';

        const url = form.action;
        const data = new FormData(form);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                statusMessage.textContent = "✅ ¡Gracias! Tu mensaje ha sido enviado correctamente.";
                statusMessage.style.color = '#2ecc71'; // Verde
                form.reset(); // Limpia el formulario
            } else {
                statusMessage.textContent = "❌ Error al enviar el mensaje. Por favor, inténtalo de nuevo o usa mis redes sociales.";
                statusMessage.style.color = '#e74c3c'; // Rojo
            }
        } catch (error) {
            statusMessage.textContent = "❌ Error de conexión. Por favor, verifica tu conexión o usa mis redes sociales.";
            statusMessage.style.color = '#e74c3c';
        }

        // Elimina cualquier mensaje anterior y añade el nuevo
        const existingStatus = form.parentNode.querySelector('.form-submission-status');
        if (existingStatus) existingStatus.remove();

        form.parentNode.insertBefore(statusMessage, form.nextSibling);
    });
});